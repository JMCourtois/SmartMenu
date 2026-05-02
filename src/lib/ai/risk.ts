import type { AiRiskLevel } from "@/types/menu";
import type { AiProposedChange } from "@/lib/ai/schemas";

const safetyFields = new Set([
  "priceCents",
  "allergens",
  "allergen",
  "dietaryTags",
  "isVegan",
  "isGlutenFree",
  "glutenFree",
  "vegan",
]);

function maxRisk(a: AiRiskLevel, b: AiRiskLevel): AiRiskLevel {
  const order: AiRiskLevel[] = ["LOW", "MEDIUM", "HIGH", "BLOCKED"];
  return order[Math.max(order.indexOf(a), order.indexOf(b))];
}

export function classifyAiChange(change: AiProposedChange): AiRiskLevel {
  const field = change.field ?? "";

  if (change.entityType === "PUBLISH") {
    return "BLOCKED";
  }

  if (change.operation === "DELETE") {
    return "HIGH";
  }

  if (change.entityType === "ALLERGEN" || change.entityType === "DIETARY_TAG") {
    return "HIGH";
  }

  if (change.entityType === "MENU_ITEM" && safetyFields.has(field)) {
    return "HIGH";
  }

  if (change.entityType === "AVAILABILITY") {
    return "MEDIUM";
  }

  if (change.entityType === "PROMOTION" || change.entityType === "PAIRING") {
    return "MEDIUM";
  }

  if (change.entityType === "TRANSLATION") {
    return "MEDIUM";
  }

  return "LOW";
}

export function recomputeAiRisk(changes: AiProposedChange[]): AiRiskLevel {
  return changes.reduce<AiRiskLevel>(
    (risk, change) => maxRisk(risk, classifyAiChange(change)),
    "LOW",
  );
}

export function isAutoApplySupported(change: AiProposedChange) {
  if (classifyAiChange(change) === "HIGH" || classifyAiChange(change) === "BLOCKED") {
    return false;
  }

  if (change.operation === "DELETE") {
    return false;
  }

  if (change.entityType === "TRANSLATION") {
    return change.operation === "CREATE" || change.operation === "UPDATE";
  }

  if (change.entityType === "MENU_ITEM") {
    return change.operation === "UPDATE" && change.field === "description";
  }

  if (change.entityType === "AVAILABILITY") {
    return change.operation === "UPDATE";
  }

  if (change.entityType === "PAIRING") {
    return change.operation === "CREATE";
  }

  if (change.entityType === "PROMOTION") {
    return change.operation === "UPDATE";
  }

  return false;
}
