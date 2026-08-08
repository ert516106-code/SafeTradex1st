import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
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
      if (chat) chatService.markLeft(chat.chatId, chat.accessToken);
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

  function handleClose() {
    if (chat) chatService.markLeft(chat.chatId, chat.accessToken);
    setOpen(false);
  }

  async function handleOpen() {
    // Reopening an existing chat cancels the 5-minute deletion countdown
    if (chat && !open) {
      try {
        const { chatId, accessToken } = await chatService.resumeChat(chat.uid);
        const session = { chatId, accessToken, uid: chat.uid };
        setChat(session);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (err) {
        console.error("Failed to resume chat:", err);
      }
    }
    setOpen((o) => !o);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Customer Service"
        style={{
          position: "fixed",
          bottom: 96,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          border: "none",
          boxShadow: "0 10px 24px rgba(37,99,235,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 900,
        }}
      >
        <MessageCircle size={24} color="#fff" />
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 156,
            right: 20,
            width: 320,
            maxWidth: "calc(100vw - 40px)",
            height: 420,
            background: "#0c1226",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            zIndex: 900,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Online Chat</span>
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} color="#fff" />
            </button>
          </div>

          {!chat ? (
            <form onSubmit={handleStartChat} style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", marginTop: 20 }}>
                Welcome to Online Support!
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
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {error && <p style={{ color: "#f87171", fontSize: 12.5 }}>{error}</p>}
              <button
                type="submit"
                disabled={starting}
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: starting ? "not-allowed" : "pointer",
                }}
              >
                {starting ? "Starting..." : "Start Chat"}
              </button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {messages.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, textAlign: "center", marginTop: 20 }}>
                    Send a message to get started.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender_type === "user" ? "flex-end" : "flex-start",
                      background: m.sender_type === "user" ? "#2563eb" : "rgba(255,255,255,0.08)",
                      color: "#fff",
                      borderRadius: 14,
                      padding: "8px 12px",
                      fontSize: 13,
                      maxWidth: "80%",
                    }}
                  >
                    {m.message}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    border: "none",
                    borderRadius: 10,
                    width: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Send size={16} color="#fff" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
