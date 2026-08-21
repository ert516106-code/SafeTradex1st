import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, ImagePlus } from "lucide-react";
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
  const [sendingOption, setSendingOption] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

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

  function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleImageSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !chat) return;
    setUploading(true);
    try {
      const url = await chatService.uploadChatImage(file);
      await chatService.sendImageMessage(chat.chatId, chat.accessToken, url);
      loadMessages();
    } catch (err) {
      console.error("Failed to send image:", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSelectOption(messageId, optionText) {
    if (!chat) return;
    setSendingOption(messageId);
    try {
      await chatService.sendMessage(chat.chatId, chat.accessToken, optionText);
      loadMessages();
    } catch (err) {
      console.error("Failed to send selected option:", err);
    } finally {
      setSendingOption(null);
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
      {/* ----- FLOATING TOGGLE BUTTON – lifted well above the bottom nav ----- */}
      <button
        onClick={handleOpen}
        aria-label="Customer Service"
        style={{
          position: "fixed",
          bottom: 130,
          right: 20,
          width: 60,
          height: 60,
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
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {open ? (
          <X size={28} strokeWidth={2.5} color="#fff" />
        ) : (
          <MessageCircle size={28} strokeWidth={2.5} color="#fff" />
        )}
      </button>

      {/* ----- CHAT WINDOW ----- */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 200,
            right: 20,
            width: 340,
            maxWidth: "calc(100vw - 40px)",
            maxHeight: "calc(100vh - 260px)",
            height: 460,
            background: "#0c1226",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
            zIndex: 9998,
            animation: "slideUp 0.2s ease-out",
          }}
        >
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MessageCircle size={20} color="#fff" />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "0.3px" }}>
                Support Chat
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} color="#fff" />
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
                {messages.map((m) =>
                  m.message_type === "options" ? (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.sender_type === "user" ? "flex-end" : "flex-start",
                        background: m.sender_type === "user" ? "#2563eb" : "rgba(255,255,255,0.07)",
                        color: "#fff",
                        borderRadius: m.sender_type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "12px 14px",
                        fontSize: 13.5,
                        maxWidth: "85%",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <p style={{ margin: "0 0 10px" }}>{m.message}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {(m.options || []).map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectOption(m.id, opt)}
                            disabled={sendingOption === m.id}
                            style={{
                              background: "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.18)",
                              borderRadius: 10,
                              padding: "8px 12px",
                              color: "#fff",
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "left",
                              cursor: sendingOption === m.id ? "not-allowed" : "pointer",
                              opacity: sendingOption === m.id ? 0.5 : 1,
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : m.message_type === "image" ? (
                    
                      key={m.id}
                      href={m.message}
                      target="_blank"
                      rel="noreferrer"
                      style={{ alignSelf: m.sender_type === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}
                    >
                      <img
                        src={m.message}
                        alt="Sent attachment"
                        style={{ maxWidth: "100%", borderRadius: 14, display: "block" }}
                      />
                    </a>
                  ) : (
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
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {m.message}
                    </div>
                  )
                )}
              </div>
              <form onSubmit={handleSend} style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  disabled={uploading}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    width: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: uploading ? "not-allowed" : "pointer",
                    opacity: uploading ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                  title="Send image"
                >
                  <ImagePlus size={18} color="#fff" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelected}
                  style={{ display: "none" }}
                />
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
                    minWidth: 0,
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
                    flexShrink: 0,
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

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5), 0 0 0 0 rgba(37, 99, 235, 0.2); }
          50% { box-shadow: 0 8px 48px rgba(37, 99, 235, 0.8), 0 0 0 8px rgba(37, 99, 235, 0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
