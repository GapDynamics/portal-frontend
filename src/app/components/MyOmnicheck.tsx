"use client";
import styles from "./MyOmnicheck.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import MyOmnicheckImg from "../assets/images/omnicheck-partner1.png";

export default function MyOmnicheck() {
  const { lang } = useLanguage();

  const copy: Record<string, {
    title: string;
    intro: string;
    body1: string;
    body2: string;
    highlight: string;
  }> = {
    de: {
      title: "MyOmnicheck – Ihre umfassende Standortbestimmung für ganzheitliche Gesundheit!",
      intro:
        "Omnicheck ist ein einzigartiges Gesundheitsangebot, das Ihnen hilft, Ihren aktuellen Gesundheitszustand präzise einzuordnen und gezielt zu verbessern.",
      body1:
        "Im Mittelpunkt steht ein ausführlicher, fundierter Fragebogen, der die drei zentralen Bereiche moderner Präventionsmedizin abdeckt: mediterraner Lebensstil, Hormonbalance und Mikrobiom. Auf Basis Ihrer Angaben wird eine 20–30 Seiten umfassende persönliche Auswertung erstellt. Diese Analyse zeigt klar auf, wo Sie gesundheitlich stehen, welche Faktoren besonders relevant sind und welche Schritte für Ihre körperliche und mentale Balance wichtig sind. Die Ergebnisse können anschließend gemeinsam mit einer Fachperson oder einem zertifizierten Omnicheck-Partner besprochen werden, sodass Sie eine professionelle Einordnung und individuelle Empfehlungen erhalten.",
      body2:
        "Ergänzend dazu erhalten Sie Zugang zur Omnicheck-App, die alle Ihre Gesundheitsdaten sicher bündelt. Ein besonderes Highlight ist das integrierte KI-gestützte Ernährungstagebuch: Durch ein einfaches Fotoprotokoll erkennt die App Ihre Mahlzeiten automatisch und unterstützt Sie dabei, Ihr Essverhalten transparent und mühelos zu dokumentieren.",
      highlight:
        "Omnicheck verbindet präzise Analyse, persönliche Betreuung und moderne Technologie – für ein ganzheitliches Verständnis Ihrer Gesundheit und eine klare Orientierung auf Ihrem Weg zu mehr Wohlbefinden.",
    },
    en: {
      title: "MyOmniCheck – your comprehensive baseline for holistic health!",
      intro:
        "OmniCheck is a unique health offering that helps you clearly understand your current health status and improve it in a targeted way.",
      body1:
        "At the core is a detailed, evidence-based questionnaire that covers three key areas of modern preventive medicine: Mediterranean lifestyle, hormone balance and microbiome. Based on your answers, a personal 20–30 page report is generated. This analysis shows where you currently stand, which factors matter most and which steps are important for your physical and mental balance. The results can be reviewed together with a professional or certified OmniCheck partner so you receive expert interpretation and personalised recommendations.",
      body2:
        "In addition, you get access to the OmniCheck app, which securely brings all your health data together. A special highlight is the integrated AI-powered nutrition diary: with a simple photo log, the app automatically recognises your meals and helps you track your eating habits transparently and effortlessly.",
      highlight:
        "OmniCheck combines precise analysis, personal guidance and modern technology – for a holistic understanding of your health and clear orientation on your path to greater wellbeing.",
    },
    fr: {
      title: "MyOmniCheck – votre point de départ complet pour une santé globale !",
      intro:
        "OmniCheck est une offre de santé unique qui vous aide à situer précisément votre état de santé actuel et à l’améliorer de manière ciblée.",
      body1:
        "Au cœur du dispositif se trouve un questionnaire détaillé et fondé scientifiquement qui couvre trois domaines clés de la médecine préventive moderne : le mode de vie méditerranéen, l’équilibre hormonal et le microbiote. Sur la base de vos réponses, un rapport personnel de 20 à 30 pages est généré. Cette analyse montre clairement où vous en êtes, quels facteurs sont particulièrement importants et quelles étapes sont essentielles pour votre équilibre physique et mental. Les résultats peuvent ensuite être discutés avec un professionnel de santé ou un partenaire OmniCheck certifié afin de bénéficier d’une interprétation experte et de recommandations personnalisées.",
      body2:
        "Vous avez en complément accès à l’application OmniCheck, qui regroupe en toute sécurité l’ensemble de vos données de santé. Un point fort particulier est le journal alimentaire assisté par IA intégré : grâce à un simple protocole photo, l’application reconnaît automatiquement vos repas et vous aide à documenter vos habitudes alimentaires de manière transparente et sans effort.",
      highlight:
        "OmniCheck allie analyse précise, accompagnement personnalisé et technologie moderne – pour une compréhension globale de votre santé et un cap clair vers davantage de bien-être.",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 d-flex">
            <div className={styles.imageWrap}>
              <img
                src={MyOmnicheckImg.src}
                alt={t.title}
                className={styles.image}
              />
            </div>
          </div>
          <div className="col-lg-6 d-flex">
            <div className={styles.textCol}>
              <h2 className={styles.title}>{t.title}</h2>
              <p className={styles.lead}>{t.intro}</p>
              <p className={styles.lead}>{t.body1}</p>
              <p className={styles.lead}>{t.body2}</p>
              <p className={styles.highlight}>{t.highlight}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
