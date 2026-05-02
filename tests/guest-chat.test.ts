import { describe, expect, it } from "vitest";

import {
  clearConversation,
  detectChatLanguage,
  readConversation,
  writeConversation,
} from "@/lib/guest-chat";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("guest concierge chat helpers", () => {
  it("detects common guest question languages", () => {
    expect(detectChatLanguage("추천해 주세요", "en")).toBe("ko");
    expect(detectChatLanguage("おすすめは何ですか？", "en")).toBe("ja");
    expect(detectChatLanguage("我应该点什么？", "en")).toBe("zh-CN");
    expect(detectChatLanguage("Что заказать без свинины?", "en")).toBe("ru");
    expect(detectChatLanguage("¿Qué plato recomiendas sin cerdo?", "en")).toBe("es");
    expect(detectChatLanguage("Was soll ich ohne Schwein bestellen?", "en")).toBe("de");
    expect(detectChatLanguage("Cosa posso ordinare senza maiale?", "en")).toBe("it");
    expect(detectChatLanguage("Que commander sans porc ?", "en")).toBe("fr");
  });

  it("falls back to the selected menu locale", () => {
    expect(detectChatLanguage("What should I order?", "fr")).toBe("fr");
  });

  it("preserves stored chat message content and locale", () => {
    const storage = new MemoryStorage();
    writeConversation(storage, "demo", [
      { role: "user", content: "¿Qué recomiendas?", locale: "es" },
      { role: "assistant", content: "Recomendaría este plato.", locale: "es" },
    ]);

    expect(readConversation(storage, "demo")).toEqual([
      { role: "user", content: "¿Qué recomiendas?", locale: "es" },
      { role: "assistant", content: "Recomendaría este plato.", locale: "es" },
    ]);

    clearConversation(storage, "demo");
    expect(readConversation(storage, "demo")).toEqual([]);
  });
});
