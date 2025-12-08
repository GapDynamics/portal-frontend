"use client";
import Link from "next/link";
import { useMemo, useRef, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getSocket } from "../socketClient";

type Message = {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
};

export default function ChatThreadPage() {
  const pathname = usePathname();
  const peerId = pathname.split("/").pop() || "";
  const { lang } = useLanguage();
  const copy: Record<string, { back: string; send: string; attach: string; schedule: string; placeholder: (name: string) => string }>= {
    en: { back: "Back", send: "Send", attach: "Attach", schedule: "Schedule", placeholder: (n) => `Message ${n}…` },
    de: { back: "Zurück", send: "Senden", attach: "Anhängen", schedule: "Planen", placeholder: (n) => `Nachricht an ${n}…` },
    fr: { back: "Retour", send: "Envoyer", attach: "Joindre", schedule: "Planifier", placeholder: (n) => `Message à ${n}…` },
  };
  const t = copy[lang] ?? copy.en;
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");
  const searchParams = useSearchParams();
  const peerUserId = searchParams?.get("peer") || "";

  // Load initial history from REST API
  useEffect(() => {
    let cancelled = false;
    async function loadMessages() {
      setLoading(true);
      setError(null);
      try {
        const getToken = (): string | null => {
          try {
            if (typeof window !== "undefined") {
              const ls = window.localStorage.getItem("auth_token");
              if (ls) return ls;
            }
          } catch {}
          try {
            if (typeof document !== "undefined") {
              const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
              if (m) return decodeURIComponent(m[1]);
            }
          } catch {}
          return null;
        };

        const token = getToken();
        if (!token) {
          if (!cancelled) setError("Not authenticated");
          return;
        }

        if (!peerId) {
          if (!cancelled) setError("Conversation not found");
          return;
        }

        const res = await fetch(`${apiBase}/chat/conversations/${encodeURIComponent(peerId)}/messages`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (!cancelled) setError("Failed to load messages");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        const mapped: Message[] = Array.isArray(data) ? data.map((m: any) => ({
          id: String(m.id ?? ""),
          fromId: m.sender?.id != null ? String(m.sender.id) : "",
          toId: "",
          body: m.content ?? "",
          createdAt: m.createdAt ?? "",
        })) : [];
        setMessages(mapped);
      } catch {
        if (!cancelled) setError("Failed to load messages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMessages();
    return () => { cancelled = true; };
  }, [apiBase, peerId]);

  const items = useMemo(() => messages, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [items.length]);

  // Connect Socket.io for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onReceive = (msg: any) => {
      try {
        // Try to match on conversation id when available
        const convId = String((msg as any).conversationId ?? (msg as any).conversation?.id ?? "");
        if (convId && convId !== peerId) return;
      } catch {}
      setMessages((prev) => [
        ...prev,
        {
          id: String(msg.id ?? `ws-${Date.now()}`),
          fromId: msg.sender?.id != null ? String(msg.sender.id) : "",
          toId: "",
          body: msg.content ?? "",
          createdAt: msg.createdAt ?? new Date().toISOString(),
        },
      ]);
    };

    socket.on("receiveMessage", onReceive);
    return () => {
      try { socket.off("receiveMessage", onReceive); } catch {}
    };
  }, [peerId]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    // Optimistically append the message locally so it appears in the UI immediately.
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      fromId: "me",
      toId: peerUserId || peerId,
      body: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");

    // Also emit to backend via WebSocket when available
    try {
      const socket = getSocket();
      if (socket) {
        socket.emit("sendMessage", {
          recipientId: peerUserId || peerId,
          content: text,
        });
      }
    } catch {}
  }

  return (
    <div className="container" style={{ paddingTop: 140, paddingBottom: 24 }}>
      <div className="row g-3">
        <div className="col-12 col-lg-4 d-none d-lg-block">
          <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>A</div>
                <div>
                  <div className="fw-semibold">Dr. Anna Keller</div>
                  <div className="text-muted small">Cardiology • Zurich</div>
                </div>
              </div>
              <Link href="/portal/chat" className="btn btn-outline-secondary btn-sm">{t.back}</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body border-bottom d-flex align-items-center justify-content-between" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>A</div>
                <div>
                  <div className="fw-semibold">Dr. Anna Keller</div>
                  <div className="text-muted small">Cardiology • Zurich</div>
                </div>
              </div>
              <Link href="/portal/chat" className="btn btn-outline-secondary btn-sm d-lg-none">{t.back}</Link>
            </div>
            <div className="card-body" style={{ height: 520, overflowY: "auto", background: "#f8fafc" }}>
              {loading && (
                <div className="text-center text-muted">Loading messages5</div>
              )}
              {error && !loading && (
                <div className="alert alert-danger" role="alert">{error}</div>
              )}
              {!loading && !error && items.map((m) => (
                <div key={m.id} className="d-flex mb-2 justify-content-start">
                  <div className="p-2 rounded-3 text-white" style={{ maxWidth: 520, backgroundColor: 'var(--brand-primary)' }}>
                    <div>{m.body}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="card-body border-top">
              <div className="d-flex gap-2">
                <input className="form-control" placeholder={t.placeholder(peerId)} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }} onClick={send}>{t.send}</button>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-outline-secondary btn-sm">{t.attach}</button>
                <button className="btn btn-outline-secondary btn-sm">{t.schedule}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
