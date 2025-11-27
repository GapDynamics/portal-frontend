"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "../../components/Footer";
import { useLanguage } from "../../providers/LanguageProvider";

function LabelValue({ label, value }: { label: string; value?: any }) {
  if (!value && value !== 0) return null;
  return (
    <div className="mb-2">
      <div className="text-uppercase text-muted small">{label}</div>
      <div className="fw-semibold">{String(value)}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    loadingProfile: string;
    profileNotFound: string;
    backDirectory: string;
    headerBadge: string;
    headerFallbackName: string;
    openInMaps: string;
    message: string;
    about: string;
    noBio: string;
    details: string;
    specialties: string;
    languages: string;
    company: string;
    country: string;
    city: string;
    coordinates: string;
    contact: string;
    emailLabel: string;
    phoneLabel: string;
    emailBtn: string;
    messageBtn: string;
    backBtn: string;
  }> = {
    en: {
      loadingProfile: "Loading profile…",
      profileNotFound: "Profile not found.",
      backDirectory: "Back to directory",
      headerBadge: "Professional profile",
      headerFallbackName: "Professional",
      openInMaps: "Open in Maps",
      message: "Message",
      about: "About",
      noBio: "No bio provided.",
      details: "Details",
      specialties: "Specialties",
      languages: "Languages",
      company: "Company",
      country: "Country",
      city: "City",
      coordinates: "Coordinates",
      contact: "Contact",
      emailLabel: "Email",
      phoneLabel: "Phone",
      emailBtn: "Email",
      messageBtn: "Message",
      backBtn: "Back to directory",
    },
    de: {
      loadingProfile: "Profil wird geladen…",
      profileNotFound: "Profil nicht gefunden.",
      backDirectory: "Zurück zum Verzeichnis",
      headerBadge: "Profil der Fachperson",
      headerFallbackName: "Fachperson",
      openInMaps: "In Maps öffnen",
      message: "Nachricht",
      about: "Über",
      noBio: "Keine Beschreibung vorhanden.",
      details: "Details",
      specialties: "Fachgebiete",
      languages: "Sprachen",
      company: "Praxis / Unternehmen",
      country: "Land",
      city: "Stadt",
      coordinates: "Koordinaten",
      contact: "Kontakt",
      emailLabel: "E‑Mail",
      phoneLabel: "Telefon",
      emailBtn: "E‑Mail",
      messageBtn: "Nachricht",
      backBtn: "Zurück zum Verzeichnis",
    },
    fr: {
      loadingProfile: "Chargement du profil…",
      profileNotFound: "Profil introuvable.",
      backDirectory: "Retour à l’annuaire",
      headerBadge: "Profil professionnel",
      headerFallbackName: "Professionnel",
      openInMaps: "Ouvrir dans Maps",
      message: "Message",
      about: "À propos",
      noBio: "Aucune biographie fournie.",
      details: "Détails",
      specialties: "Spécialités",
      languages: "Langues",
      company: "Cabinet / Entreprise",
      country: "Pays",
      city: "Ville",
      coordinates: "Coordonnées",
      contact: "Contact",
      emailLabel: "E‑mail",
      phoneLabel: "Téléphone",
      emailBtn: "E‑mail",
      messageBtn: "Message",
      backBtn: "Retour à l’annuaire",
    },
  };
  const t = copy[lang] ?? copy.en;
  const routeParams = useParams();
  const id = useMemo(() => {
    const raw = (routeParams as any)?.id;
    if (Array.isArray(raw)) return raw[0];
    return raw as string | undefined;
  }, [routeParams]);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setError(null);
        if (!id) throw new Error('invalid_id');
        const res = await fetch(`${apiBase}/profiles/${encodeURIComponent(id)}`, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('not_found');
        const data = await res.json();
        if (!ignore) setProfile(data);
      } catch (e: any) {
        if (!ignore) setError(t.profileNotFound);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <main className="py-5">
        <div className="container">
          <div className="alert alert-secondary" role="alert" style={{ borderRadius: 12 }}>{t.loadingProfile}</div>
        </div>
      </main>
    );
  }
  if (error || !profile) {
    return (
      <main className="py-5">
        <div className="container">
          <div className="alert alert-danger" role="alert" style={{ borderRadius: 12 }}>
            {error || t.profileNotFound}
          </div>
          <Link href="/directory" className="btn btn-outline-primary">{t.backDirectory}</Link>
        </div>
      </main>
    );
  }

  const fullName = profile.displayName || `${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`.trim();
  const locationParts = [profile.city, profile.state, profile.country, profile.postalCode].filter(Boolean);
  const locationStr = locationParts.join(", ");
  const gmaps = typeof profile.latitude === 'number' && typeof profile.longitude === 'number'
    ? `https://www.google.com/maps?q=${encodeURIComponent(profile.latitude)},${encodeURIComponent(profile.longitude)}`
    : null;
  const phone = profile?.user?.telephone || profile?.telephone || profile?.phone;
  const photo = profile?.profilePictureUrl;

  return (
    <main style={{paddingTop: 140}}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 12 }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
            ) : (
              <div aria-hidden className="d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>
                {(fullName || 'P').slice(0,1)}
              </div>
            )}
            <div>
              <div className="text-uppercase text-muted small">{t.headerBadge}</div>
              <h1 className="h2 fw-bold mb-1">{fullName || t.headerFallbackName}</h1>
              <div className="d-flex flex-wrap gap-2">
                {profile.specialties ? (<span className="badge text-bg-light">{profile.specialties}</span>) : null}
                {profile.languages ? (<span className="badge text-bg-light">{profile.languages}</span>) : null}
                {locationStr ? (<span className="badge text-bg-light">{locationStr}</span>) : null}
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            {gmaps ? (
              <a className="btn btn-outline-secondary" href={gmaps} target="_blank" rel="noopener noreferrer">{t.openInMaps}</a>
            ) : null}
            <Link style={{backgroundColor:"var(--brand-primary)", color:"white", border:"1px solid var(--brand-primary)"}} className="btn" href={`/portal/chat/${profile.id}`}>{t.message}</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 4, marginBottom: 48 }}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h5 className="card-title mb-3">{t.about}</h5>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{profile.bio || t.noBio}</p>
              </div>
            </div>

            <div className="card mt-3" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h5 className="card-title mb-3">{t.details}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <LabelValue label={t.specialties} value={profile.specialties} />
                    <LabelValue label={t.languages} value={profile.languages} />
                    <LabelValue label={t.company} value={profile.company} />
                  </div>
                  <div className="col-md-6">
                    <LabelValue label={t.country} value={profile.country} />
                    <LabelValue label={t.city} value={profile.city} />
                    {typeof profile.latitude === 'number' && typeof profile.longitude === 'number' ? (
                      <LabelValue label={t.coordinates} value={`${profile.latitude}, ${profile.longitude}`} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h5 className="card-title mb-3">{t.contact}</h5>
                {profile?.user?.email ? (
                  <div className="mb-2">
                    <div className="text-uppercase text-muted small">{t.emailLabel}</div>
                    <a href={`mailto:${profile.user.email}`} className="fw-semibold">{profile.user.email}</a>
                  </div>
                ) : null}
                {phone ? (
                  <div className="mb-2">
                    <div className="text-uppercase text-muted small">{t.phoneLabel}</div>
                    <a href={`tel:${phone}`} className="fw-semibold">{phone}</a>
                  </div>
                ) : null}
                <div className="d-grid gap-2 mt-3">
                  {profile?.user?.email ? (
                    <a href={`mailto:${profile.user.email}`} className="btn btn-outline-secondary">{t.emailBtn}</a>
                  ) : null}
                  <Link href={`/portal/chat/${profile.id}`} className="btn" style={{backgroundColor:"var(--brand-primary)", color:"white", border:"1px solid var(--brand-primary)"}}>{t.messageBtn}</Link>
                  <Link href="/directory" className="btn btn-outlineSecondary">{t.backBtn}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
