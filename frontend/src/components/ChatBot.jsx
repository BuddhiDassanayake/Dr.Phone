import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

const API_BASE = config.apiBaseUrl;

const QUICK_REPLIES = [
  { label: "📦 Status", value: "Check my repair status" },
  { label: "🔍 Lost ID", value: "I forgot my tracking number" },
  { label: "⏱️ Time", value: "How long will my repair take?" },
  { label: "🛠️ Services", value: "What repairs do you offer?" },
];

const formatMessage = (text) => {
  if (!text || typeof text !== 'string') return null;

  const combinedRegex = /(\*\*.*?\*\*|ORD-\d+|#\d{4,10}|\$\d+(?:\.\d{2})?|Ready|Fixed|Completed|Processing|Delayed|Cancelled)/gi;

  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(combinedRegex);
    return (
      <div key={i} style={{ margin: "4px 0", lineHeight: "1.5" }}>
        {parts.map((part, j) => {
          if (!part) return null;
          const lowerPart = part.toLowerCase();

          if (/ORD-\d+|#\d{4,}/gi.test(part)) return <span key={j} style={styles.trackingBadge}>🎫 {part}</span>;
          if (/\$\d+/g.test(part)) return <span key={j} style={styles.priceHighlight}>{part}</span>;
          if (["ready", "fixed", "completed"].includes(lowerPart)) return <span key={j} style={styles.statusSuccess}>{part}</span>;
          if (["delayed", "cancelled"].includes(lowerPart)) return <span key={j} style={styles.statusAlert}>{part}</span>;
          if (["processing"].includes(lowerPart)) return <span key={j} style={styles.statusNeutral}>{part}</span>;
          if (part.startsWith("**") && part.endsWith("**")) return <span key={j} style={styles.boldText}>{part.replace(/\*\*/g, "")}</span>;

          return part;
        })}
      </div>
    );
  });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("drphone_user") || "");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: userName 
        ? `Welcome back, **${userName}**! 👨‍🔧 How can **Dr.Phone** help you today? 😊` 
        : "Hi there! 🤖 I'm the **Dr.Phone** assistant. May I start by asking your **name**? 🧐",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    
    // Personalization logic
    let currentName = userName;
    if (!userName) {
        currentName = userMessage.split(' ').pop(); 
        setUserName(currentName);
        localStorage.setItem("drphone_user", currentName);
    }

    // 1. Add user message to local state immediately
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      console.log("📤 Sending to Dr.Phone API:", userMessage);

      const res = await fetch(`${API_BASE}/chatbot/message`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache" // Prevent browser from caching responses
        },
        body: JSON.stringify({
          message: userMessage,
          userName: currentName,
          // 2. CRITICAL FIX: Send the UPDATED history including the latest message
          conversationHistory: updatedMessages.slice(-8).map(m => ({
            role: m.role === "assistant" ? "model" : "user", // "model" works better for Gemini backends
            content: String(m.content)
          })),
          timestamp: Date.now() // Unique ID to force new backend processing
        }),
      });

      const data = await res.json();
      
      // 3. Fallback logic to prevent empty/same replies
      const botReply = data.reply && data.reply.length > 0 
        ? data.reply 
        : `I'm processing your request, **${currentName}**... could you tell me more? 🧐`;

      setMessages(prev => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having a bit of trouble connecting! 😧 Please try again. 🔄" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.button 
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)} style={styles.fab}
      >
        {isOpen ? "✕" : "🤖"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            style={styles.window}
          >
            <div style={styles.header}>
              <div style={styles.headerInfo}>
                <div style={styles.statusDot} />
                <div>
                  <div style={{ fontWeight: "800", fontSize: "17px" }}>Dr.Phone 👨‍🔧</div>
                  <div style={{ fontSize: "11px", opacity: 0.8 }}>{userName ? `Assisting ${userName}` : "Live Expert"}</div>
                </div>
              </div>
            </div>

            <div style={styles.scrollArea}>
              <div style={styles.messageList}>
                {messages.map((msg, i) => (
                  msg.content && (
                    <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ ...styles.bubble, ...(msg.role === "user" ? styles.userBubble : styles.botBubble) }}
                      >
                        {formatMessage(msg.content)}
                      </motion.div>
                    </div>
                  )
                ))}
                {isLoading && (
                  <div style={styles.typingIndicator}>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} style={styles.dot} />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} style={styles.dot} />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} style={styles.dot} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {!isLoading && (
              <div style={styles.quickReplyContainer}>
                {QUICK_REPLIES.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q.value)} style={styles.quickReplyChip}>{q.label}</button>
                ))}
              </div>
            )}

            <div style={styles.inputArea}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Dr.Phone... 🧐"
                style={styles.input}
              />
              <button onClick={() => sendMessage()} style={styles.sendBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  fab: { position: "fixed", bottom: "30px", right: "30px", width: "65px", height: "65px", borderRadius: "22px", backgroundColor: "#4F46E5", color: "white", border: "none", cursor: "pointer", zIndex: 10000, fontSize: "28px", boxShadow: "0 10px 30px rgba(79, 70, 229, 0.4)" },
  window: { position: "fixed", bottom: "110px", right: "30px", width: "380px", height: "600px", backgroundColor: "#ffffff", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", borderRadius: "28px", display: "flex", flexDirection: "column", zIndex: 10000, overflow: 'hidden' },
  header: { padding: "20px 25px", background: "#4F46E5", color: "white" },
  headerInfo: { display: "flex", alignItems: "center", gap: "12px" },
  statusDot: { width: "10px", height: "10px", backgroundColor: "#10B981", borderRadius: "50%", border: '2px solid white' },
  scrollArea: { flex: "1 1 0%", overflowY: "auto", background: "#F8FAFC", minHeight: 0 },
  messageList: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  msgRow: { display: 'flex', width: '100%' },
  bubble: { padding: "12px 16px", borderRadius: "20px", fontSize: "14.5px", maxWidth: '85%', wordWrap: 'break-word' },
  botBubble: { backgroundColor: "white", color: "#1E293B", borderBottomLeftRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  userBubble: { backgroundColor: "#4F46E5", color: "white", borderBottomRightRadius: '4px' },
  trackingBadge: { backgroundColor: "#FEF3C7", color: "#B45309", padding: "3px 10px", borderRadius: "8px", fontWeight: "800", border: "1px solid #F59E0B", margin: "0 2px", fontSize: "13px" },
  statusSuccess: { color: "#059669", fontWeight: "700", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "6px" },
  statusAlert: { color: "#DC2626", fontWeight: "700", backgroundColor: "#FEE2E2", padding: "2px 6px", borderRadius: "6px" },
  statusNeutral: { color: "#4F46E5", fontWeight: "700", backgroundColor: "#EEF2FF", padding: "2px 6px", borderRadius: "6px" },
  priceHighlight: { color: "#4F46E5", fontWeight: "800", textDecoration: "underline" },
  boldText: { color: "#1E293B", fontWeight: "700" },
  quickReplyContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '15px 20px', background: '#F8FAFC' },
  quickReplyChip: { padding: '8px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#4F46E5', fontSize: '12px', cursor: 'pointer', fontWeight: '700' },
  inputArea: { padding: "15px 20px", display: "flex", gap: "10px", background: 'white', borderTop: '1px solid #F1F5F9' },
  input: { flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", outline: 'none', fontSize: '14px' },
  sendBtn: { background: "#4F46E5", border: "none", borderRadius: "12px", width: "45px", height: "45px", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' },
  typingIndicator: { display: 'flex', gap: '4px', paddingLeft: '5px' },
  dot: { width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%' }
};