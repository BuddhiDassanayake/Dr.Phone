// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import config from "../config";

const API_BASE = config.apiBaseUrl;

const BOT_AVATAR = "🔧";
const USER_AVATAR = "👤";

const QUICK_REPLIES = [
  "Check my repair status",
  "I forgot my tracking number",
  "How long will my repair take?",
  "What repairs do you offer?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm your Dr.Phone assistant. I can help you track your repair, find your tracking number, or answer any repair questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    
    // Create new array for UI updates
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setIsTyping(true);

    // FIXED 1: Ensure URL hits `/api/chatbot/message`
    // Depending on your config, you might need to adjust this string.
    const endpointUrl = `${API_BASE}/chatbot/message`;
    console.log("Fetching from URL:", endpointUrl);

    try {
      console.log("📤 Sending message:", userMessage);

      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: String(userMessage || "").trim(),
          // FIXED 2: Send 'messages' (past history), NOT 'newMessages' 
          // Gemini fails if you send the current user message in the history AND as the new message.
          conversationHistory: messages
            .slice(-10) // limit history
            .map((msg) => ({
              role: msg.role === "assistant" ? "assistant" : "user",
              content: String(msg.content || ""),
            })),
        }),
      });

      console.log("Response Status:", res.status);
      const data = await res.json();
      console.log("Response Data:", data);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } catch (err) {
      console.error("Catch Block Error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen((o) => !o)} style={styles.fab}>
        {isOpen ? "✖" : "💬"}
      </button>

      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerTitle}>Dr.Phone Assistant</div>
            <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>X</button>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{...styles.msgRow, flexDirection: msg.role === "user" ? "row-reverse" : "row"}}>
                {/* FIXED 3: Correct React syntax for merging style objects */}
                <div style={{ ...styles.bubble, ...(msg.role === "user" ? styles.userBubble : styles.botBubble) }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && <div style={{color: '#888', fontSize: '12px', paddingLeft: '10px'}}>Assistant is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type here..."
              style={styles.textarea}
            />
            <button onClick={() => sendMessage()} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: { position: "fixed", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#6366f1", color: "white", border: "none", cursor: "pointer", zIndex: 10000, fontSize: "24px" },
  window: { position: "fixed", bottom: "90px", right: "20px", width: "350px", height: "500px", backgroundColor: "#fff", boxShadow: "0 5px 40px rgba(0,0,0,0.2)", borderRadius: "10px", display: "flex", flexDirection: "column", zIndex: 10000, overflow: 'hidden', border: '1px solid #ddd' },
  header: { padding: "15px", background: "#6366f1", color: "white", display: "flex", justifyContent: "space-between", fontWeight: "bold" },
  messages: { flex: 1, padding: "10px", overflowY: "auto", display: 'flex', flexDirection: 'column', gap: '10px' },
  msgRow: { display: 'flex', gap: '8px' },
  bubble: { padding: "8px 12px", borderRadius: "12px", fontSize: "14px", maxWidth: '80%', wordWrap: 'break-word' },
  botBubble: { backgroundColor: "#f1f1f1", color: "#333" },
  userBubble: { backgroundColor: "#6366f1", color: "white" },
  inputArea: { padding: "10px", display: "flex", gap: "5px", borderTop: "1px solid #eee" },
  textarea: { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ddd" },
  sendBtn: { padding: "8px 15px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }
};