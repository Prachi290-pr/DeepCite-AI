import { useState, useEffect, useRef } from "react";
import { askQuestion } from "./api/ragApi";
import ReactMarkdown from 'react-markdown';

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-void: #000000;
    --bg-base: #050805;
    --bg-surface: #0a0f0a;
    --bg-raised: #0f160f;
    --bg-hover: #141f14;
    --border-dim: #1a2e1a;
    --border-mid: #1f3a1f;
    --border-bright: #2d5a2d;
    --green-dim: #1a4d1a;
    --green-mid: #22c55e;
    --green-bright: #4ade80;
    --green-glow: #86efac;
    --green-muted: #166534;
    --text-primary: #e8f5e8;
    --text-secondary: #6b9e6b;
    --text-dim: #3d6b3d;
    --text-bright: #a3e8a3;
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Syne', sans-serif;
  }

  html, body, #root { height: 100%; background: var(--bg-void); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--green-dim); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--green-muted); }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 4px rgba(34, 197, 94, 0.3); }
    50% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.7), 0 0 24px rgba(34, 197, 94, 0.2); }
  }

  @keyframes bounce-dot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; }
    94% { opacity: 1; }
    96% { opacity: 0.9; }
    97% { opacity: 1; }
  }

  @keyframes slide-in-left {
    from { transform: translateX(-8px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slide-in-right {
    from { transform: translateX(8px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes fade-up {
    from { transform: translateY(6px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes terminal-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .file-item:hover { color: var(--green-bright) !important; background: var(--bg-hover) !important; }
  .file-item:hover .file-dot { background: var(--green-bright) !important; }

  .source-chip:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; color: var(--green-bright) !important; }
  .source-chip:hover .source-num { background: var(--green-mid) !important; color: #000 !important; }

  .send-btn:hover:not(:disabled) { background: var(--green-bright) !important; box-shadow: 0 0 20px rgba(74, 222, 128, 0.4) !important; }

  .query-btn:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; color: var(--green-bright) !important; }

  .upload-btn:hover { background: var(--green-muted) !important; border-color: var(--green-bright) !important; box-shadow: 0 0 12px rgba(34, 197, 94, 0.3) !important; }

  .chat-input:focus { border-color: var(--green-mid) !important; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15), inset 0 0 20px rgba(34, 197, 94, 0.03) !important; outline: none; }

  .ai-msg { animation: slide-in-left 0.25s ease-out; }
  .user-msg { animation: slide-in-right 0.25s ease-out; }
  .fade-up { animation: fade-up 0.3s ease-out; }

  .app-container { animation: flicker 8s infinite; }

  .status-dot { animation: pulse-glow 2s infinite; }
`;
document.head.appendChild(styleSheet);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { hour12: false }));

  const [library] = useState([
    "attention_is_all_u_need.pdf",
    "bert.pdf",
    "vit.pdf",
    "llama.pdf",
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    const userMessage = { role: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    try {
      const result = await askQuestion(query);
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: result.answer,
        sources: result.sources || [],
        metrics: result.metrics || {},
      }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "ERR_CONNECTION_REFUSED — Is FastAPI running?" }]);
    }
    setLoading(false);
  };

  return (
    <div className="app-container" style={{
      display: "flex",
      height: "100vh",
      background: "var(--bg-void)",
      fontFamily: "var(--font-mono)",
      color: "var(--text-primary)",
      overflow: "hidden",
      position: "relative",
    }}>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 260, background: "var(--bg-base)",
        borderRight: "1px solid var(--border-dim)",
        display: "flex", flexDirection: "column",
        padding: "20px 0",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Logo area */}
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border-dim)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, border: "1px solid var(--green-mid)",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(34,197,94,0.08)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--green-bright)" }}>
              RAGBASE
            </span>
          </div>
          <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
            RESEARCH INTELLIGENCE SYSTEM
          </div>
        </div>

        {/* Library */}
        <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.12em", fontWeight: 600 }}>
              INDEXED CORPUS
            </span>
            <button className="upload-btn" style={{
              width: 22, height: 22, border: "1px solid var(--border-mid)",
              background: "transparent", color: "var(--green-mid)", cursor: "pointer",
              borderRadius: 4, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>+</button>
          </div>

          {library.map((file, i) => (
            <div key={i} className="file-item" style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
              borderRadius: 6, cursor: "default", transition: "all 0.15s",
              color: "var(--text-secondary)", fontSize: "0.76rem", marginBottom: 2,
            }}>
              <div className="file-dot" style={{
                width: 5, height: 5, borderRadius: "50%", background: "var(--green-muted)",
                flexShrink: 0, transition: "background 0.15s",
              }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{file}</span>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div style={{ padding: "14px 20px 0", borderTop: "1px solid var(--border-dim)" }}>
          <div style={{ height: 2, background: "var(--bg-raised)", borderRadius: 1, marginBottom: 8, overflow: "hidden" }}>
            <div style={{ width: "40%", height: "100%", background: "linear-gradient(90deg, var(--green-muted), var(--green-mid))", borderRadius: 1 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-dim)" }}>
            <span>4 / 10 docs</span>
            <span>HYBRID SEARCH</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-void)", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          padding: "12px 24px", borderBottom: "1px solid var(--border-dim)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--bg-base)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Research Assistant
            </span>
            <span style={{
              fontSize: "0.6rem", letterSpacing: "0.1em", padding: "2px 8px",
              border: "1px solid var(--green-dim)", color: "var(--green-mid)",
              borderRadius: 3, fontWeight: 600,
            }}>BETA</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "var(--text-secondary)" }}>
              <div className="status-dot" style={{
                width: 6, height: 6, borderRadius: "50%", background: "var(--green-mid)",
                boxShadow: "0 0 6px rgba(34,197,94,0.5)",
              }} />
              Llama-3 · ONLINE
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.length === 0 && (
            <div className="fade-up" style={{ margin: "auto", textAlign: "center", maxWidth: 360, padding: "40px 0" }}>
              <div style={{
                width: 56, height: 56, border: "1px solid var(--border-bright)", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                background: "rgba(34,197,94,0.05)",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Ready to Research
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
                Query your indexed corpus. Hybrid BM25 + vector retrieval active.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["What is the main contribution?", "Summarize the methodology", "Compare attention mechanisms", "What datasets were used?"].map((q, i) => (
                  <button key={i} className="query-btn" onClick={() => setQuery(q)} style={{
                    padding: "9px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
                    borderRadius: 8, color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s", fontFamily: "var(--font-mono)",
                  }}>
                    <span style={{ color: "var(--green-mid)", marginRight: 8 }}>&gt;</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            msg.role === "user" ? (
              <div key={idx} className="user-msg" style={{ alignSelf: "flex-end", maxWidth: "75%" }}>
                <div style={{
                  background: "var(--bg-raised)", border: "1px solid var(--border-bright)",
                  borderRadius: "12px 12px 2px 12px", padding: "12px 16px",
                  fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-bright)",
                  boxShadow: "0 0 20px rgba(34,197,94,0.05)",
                }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div key={idx} className="ai-msg" style={{ alignSelf: "flex-start", maxWidth: "88%", display: "flex", gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-bright)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
                  background: "rgba(34,197,94,0.08)",
                  fontSize: "0.6rem", color: "var(--green-mid)", fontWeight: 700, letterSpacing: "0.05em",
                }}>AI</div>
                <div>
                  <div style={{
                    background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
                    borderRadius: "2px 12px 12px 12px", padding: "14px 18px",
                    fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-primary)",
                  }}>
                    {msg.text}
                  </div>
                  {msg.sources?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {msg.sources.map((s, i) => (
                        <button key={i} className="source-chip" onClick={() => setSelectedSource(s)} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "5px 10px 5px 6px", border: "1px solid var(--border-mid)",
                          background: selectedSource === s ? "rgba(34,197,94,0.1)" : "var(--bg-surface)",
                          borderColor: selectedSource === s ? "var(--green-mid)" : "var(--border-mid)",
                          borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
                          fontFamily: "var(--font-mono)",
                        }}>
                          <span className="source-num" style={{
                            width: 16, height: 16, borderRadius: "50%",
                            background: selectedSource === s ? "var(--green-mid)" : "var(--border-bright)",
                            color: selectedSource === s ? "#000" : "var(--text-secondary)",
                            fontSize: "0.6rem", fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                          }}>{i + 1}</span>
                          <span style={{ fontSize: "0.72rem", color: selectedSource === s ? "var(--green-bright)" : "var(--text-secondary)", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.source}</span>
                          <span style={{ fontSize: "0.62rem", color: "var(--text-dim)" }}>p.{s.page}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          ))}

          {loading && (
            <div className="ai-msg" style={{ alignSelf: "flex-start", display: "flex", gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-bright)",
                background: "rgba(34,197,94,0.08)",
                fontSize: "0.6rem", color: "var(--green-mid)", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
              }}>AI</div>
              <div style={{
                background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
                borderRadius: "2px 12px 12px 12px", padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "var(--green-mid)",
                    display: "inline-block",
                    animation: `bounce-dot 1.2s ${d}s infinite ease-in-out`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-dim)", background: "var(--bg-base)", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "var(--green-mid)", fontSize: "0.9rem", flexShrink: 0, fontWeight: 600 }}>&gt;</span>
          <input
            className="chat-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
            placeholder="Query your research corpus..."
            disabled={loading}
            style={{
              flex: 1, padding: "11px 14px", background: "var(--bg-surface)",
              border: "1px solid var(--border-mid)", borderRadius: 8,
              color: "var(--text-primary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)",
              transition: "all 0.2s",
              caretColor: "var(--green-bright)",
            }}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            style={{
              width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border-bright)",
              background: loading || !query.trim() ? "var(--bg-surface)" : "rgba(34,197,94,0.15)",
              color: loading || !query.trim() ? "var(--text-dim)" : "var(--green-mid)",
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ── */}
      <aside style={{
        width: 280, background: "var(--bg-base)", borderLeft: "1px solid var(--border-dim)",
        padding: 20, display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--text-dim)", fontWeight: 600 }}>
            SOURCE INSPECTOR
          </span>
          {selectedSource && (
            <button onClick={() => setSelectedSource(null)} style={{
              background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.7rem",
            }}>✕ clear</button>
          )}
        </div>

        {selectedSource ? (
          <div className="fade-up" style={{
            border: "1px solid var(--border-mid)", borderRadius: 10,
            background: "var(--bg-surface)", overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-dim)", background: "var(--bg-raised)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", wordBreak: "break-all", lineHeight: 1.4, fontWeight: 500 }}>
                  {selectedSource.source}
                </span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--green-mid)", marginLeft: 20 }}>
                PAGE {selectedSource.page}
              </div>
            </div>

            {/* Excerpt */}
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>EXCERPT</div>
              <div style={{
                background: "var(--bg-void)", border: "1px solid var(--border-dim)", borderRadius: 6, padding: "10px 12px",
                borderLeft: "2px solid var(--green-muted)", marginBottom: 14,
              }}>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.65, color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }}>
                  "{selectedSource.text}"
                </p>
              </div>

              {/* Metadata */}
              {[
                ["RELEVANCE", "HIGH"],
                ["METHOD", "HYBRID"],
                ["RETRIEVER", "BM25 + FAISS"],
              ].map(([label, val]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", padding: "7px 0",
                  borderBottom: "1px solid var(--border-dim)", fontSize: "0.72rem",
                }}>
                  <span style={{ color: "var(--text-dim)", letterSpacing: "0.06em" }}>{label}</span>
                  <span style={{ color: "var(--green-bright)", fontWeight: 600, letterSpacing: "0.04em" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, border: "1px dashed var(--border-mid)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.5,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6 }}>
              Click a source chip<br/>to inspect context
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}