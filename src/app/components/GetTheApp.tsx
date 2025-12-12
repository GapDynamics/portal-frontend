"use client";
import styles from "./GetTheApp.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import PlayStore from '../assets/images/google-play.png'


export default function GetTheApp() {
  const { lang } = useLanguage();

  const copy: Record<string, {
    title: string;
    subtitle: string;
  }> = {
    en: {
      title: "Get the App!",
      subtitle: "Enhance Your Health, Enhance Your Life!",
    },
    de: {
      title: "Hol dir die App!",
      subtitle: "Verbessere deine Gesundheit, verbessere dein Leben!",
    },
    fr: {
      title: "Téléchargez l'application !",
      subtitle: "Améliorez votre santé, améliorez votre vie !",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{t.title}</h2>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
          <div className={styles.badgesWrapper}>
            <a 
              className={styles.badge} 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Get it on Google Play"
            >
              <img 
                className={styles.badgeImg} 
                src={PlayStore.src} 
                alt="Get it on Google Play" 
              />
            </a>
            <a 
              className={styles.badge} 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Download on the App Store"
            >
              <img 
                className={styles.badgeImg} 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on the App Store" 
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
