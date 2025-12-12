"use client";
import styles from "./NutriTeamWeb.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import MockImageNew from '../assets/images/header-swiss-healthassist.jpg'
import Hin from '../assets/images/hin.png'

export default function NutriTeamWebNew() {
  const { lang } = useLanguage();
  const copy: Record<string, { title: string;  desc: string; longDesc: string; cta: string }>= {
    en: {
      title: "Registered Partner Swiss Health Assistant",
      // sub: "AI-powered guidance for faster insights.",
      desc: "Swiss HealthAssist is a secure, privacy-compliant Swiss AI technology developed in collaboration with our partner AlpineAI. All features are tailored to the needs of medical and psychological professionals as well as caregivers in the Swiss healthcare system.",
      longDesc: "Personalized nutrition coaching — Our certified nutritionists provide you with customized plans and ongoing support on your weight loss journey. Using our advanced LLM model aligned with Mediterranean Diet, Hormone Balance, Microbiome Optimization and Fitness, we deliver precise, evidence-based recommendations. Our AI-powered application analyzes your individual needs and creates personalized nutritional strategies to take your health to a new level. Start your transformation today and experience the precision and efficiency of data-driven nutrition coaching.",
      cta: "Open Health Assistant",
    },
    de: {
      title: "Registrierter Partner Swiss Health Assistant",
      // sub: "KI-gestützte Orientierung für schnelle Einblicke.",
      desc: "Swiss HealthAssist ist eine sichere, datenschutzkonforme Schweizer KI-Technologie. Sämtliche Funktionen sind auf die Bedürfnisse medizinischer und psychologischer Fachpersonen sowie für Personen aus der Pflege im Schweizer Gesundheitswesen zugeschnitten.",
      longDesc: "Personalisierte Ernährungsberatung — Unsere zertifizierten Ernährungsexpert:innen erstellen individuelle Pläne und begleiten dich kontinuierlich auf deinem Weg zur Gewichtsreduktion. Mit unserem fortschrittlichen LLMModell, abgestimmt auf mediterrane Ernährung, Hormonbalance, Mikrobiom Optimierung und Fitness, liefern wir präzise, evidenzbasierte Empfehlungen. Unsere KI gestützte Anwendung analysiert deine individuellen Bedürfnisse und entwickelt personalisierte Ernährungsstrategien, die deine Gesundheit auf das nächste Level heben. Starte deine Transformation noch heute und erlebe Präzision und Effizienz datengetriebener Ernährungsberatung.",
      cta: "Health Assistant öffnen",
    },
    fr: {
      title: "Partenaire enregistré Swiss Health Assistant",
      // sub: "Conseils rapides grâce à l’IA.",
      desc: "Swiss HealthAssist est une technologie suisse d'intelligence artificielle sécurisée et conforme à la protection des données, entwickelt in Zusammenarbeit mit AlpineAI. Toutes les fonctionnalités sind auf die Bedürfnisse medizinischer und psychologischer Fachpersonen sowie für Personen aus der Pflege im Schweizer Gesundheitswesen zugeschnitten.",
      longDesc: "Coaching nutritionnel personnalisé — Nos nutritionnistes certifiés vous proposent des plans sur mesure et un accompagnement continu dans votre parcours de perte de poids. Grâce à notre modèle LLM avancé, aligné avec le régime méditerranéen, l’équilibre hormonal, l’optimisation du microbiome et la condition physique, nous fournissons des recommandations précises et fondées sur des preuves. Notre application propulsée par l’IA analyse vos besoins individuels et conçoit des stratégies nutritionnelles personnalisées pour porter votre santé à un niveau supérieur. Commencez votre transformation dès aujourd’hui et découvrez la précision et l’efficacité d’un coaching nutritionnel guidé par les données.",
      cta: "Ouvrir l’Assistant santé",
    },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrap}>
             <div>
            <a href="https://www.hin.ch/de/index.cfm" target="_blank" rel="noopener noreferrer"> <img src={Hin.src} alt="Hin" /></a>
            <h2 className={styles.title}>{t.title}</h2>
            {/* <p className={styles.subtitle}>{t.sub}</p> */}
            <p className={styles.desc}>{t.desc}</p>
            {/* <p className={styles.desc}>{t.longDesc}</p> */}
            {/* <a className={styles.badgeLink} href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=homepage&utm_campaign=health-assistant" target="_blank" rel="noopener noreferrer">
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <span>{t.cta}</span>
            </a> */}
          </div>
           <div className={styles.mock}>
            <img className={styles.mockImg} src={MockImageNew.src} alt="NutriTeam" />
          </div>
        </div>
      </div>
    </section>
  );
}
