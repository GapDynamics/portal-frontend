"use client";

import Link from "next/link";
import styles from "./portal/welcome/page.module.scss";
import Logo from "@/app/assets/images/omnicheck-logo.png";
import Mascot from "@/app/assets/images/omni-logo1.png";
import LangSelector from "./components/LangSelector";
import Screenshot1 from "@/app/assets/images/sc-1.jpg";
import Screenshot2 from "@/app/assets/images/sc-2.jpg";
import Screenshot3 from "@/app/assets/images/sc-3.jpg";
import Screenshot4 from "@/app/assets/images/sc-4.jpg";
import Screenshot5 from "@/app/assets/images/sc-5.png";
import GoalImg1 from "@/app/assets/images/lose-weight1.jpg";
import GoalImg2 from "@/app/assets/images/lose-weight.jpg";
import GoalImg3 from "@/app/assets/images/healthy-routine.jpg";
import GoalImg4 from "@/app/assets/images/maintain-weight.jpg";
import MyOmnicheck from "./components/MyOmnicheck";
import NutriTeamWebNew from "./components/NutriTeamWebNew";
import PlayStore from "@/app/assets/images/google-play.png";
import MeetingBookingModal from "./components/MeetingBookingModal";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function Home() {
  const { lang } = useLanguage();
  const copy: Record<
    string,
    {
      nav: { directory: string; coupons: string; about: string; contact: string };
      hero: { h1: string; sub: string; getStarted: string; note: string };
      goals: { title: string; labels: { build: string; lose: string; routines: string; maintain: string } };
      cta: { title: string; button: string; note: string };
      footer: {
        quickTitle: string;
        resourcesTitle: string;
        home: string;
        about: string;
        faq: string;
        contact: string;
        blog: string;
        guides: string;
        support: string;
        privacy: string;
        terms: string;
        rights: string;
      };
    }
  > = {
    en: {
      nav: { directory: "Directory", coupons: "Coupons", about: "About us", contact: "Contact" },
      hero: {
        h1: "Better habits. Better outcomes.",
        sub: "One place to manage your health journey with OmniCheck.",
        getStarted: "Get started",
        note: "Set up your account in minutes",
      },
      goals: {
        title: "Reach your goals, your way",
        labels: { build: "Build muscles", lose: "Lose weight", routines: "Build healthy routines", maintain: "Personal Training Plan" },
      },
      cta: { title: "Ready to see results? Start your plan today.", button: "Get started", note: "Set up your account in minutes" },
      footer: {
        quickTitle: "Quick links",
        resourcesTitle: "Resources",
        home: "Home",
        about: "About",
        faq: "FAQ",
        contact: "Contact",
        blog: "Blog",
        guides: "Guides",
        support: "Support",
        privacy: "Privacy",
        terms: "Terms",
        rights: "All rights reserved.",
      },
    },
    de: {
      nav: { directory: "Verzeichnis", coupons: "Coupons", about: "Über uns", contact: "Kontakt" },
      hero: {
        h1: "Bessere Gewohnheiten. Bessere Ergebnisse.",
        sub: "Alles an einem Ort, um deine Gesundheitsreise mit OmniCheck zu begleiten.",
        getStarted: "Loslegen",
        note: "Konto in wenigen Minuten einrichten",
      },
      goals: {
        title: "Erreiche deine Ziele – auf deine Weise",
        labels: { build: "Muskeln aufbauen", lose: "Abnehmen", routines: "Gesunde Routinen aufbauen", maintain: "Personalisierter Trainingsplan" },
      },
      cta: { title: "Bereit für Ergebnisse? Starte deinen Plan noch heute.", button: "Loslegen", note: "Konto in wenigen Minuten einrichten" },
      footer: {
        quickTitle: "Schnellzugriff",
        resourcesTitle: "Ressourcen",
        home: "Startseite",
        about: "Über uns",
        faq: "FAQ",
        contact: "Kontakt",
        blog: "Blog",
        guides: "Leitfäden",
        support: "Support",
        privacy: "Datenschutz",
        terms: "Nutzungsbedingungen",
        rights: "Alle Rechte vorbehalten.",
      },
    },
    fr: {
      nav: { directory: "Annuaire", coupons: "Coupons", about: "À propos", contact: "Contact" },
      hero: {
        h1: "De meilleures habitudes. De meilleurs résultats.",
        sub: "Un seul endroit pour gérer votre parcours santé avec OmniCheck.",
        getStarted: "Commencer",
        note: "Créez votre compte en quelques minutes",
      },
      goals: {
        title: "Atteignez vos objectifs, à votre façon",
        labels: { build: "Prendre du muscle", lose: "Perdre du poids", routines: "Créer des routines saines", maintain: "Personalisierter Trainingsplan" },
      },
      cta: { title: "Prêt à voir des résultats ? Commencez votre plan dès aujourd’hui.", button: "Commencer", note: "Créez votre compte en quelques minutes" },
      footer: {
        quickTitle: "Liens rapides",
        resourcesTitle: "Ressources",
        home: "Accueil",
        about: "À propos",
        faq: "FAQ",
        contact: "Contact",
        blog: "Blog",
        guides: "Guides",
        support: "Support",
        privacy: "Confidentialité",
        terms: "Conditions",
        rights: "Tous droits réservés.",
      },
    },
  };
  const t = copy[lang] ?? copy.en;

  return (
    <main className={`${styles.page} ${styles.landingMain}`}>
      <div className={styles.topNavBar}>
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
              {/* <Link className={styles.link} href="/directory">{t.nav.directory}</Link> */}
              <Link className={styles.link} href="/coupons">{t.nav.coupons}</Link>
              <a className={styles.link} href="https://www.nutriteam.ch/team/" target="_blank">{t.nav.about}</a>
              <Link className={styles.link} href="/contact">{t.nav.contact}</Link>
            </nav>

            <div className={styles.langWrap}>
              <LangSelector className={styles.langSelect} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">

        <section className={styles.hero}>
          <h1 className={styles.h1}>{t.hero.h1}</h1>
          <div className={styles.sub}>{t.hero.sub}</div>
          <div className={styles.heroActions}>
            <MeetingBookingModal />
            <Link className={styles.heroCta} href="/home">{t.hero.getStarted}</Link>
          </div>
          <div className={styles.note}>{t.hero.note}</div>

          {/* <div className={styles.mascotWrap}>
            <img className={styles.mascot} src={Mascot.src} alt="Mascot" />
          </div> */}
        </section>

        <section className={styles.screenshotsSection} aria-label="App screenshots">
          <div className={styles.screenshotsTrack}>
            <div className={styles.phoneShot}>
              <img
                className={styles.phoneShotImg}
                src={Screenshot1.src}
                alt="OmniCheck app screenshot 1"
                loading="lazy"
              />
            </div>
            <div className={styles.phoneShot}>
              <img
                className={styles.phoneShotImg}
                src={Screenshot2.src}
                alt="OmniCheck app screenshot 2"
                loading="lazy"
              />
            </div>
             <div className={styles.phoneShot}>
              <img
                className={styles.phoneShotImg}
                src={Screenshot5.src}
                alt="OmniCheck app screenshot 5"
                loading="lazy"
              />
            </div>
            <div className={styles.phoneShot}>
              <img
                className={styles.phoneShotImg}
                src={Screenshot3.src}
                alt="OmniCheck app screenshot 3"
                loading="lazy"
              />
            </div>
            <div className={styles.phoneShot}>
              <img
                className={styles.phoneShotImg}
                src={Screenshot4.src}
                alt="OmniCheck app screenshot 4"
                loading="lazy"
              />
            </div>
            
          </div>
        </section>

        <section className={styles.goalsSection} aria-label="Goals">
          <div className={styles.goalsPanel}>
            <h2 className={styles.goalsTitle}>{t.goals.title}</h2>
          </div>

          <div className={styles.goalsCards}>
            <div className={styles.goalCard}>
              <div className={styles.goalLabel}>{t.goals.labels.build}</div>
              <div className={styles.goalImgWrap}>
                <img className={styles.goalImg} src={GoalImg1.src} alt={t.goals.labels.build} loading="lazy" />
              </div>
            </div>

            <div className={styles.goalCard}>
              <div className={styles.goalLabel}>{t.goals.labels.lose}</div>
              <div className={styles.goalImgWrap}>
                <img className={styles.goalImg} src={GoalImg2.src} alt={t.goals.labels.lose} loading="lazy" />
              </div>
            </div>

            <div className={styles.goalCard}>
              <div className={styles.goalLabel}>{t.goals.labels.routines}</div>
              <div className={styles.goalImgWrap}>
                <img className={styles.goalImg} src={GoalImg3.src} alt={t.goals.labels.routines} loading="lazy" />
              </div>
            </div>

            <div className={styles.goalCard}>
              <div className={styles.goalLabel}>{t.goals.labels.maintain}</div>
              <div className={styles.goalImgWrap}>
                <img className={styles.goalImg} src={GoalImg4.src} alt={t.goals.labels.maintain} loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <MyOmnicheck />
      <NutriTeamWebNew />

      <section className={styles.reviewsCtaSection} aria-label="Reviews and call to action">
        <div className="container">
          <div className={styles.reviewsCtaHero}>
            <h2 className={styles.reviewsCtaTitle}>{t.cta.title}</h2>
            <Link className={styles.reviewsCtaButton} href="/home">{t.cta.button}</Link>
            <div className={styles.reviewsCtaNote}>{t.cta.note}</div>
          </div>
        </div>  
      </section>

      <footer className={styles.landingFooter} aria-label="Footer">
        <div className="container">
          <div className={styles.footerTop}>
            <div className={styles.footerBadges}>
              <a className={styles.storeBadge} href="#" aria-label="Download on the App Store">
                <img
                  className={styles.storeBadgeImg}
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                />
              </a>
              <a className={styles.storeBadge} href="#" aria-label="Get it on Google Play">
                <img className={styles.storeBadgeImg} src={PlayStore.src} alt="Google Play" />
              </a>
            </div>

            <div className={styles.footerCols}>
              <div className={styles.footerCol}>
                <div className={styles.footerColTitle}>{t.footer.quickTitle}</div>
                <a className={styles.footerLink} href="/">{t.footer.home}</a>
                <a className={styles.footerLink} href="https://www.nutriteam.ch/team/" target="_blank" rel="noreferrer">{t.footer.about}</a>
                <a className={styles.footerLink} href="/faq">{t.footer.faq}</a>
                <a className={styles.footerLink} href="/contact">{t.footer.contact}</a>
              </div>
              <div className={styles.footerCol}>
                <div className={styles.footerColTitle}>{t.footer.resourcesTitle}</div>
                <a className={styles.footerLink} href="https://www.nutriteam.ch/unsere-blog-beitraege/" target="_blank" rel="noreferrer">{t.footer.blog}</a>
                <a className={styles.footerLink} href="#">{t.footer.guides}</a>
                <a className={styles.footerLink} href="#">{t.footer.support}</a>
              </div>
            </div>
          </div>

          <div className={styles.footerMid}>
            <div className={styles.footerSocials} aria-label="Social links">
              <a className={styles.footerSocial} href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a className={styles.footerSocial} href="#" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 9h3V6h-3c-2 0-4 2-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1z" fill="currentColor"/></svg>
              </a>
              <a className={styles.footerSocial} href="#" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 3v10.2a3.4 3.4 0 1 1-2-3.1V6.1c-.7-.1-1.4-.1-2.1.1A6 6 0 1 0 16 12V7.5c1.3 1 2.9 1.6 4.6 1.7V6.2c-1.8-.1-3.5-1.2-4.6-3.2z" fill="currentColor"/></svg>
              </a>
            </div>

            <div className={styles.footerLegal}>
              <span className={styles.footerCopyright}>Copyright © {new Date().getFullYear()} OmniCheck. {t.footer.rights}</span>
              <div className={styles.footerLegalLinks}>
                <a className={styles.footerLinkInline} href="https://www.nutriteam.ch/datenschutz-und-haftung/" target="_blank" rel="noreferrer">{t.footer.privacy}</a>
                <a className={styles.footerLinkInline} href="https://www.nutriteam.ch/agb/" target="_blank" rel="noreferrer">{t.footer.terms}</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBrandBig} aria-hidden="true">omnicheck</div>
        </div>
      </footer>
    </main>
  );
}
