"use client";
import styles from "./OmnicheckPartner.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import PartnerImg from "../assets/images/omnicheck-partner.png";

export default function OmnicheckPartner() {
  const { lang } = useLanguage();

  const copy: Record<
    string,
    {
      kicker: string;
      title: string;
      intro1: string;
      intro2: string;
      benefits: { strong: string; sub: string }[];
      outro1: string;
      outro2: string;
    }
  > = {
    de: {
      kicker: "Für Omnicheck-Partner",
      title:
        "Werde Omnicheck-Partner – erweitere dein Angebot mit moderner Gesundheitsanalyse.",
      intro1:
        "Als Fachperson im Gesundheitswesen bietest du als Omnicheck-Partner deinen Kundinnen und Kunden einen echten Mehrwert: eine wissenschaftlich fundierte und ganzheitliche Gesundheitsanalyse, die Lifestyle, Hormonbalance und Mikrobiom berücksichtigt. Der detaillierte Fragebogen und die individuelle 20–30-seitige Auswertung ermöglichen es dir, Gesundheitsstatus und Potenziale deiner Klient:innen präzise zu erfassen.",
      intro2: "Mit Omnicheck integrierst du ein innovatives Tool in deine Beratung:",
      benefits: [
        { strong: "Umfassende Gesundheitsanalyse", sub: "für deine Kund:innen" },
        {
          strong: "Individuelles Beratungsgespräch",
          sub: "zur gemeinsamen Auswertung",
        },
        {
          strong: "Zugang zur Omnicheck-App",
          sub: "mit allen Gesundheitsdaten an einem Ort",
        },
        {
          strong: "KI-gestütztes Ernährungstagebuch",
          sub: "per Fotoprotokoll",
        },
      ],
      outro1:
        "Als Partner stärkst du deine Position als ganzheitliche Fachperson, erweiterst dein Leistungsangebot und begleitest deine Kund:innen noch gezielter auf deinem Weg zu mehr Gesundheit und Wohlbefinden.",
      outro2:
        "Werde Teil des Omnicheck-Netzwerks – und unterstütze Menschen dabei, deine Gesundheit besser zu verstehen und aktiv zu gestalten.",
    },
    en: {
      kicker: "For OmniCheck partners",
      title:
        "Become an OmniCheck partner – expand your offer with modern health analytics.",
      intro1:
        "As a healthcare professional, you offer your clients real added value as an OmniCheck partner: a science-based, holistic health analysis that takes lifestyle, hormone balance and microbiome into account. The detailed questionnaire and individual 20–30 page report enable you to precisely capture your clients’ health status and potential.",
      intro2: "With OmniCheck you integrate an innovative tool into your consultations:",
      benefits: [
        { strong: "Comprehensive health analysis", sub: "for your clients" },
        {
          strong: "Individual consultation",
          sub: "to review results together",
        },
        {
          strong: "Access to the OmniCheck app",
          sub: "with all health data in one place",
        },
        {
          strong: "AI-powered nutrition diary",
          sub: "using photo-based logging",
        },
      ],
      outro1:
        "As a partner you strengthen your position as a holistic professional, expand your service offering and support your clients even more specifically on their path to better health and wellbeing.",
      outro2:
        "Become part of the OmniCheck network – and help people better understand their health and take an active role in it.",
    },
    fr: {
      kicker: "Pour les partenaires OmniCheck",
      title:
        "Devenez partenaire OmniCheck – enrichissez votre offre avec une analyse de santé moderne.",
      intro1:
        "En tant que professionnel·le de santé, vous offrez à vos client·e·s une réelle valeur ajoutée en tant que partenaire OmniCheck : une analyse de santé scientifique et globale qui prend en compte le mode de vie, l’équilibre hormonal et le microbiote. Le questionnaire détaillé et le rapport individuel de 20 à 30 pages vous permettent de saisir précisément l’état de santé et le potentiel de vos client·e·s.",
      intro2:
        "Avec OmniCheck, vous intégrez un outil innovant dans votre accompagnement :",
      benefits: [
        { strong: "Analyse de santé complète", sub: "pour vos client·e·s" },
        {
          strong: "Entretien de conseil individuel",
          sub: "pour analyser les résultats ensemble",
        },
        {
          strong: "Accès à l’application OmniCheck",
          sub: "avec toutes les données de santé au même endroit",
        },
        {
          strong: "Journal alimentaire assisté par IA",
          sub: "via un protocole photo",
        },
      ],
      outro1:
        "En tant que partenaire, vous renforcez votre position de professionnel·le holistique, élargissez votre offre de prestations et accompagnez vos client·e·s de manière encore plus ciblée vers plus de santé et de bien-être.",
      outro2:
        "Rejoignez le réseau OmniCheck – et aidez les personnes à mieux comprendre leur santé et à la prendre en main de façon active.",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row align-items-stretch g-4">
          {/* Text on the right */}
          <div className="col-lg-6 d-flex order-2 order-lg-1">
            <div className={styles.textCol}>

              <span className={styles.kicker}>{t.kicker}</span>
              <h2 className={styles.title}>{t.title}</h2>
              <p className={styles.lead}>{t.intro1}</p>
              <p className={styles.lead}>{t.intro2}</p>
              <ul className={styles.benefits}>
                {t.benefits.map((b, idx) => (
                  <li key={idx}>
                    <strong>{b.strong}</strong>
                    <span>{b.sub}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.outro}>{t.outro1}</p>
              <p className={styles.outro}>{t.outro2}</p>
            </div>
          </div>
           <div className="col-lg-6 d-flex order-1 order-lg-12">
            <div className={styles.imageWrap}>

              <img
                src={PartnerImg.src}
                alt={t.title}
                className={styles.image}
                onError={(e) => {
                  const img = e.currentTarget as unknown as HTMLImageElement;
                  (img as any).style.display = "none";
                  const fallback = img.parentElement?.querySelector(
                    `.${styles.visual}`
                  ) as HTMLElement | null;
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div
                className={styles.visual}
                aria-hidden="true"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}