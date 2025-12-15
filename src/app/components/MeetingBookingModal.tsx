"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../portal/welcome/page.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

export default function MeetingBookingModal() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"details" | "slots">("details");
  const [error, setError] = useState<string | null>(null);

  const copy: Record<
    string,
    {
      trigger: string;
      title: string;
      labelName: string;
      labelEmail: string;
      placeholderName: string;
      placeholderEmail: string;
      cancel: string;
      seeSlots: string;
      back: string;
      changeDetails: string;
      errName: string;
      errEmail: string;
      errNotConfigured: string;
      errInvalidUrl: string;
    }
  > = {
    en: {
      trigger: "Book a meeting",
      title: "Book a meeting",
      labelName: "Name",
      labelEmail: "Email",
      placeholderName: "Your name",
      placeholderEmail: "you@example.com",
      cancel: "Cancel",
      seeSlots: "See available slots",
      back: "Back",
      changeDetails: "Change details",
      errName: "Please enter your name.",
      errEmail: "Please enter a valid email.",
      errNotConfigured: "Calendly is not configured yet. Set NEXT_PUBLIC_CALENDLY_URL to your scheduling link.",
      errInvalidUrl: "Calendly link is invalid. Please check NEXT_PUBLIC_CALENDLY_URL.",
    },
    de: {
      trigger: "Meeting buchen",
      title: "Meeting buchen",
      labelName: "Name",
      labelEmail: "E-Mail",
      placeholderName: "Dein Name",
      placeholderEmail: "du@beispiel.ch",
      cancel: "Abbrechen",
      seeSlots: "Verfügbare Termine ansehen",
      back: "Zurück",
      changeDetails: "Daten ändern",
      errName: "Bitte gib deinen Namen ein.",
      errEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
      errNotConfigured: "Calendly ist noch nicht eingerichtet. Setze NEXT_PUBLIC_CALENDLY_URL auf deinen Scheduling-Link.",
      errInvalidUrl: "Calendly-Link ist ungültig. Bitte prüfe NEXT_PUBLIC_CALENDLY_URL.",
    },
    fr: {
      trigger: "Réserver un rendez-vous",
      title: "Réserver un rendez-vous",
      labelName: "Nom",
      labelEmail: "E-mail",
      placeholderName: "Votre nom",
      placeholderEmail: "vous@exemple.com",
      cancel: "Annuler",
      seeSlots: "Voir les créneaux disponibles",
      back: "Retour",
      changeDetails: "Modifier les informations",
      errName: "Veuillez saisir votre nom.",
      errEmail: "Veuillez saisir une adresse e-mail valide.",
      errNotConfigured: "Calendly n’est pas encore configuré. Définissez NEXT_PUBLIC_CALENDLY_URL avec votre lien de planification.",
      errInvalidUrl: "Lien Calendly invalide. Vérifiez NEXT_PUBLIC_CALENDLY_URL.",
    },
  };
  const t = copy[lang] ?? copy.en;

  const calendlyBaseUrl = useMemo(() => {
    const u = (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "").trim();
    return u;
  }, []);

  const calendlyEmbedUrl = useMemo(() => {
    if (!calendlyBaseUrl) return "";
    try {
      const url = new URL(calendlyBaseUrl);
      const n = name.trim();
      const e = email.trim();
      if (n) url.searchParams.set("name", n);
      if (e) url.searchParams.set("email", e);
      url.searchParams.set("hide_gdpr_banner", "1");
      return url.toString();
    } catch {
      return "";
    }
  }, [calendlyBaseUrl, email, name]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep("details");
      setError(null);
    }
  }, [open]);

  const resetForm = () => {
    setName("");
    setEmail("");
  };

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const n = name.trim();
    const em = email.trim();

    if (!n) {
      setError(t.errName);
      return;
    }

    if (!em || !/^\S+@\S+\.\S+$/.test(em)) {
      setError(t.errEmail);
      return;
    }

    if (!calendlyBaseUrl) {
      setError(t.errNotConfigured);
      return;
    }

    setStep("slots");
  };

  return (
    <>
      <button type="button" className={styles.heroCtaSecondary} onClick={() => setOpen(true)}>
        {t.trigger}
      </button>

      {open && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Book a meeting">
          <button type="button" className={styles.modalBackdropBtn} aria-label="Close modal" onClick={() => setOpen(false)} />

          <div className={styles.modalCard} role="document">
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{t.title}</div>
              <button type="button" className={styles.modalClose} aria-label="Close" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            {step === "details" ? (
              <form className={styles.modalForm} onSubmit={onContinue}>
                <label className={styles.modalLabel}>
                  <span>{t.labelName}</span>
                  <input className={styles.modalInput} value={name} onChange={(e) => setName(e.target.value)} placeholder={t.placeholderName} />
                </label>

                <label className={styles.modalLabel}>
                  <span>{t.labelEmail}</span>
                  <input
                    className={styles.modalInput}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholderEmail}
                  />
                </label>

                {error && <div className={styles.modalError}>{error}</div>}

                <div className={styles.modalActions}>
                  <button type="button" className={styles.modalSecondaryBtn} onClick={() => setOpen(false)}>
                    {t.cancel}
                  </button>
                  <button type="submit" className={styles.modalPrimaryBtn}>
                    {t.seeSlots}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.modalEmbedWrap}>
                <div className={styles.modalEmbedTopRow}>
                  <button
                    type="button"
                    className={styles.modalSecondaryBtn}
                    onClick={() => {
                      setStep("details");
                      setError(null);
                    }}
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    className={styles.modalSecondaryBtn}
                    onClick={() => {
                      resetForm();
                      setStep("details");
                      setError(null);
                    }}
                  >
                    {t.changeDetails}
                  </button>
                </div>

                {!calendlyEmbedUrl ? (
                  <div className={styles.modalError}>{t.errInvalidUrl}</div>
                ) : (
                  <iframe
                    className={styles.modalEmbed}
                    title="Meeting scheduling"
                    src={calendlyEmbedUrl}
                    frameBorder={0}
                    allow="camera; microphone; fullscreen; payment"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
