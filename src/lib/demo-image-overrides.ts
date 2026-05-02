"use client";

import {
  isAllowedMenuItemImageType,
  MAX_MENU_ITEM_IMAGE_SIZE,
} from "@/lib/menu/images";

export type DemoMenuItemImageOverride = {
  restaurantSlug: string;
  itemId: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: number;
};

type StoredDemoMenuItemImage = {
  key: string;
  restaurantSlug: string;
  itemId: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: number;
};

export const DEMO_IMAGE_OVERRIDE_EVENT = "smartmenu:demo-image-override";
export const DEMO_IMAGE_OVERRIDE_VERSION_KEY = "smartmenu:demo-image-override-version";

const DB_NAME = "smartmenu-demo-image-overrides";
const DB_VERSION = 1;
const STORE_NAME = "menuItemImages";

function overrideKey(restaurantSlug: string, itemId: string) {
  return `${restaurantSlug}:${itemId}`;
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction was aborted."));
  });
}

function openDemoImageDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open demo image storage."));
  });
}

function toOverride(record: StoredDemoMenuItemImage): DemoMenuItemImageOverride {
  return {
    restaurantSlug: record.restaurantSlug,
    itemId: record.itemId,
    url: URL.createObjectURL(record.blob),
    fileName: record.fileName,
    mimeType: record.mimeType,
    size: record.size,
    updatedAt: record.updatedAt,
  };
}

function broadcastDemoImageOverride(restaurantSlug: string, itemId: string) {
  window.dispatchEvent(
    new CustomEvent(DEMO_IMAGE_OVERRIDE_EVENT, {
      detail: { restaurantSlug, itemId },
    }),
  );

  try {
    window.localStorage.setItem(DEMO_IMAGE_OVERRIDE_VERSION_KEY, `${Date.now()}`);
  } catch {
    // Local uploads still work if storage events are unavailable.
  }
}

export function subscribeDemoImageOverrides(
  listener: (detail?: { restaurantSlug?: string; itemId?: string }) => void,
) {
  const eventHandler = (event: Event) => {
    listener((event as CustomEvent).detail);
  };
  const storageHandler = (event: StorageEvent) => {
    if (event.key === DEMO_IMAGE_OVERRIDE_VERSION_KEY) {
      listener();
    }
  };

  window.addEventListener(DEMO_IMAGE_OVERRIDE_EVENT, eventHandler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(DEMO_IMAGE_OVERRIDE_EVENT, eventHandler);
    window.removeEventListener("storage", storageHandler);
  };
}

export function validateDemoMenuImageFile(file: File) {
  if (!isAllowedMenuItemImageType(file.type)) {
    return "Use a JPEG, PNG, WebP, or AVIF image.";
  }

  if (file.size > MAX_MENU_ITEM_IMAGE_SIZE) {
    return "Image is too large. Maximum size is 8MB.";
  }

  return null;
}

export async function saveDemoMenuItemImageOverride(
  restaurantSlug: string,
  itemId: string,
  file: File,
) {
  const validationError = validateDemoMenuImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const db = await openDemoImageDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const record: StoredDemoMenuItemImage = {
    key: overrideKey(restaurantSlug, itemId),
    restaurantSlug,
    itemId,
    blob: file,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    updatedAt: Date.now(),
  };

  store.put(record);
  await transactionDone(transaction);
  db.close();
  broadcastDemoImageOverride(restaurantSlug, itemId);

  return toOverride(record);
}

export async function getDemoMenuItemImageOverride(
  restaurantSlug: string,
  itemId: string,
) {
  const db = await openDemoImageDb();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const record = await requestToPromise<StoredDemoMenuItemImage | undefined>(
    store.get(overrideKey(restaurantSlug, itemId)),
  );
  await transactionDone(transaction);
  db.close();

  return record ? toOverride(record) : null;
}

export async function getDemoMenuImageOverrides(restaurantSlug: string) {
  const db = await openDemoImageDb();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const records = await requestToPromise<StoredDemoMenuItemImage[]>(store.getAll());
  await transactionDone(transaction);
  db.close();

  return Object.fromEntries(
    records
      .filter((record) => record.restaurantSlug === restaurantSlug)
      .map((record) => [record.itemId, toOverride(record).url]),
  ) as Record<string, string>;
}

export async function clearDemoMenuItemImageOverride(
  restaurantSlug: string,
  itemId: string,
) {
  const db = await openDemoImageDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.delete(overrideKey(restaurantSlug, itemId));
  await transactionDone(transaction);
  db.close();
  broadcastDemoImageOverride(restaurantSlug, itemId);
}
