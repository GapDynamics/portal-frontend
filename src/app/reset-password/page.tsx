"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../components/Footer";
import styles from "../login/page.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

function ResetPasswordContent() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string;
    subtitle: string;
    newPassword: string;
    confirmPassword: string;
    missingToken: string;
    passwordTooShort: string;
    passwordMismatch: string;
    tokenInvalid: string;
    resetFailed: string;
    resetSuccess: string;
    submit: string;
    back: string;
    loading: string;
  }> = {
    en: {
      title: "Reset password",
      subtitle: "Enter your new password below.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      missingToken: "Missing token. Please use the link from your email.",
      passwordTooShort: "Password must be at least 8 characters.",
      passwordMismatch: "Passwords do not match.",
      tokenInvalid: "Token is invalid or has expired.",
      resetFailed: "Failed to reset password. Try again.",
      resetSuccess: "Password has been successfully reset.",
      submit: "Reset password",
      back: "Back to login",
      loading: "Loading…",
    },
    de: {
      title: "Passwort zurücksetzen",
      subtitle: "Geben Sie unten Ihr neues Passwort ein.",
      newPassword: "Neues Passwort",
      confirmPassword: "Passwort bestätigen",
      missingToken: "Token fehlt. Bitte verwenden Sie den Link aus Ihrer E‑Mail.",
      passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      passwordMismatch: "Die Passwörter stimmen nicht überein.",
      tokenInvalid: "Der Token ist ungültig oder abgelaufen.",
      resetFailed: "Passwort konnte nicht zurückgesetzt werden. Bitte erneut versuchen.",
      resetSuccess: "Das Passwort wurde erfolgreich zurückgesetzt.",
      submit: "Passwort zurücksetzen",
      back: "Zur Anmeldung",
      loading: "Laden…",
    },
    fr: {
      title: "Réinitialiser le mot de passe",
      subtitle: "Entrez votre nouveau mot de passe ci‑dessous.",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmez le mot de passe",
      missingToken: "Jeton manquant. Veuillez utiliser le lien depuis votre e‑mail.",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      tokenInvalid: "Le jeton est invalide ou expiré.",
      resetFailed: "Échec de la réinitialisation du mot de passe. Réessayez.",
      resetSuccess: "Le mot de passe a été réinitialisé avec succès.",
      submit: "Réinitialiser le mot de passe",
      back: "Retour à la connexion",
      loading: "Chargement…",
    },
  };
  const t = copy[lang] ?? copy.en;

  const sp = useSearchParams();
  const token = useMemo(() => sp.get("token") || "", [sp]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!token) { setError(t.missingToken); return; }
    if (!password || password.length < 8) { setError(t.passwordTooShort); return; }
    if (password !== confirm) { setError(t.passwordMismatch); return; }
    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j?.message || t.tokenInvalid);
        return;
      }
      setMessage(j?.message || t.resetSuccess);
    } catch {
      setError(t.resetFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <div className="container">
        <header className={styles.header}>
          <h1 style={{color: "var(--brand-primary)"}}>{t.title}</h1>
          <p>{t.subtitle}</p>
        </header>

        <section className={styles.section}>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className={styles.authCard}>
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={onSubmit} noValidate>
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label">{t.newPassword}</label>
                      <input id="password" name="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="confirm" className="form-label">{t.confirmPassword}</label>
                      <input id="confirm" name="confirm" type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
                    </div>

                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    {message && <div className="alert alert-success py-2" role="status">{message}</div>}
                    <div className="d-flex gap-2 mt-5 justify-content-between">
                      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} style={{backgroundColor: "var(--brand-primary)", maxWidth: "60%"}} disabled={submitting}>
                        {submitting ? t.loading : t.submit}
                      </button>
                      <a href="/login" className="btn btn-outline-secondary" style={{color: "var(--brand-primary)"}}>{t.back}</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FallbackShell />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function FallbackShell() {
  const { lang } = useLanguage();
  const copy: Record<string, { loading: string }> = {
    en: { loading: "Loading…" },
    de: { loading: "Laden…" },
    fr: { loading: "Chargement…" },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <main style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="container">
        <div className="alert alert-info">{t.loading}</div>
      </div>
    </main>
  );
}
