import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { askQuestion } from "./api/ragApi";

function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const userMessage = { role: "user", text: query };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

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
        {
          role: "assistant",
          text: "Error connecting to DeepCite engine. Ensure FastAPI backend is running."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.appContainer}>
      {/* Sidebar */}

      <aside style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>DC</div>
            <div>
              <h2 style={styles.sidebarTitle}>DeepCite AI</h2>
              <p style={styles.sidebarSubtitle}>Research Assistant</p>
            </div>
          </div>

          <div style={styles.statusBadge}>
            <span style={styles.statusDot}></span>
            Engine Running
          </div>

          <div style={styles.sidebarMenu}>
            <p style={styles.menuLabel}>SYSTEM</p>

            <div style={styles.componentPill}>Hybrid Search</div>
            <div style={styles.componentPill}>BM25 + FAISS</div>
            <div style={styles.componentPill}>Llama-3-8B</div>
            <div style={styles.componentPill}>Cross Encoder Rerank</div>
          </div>

          <div style={styles.sidebarFooter}>
            Built for Academic Retrieval
          </div>
        </div>
      </aside>

      {/* Main */}

      <main style={styles.mainArea}>
        <div style={styles.chatHeader}>
          <h3 style={styles.headerTitle}>Research Chat</h3>
        </div>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <h3>DeepCite Knowledge Base</h3>
              <p>Ask questions about your indexed research papers.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                ...(msg.role === "user" ? styles.userRow : styles.aiRow)
              }}
            >
              {msg.role === "assistant" && <div style={styles.aiAvatar}>AI</div>}

              <div
                style={
                  msg.role === "user" ? styles.userBubble : styles.aiBubble
                }
              >
                <div style={styles.messageText}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Sources */}

                {msg.sources && msg.sources.length > 0 && (
                  <div style={styles.sourcesContainer}>
                    <div style={styles.sourcesHeader}>Sources</div>

                    {msg.sources.map((s, i) => (
                      <div
                        key={i}
                        style={styles.sourceTag}
                        onClick={() =>
                          alert(`Open ${s.source} page ${s.page}`)
                        }
                      >
                        <span style={styles.sourceBadge}>{i + 1}</span>

                        <span style={styles.sourceName}>{s.source}</span>

                        <span style={styles.pageTag}>Page {s.page}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metrics */}

                {msg.metrics && Object.keys(msg.metrics).length > 0 && (
                  <div style={styles.metricsBar}>
                    {Object.entries(msg.metrics).map(([key, val]) => (
                      <div key={key} style={styles.metricItem}>
                        <span style={styles.metricLabel}>
                          {key.replace("_", " ")}
                        </span>

                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${val * 100}%`
                            }}
                          ></div>
                        </div>

                        <span style={styles.metricValue}>
                          {(val * 100).toFixed(0)}%
                        </span>
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
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}

        <div style={styles.inputWrapper}>
          <form onSubmit={handleSubmit} style={styles.inputArea}>
            <textarea
              ref={textareaRef}
              value={query}
              placeholder="Ask about your research papers..."
              onChange={handleInputChange}
              style={styles.input}
              rows={1}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            <button
              type="submit"
              style={loading ? styles.buttonDisabled : styles.button}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>

          <p style={styles.footerNote}>
            Answers are grounded in indexed research papers.
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f8fafc"
  },

  sidebar: {
    width: "250px",
    background: "#0f172a",
    color: "white"
  },

  sidebarContent: {
    padding: "28px",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  logoArea: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "30px"
  },

  logoIcon: {
    background: "#2563eb",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  sidebarTitle: { margin: 0 },

  sidebarSubtitle: { margin: 0, fontSize: "0.7rem", opacity: 0.6 },

  statusBadge: {
    background: "#022c22",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "0.8rem",
    marginBottom: "24px"
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    marginRight: "6px"
  },

  sidebarMenu: { flex: 1 },

  menuLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    opacity: 0.5
  },

  componentPill: {
    background: "#1e293b",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    marginTop: "6px"
  },

  sidebarFooter: { fontSize: "0.7rem", opacity: 0.5 },

  mainArea: { flex: 1, display: "flex", flexDirection: "column" },

  chatHeader: {
    padding: "18px",
    borderBottom: "1px solid #e2e8f0",
    background: "white"
  },

  headerTitle: { margin: 0 },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  messageRow: { display: "flex", gap: "10px", maxWidth: "80%" },

  userRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },

  aiRow: { alignSelf: "flex-start" },

  aiAvatar: {
    background: "#2563eb",
    color: "white",
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px"
  },

  userBubble: {
    background: "#2563eb",
    color: "white",
    padding: "14px",
    borderRadius: "16px"
  },

  aiBubble: {
    background: "white",
    border: "1px solid #e2e8f0",
    padding: "16px",
    borderRadius: "16px"
  },

  messageText: { lineHeight: 1.6 },

  sourcesContainer: { marginTop: "12px" },

  sourcesHeader: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    opacity: 0.6
  },

  sourceTag: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    background: "#f1f5f9",
    borderRadius: "6px",
    marginTop: "4px",
    cursor: "pointer"
  },

  sourceBadge: {
    background: "#e2e8f0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem"
  },

  pageTag: { color: "#2563eb", fontWeight: "bold" },

  metricsBar: { marginTop: "10px" },

  metricItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.7rem"
  },

  progressBar: {
    flex: 1,
    height: "4px",
    background: "#e2e8f0",
    borderRadius: "3px"
  },

  progressFill: { background: "#2563eb", height: "100%" },

  metricValue: { fontWeight: "bold" },

  inputWrapper: {
    borderTop: "1px solid #e2e8f0",
    padding: "18px",
    background: "white"
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    maxWidth: "800px",
    margin: "0 auto"
  },

  input: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px",
    resize: "none",
    fontSize: "0.95rem",
    outline: "none"
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer"
  },

  buttonDisabled: {
    background: "#94a3b8",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px"
  },

  footerNote: {
    textAlign: "center",
    fontSize: "0.7rem",
    marginTop: "8px",
    color: "#94a3b8"
  },

  typingIndicator: {
    display: "flex",
    gap: "4px"
  }
};

export default App;