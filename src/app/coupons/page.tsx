"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import styles from "./page.module.scss";
import Footer from "@/app/components/Footer";

const LS_MY_COUPONS = "my_coupons";
const LS_LAST_PURCHASE = "last_purchase";

function save<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function load<T>(k: string, fallback: T): T { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }

function genCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n:number)=>Array.from({length:n},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join("");
  return `NTR-${part(3)}-${part(4)}`;
}

export default function CouponsCatalogPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string; lead: string; price: string; qty: string; buy: string;
    ribbon1: string; ribbon2: string; ribbon3: string;
    planPrivate: string; planEnterprise: string;
    cardIndividual: string; cardCustom: string;
    perkUseAnytime: string; perkInstantCode: string;
    perkTeams: string; perkVolume: string;
    offApplied: (n: number)=>string; noDiscount: string;
    estTotal: string; perCoupon: string;
    mustSignIn: string;
    checkoutFailed: string;
    checkoutMissingUrl: string;
    checkoutStartFailed: string;
  }>= {
    en: {
      title: "OmniCheck Coupons",
      lead: "Buy coupons for yourself or loved ones.",
      price: "Price",
      qty: "Quantity",
      buy: "Buy",
      ribbon1: "Instant delivery",
      ribbon2: "Secure",
      ribbon3: "Works across our network",
      planPrivate: "Private",
      planEnterprise: "Enterprise",
      cardIndividual: "Individual",
      cardCustom: "Custom",
      perkUseAnytime: "Use anytime",
      perkInstantCode: "Instant code",
      perkTeams: "Great for teams and clinics",
      perkVolume: "Volume-friendly checkout",
      offApplied: (n)=>`${n}% off applied`,
      noDiscount: "No bulk discount",
      estTotal: "Estimated total:",
      perCoupon: "per coupon",
      mustSignIn: "Please sign in to continue.",
      checkoutFailed: "Checkout failed",
      checkoutMissingUrl: "Checkout failed: missing redirect URL.",
      checkoutStartFailed: "Failed to start checkout. Please try again.",
    },
    de: {
      title: "OmniCheck Coupons",
      lead: "Kaufe Coupons für dich oder deine Liebsten.",
      price: "Preis",
      qty: "Menge",
      buy: "Kaufen",
      ribbon1: "Sofortige Zustellung",
      ribbon2: "Sicher",
      ribbon3: "Funktioniert in unserem Netzwerk",
      planPrivate: "Privat",
      planEnterprise: "Unternehmen",
      cardIndividual: "Einzeln",
      cardCustom: "Individuell",
      perkUseAnytime: "Jederzeit einlösbar",
      perkInstantCode: "Sofortiger Code",
      perkTeams: "Ideal für Teams und Praxen",
      perkVolume: "Volumenfreundlicher Checkout",
      offApplied: (n)=>`${n}% Rabatt angewendet`,
      noDiscount: "Kein Mengenrabatt",
      estTotal: "Geschätzte Summe:",
      perCoupon: "pro coupon",
      mustSignIn: "Bitte melde dich an um fortzufahren!",
      checkoutFailed: "Checkout fehlgeschlagen",
      checkoutMissingUrl: "Checkout fehlgeschlagen: Weiterleitungs-URL fehlt.",
      checkoutStartFailed: "Checkout konnte nicht gestartet werden. Bitte versuch es erneut.",
    },
    fr: {
      title: "Coupons OmniCheck",
      lead: "Achetez des coupons pour vous ou vos proches.",
      price: "Prix",
      qty: "Quantité",
      buy: "Acheter",
      ribbon1: "Livraison instantanée",
      ribbon2: "Sécurisé",
      ribbon3: "Valable dans notre réseau",
      planPrivate: "Particulier",
      planEnterprise: "Entreprise",
      cardIndividual: "Individuel",
      cardCustom: "Personnalisé",
      perkUseAnytime: "Utilisable à tout moment",
      perkInstantCode: "Code instantané",
      perkTeams: "Idéal pour équipes et cliniques",
      perkVolume: "Paiement adapté au volume",
      offApplied: (n)=>`${n}% de réduction appliquée`,
      noDiscount: "Pas de remise de volume",
      estTotal: "Total estimé :",
      perCoupon: "par coupon",
      mustSignIn: "Veuillez vous connecter pour continuer.",
      checkoutFailed: "Échec du paiement",
      checkoutMissingUrl: "Échec du paiement : URL de redirection manquante.",
      checkoutStartFailed: "Impossible de démarrer le paiement. Veuillez réessayer.",
    },
  };
  const t = copy[lang] ?? copy.en;

  const [qty, setQty] = useState(10);
  const [plan, setPlan] = useState<"private" | "enterprise">("enterprise");
  const baseUnitCents = 2900;
  const formatCHF = (cents: number) => `CHF ${(cents / 100).toFixed(2)}`;
  const oneUnitPriceText = useMemo(() => formatCHF(baseUnitCents), []);
  const discountRate = useMemo(() => {
    const effectiveQty = Math.max(10, Math.min(1000, qty || 10));
    return Math.min((effectiveQty / 1000) * 0.8, 0.8);
  }, [qty]);
  const customUnitCents = useMemo(() => {
    return Math.round(baseUnitCents * (1 - discountRate));
  }, [baseUnitCents, discountRate]);
  const customUnitPriceText = useMemo(() => formatCHF(customUnitCents), [customUnitCents]);
  const discountPercent = useMemo(() => Math.round(discountRate * 100), [discountRate]);
  const estTotalCents = useMemo(() => customUnitCents * Math.max(10, Math.min(1000, qty || 10)), [customUnitCents, qty]);
  const estTotalText = useMemo(() => formatCHF(estTotalCents), [estTotalCents]);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  async function handleBuy(n?: number) {
    const selectedPlan = plan === "private" ? "individual" : "enterprise";
    const desiredQty = n ?? qty;
    const count = selectedPlan === "individual" ? 1 : Math.max(10, Math.min(1000, desiredQty || 10));
    try {
      const token = (() => {
        try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
        try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {}
        return null;
      })();
      if (!token) {
        alert(t.mustSignIn);
        return;
      }
      const res = await fetch(`${apiBase}/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan: selectedPlan, quantity: count }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || data?.error || t.checkoutFailed;
        alert(typeof msg === 'string' ? msg : t.checkoutFailed);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(t.checkoutMissingUrl);
      }
    } catch (e) {
      console.error(e);
      alert(t.checkoutStartFailed);
    }
  }

  return (
    <>
    <div className="d-flex flex-column min-vh-100">
    <main className={`${styles.section} flex-grow-1`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.lead}</p>
          <div className={styles.ribbon}>
            <span>{t.ribbon1}</span>
            <span>•</span>
            <span>{t.ribbon2}</span>
            <span>•</span>
            <span>{t.ribbon3}</span>
          </div>
        </div>

        {/* Plan toggle */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div className="btn-group" role="group" aria-label="Plan switcher">
            <button
              type="button"
              className="btn btn-sm"
              style={{
                backgroundColor: plan === "private" ? "var(--brand-primary)" : "transparent",
                color: plan === "private" ? "#fff" : "var(--brand-primary)",
                borderColor: "var(--brand-primary)",
              }}
              onClick={()=>setPlan("private")}
            >
              {t.planPrivate}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                backgroundColor: plan === "enterprise" ? "var(--brand-primary)" : "transparent",
                color: plan === "enterprise" ? "#fff" : "var(--brand-primary)",
                borderColor: "var(--brand-primary)",
              }}
              onClick={()=>setPlan("enterprise")}
            >
              {t.planEnterprise}
            </button>
          </div>
        </div>

        {/* Products */}
        <div className={`row justify-content-center ${styles.grid}`}>
          <div className="col-md-6 mx-auto">
            <div className={styles.card}>
              {plan === "private" ? (
                <>
                  <div className={styles.badge}>{t.planPrivate}</div>
                  <h3 className={styles.cardTitle}>{t.cardIndividual}</h3>
                  <div className={styles.cardSub}>{t.price}: {oneUnitPriceText}</div>
                  <ul className={styles.perkList}>
                    <li><span className={styles.perkDot} />{t.perkUseAnytime}</li>
                    <li><span className={styles.perkDot} />{t.perkInstantCode}</li>
                  </ul>
                  <button style={{borderColor: "#0c6172"}} className={styles.buyBtn} onClick={()=>handleBuy(1)}>{t.buy}</button>
                </>
              ) : (
                <>
                  <div className={styles.badge}>{t.planEnterprise}</div>
                  <h3 className={styles.cardTitle}>{t.cardCustom}</h3>
                  <div className={styles.cardSub}>{t.price}: {customUnitPriceText} {t.perCoupon}</div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <label className="form-label m-0">{t.qty}</label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      className="form-control"
                      style={{ maxWidth: 140 }}
                      value={qty}
                      onChange={(e)=>{
                        const v = Number(e.target.value)||10;
                        setQty(Math.max(10, Math.min(1000, v)));
                      }}
                    />
                  </div>
                  <div className="mb-2 small">
                    {discountPercent > 0 ? (
                      <span className="text-success fw-semibold">{t.offApplied(discountPercent)}</span>
                    ) : (
                      <span className="text-muted">{t.noDiscount}</span>
                    )}
                  </div>
                  <div className="mb-2 small text-muted">{t.estTotal} <strong>{estTotalText}</strong></div>
                  <ul className={styles.perkList}>
                    <li><span className={styles.perkDot} />{t.perkTeams}</li>
                    <li><span className={styles.perkDot} />{t.perkVolume}</li>
                  </ul>
                  <button style={{borderColor: "#0c6172"}} className={styles.buyBtn} onClick={()=>handleBuy()}>{t.buy}</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* How it works section (bottom) */}
        <div className={styles.howSection}>
          {lang === "de" && (
            <div className={`card ${styles.howCard}`}>
              <div className="card-body">
                <h2 className={`h5 mb-3 ${styles.howTitle}`}>So funktioniert es: Personalisierte Omnicheck-Coupons für deine Kund:innen</h2>
                <p className={styles.howIntro}>
                  Als Omnicheck-Partner kannst du ganz unkompliziert personalisierte Coupons erwerben, die deinen Kund:innen den
                  Zugang zur Omnicheck-Gesundheitsanalyse ermöglichen. Der Ablauf ist einfach:
                </p>
                <ol className={styles.howStepsGrid}>
                  <li className={styles.howStep}>
                    <strong>Personalisierte Coupons kaufen</strong>
                    <br />
                    Du bestellst die gewünschte Anzahl an Coupons direkt über deinen Partnerbereich. Jeder Coupon ist eindeutig
                    zugeordnet und enthält einen individuellen Code, den du deinen Kund:innen weitergeben kannst – digital oder
                    gedruckt.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Coupons an Kund:innen weitergeben</strong>
                    <br />
                    Deine Kund:innen lösen den Coupon auf der Omnicheck-Plattform ein und erhalten sofort Zugang zum umfassenden
                    Gesundheitsfragebogen sowie zur Omnicheck-App.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Verbindung zwischen Kund:in und Partner</strong>
                    <br />
                    Bei der Registrierung können sich Kund:innen direkt mit dir als Omnicheck-Partner verbinden. Dadurch erhältst du
                    automatisch Einsicht in die Auswertung und bist als betreuende Fachperson hinterlegt.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Professionelles Auswertungsgespräch</strong>
                    <br />
                    Nachdem die 20–30-seitige Analyse erstellt wurde, besprichst du die Ergebnisse im persönlichen
                    Beratungsgespräch. So kannst du aufklären, priorisieren und gemeinsam konkrete nächste Schritte definieren.
                  </li>
                </ol>
                <p className={`mb-0 ${styles.howOutro}`}>
                  Mit den personalisierten Coupons machst du den Omnicheck zu einem reibungslosen, professionellen Zusatzangebot in
                  deiner Praxis – einfach, transparent und perfekt in deinen Beratungsprozess integrierbar.
                </p>
              </div>
            </div>
          )}
          {lang === "en" && (
            <div className={`card ${styles.howCard}`}>
              <div className="card-body">
                <h2 className={`h5 mb-3 ${styles.howTitle}`}>How it works: Personalised OmniCheck coupons for your clients</h2>
                <p className={styles.howIntro}>
                  As an OmniCheck partner you can easily purchase personalised coupons that give your clients access to the
                  OmniCheck health analysis. The process is simple:
                </p>
                <ol className={styles.howStepsGrid}>
                  <li className={styles.howStep}>
                    <strong>Purchase personalised coupons</strong>
                    <br />
                    You order the desired number of coupons directly in your partner area. Each coupon is uniquely assigned and
                    contains an individual code that you can pass on to your clients – digitally or printed.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Share coupons with clients</strong>
                    <br />
                    Your clients redeem the coupon on the OmniCheck platform and immediately gain access to the comprehensive health
                    questionnaire and the OmniCheck app.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Link between client and partner</strong>
                    <br />
                    During registration, clients can connect directly with you as their OmniCheck partner. This gives you automatic
                    insight into the results and lists you as the responsible professional.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Professional results consultation</strong>
                    <br />
                    Once the 20–30 page analysis has been created, you review the results together in a personal consultation. This
                    allows you to explain the findings, set priorities and define concrete next steps together.
                  </li>
                </ol>
                <p className={`mb-0 ${styles.howOutro}`}>
                  With personalised coupons you turn OmniCheck into a smooth, professional add-on service in your practice – simple,
                  transparent and perfectly integrated into your counselling process.
                </p>
              </div>
            </div>
          )}
          {lang === "fr" && (
            <div className={`card ${styles.howCard}`}>
              <div className="card-body">
                <h2 className={`h5 mb-3 ${styles.howTitle}`}>Comment ça fonctionne a0: coupons OmniCheck personnalisés pour vos client·e·s</h2>
                <p className={styles.howIntro}>
                  En tant que partenaire OmniCheck, vous pouvez acheter très simplement des coupons personnalisés qui donnent à vos
                  client·e·s accès à l'analyse de santé OmniCheck. Le déroulement est simple a0:
                </p>
                <ol className={styles.howStepsGrid}>
                  <li className={styles.howStep}>
                    <strong>Acheter des coupons personnalisés</strong>
                    <br />
                    Vous commandez le nombre souhaité de coupons directement depuis votre espace partenaire. Chaque coupon est attribué
                    de manière unique et contient un code individuel que vous pouvez transmettre à vos client·e·s – sous forme
                    numérique ou imprimée.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Transmettre les coupons aux client·e·s</strong>
                    <br />
                    Vos client·e·s utilisent leur coupon sur la plateforme OmniCheck et obtiennent immédiatement accès au
                    questionnaire de santé complet ainsi qu'à l'application OmniCheck.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Lien entre client·e et partenaire</strong>
                    <br />
                    Lors de l'inscription, les client·e·s peuvent se connecter directement à vous en tant que partenaire OmniCheck.
                    Vous obtenez ainsi automatiquement un aperçu des résultats et êtes enregistré·e comme professionnel·le de
                    référence.
                  </li>
                  <li className={styles.howStep}>
                    <strong>Entretien professionnel de restitution</strong>
                    <br />
                    Une fois l'analyse de 20 à 30 pages créée, vous discutez des résultats lors d'un entretien personnalisé. Vous
                    pouvez ainsi expliquer, hiérarchiser et définir ensemble les prochaines étapes concrètes.
                  </li>
                </ol>
                <p className={`mb-0 ${styles.howOutro}`}>
                  Grâce aux coupons personnalisés, OmniCheck devient une offre complémentaire fluide et professionnelle dans votre
                  cabinet – simple, transparente et parfaitement intégrée à votre processus de conseil.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* <div className="text-center mt-2">
          <Link href="/portal/coupons" className="btn btn-outline-secondary btn-sm">My coupons</Link>
        </div> */}
      </div>
    </main>
    <Footer />
    </div>
    </>
  );
}
