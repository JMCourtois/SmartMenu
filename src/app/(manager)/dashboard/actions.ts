"use server";

import { revalidatePath } from "next/cache";

import {
  applyApprovedChangeSet,
  approveChangeSet,
  rejectChangeSet,
  requestAiChangeSet,
} from "@/lib/ai/change-set";
import { requireRestaurantAccess } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/db";
import {
  createMenuCategory,
  createMenuItem,
  upsertMenuItemTranslation,
} from "@/lib/menu/mutations";
import {
  publishDraftVersion,
  restoreVersionAsDraft,
} from "@/lib/menu/versioning";

export async function createCategoryAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "menu:write");
  await createMenuCategory({ formData, actorUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
}

export async function createMenuItemAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "menu:write");
  await createMenuItem({ formData, actorUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
}

export async function upsertTranslationAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "menu:write");
  await upsertMenuItemTranslation({ formData, actorUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
}

export async function publishDraftAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "menu:publish");
  const menuVersionId = String(formData.get("menuVersionId") ?? "");
  await publishDraftVersion({ menuVersionId, actorUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
  revalidatePath(`/r/[restaurantSlug]`, "page");
}

export async function restoreVersionAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "menu:publish");
  const menuVersionId = String(formData.get("menuVersionId") ?? "");
  await restoreVersionAsDraft({ menuVersionId, actorUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
}

export async function requestAiProposalAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "ai:write");
  const menuVersionId = String(formData.get("menuVersionId") ?? "");
  const prompt = String(formData.get("prompt") ?? "");
  await requestAiChangeSet({ menuVersionId, prompt, requestedById: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/ai-editor`);
}

export async function approveChangeSetAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "ai:write");
  const changeSetId = String(formData.get("changeSetId") ?? "");
  await approveChangeSet({ changeSetId, approvedByUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/ai-editor`);
}

export async function rejectChangeSetAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "ai:write");
  const changeSetId = String(formData.get("changeSetId") ?? "");
  await rejectChangeSet({ changeSetId, rejectedByUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/ai-editor`);
}

export async function applyChangeSetAction(
  restaurantId: string,
  formData: FormData,
) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const { user } = await requireRestaurantAccess(restaurantId, "ai:write");
  const changeSetId = String(formData.get("changeSetId") ?? "");
  await applyApprovedChangeSet({ changeSetId, approvedByUserId: user.id });
  revalidatePath(`/dashboard/restaurants/${restaurantId}/ai-editor`);
  revalidatePath(`/dashboard/restaurants/${restaurantId}/menu`);
}
