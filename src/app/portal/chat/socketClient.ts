"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getToken(): string | null {
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
}

export function getSocket(): Socket | null {
  if (socket && socket.connected) return socket;

  const token = getToken();
  if (!token) return null;

  try {
    socket = io("wss://gdp.codefest.io", {
      path: "/app7/socket.io",
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Basic logging to help debug connection issues in dev
    socket.on("connect", () => {
      console.log("[ChatSocket] Connected", socket?.id);
    });
    socket.on("disconnect", (reason) => {
      console.log("[ChatSocket] Disconnected", reason);
    });
    socket.on("connect_error", (err) => {
      console.error("[ChatSocket] Connection error", err.message);
    });
  } catch {
    socket = null;
  }

  return socket;
}

export function disconnectSocket() {
  try {
    if (socket) {
      socket.disconnect();
    }
  } catch {}
  socket = null;
}
