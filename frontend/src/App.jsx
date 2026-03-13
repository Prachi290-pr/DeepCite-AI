import { useState, useEffect, useRef } from "react";
import { askQuestion } from "./api/ragApi";

function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const result = await askQuestion(query);
      const aiMessage = {
        role: "assistant",
        text: result.answer,
        sources: result.sources || [],
        metrics: result.metrics || {}
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error connecting to DeepCite engine. Please ensure the FastAPI backend and local LLM are active." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.appContainer}>
      {/* Functional Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 style={styles.sidebarTitle}>DeepCite AI</h2>
              <p style={styles.sidebarSubtitle}>RAG System v2.1</p>
            </div>
          </div>

          <div style={styles.statusBadge}>
            <span style={styles.statusDot}></span>
            <span style={styles.statusText}>Local Engine Active</span>
          </div>

          <div style={styles.sidebarMenu}>
             <p style={styles.menuLabel}>System Components</p>
             <div style={styles.componentPill}>Hybrid: BM25 + FAISS</div>
             <div style={styles.componentPill}>Model: Llama-3-8B</div>
             <div style={styles.componentPill}>Cross-Encoder Rerank</div>
          </div>

          <div style={styles.sidebarFooter}>
            <p style={styles.version}>Built for Academic Retrieval</p>
          </div>
        </div>
      </aside>

      <main style={styles.mainArea}>
        <div style={styles.chatHeader}>
          <div style={styles.headerLeft}>
            <h3 style={styles.headerTitle}>Research Assistant</h3>
            <span style={styles.headerBadge}>Grounded Response Mode</span>
          </div>
        </div>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📚</div>
              <h3 style={styles.emptyTitle}>DeepCite Knowledge Base</h3>
              <p style={styles.emptyText}>Submit a query to scan your indexed research papers for grounded, cited answers.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} style={{ ...styles.messageRow, ...(msg.role === "user" ? styles.userRow : styles.aiRow) }}>
              {msg.role === "assistant" && <div style={styles.aiAvatar}>AI</div>}
              <div style={msg.role === "user" ? styles.userBubble : styles.aiBubble}>
                <div style={styles.messageText}>{msg.text}</div>

                {msg.sources && msg.sources.length > 0 && (
                  <div style={styles.sourcesContainer}>
                    <div style={styles.sourcesHeader}>Document Evidence</div>
                    <div style={styles.sourcesList}>
                      {msg.sources.map((s, i) => (
                        <div key={i} style={styles.sourceTag}>
                          <span style={styles.sourceBadge}>{i + 1}</span>
                          <span style={styles.sourceName}>{s.source}</span>
                          <span style={styles.pageTag}>Page {s.page}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.metrics && Object.keys(msg.metrics).length > 0 && (
                  <div style={styles.metricsBar}>
                    {Object.entries(msg.metrics).map(([key, val]) => (
                      <div key={key} style={styles.metricItem}>
                        <span style={styles.metricLabel}>{key.replace('_', ' ')}</span>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${val * 100}%` }}></div>
                        </div>
                        <span style={styles.metricValue}>{(val * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.messageRow, ...styles.aiRow }}>
              <div style={styles.aiAvatar}>AI</div>
              <div style={styles.aiBubble}>
                <div style={styles.typingIndicator}>
                  <span style={styles.typingDot}></span>
                  <span style={{ ...styles.typingDot, animationDelay: '0.2s' }}></span>
                  <span style={{ ...styles.typingDot, animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputWrapper}>
          <form onSubmit={handleSubmit} style={styles.inputArea}>
            <div style={styles.inputContainer}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your research papers..."
                style={styles.input}
                disabled={loading}
              />
              <button type="submit" style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
                {loading ? <div style={styles.buttonLoader}></div> : "Ask"}
              </button>
            </div>
          </form>
          <p style={styles.footerNote}>Citations are automatically extracted from document metadata</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: { display: "flex", height: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "'Inter', sans-serif" },
  sidebar: { width: "260px", background: "#0b1120", color: "white" },
  sidebarContent: { padding: "32px 24px", height: "100%", display: "flex", flexDirection: "column" },
  logoArea: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" },
  logoIcon: { background: "linear-gradient(135deg, #2563eb, #7c3aed)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  sidebarTitle: { margin: 0, fontSize: "1.1rem", fontWeight: "600" },
  sidebarSubtitle: { margin: 0, fontSize: "0.65rem", opacity: 0.5 },
  statusBadge: { background: "rgba(34, 197, 94, 0.1)", padding: "10px 14px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" },
  statusText: { fontSize: "0.8rem", color: "#4ade80" },
  sidebarMenu: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  menuLabel: { fontSize: "0.65rem", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em", fontWeight: "700" },
  componentPill: { background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px", fontSize: "0.75rem", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" },
  sidebarFooter: { marginTop: "auto" },
  version: { fontSize: "0.65rem", color: "#475569", margin: 0 },
  mainArea: { flex: 1, display: "flex", flexDirection: "column" },
  chatHeader: { padding: "18px 32px", background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  headerTitle: { margin: 0, fontSize: "1rem", fontWeight: "600" },
  headerBadge: { background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: "600" },
  chatBox: { flex: 1, padding: "32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" },
  emptyState: { margin: "auto", textAlign: "center", maxWidth: "400px" },
  emptyIcon: { fontSize: "40px", marginBottom: "16px" },
  emptyTitle: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "8px" },
  emptyText: { color: "#64748b", lineHeight: "1.6", fontSize: "0.9rem" },
  messageRow: { display: "flex", gap: "12px", maxWidth: "85%" },
  userRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  aiRow: { alignSelf: "flex-start" },
  aiAvatar: { width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: "bold", flexShrink: 0 },
  userBubble: { background: "#2563eb", color: "white", padding: "14px 18px", borderRadius: "18px 18px 4px 18px" },
  aiBubble: { background: "white", padding: "18px 22px", borderRadius: "18px 18px 18px 4px", border: "1px solid #e2e8f0" },
  messageText: { lineHeight: "1.6", fontSize: "0.95rem" },
  sourcesContainer: { marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" },
  sourcesHeader: { fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", marginBottom: "8px" },
  sourcesList: { display: "flex", flexDirection: "column", gap: "6px" },
  sourceTag: { fontSize: "0.75rem", color: "#334155", background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #e2e8f0" },
  sourceBadge: { background: "#e2e8f0", color: "#475569", width: "16px", height: "16px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700" },
  sourceName: { flex: 1 },
  pageTag: { color: "#2563eb", fontWeight: "600" },
  metricsBar: { marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "6px" },
  metricItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "0.65rem" },
  metricLabel: { color: "#64748b", minWidth: "80px", textTransform: "capitalize" },
  progressBar: { flex: 1, height: "3px", background: "#f1f5f9", borderRadius: "2px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#2563eb", transition: "width 0.4s ease" },
  metricValue: { color: "#0f172a", fontWeight: "700", minWidth: "30px", textAlign: "right" },
  inputWrapper: { padding: "24px 32px", background: "white", borderTop: "1px solid #e2e8f0" },
  inputArea: { maxWidth: "800px", margin: "0 auto" },
  inputContainer: { display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "6px 6px 6px 16px" },
  input: { flex: 1, border: "none", background: "none", fontSize: "0.95rem", outline: "none", color: "#0f172a" },
  button: { background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" },
  buttonDisabled: { background: "#e2e8f0", color: "#94a3b8", border: "none", borderRadius: "8px", padding: "10px 20px" },
  buttonLoader: { width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" },
  footerNote: { textAlign: "center", fontSize: "0.65rem", color: "#94a3b8", marginTop: "12px" },
  typingIndicator: { display: "flex", gap: "4px", padding: "4px 0" },
  typingDot: { width: "6px", height: "6px", background: "#cbd5e1", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out" }
};

// Injection of keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
`;
document.head.appendChild(styleSheet);

export default App;