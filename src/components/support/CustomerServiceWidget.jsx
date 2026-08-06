import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Headphones } from "lucide-react";
import * as chatService from "../../services/chatService";

const SESSION_KEY = "safetradex_support_chat";

export default function CustomerServiceWidget() {
  const [open, setOpen] = useState(false);
  const [uidInput, setUidInput] = useState("");
  const [chat, setChat] = useState(null); // { chatId, accessToken, uid }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const pollRef = useRef(null);

  // Restore an existing chat session from this browser tab, if any
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setChat(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!chat) return;
    try {
      const msgs = await chatService.getMessages(chat.chatId, chat.accessToken);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [chat]);

  useEffect(() => {
    if (!chat) return;
    loadMessages();
    pollRef.current = setInterval(loadMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [chat, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleUnload = () => {
      if (chat) chatService.setOffline(chat.chatId, chat.accessToken);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [chat]);

  async function handleStartChat(e) {
    e.preventDefault();
    if (!uidInput.trim()) {
      setError("Enter your account UID.");
      return;
    }
    setStarting(true);
    setError("");
    try {
      const { chatId, accessToken } = await chatService.startChat(uidInput.trim());
      const session = { chatId, accessToken, uid: uidInput.trim() };
      setChat(session);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
      setError(err.message || "Could not start chat. Check the UID and try again.");
    } finally {
      setStarting(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !chat) return;
    const text = input.trim();
    setInput("");
    try {
      await chatService.sendMessage(chat.chatId, chat.accessToken, text);
      loadMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  return (
    <>
      {/* ----- FLOATING TOGGLE BUTTON – HIGHLY VISIBLE ----- */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Customer Service"
        style={{
          position: "fixed",
          bottom: "100px", // sits above bottom navigation (adjust as needed)
          right: "20px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
          border: "none",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.6), 0 0 0 4px rgba(37, 99, 235, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: "pulse-glow 2.5s infinite ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 8px 40px rgba(37, 99, 235, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(37, 99, 235, 0.6)";
        }}
      >
        {open ? (
          <X size={30} strokeWidth={2.5} color="#fff" />
        ) : (
          <Headphones size={30} strokeWidth={2.5} color="#fff" />
        )}
        {/* Small notification badge */}
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            background: "#ef4444",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #0c1226",
          }}
        >
          1
        </span>
      </button>

      {/* ----- CHAT WINDOW ----- */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "180px",
            right: "20px",
            width: "360px",
            maxWidth: "calc(100vw - 40px)",
            height: "480px",
            maxHeight: "calc(100vh - 220px)",
            background: "#0c1226",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
            zIndex: 9998,
            backdropFilter: "blur(8px)",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          {/* Header – brighter gradient */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Headphones size={20} color="#fff" />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "0.3px" }}>
                Support Chat
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {!chat ? (
            <form onSubmit={handleStartChat} style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ color: "#f0f4fa", fontWeight: 600, fontSize: 16, textAlign: "center", marginTop: 16 }}>
                👋 Welcome to SafeTrade Support
              </p>
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Your UID</label>
                <input
                  value={uidInput}
                  onChange={(e) => setUidInput(e.target.value)}
                  placeholder="Enter your account UID"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: 14,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
              {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
              <button
                type="submit"
                disabled={starting}
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: starting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                }}
              >
                {starting ? "Starting..." : "Start Chat"}
              </button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {messages.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
                    Send a message to get started.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender_type === "user" ? "flex-end" : "flex-start",
                      background: m.sender_type === "user" ? "#2563eb" : "rgba(255,255,255,0.07)",
                      color: "#fff",
                      borderRadius: m.sender_type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "10px 14px",
                      fontSize: 13.5,
                      maxWidth: "85%",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {m.message}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    border: "none",
                    borderRadius: 12,
                    width: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#3b82f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                >
                  <Send size={20} color="#fff" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Global animations injected via style tag */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5), 0 0 0 0 rgba(37, 99, 235, 0.2); }
          50% { box-shadow: 0 8px 48px rgba(37, 99, 235, 0.8), 0 0 0 8px rgba(37, 99, 235, 0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Scrollbar styling */
        div[style*="overflow-y: auto"]::-webkit-scrollbar {
          width: 4px;
        }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
