"use client";
import { useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

type Props = { placeholder?: string; onSend: (text: string) => void };

export default function MessageInput({ placeholder, onSend }: Props) {
  const { lang } = useLanguage();
  const copy: Record<string, { placeholder: string; send: string; attach: string; schedule: string }> = {
    en: {
      placeholder: "Type a message",
      send: "Send",
      attach: "Attach",
      schedule: "Schedule",
    },
    de: {
      placeholder: "Nachricht eingeben",
      send: "Senden",
      attach: "Anhängen",
      schedule: "Planen",
    },
    fr: {
      placeholder: "Écrire un message",
      send: "Envoyer",
      attach: "Joindre",
      schedule: "Planifier",
    },
  };
  const t = copy[lang] ?? copy.en;

  const [draft, setDraft] = useState("");
  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }
  return (
    <div>
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder={placeholder || t.placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button className="btn btn-primary" onClick={send}>{t.send}</button>
      </div>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-outline-secondary btn-sm">{t.attach}</button>
        <button className="btn btn-outline-secondary btn-sm">{t.schedule}</button>
      </div>
    </div>
  );
}
