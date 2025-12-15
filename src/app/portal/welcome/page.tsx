"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import Logo from "@/app/assets/images/omnicheck-logo.png";
import Mascot from "@/app/assets/images/omni-logo1.png";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function PortalWelcomePage() {
  const { lang } = useLanguage();
  const copy: Record<
    string,
    {
      navPatient: string;
      navProfessional: string;
      navDirectory: string;
      navMessages: string;
      ctaPortal: string;
      ctaTry: string;
      h1: string;
      sub: string;
      getStarted: string;
      note: string;
      cards: { title: string; value: string; text: string }[];
    }
  > = {
    en: {
      navPatient: "Patient",
      navProfessional: "Professional",
      navDirectory: "Directory",
      navMessages: "Messages",
      ctaPortal: "Go to portal",
      ctaTry: "Try for free",
      h1: "Better habits. Better outcomes.",
      sub: "One place to manage your health journey with OmniCheck.",
      getStarted: "Get started",
      note: "Set up your account in minutes",
      cards: [
        { title: "Progress", value: "75%", text: "Stay consistent with small daily wins." },
        { title: "Nutrition", value: "+12", text: "Personalized tips for better meals." },
        { title: "Hydration", value: "2.0L", text: "Track water and build the habit." },
        { title: "Milestones", value: "3", text: "Celebrate streaks and achievements." },
      ],
    },
    de: {
      navPatient: "Patient",
      navProfessional: "Fachperson",
      navDirectory: "Verzeichnis",
      navMessages: "Nachrichten",
      ctaPortal: "Zum Portal",
      ctaTry: "Kostenlos testen",
      h1: "Bessere Gewohnheiten. Bessere Ergebnisse.",
      sub: "Alles an einem Ort, um deine Gesundheitsreise mit OmniCheck zu begleiten.",
      getStarted: "Loslegen",
      note: "Konto in wenigen Minuten einrichten",
      cards: [
        { title: "Fortschritt", value: "75%", text: "Bleib dran – mit kleinen täglichen Erfolgen." },
        { title: "Ernährung", value: "+12", text: "Personalisierte Tipps für bessere Mahlzeiten." },
        { title: "Hydration", value: "2.0L", text: "Wasser tracken und die Gewohnheit aufbauen." },
        { title: "Meilensteine", value: "3", text: "Streaks und Erfolge feiern." },
      ],
    },
    fr: {
      navPatient: "Patient",
      navProfessional: "Professionnel",
      navDirectory: "Annuaire",
      navMessages: "Messages",
      ctaPortal: "Accéder au portail",
      ctaTry: "Essayer gratuitement",
      h1: "De meilleures habitudes. De meilleurs résultats.",
      sub: "Un seul endroit pour gérer votre parcours santé avec OmniCheck.",
      getStarted: "Commencer",
      note: "Créez votre compte en quelques minutes",
      cards: [
        { title: "Progrès", value: "75%", text: "Restez régulier avec de petites victoires quotidiennes." },
        { title: "Nutrition", value: "+12", text: "Conseils personnalisés pour de meilleurs repas." },
        { title: "Hydratation", value: "2.0L", text: "Suivez votre eau et créez l’habitude." },
        { title: "Étapes", value: "3", text: "Célébrez les séries et les réussites." },
      ],
    },
  };
  const t = copy[lang] ?? copy.en;

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.topNav}>
          <Link href="/" className={styles.brand}>
            <span
              className={styles.brandLogoMask}
              style={{ "--logo-url": `url(${Logo.src})` } as any}
              aria-label="OmniCheck"
            />
          </Link>

          <nav className={styles.links} aria-label="Portal navigation">
            <Link className={styles.link} href="/portal/patient">{t.navPatient}</Link>
            <Link className={styles.link} href="/portal/professional">{t.navProfessional}</Link>
            <Link className={styles.link} href="/directory">{t.navDirectory}</Link>
            <Link className={styles.link} href="/portal/chat">{t.navMessages}</Link>
          </nav>

          <div className="d-flex align-items-center gap-2">
            <Link className={styles.cta} href="/portal">{t.ctaPortal}</Link>
            <Link className={styles.cta} href="/register">{t.ctaTry}</Link>
          </div>
        </div>

        <section className={styles.hero}>
          <h1 className={styles.h1}>{t.h1}</h1>
          <div className={styles.sub}>{t.sub}</div>
          <Link className={styles.heroCta} href="/register">{t.getStarted}</Link>
          <div className={styles.note}>{t.note}</div>

          <div className={styles.mascotWrap}>
            <img className={styles.mascot} src={Mascot.src} alt="Mascot" />
          </div>
        </section>

        <section className={styles.cardRow}>
          <div className={styles.cards}>
            {t.cards.map((c, idx) => (
              <div className={styles.card} key={idx}>
                <div className={styles.cardTitle}>{c.title}</div>
                <div className={styles.cardValue}>{c.value}</div>
                <div className={styles.cardText}>{c.text}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
