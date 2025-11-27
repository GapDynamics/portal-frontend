"use client";
import styles from "./Footer.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import Logo from '../assets/images/omnicheck-logo-mob.png'

export default function Footer() {
  const { lang } = useLanguage();

  const copy: Record<string, {
    aboutTitle: string;
    aboutText: string;
    quickTitle: string;
    resTitle: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
    subscribe: string;
    rights: string;
    linkHome: string;
    linkAbout: string;
    linkFaq: string;
    linkContact: string;
    linkBlog: string;
    linkGuides: string;
    linkSupport: string;
    linkPrivacy: string;
    linkTerms: string;
  }> = {
    en: {
      aboutTitle: "About OmniCheck Network",
      aboutText: "A community connecting patients and professionals with functional, preventative and holistic healthcare.",
      quickTitle: "Quick links",
      resTitle: "Resources",
      newsletterTitle: "Stay in the loop",
      newsletterPlaceholder: "Your email address",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
      linkHome: "Home",
      linkAbout: "About",
      linkFaq: "FAQ",
      linkContact: "Contact",
      linkBlog: "Blog",
      linkGuides: "Guides",
      linkSupport: "Support",
      linkPrivacy: "Privacy",
      linkTerms: "Terms",
    },
    de: {
      aboutTitle: "Über OmniCheck Network",
      aboutText: "Eine Community, die Patient:innen und Fachpersonen in der funktionellen, präventiven und ganzheitlichen Medizin verbindet.",
      quickTitle: "Schnellzugriff",
      resTitle: "Ressourcen",
      newsletterTitle: "Bleiben Sie informiert",
      newsletterPlaceholder: "Ihre E‑Mail‑Adresse",
      subscribe: "Abonnieren",
      rights: "Alle Rechte vorbehalten.",
      linkHome: "Startseite",
      linkAbout: "Über uns",
      linkFaq: "FAQ",
      linkContact: "Kontakt",
      linkBlog: "Blog",
      linkGuides: "Leitfäden",
      linkSupport: "Support",
      linkPrivacy: "Datenschutz",
      linkTerms: "Nutzungsbedingungen",
    },
    fr: {
      aboutTitle: "À propos de OmniCheck Network",
      aboutText: "Une communauté reliant patients et professionnels en santé fonctionnelle, préventive et holistique.",
      quickTitle: "Liens rapides",
      resTitle: "Ressources",
      newsletterTitle: "Restez informé",
      newsletterPlaceholder: "Votre adresse e‑mail",
      subscribe: "S'abonner",
      rights: "Tous droits réservés.",
      linkHome: "Accueil",
      linkAbout: "À propos",
      linkFaq: "FAQ",
      linkContact: "Contact",
      linkBlog: "Blog",
      linkGuides: "Guides",
      linkSupport: "Support",
      linkPrivacy: "Confidentialité",
      linkTerms: "Conditions",
    },
  };

  const t = copy[lang] ?? copy.en;

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <div className={styles.brand}>
              <div className={styles.logo} aria-hidden="true"><img className="img-fluid" style={{maxWidth: "150px"}} src={Logo.src} alt="OmniCheck AI" /></div>
              {/* <p style={{marginBottom: 0, color: "#00a5bf", fontWeight: 600, marginTop: 8, fontSize: "18px"}}>OmniCheck AI</p> */}
              <p className={styles.about}>{t.aboutText}</p>
              <div className={styles.socials}>
                <a aria-label="X" href="#" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </a>
                <a aria-label="LinkedIn" href="#" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="8" cy="8" r="1" fill="currentColor"/><path d="M12 17v-3a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </a>
                <a aria-label="Instagram" href="#" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h4 className={styles.columnTitle}>{t.quickTitle}</h4>
            <ul className={styles.links}>
              <li><a href="/">{t.linkHome}</a></li>
              <li><a href="/about">{t.linkAbout}</a></li>
              <li><a href="/faq">{t.linkFaq}</a></li>
              <li><a href="/contact">{t.linkContact}</a></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h4 className={styles.columnTitle}>{t.resTitle}</h4>
            <ul className={styles.links}>
              <li><a href="#">{t.linkBlog}</a></li>
              <li><a href="#">{t.linkGuides}</a></li>
              <li><a href="#">{t.linkSupport}</a></li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h4 className={styles.columnTitle}>{t.newsletterTitle}</h4>
            <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t.newsletterPlaceholder} aria-label={t.newsletterPlaceholder} />
              <button type="submit">{t.subscribe}</button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} OmniCheck AI. {t.rights}</span>
          <div className={styles.bottomLinks}>
            <a href="#">{t.linkPrivacy}</a>
            <a href="#">{t.linkTerms}</a>
            {/* <a href="#">Imprint</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
