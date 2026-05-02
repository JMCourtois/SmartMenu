import { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { AiMenuChangeSchema, type AiProposedChange } from "@/lib/ai/schemas";
import { runMenuAgent } from "@/lib/ai/menu-agent";
import { isAutoApplySupported, recomputeAiRisk } from "@/lib/ai/risk";
import { menuVersionInclude } from "@/lib/menu/queries";

function jsonValue(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === null || value === undefined
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue);
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

async function itemIdsForVersion(tx: Prisma.TransactionClient, menuVersionId: string) {
  const categories = await tx.menuCategory.findMany({
    where: { menuVersionId },
    select: {
      items: {
        select: { id: true },
      },
    },
  });

  return new Set(categories.flatMap((category) => category.items.map((item) => item.id)));
}

export async function requestAiChangeSet({
  menuVersionId,
  prompt,
  requestedById,
}: {
  menuVersionId: string;
  prompt: string;
  requestedById: string;
}) {
  const prisma = getPrisma();
  const changeSet = await prisma.aiChangeSet.create({
    data: {
      menuVersionId,
      requestedById,
      prompt,
      status: "PROCESSING",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: requestedById,
      action: "CREATE_AI_CHANGE_SET",
      entityType: "AiChangeSet",
      entityId: changeSet.id,
      metadata: {
        menuVersionId,
      },
    },
  });

  if (process.env.INNGEST_EVENT_KEY) {
    await inngest.send({
      name: "menu.ai_edit.requested",
      data: {
        changeSetId: changeSet.id,
      },
    });
  } else {
    await generateAndSaveAiProposal(changeSet.id);
  }

  return changeSet;
}

export async function generateAndSaveAiProposal(changeSetId: string) {
  const prisma = getPrisma();
  const changeSet = await prisma.aiChangeSet.findUnique({
    where: { id: changeSetId },
    include: {
      menuVersion: {
        include: menuVersionInclude,
      },
    },
  });

  if (!changeSet) {
    throw new Error("Change set not found.");
  }

  try {
    const proposal = AiMenuChangeSchema.parse(
      await runMenuAgent({
        managerPrompt: changeSet.prompt,
        menuSnapshot: changeSet.menuVersion,
      }),
    );
    const riskLevel = recomputeAiRisk(proposal.changes);

    return await prisma.aiChangeSet.update({
      where: { id: changeSetId },
      data: {
        status: "PROPOSED",
        summary: proposal.summary,
        riskLevel,
        warnings: proposal.warnings,
        changes: {
          create: proposal.changes.map((change) => ({
            entityType: change.entityType,
            entityId: change.entityId,
            operation: change.operation,
            field: change.field,
            oldValue: jsonValue(change.oldValue),
            newValue: jsonValue(change.newValue),
            reason: change.reason,
          })),
        },
      },
    });
  } catch (error) {
    await prisma.aiChangeSet.update({
      where: { id: changeSetId },
      data: {
        status: "FAILED",
        summary: error instanceof Error ? error.message : "AI proposal failed.",
        riskLevel: "BLOCKED",
      },
    });
    throw error;
  }
}

export async function approveChangeSet({
  changeSetId,
  approvedByUserId,
}: {
  changeSetId: string;
  approvedByUserId: string;
}) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const changeSet = await tx.aiChangeSet.findUnique({
      where: { id: changeSetId },
    });

    if (!changeSet || changeSet.status !== "PROPOSED") {
      throw new Error("Only proposed change sets can be approved.");
    }

    await tx.auditLog.create({
      data: {
        actorUserId: approvedByUserId,
        action: "APPROVE_AI_CHANGE_SET",
        entityType: "AiChangeSet",
        entityId: changeSetId,
        metadata: {
          riskLevel: changeSet.riskLevel,
        },
      },
    });

    return tx.aiChangeSet.update({
      where: { id: changeSetId },
      data: { status: "APPROVED" },
    });
  });
}

export async function rejectChangeSet({
  changeSetId,
  rejectedByUserId,
}: {
  changeSetId: string;
  rejectedByUserId: string;
}) {
  const prisma = getPrisma();
  await prisma.auditLog.create({
    data: {
      actorUserId: rejectedByUserId,
      action: "REJECT_AI_CHANGE_SET",
      entityType: "AiChangeSet",
      entityId: changeSetId,
    },
  });

  return prisma.aiChangeSet.update({
    where: { id: changeSetId },
    data: { status: "REJECTED" },
  });
}

async function applyChange(
  tx: Prisma.TransactionClient,
  change: AiProposedChange,
) {
  if (change.entityType === "TRANSLATION") {
    const value = objectValue(change.newValue);
    if (!change.entityId || !change.field || !value) {
      throw new Error("Invalid translation change.");
    }

    await tx.menuItemTranslation.upsert({
      where: {
        menuItemId_locale: {
          menuItemId: change.entityId,
          locale: change.field,
        },
      },
      update: {
        name: typeof value.name === "string" ? value.name : undefined,
        description:
          typeof value.description === "string" ? value.description : null,
      },
      create: {
        menuItemId: change.entityId,
        locale: change.field,
        name: typeof value.name === "string" ? value.name : "Untitled",
        description:
          typeof value.description === "string" ? value.description : null,
      },
    });
    return;
  }

  if (change.entityType === "MENU_ITEM" && change.field === "description") {
    await tx.menuItem.update({
      where: { id: change.entityId ?? "" },
      data: {
        description: typeof change.newValue === "string" ? change.newValue : null,
      },
    });
    return;
  }

  if (change.entityType === "AVAILABILITY") {
    await tx.menuItem.update({
      where: { id: change.entityId ?? "" },
      data: {
        isAvailable: Boolean(change.newValue),
      },
    });
    return;
  }

  if (change.entityType === "PROMOTION") {
    await tx.menuItem.update({
      where: { id: change.entityId ?? "" },
      data: {
        isPromoted: Boolean(change.newValue),
      },
    });
    return;
  }

  if (change.entityType === "PAIRING") {
    const value = objectValue(change.newValue);
    if (!change.entityId || !value || typeof value.pairedItemName !== "string") {
      throw new Error("Invalid pairing change.");
    }

    await tx.pairingSuggestion.create({
      data: {
        menuItemId: change.entityId,
        pairedItemName: value.pairedItemName,
        reason: typeof value.reason === "string" ? value.reason : null,
        priority: typeof value.priority === "number" ? value.priority : 0,
      },
    });
    return;
  }

  throw new Error(`Unsupported change handler: ${change.entityType}.${change.field}`);
}

export async function applyApprovedChangeSet({
  changeSetId,
  approvedByUserId,
}: {
  changeSetId: string;
  approvedByUserId: string;
}) {
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const changeSet = await tx.aiChangeSet.findUnique({
      where: { id: changeSetId },
      include: { changes: true },
    });

    if (!changeSet) {
      throw new Error("Change set not found.");
    }

    if (changeSet.status !== "APPROVED") {
      throw new Error("Change set must be approved before applying.");
    }

    if (changeSet.riskLevel === "BLOCKED") {
      throw new Error("Blocked change set cannot be applied.");
    }

    const parsedChanges = changeSet.changes.map((change) => ({
      entityType: change.entityType,
      entityId: change.entityId,
      operation: change.operation,
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      reason: change.reason ?? "",
    })) as AiProposedChange[];

    const unsafeChange = parsedChanges.find((change) => !isAutoApplySupported(change));
    if (unsafeChange) {
      throw new Error(
        `This change set contains a non-auto-applicable change: ${unsafeChange.entityType}.${unsafeChange.field ?? unsafeChange.operation}`,
      );
    }

    const validItemIds = await itemIdsForVersion(tx, changeSet.menuVersionId);
    const foreignChange = parsedChanges.find(
      (change) => change.entityId && !validItemIds.has(change.entityId),
    );
    if (foreignChange) {
      throw new Error(`Change references an item outside this menu version: ${foreignChange.entityId}`);
    }

    for (const change of parsedChanges) {
      await applyChange(tx, change);
    }

    await tx.aiChangeSet.update({
      where: { id: changeSetId },
      data: {
        status: "APPLIED",
        appliedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: approvedByUserId,
        action: "APPLY_AI_CHANGE_SET",
        entityType: "AiChangeSet",
        entityId: changeSetId,
        metadata: {
          changeCount: parsedChanges.length,
          riskLevel: changeSet.riskLevel,
        },
      },
    });

    return { success: true };
  });
}
