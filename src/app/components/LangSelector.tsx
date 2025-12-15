"use client";

import { useLanguage } from "../providers/LanguageProvider";

export default function LangSelector({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <select
      className={className}
      aria-label="Language"
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
    >
      <option value="de">DE</option>
      <option value="en">EN</option>
      <option value="fr">FR</option>
    </select>
  );
}
