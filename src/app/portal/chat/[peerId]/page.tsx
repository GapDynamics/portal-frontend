"use client";
import Link from "next/link";
import { useMemo, useRef, useEffect, useState, type ChangeEvent } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getSocket } from "@/app/portal/chat/socketClient";

 function getPayloadFromToken(token: string): { sub: string } | null {
   try {
     const payload = token.split(".")[1];
     if (!payload) return null;
     return JSON.parse(atob(payload));
   } catch (e) {
     console.error("Failed to decode token", e);
     return null;
   }
 }

 type Participant = {
   id: string | number;
   firstName?: string;
   lastName?: string;
   profile?: { profilePictureUrl?: string };
 };

type Message = {
  id: string | number;
  fromId?: string | number;
  toId?: string | number;
  sender?: Participant;
  body: string;
  createdAt: string;
  readAt?: string | Date;
  conversationId?: string | number;
};

export default function ChatThreadPage() {
  const router = useRouter();
  const pathname = usePathname();
  const peerId = pathname.split("/").pop() || "";
  const { lang } = useLanguage();
  const copy: Record<string, { back: string; send: string; attach: string; schedule: string; placeholder: (name: string) => string; noMessages: string }>= {
    en: { back: "Back", send: "Send", attach: "Attach", schedule: "Schedule", placeholder: (n) => `Message ${n}…`, noMessages: "No messages yet. Start the conversation!" },
    de: { back: "Zurück", send: "Senden", attach: "Anhängen", schedule: "Planen", placeholder: (n) => `Nachricht an ${n}…`, noMessages: "Noch keine Nachrichten. Starte die Unterhaltung!" },
    fr: { back: "Retour", send: "Envoyer", attach: "Joindre", schedule: "Planifier", placeholder: (n) => `Message à ${n}…`, noMessages: "Aucun message pour le moment. Commencez la conversation !" },
  };
  const t = copy[lang] ?? copy.en;
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");
  const searchParams = useSearchParams();
  const peerUserId = searchParams?.get("peer") || "";

  const conversationId = peerId;
  const recipientId = peerUserId;

  const normalizeMessage = (raw: any): Message => {
    const body = raw?.body ?? raw?.content ?? "";
    const sender = raw?.sender ?? raw?.user ?? raw?.from ?? null;
    const fromId = raw?.fromId ?? raw?.senderId ?? raw?.sender_id ?? sender?.id ?? raw?.userId ?? raw?.user_id;
    const convId = raw?.conversationId ?? raw?.conversation_id ?? raw?.convId ?? raw?.conv_id;
    return {
      id: raw?.id ?? `local-${Date.now()}`,
      fromId,
      sender,
      body,
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.timestamp ?? new Date().toISOString(),
      readAt: raw?.readAt ?? raw?.read_at,
      conversationId: convId,
    };
  };

  const myUserId = useMemo(() => {
    try {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("auth_token");
        if (token) return getPayloadFromToken(token)?.sub;
      }
    } catch {}
    return null;
  }, []);

  // Load professional profile
  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!peerId) return;
      try {
        setProfileLoading(true);
        const res = await fetch(`${apiBase}/profiles/${encodeURIComponent(peerId)}`, {
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [apiBase, peerId]);

  // Load initial history from REST API
  useEffect(() => {
    let cancelled = false;
    async function loadMessages() {
      if (!conversationId || conversationId === "new") {
        setLoading(false);
        setError(null);
        setMessages([]);
        return;
      }

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

        if (!conversationId) {
          if (!cancelled) setError("Conversation not found");
          return;
        }

        const res = await fetch(`${apiBase}/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          // If conversation doesn't exist yet, that's okay - just show empty messages
          if (res.status === 404) {
            if (!cancelled) {
              setMessages([]);
              setError(null);
            }
            return;
          }
          if (!cancelled) setError("Failed to load messages");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : (data?.messages ?? []);
        setMessages(list.map(normalizeMessage));

        const otherUser = (data?.conversation?.participants || []).find(
          (p: Participant) => String(p?.id) !== String(myUserId)
        );
        if (otherUser) setProfile({ user: otherUser, displayName: `${otherUser.firstName ?? ""} ${otherUser.lastName ?? ""}`.trim() });

        const socket = getSocket();
        if (socket) socket.emit("messagesRead", { conversationId: parseInt(String(conversationId), 10) });
      } catch {
        if (!cancelled) setError(null); // Don't show error for new conversations
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMessages();
    return () => { cancelled = true; };
  }, [apiBase, conversationId, myUserId]);

  const items = useMemo(() => messages, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [items.length]);

  // Connect Socket.io for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onReceiveMessage = (msg: any) => {
      const newConversationId = String(msg?.conversationId ?? msg?.conversation?.id ?? "");
      if (conversationId === "new" && newConversationId) {
        router.replace(`/portal/chat/${newConversationId}`);
      }
      if (newConversationId && (newConversationId === conversationId || conversationId === "new")) {
        const incoming = normalizeMessage(msg);
        setMessages((prev) => {
          // 1) If message already exists by id, don't append.
          if (incoming?.id != null && prev.some((m) => String(m.id) === String(incoming.id))) return prev;

          const incomingFromMe = String(incoming.sender?.id ?? incoming.fromId) === String(myUserId);
          if (!incomingFromMe) return [...prev, incoming];

          // 2) Reconcile optimistic local message with echoed server message
          // If the last message is a local optimistic one with same body, replace it.
          const lastIndex = prev.length - 1;
          if (lastIndex < 0) return [incoming];

          const last = prev[lastIndex];
          const isLastLocal = typeof last.id === "string" && last.id.startsWith("local-");
          const sameBody = String(last.body ?? "") === String(incoming.body ?? "");

          let withinWindow = false;
          try {
            const a = new Date(String(last.createdAt)).getTime();
            const b = new Date(String(incoming.createdAt)).getTime();
            if (Number.isFinite(a) && Number.isFinite(b)) withinWindow = Math.abs(b - a) < 15000;
          } catch {
            withinWindow = false;
          }

          if (isLastLocal && sameBody && withinWindow) {
            const next = prev.slice();
            next[lastIndex] = { ...last, ...incoming };
            return next;
          }

          // fallback: append
          return [...prev, incoming];
        });
        socket.emit("messagesRead", { conversationId: parseInt(newConversationId, 10) });
      }
    };

    const onTyping = (payload: { convId?: string | number; userId?: string | number }) => {
      const convId = payload?.convId;
      const userId = payload?.userId;
      if (!convId || !userId || !conversationId) return;
      if (String(convId) === String(conversationId) && String(userId) !== String(myUserId)) setIsTyping(true);
    };

    const onStopTyping = (payload: { convId?: string | number; userId?: string | number }) => {
      const convId = payload?.convId;
      const userId = payload?.userId;
      if (!convId || !userId || !conversationId) return;
      if (String(convId) === String(conversationId) && String(userId) !== String(myUserId)) setIsTyping(false);
    };

    const onMessagesSeen = (payload: { convId?: string | number; readerId?: string | number }) => {
      const convId = payload?.convId;
      const readerId = payload?.readerId;
      if (!convId || !readerId || !conversationId) return;
      if (String(convId) !== String(conversationId) || String(readerId) === String(myUserId)) return;
      setMessages((prev) => prev.map((m) => (m.readAt ? m : { ...m, readAt: new Date() })));
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);
    socket.on("messagesSeen", onMessagesSeen);
    return () => {
      try {
        socket.off("receiveMessage", onReceiveMessage);
        socket.off("typing", onTyping);
        socket.off("stopTyping", onStopTyping);
        socket.off("messagesSeen", onMessagesSeen);
      } catch {}
    };
  }, [conversationId, myUserId, router]);

  // Typing indicator logic
  const typingTimeoutRef = useRef<any>(null);
  const handleDraftChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    const socket = getSocket();
    if (!socket || !conversationId || conversationId === "new") return;
    socket.emit("isTyping", { conversationId: parseInt(String(conversationId), 10) });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId: parseInt(String(conversationId), 10) });
    }, 2000);
  };

  function send() {
    const text = draft.trim();
    if (!text || !myUserId) return;
    
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

    // Send message via WebSocket - the backend will persist it
    try {
      const socket = getSocket();
      if (socket) {
        const payload: { content: string; conversationId?: number; recipientId?: number } = { content: text };
        if (conversationId && conversationId !== "new") {
          payload.conversationId = parseInt(String(conversationId), 10);
        } else if (recipientId) {
          payload.recipientId = parseInt(String(recipientId), 10);
        }
        if (payload.conversationId || payload.recipientId) {
          socket.emit("sendMessage", payload);
        } else {
          console.warn("Missing conversationId/recipientId. Message not sent.");
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  const displayName = profile?.displayName || (profile?.user ? `${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim() : '') || 'Professional';
  const specialty = profile?.specialties || '';
  const location = [profile?.city, profile?.country].filter(Boolean).join(', ');
  const subtitle = [specialty, location].filter(Boolean).join(' • ');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="container" style={{ paddingTop: 140, paddingBottom: 24 }}>
      <div className="row g-3">
        <div className="col-12 col-lg-4 d-none d-lg-block">
          <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>{initial}</div>
                <div>
                  <div className="fw-semibold">{displayName}</div>
                  {subtitle && <div className="text-muted small">{subtitle}</div>}
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
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>{initial}</div>
                <div>
                  <div className="fw-semibold">{displayName}</div>
                  {subtitle && <div className="text-muted small">{subtitle}</div>}
                </div>
              </div>
              <Link href="/portal/chat" className="btn btn-outline-secondary btn-sm d-lg-none">{t.back}</Link>
            </div>
            <div className="card-body" style={{ height: 520, overflowY: "auto", background: "#f8fafc" }}>
              {loading && (
                <div className="text-center text-muted">Loading messages...</div>
              )}
              {error && !loading && (
                <div className="alert alert-danger" role="alert">{error}</div>
              )}
              {!loading && !error && items.length === 0 && (
                <div className="text-center text-muted">{t.noMessages}</div>
              )}
              {!loading && !error && items.map((m, index) => {
                const isMe = m.fromId === "me" || String(m.sender?.id ?? m.fromId) === String(myUserId);
                const isLastMessage = index === items.length - 1;
                const isRead = isLastMessage && isMe && m.readAt;
                const text = m.body ?? (m as any)?.content ?? "";

                return (
                  <div key={String(m.id)}>
                    <div className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                      <div
                        className="p-2 rounded-3"
                        style={{
                          maxWidth: 520,
                          backgroundColor: isMe ? "#E2E8F0" : "var(--brand-primary)",
                          color: isMe ? "#1E293B" : "#FFFFFF",
                          wordBreak: "break-word",
                        }}
                      >
                        <div>{text}</div>
                      </div>
                    </div>
                    {isRead && (
                      <div className="text-end text-muted small" style={{ marginTop: -5, marginRight: 5 }}>
                        Seen
                      </div>
                    )}
                  </div>
                );
              })}
              {isTyping && <div className="text-muted small p-2"><i>Typing...</i></div>}
              <div ref={endRef} />
            </div>
            <div className="card-body border-top">
              <div className="d-flex gap-2">
                <input className="form-control" placeholder={t.placeholder(displayName)} value={draft} onChange={handleDraftChange} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
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
