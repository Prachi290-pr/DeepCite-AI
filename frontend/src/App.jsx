// import { useState, useEffect, useRef } from "react";
// import { askQuestion } from "./api/ragApi";
// import ReactMarkdown from 'react-markdown';

// // Inject global styles
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --bg-void: #000000;
//     --bg-base: #050805;
//     --bg-surface: #0a0f0a;
//     --bg-raised: #0f160f;
//     --bg-hover: #141f14;
//     --border-dim: #1a2e1a;
//     --border-mid: #1f3a1f;
//     --border-bright: #2d5a2d;
//     --green-dim: #1a4d1a;
//     --green-mid: #22c55e;
//     --green-bright: #4ade80;
//     --green-glow: #86efac;
//     --green-muted: #166534;
//     --text-primary: #e8f5e8;
//     --text-secondary: #6b9e6b;
//     --text-dim: #3d6b3d;
//     --text-bright: #a3e8a3;
//     --font-mono: 'JetBrains Mono', monospace;
//     --font-display: 'Syne', sans-serif;
//   }

//   html, body, #root { height: 100%; background: var(--bg-void); }

//   ::-webkit-scrollbar { width: 4px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: var(--green-dim); border-radius: 2px; }
//   ::-webkit-scrollbar-thumb:hover { background: var(--green-muted); }

//   @keyframes pulse-glow {
//     0%, 100% { box-shadow: 0 0 4px rgba(34, 197, 94, 0.3); }
//     50% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.7), 0 0 24px rgba(34, 197, 94, 0.2); }
//   }

//   @keyframes bounce-dot {
//     0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
//     30% { transform: translateY(-5px); opacity: 1; }
//   }

//   @keyframes scan-line {
//     0% { transform: translateY(-100%); }
//     100% { transform: translateY(100vh); }
//   }

//   @keyframes flicker {
//     0%, 100% { opacity: 1; }
//     92% { opacity: 1; }
//     93% { opacity: 0.8; }
//     94% { opacity: 1; }
//     96% { opacity: 0.9; }
//     97% { opacity: 1; }
//   }

//   @keyframes slide-in-left {
//     from { transform: translateX(-8px); opacity: 0; }
//     to { transform: translateX(0); opacity: 1; }
//   }

//   @keyframes slide-in-right {
//     from { transform: translateX(8px); opacity: 0; }
//     to { transform: translateX(0); opacity: 1; }
//   }

//   @keyframes fade-up {
//     from { transform: translateY(6px); opacity: 0; }
//     to { transform: translateY(0); opacity: 1; }
//   }

//   @keyframes terminal-cursor {
//     0%, 100% { opacity: 1; }
//     50% { opacity: 0; }
//   }

//   .file-item:hover { color: var(--green-bright) !important; background: var(--bg-hover) !important; }
//   .file-item:hover .file-dot { background: var(--green-bright) !important; }

//   .source-chip:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; color: var(--green-bright) !important; }
//   .source-chip:hover .source-num { background: var(--green-mid) !important; color: #000 !important; }

//   .send-btn:hover:not(:disabled) { background: var(--green-bright) !important; box-shadow: 0 0 20px rgba(74, 222, 128, 0.4) !important; }

//   .query-btn:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; color: var(--green-bright) !important; }

//   .upload-btn:hover { background: var(--green-muted) !important; border-color: var(--green-bright) !important; box-shadow: 0 0 12px rgba(34, 197, 94, 0.3) !important; }

//   .chat-input:focus { border-color: var(--green-mid) !important; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15), inset 0 0 20px rgba(34, 197, 94, 0.03) !important; outline: none; }

//   .ai-msg { animation: slide-in-left 0.25s ease-out; }
//   .user-msg { animation: slide-in-right 0.25s ease-out; }
//   .fade-up { animation: fade-up 0.3s ease-out; }

//   .app-container { animation: flicker 8s infinite; }

//   .status-dot { animation: pulse-glow 2s infinite; }
// `;
// document.head.appendChild(styleSheet);

// export default function App() {
//   const [messages, setMessages] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedSource, setSelectedSource] = useState(null);
//   const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { hour12: false }));

//   const [library] = useState([
//     "attention_is_all_u_need.pdf",
//     "bert.pdf",
//     "vit.pdf",
//     "llama.pdf",
//   ]);

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   useEffect(() => {
//     const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!query.trim() || loading) return;
//     const userMessage = { role: "user", text: query };
//     setMessages((prev) => [...prev, userMessage]);
//     setQuery("");
//     setLoading(true);
//     try {
//       const result = await askQuestion(query);
//       setMessages((prev) => [...prev, {
//         role: "assistant",
//         text: result.answer,
//         sources: result.sources || [],
//         metrics: result.metrics || {},
//       }]);
//     } catch {
//       setMessages((prev) => [...prev, { role: "assistant", text: "ERR_CONNECTION_REFUSED — Is FastAPI running?" }]);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="app-container" style={{
//       display: "flex",
//       height: "100vh",
//       background: "var(--bg-void)",
//       fontFamily: "var(--font-mono)",
//       color: "var(--text-primary)",
//       overflow: "hidden",
//       position: "relative",
//     }}>

//       {/* Scanline overlay */}
//       <div style={{
//         position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
//         background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
//       }} />

//       {/* ── LEFT SIDEBAR ── */}
//       <aside style={{
//         width: 260, background: "var(--bg-base)",
//         borderRight: "1px solid var(--border-dim)",
//         display: "flex", flexDirection: "column",
//         padding: "20px 0",
//         position: "relative",
//         flexShrink: 0,
//       }}>
//         {/* Logo area */}
//         <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border-dim)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
//             <div style={{
//               width: 28, height: 28, border: "1px solid var(--green-mid)",
//               borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
//               background: "rgba(34,197,94,0.08)",
//             }}>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2">
//                 <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
//               </svg>
//             </div>
//             <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--green-bright)" }}>
//               RAGBASE
//             </span>
//           </div>
//           <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
//             RESEARCH INTELLIGENCE SYSTEM
//           </div>
//         </div>

//         {/* Library */}
//         <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//             <span style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.12em", fontWeight: 600 }}>
//               INDEXED CORPUS
//             </span>
//             <button className="upload-btn" style={{
//               width: 22, height: 22, border: "1px solid var(--border-mid)",
//               background: "transparent", color: "var(--green-mid)", cursor: "pointer",
//               borderRadius: 4, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center",
//               transition: "all 0.2s",
//             }}>+</button>
//           </div>

//           {library.map((file, i) => (
//             <div key={i} className="file-item" style={{
//               display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
//               borderRadius: 6, cursor: "default", transition: "all 0.15s",
//               color: "var(--text-secondary)", fontSize: "0.76rem", marginBottom: 2,
//             }}>
//               <div className="file-dot" style={{
//                 width: 5, height: 5, borderRadius: "50%", background: "var(--green-muted)",
//                 flexShrink: 0, transition: "background 0.15s",
//               }} />
//               <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{file}</span>
//             </div>
//           ))}
//         </div>

//         {/* Footer stats */}
//         <div style={{ padding: "14px 20px 0", borderTop: "1px solid var(--border-dim)" }}>
//           <div style={{ height: 2, background: "var(--bg-raised)", borderRadius: 1, marginBottom: 8, overflow: "hidden" }}>
//             <div style={{ width: "40%", height: "100%", background: "linear-gradient(90deg, var(--green-muted), var(--green-mid))", borderRadius: 1 }} />
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-dim)" }}>
//             <span>4 / 10 docs</span>
//             <span>HYBRID SEARCH</span>
//           </div>
//         </div>
//       </aside>

//       {/* ── MAIN CHAT ── */}
//       <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-void)", overflow: "hidden", minWidth: 0 }}>
//         {/* Header */}
//         <div style={{
//           padding: "12px 24px", borderBottom: "1px solid var(--border-dim)",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           background: "var(--bg-base)",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
//               Research Assistant
//             </span>
//             <span style={{
//               fontSize: "0.6rem", letterSpacing: "0.1em", padding: "2px 8px",
//               border: "1px solid var(--green-dim)", color: "var(--green-mid)",
//               borderRadius: 3, fontWeight: 600,
//             }}>BETA</span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "var(--text-secondary)" }}>
//               <div className="status-dot" style={{
//                 width: 6, height: 6, borderRadius: "50%", background: "var(--green-mid)",
//                 boxShadow: "0 0 6px rgba(34,197,94,0.5)",
//               }} />
//               Llama-3 · ONLINE
//             </div>
//             <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
//           </div>
//         </div>

//         {/* Messages */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
//           {messages.length === 0 && (
//             <div className="fade-up" style={{ margin: "auto", textAlign: "center", maxWidth: 360, padding: "40px 0" }}>
//               <div style={{
//                 width: 56, height: 56, border: "1px solid var(--border-bright)", borderRadius: 12,
//                 display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
//                 background: "rgba(34,197,94,0.05)",
//               }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
//                   <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
//                 </svg>
//               </div>
//               <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
//                 Ready to Research
//               </h3>
//               <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
//                 Query your indexed corpus. Hybrid BM25 + vector retrieval active.
//               </p>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {["What is the main contribution?", "Summarize the methodology", "Compare attention mechanisms", "What datasets were used?"].map((q, i) => (
//                   <button key={i} className="query-btn" onClick={() => setQuery(q)} style={{
//                     padding: "9px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
//                     borderRadius: 8, color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer",
//                     textAlign: "left", transition: "all 0.2s", fontFamily: "var(--font-mono)",
//                   }}>
//                     <span style={{ color: "var(--green-mid)", marginRight: 8 }}>&gt;</span>{q}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {messages.map((msg, idx) => (
//             msg.role === "user" ? (
//               <div key={idx} className="user-msg" style={{ alignSelf: "flex-end", maxWidth: "75%" }}>
//                 <div style={{
//                   background: "var(--bg-raised)", border: "1px solid var(--border-bright)",
//                   borderRadius: "12px 12px 2px 12px", padding: "12px 16px",
//                   fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-bright)",
//                   boxShadow: "0 0 20px rgba(34,197,94,0.05)",
//                 }}>
//                   <ReactMarkdown>{msg.text}</ReactMarkdown>
//                 </div>
//               </div>
//             ) : (
//               <div key={idx} className="ai-msg" style={{ alignSelf: "flex-start", maxWidth: "88%", display: "flex", gap: 10 }}>
//                 <div style={{
//                   width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-bright)",
//                   display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
//                   background: "rgba(34,197,94,0.08)",
//                   fontSize: "0.6rem", color: "var(--green-mid)", fontWeight: 700, letterSpacing: "0.05em",
//                 }}>AI</div>
//                 <div>
//                   <div style={{
//                     background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
//                     borderRadius: "2px 12px 12px 12px", padding: "14px 18px",
//                     fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-primary)",
//                   }}>
//                     <ReactMarkdown>{msg.text}</ReactMarkdown>
//                   </div>
//                   {msg.sources?.length > 0 && (
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
//                       {msg.sources.map((s, i) => (
//                         <button key={i} className="source-chip" onClick={() => setSelectedSource(s)} style={{
//                           display: "inline-flex", alignItems: "center", gap: 6,
//                           padding: "5px 10px 5px 6px", border: "1px solid var(--border-mid)",
//                           background: selectedSource === s ? "rgba(34,197,94,0.1)" : "var(--bg-surface)",
//                           borderColor: selectedSource === s ? "var(--green-mid)" : "var(--border-mid)",
//                           borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
//                           fontFamily: "var(--font-mono)",
//                         }}>
//                           <span className="source-num" style={{
//                             width: 16, height: 16, borderRadius: "50%",
//                             background: selectedSource === s ? "var(--green-mid)" : "var(--border-bright)",
//                             color: selectedSource === s ? "#000" : "var(--text-secondary)",
//                             fontSize: "0.6rem", fontWeight: 700,
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             transition: "all 0.2s",
//                           }}>{i + 1}</span>
//                           <span style={{ fontSize: "0.72rem", color: selectedSource === s ? "var(--green-bright)" : "var(--text-secondary)", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.source}</span>
//                           <span style={{ fontSize: "0.62rem", color: "var(--text-dim)" }}>p.{s.page}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           ))}

//           {loading && (
//             <div className="ai-msg" style={{ alignSelf: "flex-start", display: "flex", gap: 10 }}>
//               <div style={{
//                 width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-bright)",
//                 background: "rgba(34,197,94,0.08)",
//                 fontSize: "0.6rem", color: "var(--green-mid)", fontWeight: 700,
//                 display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
//               }}>AI</div>
//               <div style={{
//                 background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
//                 borderRadius: "2px 12px 12px 12px", padding: "14px 18px",
//                 display: "flex", alignItems: "center", gap: 4,
//               }}>
//                 {[0, 0.2, 0.4].map((d, i) => (
//                   <span key={i} style={{
//                     width: 6, height: 6, borderRadius: "50%", background: "var(--green-mid)",
//                     display: "inline-block",
//                     animation: `bounce-dot 1.2s ${d}s infinite ease-in-out`,
//                   }} />
//                 ))}
//               </div>
//             </div>
//           )}
//           <div ref={chatEndRef} />
//         </div>

//         {/* Input */}
//         <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-dim)", background: "var(--bg-base)", display: "flex", gap: 10, alignItems: "center" }}>
//           <span style={{ color: "var(--green-mid)", fontSize: "0.9rem", flexShrink: 0, fontWeight: 600 }}>&gt;</span>
//           <input
//             className="chat-input"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
//             placeholder="Query your research corpus..."
//             disabled={loading}
//             style={{
//               flex: 1, padding: "11px 14px", background: "var(--bg-surface)",
//               border: "1px solid var(--border-mid)", borderRadius: 8,
//               color: "var(--text-primary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)",
//               transition: "all 0.2s",
//               caretColor: "var(--green-bright)",
//             }}
//           />
//           <button
//             className="send-btn"
//             onClick={handleSubmit}
//             disabled={loading || !query.trim()}
//             style={{
//               width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border-bright)",
//               background: loading || !query.trim() ? "var(--bg-surface)" : "rgba(34,197,94,0.15)",
//               color: loading || !query.trim() ? "var(--text-dim)" : "var(--green-mid)",
//               cursor: loading || !query.trim() ? "not-allowed" : "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               transition: "all 0.2s", flexShrink: 0,
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <path d="M5 12h14M12 5l7 7-7 7"/>
//             </svg>
//           </button>
//         </div>
//       </main>

//       {/* ── RIGHT SIDEBAR ── */}
//       <aside style={{
//         width: 280, background: "var(--bg-base)", borderLeft: "1px solid var(--border-dim)",
//         padding: 20, display: "flex", flexDirection: "column", flexShrink: 0,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//           <span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--text-dim)", fontWeight: 600 }}>
//             SOURCE INSPECTOR
//           </span>
//           {selectedSource && (
//             <button onClick={() => setSelectedSource(null)} style={{
//               background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.7rem",
//             }}>✕ clear</button>
//           )}
//         </div>

//         {selectedSource ? (
//           <div className="fade-up" style={{
//             border: "1px solid var(--border-mid)", borderRadius: 10,
//             background: "var(--bg-surface)", overflow: "hidden",
//           }}>
//             {/* Header */}
//             <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-dim)", background: "var(--bg-raised)" }}>
//               <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
//                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
//                 </svg>
//                 <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", wordBreak: "break-all", lineHeight: 1.4, fontWeight: 500 }}>
//                   {selectedSource.source}
//                 </span>
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--green-mid)", marginLeft: 20 }}>
//                 PAGE {selectedSource.page}
//               </div>
//             </div>

//             {/* Excerpt */}
//             <div style={{ padding: 14 }}>
//               <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>EXCERPT</div>
//               <div style={{
//                 background: "var(--bg-void)", border: "1px solid var(--border-dim)", borderRadius: 6, padding: "10px 12px",
//                 borderLeft: "2px solid var(--green-muted)", marginBottom: 14,
//               }}>
//                 <p style={{ fontSize: "0.78rem", lineHeight: 1.65, color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }}>
//                   "{selectedSource.text}"
//                 </p>
//               </div>

//               {/* Metadata */}
//               {[
//                 ["RELEVANCE", "HIGH"],
//                 ["METHOD", "HYBRID"],
//                 ["RETRIEVER", "BM25 + FAISS"],
//               ].map(([label, val]) => (
//                 <div key={label} style={{
//                   display: "flex", justifyContent: "space-between", padding: "7px 0",
//                   borderBottom: "1px solid var(--border-dim)", fontSize: "0.72rem",
//                 }}>
//                   <span style={{ color: "var(--text-dim)", letterSpacing: "0.06em" }}>{label}</span>
//                   <span style={{ color: "var(--green-bright)", fontWeight: 600, letterSpacing: "0.04em" }}>{val}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
//             <div style={{
//               width: 44, height: 44, border: "1px dashed var(--border-mid)",
//               borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
//               opacity: 0.5,
//             }}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
//                 <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
//               </svg>
//             </div>
//             <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6 }}>
//               Click a source chip<br/>to inspect context
//             </p>
//           </div>
//         )}
//       </aside>
//     </div>
//   );
// }



























import { useState, useEffect, useRef } from "react";
import { askQuestion } from "./api/ragApi";
import ReactMarkdown from 'react-markdown';

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

  html, body, #root {
    height: 100%;
    width: 100%;
    background: var(--bg-void);
    overflow: hidden;
  }

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
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.85; }
    94% { opacity: 1; }
    96% { opacity: 0.92; }
    97% { opacity: 1; }
  }
  @keyframes slide-in-left {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-in-right {
    from { transform: translateX(10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fade-up {
    from { transform: translateY(8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* ── ROOT LAYOUT ── */
  .app-root {
    display: flex;
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    background: var(--bg-void);
    font-family: var(--font-mono);
    color: var(--text-primary);
    overflow: hidden;
    animation: flicker 10s infinite;
  }
  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px);
  }

  /* ── LEFT SIDEBAR ── */
  .left-sidebar {
    width: 240px;
    flex: 0 0 240px;
    background: var(--bg-base);
    border-right: 1px solid var(--border-dim);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .sidebar-logo {
    padding: 18px 18px 16px;
    border-bottom: 1px solid var(--border-dim);
    flex-shrink: 0;
  }
  .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .logo-icon {
    width: 30px; height: 30px;
    border: 1px solid var(--green-mid); border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(34,197,94,0.08); flex-shrink: 0;
  }
  .logo-text {
    font-family: var(--font-display); font-weight: 800;
    font-size: 1.05rem; letter-spacing: -0.03em; color: var(--green-bright);
  }
  .logo-sub { font-size: 0.57rem; color: var(--text-dim); letter-spacing: 0.12em; padding-left: 40px; }

  .sidebar-library { padding: 14px 16px; flex: 1; overflow-y: auto; }
  .library-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .sidebar-section-label { font-size: 0.57rem; color: var(--text-dim); letter-spacing: 0.14em; font-weight: 600; }

  .upload-btn {
    width: 20px; height: 20px; border: 1px solid var(--border-mid);
    background: transparent; color: var(--green-mid); cursor: pointer;
    border-radius: 4px; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .upload-btn:hover {
    background: var(--green-muted) !important; border-color: var(--green-bright) !important;
    box-shadow: 0 0 10px rgba(34,197,94,0.25) !important;
  }
  .file-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 8px; border-radius: 5px; cursor: default;
    transition: all 0.15s; color: var(--text-secondary); font-size: 0.73rem; margin-bottom: 2px;
  }
  .file-item:hover { color: var(--green-bright) !important; background: var(--bg-hover) !important; }
  .file-item:hover .file-dot { background: var(--green-bright) !important; }
  .file-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green-muted); flex-shrink: 0; transition: background 0.15s; }
  .file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }

  .sidebar-footer { padding: 12px 16px; border-top: 1px solid var(--border-dim); flex-shrink: 0; }
  .storage-bar-track { height: 2px; background: var(--bg-raised); border-radius: 1px; margin-bottom: 7px; overflow: hidden; }
  .storage-bar-fill { width: 40%; height: 100%; background: linear-gradient(90deg, var(--green-muted), var(--green-mid)); border-radius: 1px; }
  .storage-stats { display: flex; justify-content: space-between; font-size: 0.57rem; color: var(--text-dim); }

  /* ── MAIN CHAT ── */
  .main-chat {
    flex: 1 1 0%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg-void);
    overflow: hidden;
  }
  .chat-topbar {
    padding: 11px 22px; border-bottom: 1px solid var(--border-dim);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg-base); flex-shrink: 0;
  }
  .topbar-left { display: flex; align-items: center; gap: 10px; }
  .topbar-title { font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--text-primary); letter-spacing: -0.01em; }
  .topbar-badge { font-size: 0.55rem; letter-spacing: 0.1em; padding: 2px 7px; border: 1px solid var(--green-dim); color: var(--green-mid); border-radius: 3px; font-weight: 600; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .engine-status { display: flex; align-items: center; gap: 6px; font-size: 0.68rem; color: var(--text-secondary); }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-mid); box-shadow: 0 0 6px rgba(34,197,94,0.5); animation: pulse-glow 2s infinite; }
  .topbar-time { font-size: 0.68rem; color: var(--text-dim); font-variant-numeric: tabular-nums; }

  /* Messages area */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Empty state */
  .empty-state { margin: auto; text-align: center; max-width: 380px; padding: 32px 0; animation: fade-up 0.4s ease-out; }
  .empty-icon-box { width: 52px; height: 52px; border: 1px solid var(--border-bright); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; background: rgba(34,197,94,0.05); }
  .empty-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.02em; }
  .empty-sub { font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 22px; line-height: 1.6; }
  .query-suggestions { display: flex; flex-direction: column; gap: 7px; }
  .query-btn { padding: 9px 13px; background: var(--bg-surface); border: 1px solid var(--border-dim); border-radius: 7px; color: var(--text-secondary); font-size: 0.76rem; cursor: pointer; text-align: left; transition: all 0.2s; font-family: var(--font-mono); }
  .query-btn:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; color: var(--green-bright) !important; }
  .query-prompt-symbol { color: var(--green-mid); margin-right: 8px; }

  /* ── USER MESSAGE — flush right ── */
  .msg-row-user {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
    animation: slide-in-right 0.22s ease-out;
  }
  .user-avatar {
    width: 26px; height: 26px; border-radius: 6px;
    border: 1px solid var(--border-bright);
    background: rgba(34,197,94,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: var(--green-mid); font-weight: 700;
    letter-spacing: 0.04em; flex-shrink: 0;
  }
  .user-bubble {
    max-width: 58%;
    background: var(--bg-raised);
    border: 1px solid var(--border-bright);
    border-radius: 14px 14px 3px 14px;
    padding: 11px 15px;
    font-size: 0.85rem; line-height: 1.65; color: var(--text-bright);
    box-shadow: 0 0 18px rgba(34,197,94,0.05); word-break: break-word;
  }
  .user-bubble p { margin-bottom: 0.4em; }
  .user-bubble p:last-child { margin-bottom: 0; }

  /* ── AI MESSAGE — flush left ── */
  .msg-row-ai {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
    animation: slide-in-left 0.22s ease-out;
  }
  .ai-avatar {
    width: 26px; height: 26px; border-radius: 6px;
    border: 1px solid var(--border-bright);
    background: rgba(34,197,94,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: var(--green-mid); font-weight: 700;
    letter-spacing: 0.04em; flex-shrink: 0; margin-top: 2px;
  }
  .ai-bubble-wrapper {
    max-width: 70%;
    display: flex; flex-direction: column; gap: 8px;
  }
  .ai-bubble {
    background: var(--bg-surface); border: 1px solid var(--border-dim);
    border-radius: 3px 14px 14px 14px;
    padding: 13px 16px; font-size: 0.85rem; line-height: 1.75;
    color: var(--text-primary); word-break: break-word;
  }

  /* Markdown styling inside bubbles */
  .ai-bubble p { margin-bottom: 0.55em; }
  .ai-bubble p:last-child { margin-bottom: 0; }
  .ai-bubble strong { color: var(--green-bright); font-weight: 600; }
  .ai-bubble em { color: var(--text-bright); font-style: italic; }
  .ai-bubble code {
    background: var(--bg-raised); border: 1px solid var(--border-mid);
    border-radius: 4px; padding: 1px 6px;
    font-size: 0.81rem; color: var(--green-bright); font-family: var(--font-mono);
  }
  .ai-bubble pre {
    background: var(--bg-raised); border: 1px solid var(--border-mid);
    border-radius: 7px; padding: 12px 14px; margin: 8px 0; overflow-x: auto;
  }
  .ai-bubble pre code { background: none; border: none; padding: 0; font-size: 0.79rem; color: var(--green-bright); }
  .ai-bubble ul, .ai-bubble ol { padding-left: 18px; margin: 6px 0; }
  .ai-bubble li { margin-bottom: 3px; }
  .ai-bubble h1, .ai-bubble h2, .ai-bubble h3 { color: var(--green-bright); font-family: var(--font-display); margin: 10px 0 4px; font-size: 0.95rem; }
  .ai-bubble blockquote { border-left: 2px solid var(--green-muted); padding-left: 10px; color: var(--text-secondary); font-style: italic; margin: 6px 0; }
  .ai-bubble a { color: var(--green-mid); text-decoration: underline; }
  .ai-bubble hr { border: none; border-top: 1px solid var(--border-dim); margin: 10px 0; }

  /* Source chips */
  .source-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .source-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 9px 4px 5px; border: 1px solid var(--border-mid);
    background: var(--bg-surface); border-radius: 20px; cursor: pointer;
    transition: all 0.18s; font-family: var(--font-mono);
  }
  .source-chip:hover { background: var(--bg-hover) !important; border-color: var(--green-mid) !important; }
  .source-chip:hover .source-num { background: var(--green-mid) !important; color: #000 !important; }
  .source-chip.active { background: rgba(34,197,94,0.09); border-color: var(--green-mid); }
  .source-num {
    width: 15px; height: 15px; border-radius: 50%; background: var(--border-bright);
    color: var(--text-secondary); font-size: 0.57rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; transition: all 0.18s; flex-shrink: 0;
  }
  .source-num.active { background: var(--green-mid); color: #000; }
  .source-label { font-size: 0.7rem; color: var(--text-secondary); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .source-label.active { color: var(--green-bright); }
  .source-page { font-size: 0.6rem; color: var(--text-dim); }

  /* Loading */
  .typing-bubble {
    display: flex; align-items: center; gap: 5px; padding: 13px 16px;
    background: var(--bg-surface); border: 1px solid var(--border-dim);
    border-radius: 3px 14px 14px 14px;
  }
  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-mid); display: inline-block; }

  /* ── INPUT BAR ── */
  .input-bar {
    padding: 14px 22px; border-top: 1px solid var(--border-dim);
    background: var(--bg-base); display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .input-prompt { color: var(--green-mid); font-size: 0.88rem; font-weight: 600; flex-shrink: 0; user-select: none; }
  .chat-input {
    flex: 1; padding: 10px 13px; background: var(--bg-surface);
    border: 1px solid var(--border-mid); border-radius: 8px;
    color: var(--text-primary); font-size: 0.85rem; font-family: var(--font-mono);
    transition: all 0.2s; caret-color: var(--green-bright); min-width: 0;
  }
  .chat-input:focus { border-color: var(--green-mid) !important; box-shadow: 0 0 0 2px rgba(34,197,94,0.13) !important; outline: none; }
  .chat-input::placeholder { color: var(--text-dim); }
  .send-btn {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;
  }
  .send-btn:not(:disabled):hover { background: var(--green-bright) !important; color: #000 !important; box-shadow: 0 0 18px rgba(74,222,128,0.35) !important; border-color: var(--green-bright) !important; }
  .send-btn:disabled { cursor: not-allowed; }

  /* ── RIGHT SIDEBAR ── */
  .right-sidebar {
    width: 260px;
    flex: 0 0 260px;
    background: var(--bg-base);
    border-left: 1px solid var(--border-dim);
    display: flex; flex-direction: column;
    padding: 18px 16px;
    height: 100vh; overflow: hidden;
  }
  .inspector-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-shrink: 0; }
  .inspector-title { font-size: 0.57rem; letter-spacing: 0.14em; color: var(--text-dim); font-weight: 600; }
  .inspector-clear { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 0.68rem; font-family: var(--font-mono); transition: color 0.15s; }
  .inspector-clear:hover { color: var(--green-mid); }
  .inspector-card { border: 1px solid var(--border-mid); border-radius: 10px; background: var(--bg-surface); overflow: hidden; animation: fade-up 0.25s ease-out; flex: 1; overflow-y: auto; }
  .inspector-card-header { padding: 11px 13px; border-bottom: 1px solid var(--border-dim); background: var(--bg-raised); }
  .inspector-filename-row { display: flex; gap: 7px; align-items: flex-start; margin-bottom: 3px; }
  .inspector-filename { font-size: 0.76rem; color: var(--text-primary); word-break: break-all; line-height: 1.4; font-weight: 500; }
  .inspector-page { font-size: 0.62rem; color: var(--green-mid); margin-left: 19px; letter-spacing: 0.05em; }
  .inspector-body { padding: 13px; }
  .inspector-section-label { font-size: 0.57rem; color: var(--text-dim); letter-spacing: 0.12em; margin-bottom: 7px; font-weight: 600; }
  .excerpt-box { background: var(--bg-void); border: 1px solid var(--border-dim); border-left: 2px solid var(--green-muted); border-radius: 6px; padding: 9px 11px; margin-bottom: 13px; }
  .excerpt-text { font-size: 0.76rem; line-height: 1.65; color: var(--text-secondary); font-style: italic; }
  .meta-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-dim); font-size: 0.7rem; }
  .meta-label { color: var(--text-dim); letter-spacing: 0.05em; }
  .meta-value { color: var(--green-bright); font-weight: 600; letter-spacing: 0.04em; }
  .inspector-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .inspector-empty-icon { width: 42px; height: 42px; border: 1px dashed var(--border-mid); border-radius: 10px; display: flex; align-items: center; justify-content: center; opacity: 0.45; }
  .inspector-empty-text { font-size: 0.72rem; color: var(--text-dim); text-align: center; line-height: 1.6; }
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
    e?.preventDefault();
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
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: "**ERR_CONNECTION_REFUSED** — Is FastAPI running?",
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="app-root">
      <div className="scanlines" />

      {/* ── LEFT SIDEBAR ── */}
      <aside className="left-sidebar">
        <div className="sidebar-logo">
          <div className="logo-row">
            <div className="logo-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <span className="logo-text">DeepCite AI</span>
          </div>
          <div className="logo-sub">RESEARCH INTELLIGENCE SYSTEM</div>
        </div>

        <div className="sidebar-library">
          <div className="library-header">
            <span className="sidebar-section-label">INDEXED CORPUS</span>
            <button className="upload-btn" title="Add document">+</button>
          </div>
          {library.map((file, i) => (
            <div key={i} className="file-item">
              <div className="file-dot" />
              <span className="file-name">{file}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="storage-bar-track">
            <div className="storage-bar-fill" />
          </div>
          <div className="storage-stats">
            <span>4 / 10 docs</span>
            <span>HYBRID SEARCH</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT ── */}
      <main className="main-chat">
        <div className="chat-topbar">
          <div className="topbar-left">
            <span className="topbar-title">Research Assistant</span>
            <span className="topbar-badge">BETA</span>
          </div>
          <div className="topbar-right">
            <div className="engine-status">
              <div className="status-dot" />
              Llama-3 · ONLINE
            </div>
            <span className="topbar-time">{time}</span>
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </div>
              <h3 className="empty-title">Ready to Research</h3>
              <p className="empty-sub">Query your indexed corpus.<br/>Hybrid BM25 + vector retrieval active.</p>
              <div className="query-suggestions">
                {[
                  "What is the main contribution?",
                  "Summarize the methodology",
                  "Compare attention mechanisms",
                  "What datasets were used?",
                ].map((q, i) => (
                  <button key={i} className="query-btn" onClick={() => setQuery(q)}>
                    <span className="query-prompt-symbol">&gt;</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              /* USER — right-aligned */
              <div key={idx} className="msg-row-user">
                <div className="user-bubble">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className="user-avatar">YOU</div>
              </div>
            ) : (
              /* AI — left-aligned */
              <div key={idx} className="msg-row-ai">
                <div className="ai-avatar">AI</div>
                <div className="ai-bubble-wrapper">
                  <div className="ai-bubble">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.sources?.length > 0 && (
                    <div className="source-chips">
                      {msg.sources.map((s, i) => {
                        const isActive = selectedSource === s;
                        return (
                          <button
                            key={i}
                            className={`source-chip${isActive ? " active" : ""}`}
                            onClick={() => setSelectedSource(isActive ? null : s)}
                          >
                            <span className={`source-num${isActive ? " active" : ""}`}>{i + 1}</span>
                            <span className={`source-label${isActive ? " active" : ""}`}>{s.source}</span>
                            <span className="source-page">p.{s.page}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="msg-row-ai">
              <div className="ai-avatar">AI</div>
              <div className="typing-bubble">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span
                    key={i}
                    className="typing-dot"
                    style={{ animation: `bounce-dot 1.2s ${d}s infinite ease-in-out` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="input-bar">
          <span className="input-prompt">&gt;</span>
          <input
            className="chat-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
            }}
            placeholder="Query your research corpus..."
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            style={{
              background: loading || !query.trim() ? "var(--bg-surface)" : "rgba(34,197,94,0.13)",
              color: loading || !query.trim() ? "var(--text-dim)" : "var(--green-mid)",
              border: `1px solid ${loading || !query.trim() ? "var(--border-dim)" : "var(--border-bright)"}`,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="right-sidebar">
        <div className="inspector-header">
          <span className="inspector-title">SOURCE INSPECTOR</span>
          {selectedSource && (
            <button className="inspector-clear" onClick={() => setSelectedSource(null)}>✕ clear</button>
          )}
        </div>

        {selectedSource ? (
          <div className="inspector-card">
            <div className="inspector-card-header">
              <div className="inspector-filename-row">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="inspector-filename">{selectedSource.source}</span>
              </div>
              <div className="inspector-page">PAGE {selectedSource.page}</div>
            </div>
            <div className="inspector-body">
              <div className="inspector-section-label">EXCERPT</div>
              <div className="excerpt-box">
                <p className="excerpt-text">"{selectedSource.text}"</p>
              </div>
              {[
                ["RELEVANCE", "HIGH"],
                ["METHOD",    "HYBRID"],
                ["RETRIEVER", "BM25 + FAISS"],
              ].map(([label, val]) => (
                <div key={label} className="meta-row">
                  <span className="meta-label">{label}</span>
                  <span className="meta-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="inspector-empty">
            <div className="inspector-empty-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <p className="inspector-empty-text">Click a source chip<br/>to inspect context</p>
          </div>
        )}
      </aside>
    </div>
  );
}