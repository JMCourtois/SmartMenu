import { normalizeLocale, type LocaleCode } from "@/lib/guest-menu";

export type ConciergeStoredMessage = {
  role: "user" | "assistant";
  content: string;
  locale?: LocaleCode;
};

type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function conversationStorageKey(slug: string) {
  return `smartmenu.concierge.${slug}`;
}

export function readConversation(storage: Pick<Storage, "getItem">, slug: string) {
  try {
    const raw = storage.getItem(conversationStorageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (message): message is ConciergeStoredMessage =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string",
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
        locale: message.locale ? normalizeLocale(message.locale) : undefined,
      }))
      .slice(-6);
  } catch {
    return [];
  }
}

export function writeConversation(
  storage: Pick<Storage, "setItem">,
  slug: string,
  messages: ConciergeStoredMessage[],
) {
  storage.setItem(conversationStorageKey(slug), JSON.stringify(messages.slice(-6)));
}

export function clearConversation(storage: SessionStorageLike, slug: string) {
  storage.removeItem(conversationStorageKey(slug));
}

export function detectChatLanguage(question: string, selectedLocale: string | null | undefined): LocaleCode {
  const normalized = question.trim().toLowerCase();

  if (/[\uac00-\ud7af]/.test(question)) return "ko";
  if (/[\u3040-\u30ff]/.test(question)) return "ja";
  if (/[\u4e00-\u9fff]/.test(question)) return "zh-CN";
  if (/[\u0400-\u04ff]/.test(question)) return "ru";

  if (/[¿¡ñáéíóúü]/i.test(question) || /\b(qué|quiero|sin|cerdo|picante|vegetariano|plato|pedir|recomienda)\b/.test(normalized)) {
    return "es";
  }

  if (/[äöüß]/i.test(question) || /\b(was|bestellen|ohne|gericht|scharf|vegetarisch|empfiehl|schwein)\b/.test(normalized)) {
    return "de";
  }

  if (/\b(cosa|ordinare|senza|maiale|piccante|vegetariano|piatto|consigliami|abbinare)\b/.test(normalized)) {
    return "it";
  }

  if (/[àâçéèêëîïôùûüÿœ]/i.test(question) || /\b(quoi|commander|sans|porc|épicé|vegetarien|végétarien|plat|recommande)\b/.test(normalized)) {
    return "fr";
  }

  return normalizeLocale(selectedLocale);
}
