
// import { useState, useRef, useEffect } from "react";
// import nadaImg from "../assets/img/WhatsApp Image 2026-05-09 at 16.17.34.jpeg";
// import { API } from "../../src/pharmacy/PharmacyApi";

// // ─── hook للـ responsive ──────────────────────────────────────────────────────
// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handler);
//     return () => window.removeEventListener("resize", handler);
//   }, []);
//   return isMobile;
// }

// const getPatientId = () => {
//   try {
//     const patient = localStorage.getItem("patient");
//     if (!patient) return undefined;
//     const data = JSON.parse(patient);
//     return data?.id || data?.patient_id || undefined;
//   } catch { return undefined; }
// };

// const TABS = [
//   { id: "home",   label: "الرئيسية", icon: "🏠" },
//   { id: "chat",   label: "المحادثة", icon: "💬" },
//   { id: "search", label: "بحث دواء", icon: "🔍" },
//   { id: "rx",     label: "الروشتة",  icon: "📋" },
//   { id: "alt",    label: "البدائل",  icon: "🔄" },
// ];

// const Spinner = () => (
//   <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"52px 0" }}>
//     <div style={{ width:36, height:36, border:"3px solid #E0EAFF", borderTopColor:"#1a56db", borderRadius:"50%", animation:"spin .75s linear infinite" }} />
//     <span style={{ fontSize:13, color:"#6b7280", fontWeight:500 }}>جارٍ المعالجة…</span>
//   </div>
// );

// const ErrBox = ({ msg }) => (
//   <div style={{ display:"flex", gap:12, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:"14px 18px", fontSize:13, color:"#991b1b", lineHeight:1.6 }}>
//     <span style={{ fontSize:16 }}>⚠️</span><span>{msg}</span>
//   </div>
// );

// const ResBox = ({ data }) => {
//   const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
//   if (!text) return null;
//   return (
//     <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(26,86,219,.07)" }}>
//       <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:"linear-gradient(135deg,#eff6ff,#e0eaff)", borderBottom:"1px solid #dbeafe" }}>
//         <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", animation:"pulse 2s ease infinite" }} />
//         <span style={{ fontSize:12, fontWeight:700, color:"#1a56db", letterSpacing:.5 }}>نتيجة التحليل</span>
//       </div>
//       <pre style={{ padding:18, fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, lineHeight:1.9, whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#374151", margin:0 }}>{text}</pre>
//     </div>
//   );
// };

// const ChatLoadingIndicator = () => (
//   <div style={{ display:"flex", gap:10, alignItems:"flex-end", animation:"fadeUp .18s ease", marginBottom:14 }}>
//     <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round">
//         <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
//       </svg>
//     </div>
//     <div style={{ padding:"14px 18px", background:"#f8faff", border:"1px solid #e5edff", borderRadius:"4px 16px 16px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", display:"flex", alignItems:"center", gap:6 }}>
//       {[0, 0.2, 0.4].map((delay, i) => (
//         <span key={i} style={{ width:8, height:8, borderRadius:"50%", background:"linear-gradient(135deg,#1e40af,#2563eb)", display:"inline-block", animation:`chatBounce 1.1s ${delay}s ease-in-out infinite` }}/>
//       ))}
//     </div>
//   </div>
// );

// function renderBold(text) {
//   const parts = text.split(/\*\*(.*?)\*\*/g);
//   return parts.map((p, i) =>
//     i % 2 === 1
//       ? <strong key={i} style={{ fontWeight:800, color:"#0f172a" }}>{p}</strong>
//       : p
//   );
// }

// function RxTextRenderer({ text }) {
//   if (!text) return null;
//   const lines = text.split("\n");
//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:4, fontFamily:"'Cairo',sans-serif", direction:"rtl" }}>
//       {lines.map((line, i) => {
//         const t = line.trim();
//         if (!t) return <div key={i} style={{ height:6 }} />;
//         if (t.startsWith("### ") || t.startsWith("## ") || t.startsWith("# ")) {
//           const heading = t.replace(/^#+\s*\d*\.?\s*/, "").replace(/\*\*/g, "");
//           return (
//             <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", marginTop:10, background:"linear-gradient(135deg,#1e3a8a11,#2563eb0a)", border:"1px solid #dbeafe", borderRadius:12 }}>
//               <div style={{ width:4, height:20, borderRadius:4, background:"linear-gradient(180deg,#1e40af,#2563eb)", flexShrink:0 }} />
//               <span style={{ fontSize:14, fontWeight:800, color:"#1e3a8a" }}>{heading}</span>
//             </div>
//           );
//         }
//         if (t.includes("⚠️") || /disclaimer|warning|تحذير/i.test(t)) {
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
//               <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
//               <p style={{ fontSize:13, color:"#92400e", fontWeight:600, lineHeight:1.7, margin:0 }}>{t.replace(/⚠️/g, "").replace(/\*\*/g, "").trim()}</p>
//             </div>
//           );
//         }
//         if (/contraindic|danger|خطر|ممنوع|خطير/i.test(t)) {
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
//               <span style={{ fontSize:16, flexShrink:0 }}>🚨</span>
//               <p style={{ fontSize:13, color:"#991b1b", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
//             </div>
//           );
//         }
//         if (/تفاعل|interaction|تعارض/i.test(t)) {
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
//               <span style={{ fontSize:16, flexShrink:0 }}>🔗</span>
//               <p style={{ fontSize:13, color:"#c2410c", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
//             </div>
//           );
//         }
//         if (/recommend|توصي|نصائح|يُنصح|ينصح/i.test(t)) {
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
//               <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
//               <p style={{ fontSize:13, color:"#166534", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
//             </div>
//           );
//         }
//         if (t.startsWith("- ") || t.startsWith("• ")) {
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"3px 6px" }}>
//               <span style={{ width:6, height:6, borderRadius:"50%", background:"#2563eb", flexShrink:0, marginTop:8 }} />
//               <span style={{ fontSize:13.5, color:"#374151", lineHeight:1.75 }}>{renderBold(t.replace(/^[-•]\s*/, ""))}</span>
//             </div>
//           );
//         }
//         if (/^\d+[.)\-]\s/.test(t)) {
//           const num = t.match(/^\d+/)[0];
//           const rest = t.replace(/^\d+[.)\-]\s*/, "");
//           return (
//             <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"3px 6px" }}>
//               <span style={{ minWidth:22, height:22, borderRadius:6, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#1e40af", flexShrink:0 }}>{num}</span>
//               <span style={{ fontSize:13.5, color:"#374151", lineHeight:1.75 }}>{renderBold(rest)}</span>
//             </div>
//           );
//         }
//         return (
//           <p key={i} style={{ fontSize:13.5, color:"#374151", lineHeight:1.8, margin:0 }}>{renderBold(t)}</p>
//         );
//       })}
//     </div>
//   );
// }

// const isNotRecommended = (v) =>
//   v && /غير موصى|not recommended|لا يُنصح|لا ينصح|contraindicated/i.test(v);

// function DrugCard({ drug, reason, dosageNote }) {
//   const [open, setOpen] = useState(false);
//   const isMobile = useIsMobile();

//   const infoRows = [
//     { icon:"🧬", k:"المادة الفعالة",    v:drug.active_ingredient, type:"normal"   },
//     { icon:"🏷️", k:"التصنيف",           v:drug.drug_class,        type:"normal"   },
//     { icon:"✅", k:"الاستخدامات",        v:drug.indications,       type:"normal"   },
//     { icon:"👤", k:"جرعة البالغين",     v:drug.dosage_adults,     type:"normal"   },
//     { icon:"🧒", k:"جرعة الأطفال",      v:drug.dosage_children,   type:"children" },
//   ].filter(r => r.v);

//   const safetyRows = [
//     { icon:"⚠️", k:"أعراض جانبية",    v:drug.side_effects_common,  type:"normal"  },
//     { icon:"🚨", k:"أعراض خطيرة",     v:drug.side_effects_serious, type:"serious" },
//     { icon:"🚫", k:"موانع الاستخدام", v:drug.contraindications,    type:"normal"  },
//     { icon:"⚡", k:"تحذيرات هامة",     v:drug.warnings,             type:"warning" },
//     { icon:"🤰", k:"في حالة الحمل",   v:drug.pregnancy,            type:"normal"  },
//     { icon:"🍼", k:"في حالة الرضاعة", v:drug.breastfeeding,        type:"normal"  },
//   ].filter(r => r.v);

//   const hasDetails = infoRows.length > 0 || safetyRows.length > 0;

//   const renderRow = (r, i) => {
//     if (r.type === "serious") return (
//       <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 12px" }}>
//         <span style={{ fontSize:15, flexShrink:0 }}>🚨</span>
//         <div><div style={{ fontSize:10, fontWeight:700, color:"#ef4444", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
//         <div style={{ fontSize:12.5, color:"#991b1b", lineHeight:1.6, fontWeight:600 }}>{r.v}</div></div>
//       </div>
//     );
//     if (r.type === "warning") return (
//       <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 12px" }}>
//         <span style={{ fontSize:15, flexShrink:0 }}>⚡</span>
//         <div><div style={{ fontSize:10, fontWeight:700, color:"#d97706", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
//         <div style={{ fontSize:12.5, color:"#92400e", lineHeight:1.6, fontWeight:600 }}>{r.v}</div></div>
//       </div>
//     );
//     if (r.type === "children") {
//       const notRec = isNotRecommended(r.v);
//       return (
//         <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background: notRec ? "#f9fafb" : "transparent", border: notRec ? "1px solid #e5e7eb" : "none", borderRadius:10, padding:"10px 12px", opacity: notRec ? 0.65 : 1 }}>
//           <span style={{ fontSize:15, flexShrink:0 }}>{notRec ? "❌" : "🧒"}</span>
//           <div><div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
//           <div style={{ fontSize:12.5, color: notRec ? "#9ca3af" : "#1f2937", lineHeight:1.6, fontStyle: notRec ? "italic" : "normal" }}>{r.v}</div></div>
//         </div>
//       );
//     }
//     return (
//       <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 12px" }}>
//         <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{r.icon}</span>
//         <div><div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
//         <div style={{ fontSize:12.5, color:"#1f2937", lineHeight:1.6 }}>{r.v}</div></div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(26,86,219,.06)", marginBottom:12 }}>
//       <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10, background:"#f8faff", borderBottom:"1px solid #e5edff" }}>
//         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//           <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round">
//               <path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7"/><circle cx="17" cy="17" r="5"/><path d="M14 17h6"/>
//             </svg>
//           </div>
//           <div>
//             <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{drug.drug_name}</div>
//             {drug.dosage_form && <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{drug.dosage_form}</div>}
//           </div>
//         </div>
//         {reason     && <div style={{ fontSize:13, color:"#166534", lineHeight:1.5 }}><span style={{ fontWeight:800, marginLeft:6 }}>🎯 الاستخدام:</span>{reason}</div>}
//         {dosageNote && <div style={{ fontSize:13, color:"#065f46", lineHeight:1.5 }}><span style={{ fontWeight:800, marginLeft:6 }}>💊 الجرعة:</span>{dosageNote}</div>}
//         {hasDetails && (
//           <button onClick={() => setOpen(o => !o)}
//             style={{ marginTop:10, display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:"none", background:"transparent", cursor:"pointer", textAlign:"right", padding:0 }}>
//             <span style={{ fontSize:12, color:"#64748b" }}>{open ? "إخفاء التفاصيل" : "عرض التفاصيل"}</span>
//             <svg style={{ transform:open?"rotate(180deg)":"none", transition:"transform .22s" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
//           </button>
//         )}
//       </div>
//       {open && (
//         <div style={{ borderTop:"1px solid #eff6ff", background:"#fff", padding:"16px 20px" }}>
//           {/* على الموبايل: عمود واحد — على الديسك توب: عمودين */}
//           <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"10px 20px" }}>
//             <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//               {infoRows.length > 0 && <div style={{ fontSize:10, fontWeight:800, color:"#6b7280", letterSpacing:.8, paddingBottom:4, borderBottom:"1px solid #f1f5f9", marginBottom:2 }}>📋 معلومات عامة</div>}
//               {infoRows.map((r, i) => renderRow(r, i))}
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//               {safetyRows.length > 0 && <div style={{ fontSize:10, fontWeight:800, color:"#6b7280", letterSpacing:.8, paddingBottom:4, borderBottom:"1px solid #f1f5f9", marginBottom:2 }}>🛡️ السلامة والتحذيرات</div>}
//               {safetyRows.map((r, i) => renderRow(r, i))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function RxAnalysisResult({ analysis }) {
//   const { medications = [], interactions = [], summary_ar, overall_risk_level } = analysis;
//   const RISK = {
//     low_risk:      { label:"منخفض", color:"#059669", bg:"#ecfdf5", border:"#6ee7b7", icon:"🟢" },
//     moderate_risk: { label:"متوسط", color:"#d97706", bg:"#fffbeb", border:"#fcd34d", icon:"🟡" },
//     high_risk:     { label:"مرتفع", color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:"🔴" },
//   };
//   const risk = RISK[overall_risk_level] ?? RISK.moderate_risk;

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:14  }}>
//       <div style={{ background:"linear-gradient(135deg,#1e3a5a,#2463ab)", borderRadius:20, padding:"20px 24px", color:"#fff", boxShadow:"0 4px 20px rgba(37,99,235,.35)" }}>
//         <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
//           <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>📋</div>
//           <div>
//             <div style={{ fontSize:16, fontWeight:800 }}>نتيجة تحليل الروشتة</div>
//             <div style={{ fontSize:12, opacity:.7, marginTop:2 }}>{medications.length} أدوية تم تحليلها</div>
//           </div>
//         </div>
//         {summary_ar && (
//           <div style={{ fontSize:13.5, lineHeight:1.85, background:"rgba(255,255,255,.1)", borderRadius:12, padding:"12px 16px", marginBottom:12 }}>
//             {summary_ar}
//           </div>
//         )}
//         <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:risk.bg, border:`1.5px solid ${risk.border}`, borderRadius:10, padding:"7px 14px" }}>
//           <span style={{ fontSize:16 }}>{risk.icon}</span>
//           <span style={{ fontSize:13, fontWeight:700, color:risk.color }}>مستوى الخطر: {risk.label}</span>
//         </div>
//       </div>
//       {medications.map((med, i) => (
//         <RxMedFullCard key={i} med={med} index={i} />
//       ))}
//       {interactions?.length > 0 && (
//         <div style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:16, padding:"18px 20px" }}>
//           <div style={{ fontSize:14, fontWeight:800, color:"#c2410c", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
//             <span>🔗</span> تفاعلات دوائية محتملة
//           </div>
//           {interactions.map((inter, i) => (
//             <div key={i} style={{ fontSize:13, color:"#7c2d12", lineHeight:1.75, padding:"10px 0", borderBottom:i<interactions.length-1?"1px solid #fed7aa":"none" }}>
//               {inter.drugs_involved && (
//                 <div style={{ fontWeight:800, color:"#c2410c", marginBottom:4 }}>{inter.drugs_involved.join(" + ")}</div>
//               )}
//               {inter.description_ar || inter.description}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function RxMedFullCard({ med, index }) {
//   const [open, setOpen] = useState(false);
//   const db = med.db_details || {};

//   const safeRows = [
//     { icon:"⚠️", label:"أعراض جانبية شائعة", value:db.side_effects_common },
//     { icon:"🚨", label:"أعراض خطيرة",         value:db.side_effects_serious },
//     { icon:"🚫", label:"موانع الاستخدام",      value:db.contraindications },
//     { icon:"⚡", label:"تحذيرات",              value:db.warnings },
//     { icon:"🤰", label:"الحمل",                value:db.pregnancy },
//     { icon:"🍼", label:"الرضاعة",              value:db.breastfeeding },
//     { icon:"✅", label:"الاستخدامات",           value:db.indications },
//     { icon:"👤", label:"جرعة البالغين",         value:db.dosage_adults },
//     { icon:"🧒", label:"جرعة الأطفال",          value:db.dosage_children },
//   ].filter(r => r.value);

//   return (
//     <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 14px rgba(26,86,219,.07)" }}>
//       <div style={{ background:"linear-gradient(135deg,#f8faff,#eff6ff)", padding:"18px 20px", borderBottom:"1px solid #e5edff" }}>
//         <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
//           <div style={{ width:46, height:46, borderRadius:14, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>💊</div>
//           <div style={{ flex:1 }}>
//             <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>{med.corrected_name}</div>
//             <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{med.arabic_name} {db.active_ingredient ? `· ${db.active_ingredient}` : ""}</div>
//             {db.drug_class && (
//               <div style={{ fontSize:11, color:"#2563eb", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:20, padding:"3px 10px", display:"inline-block", marginTop:6, fontWeight:600 }}>
//                 {db.drug_class}
//               </div>
//             )}
//           </div>
//           <div>
//             {med.is_safe
//               ? <span style={{ fontSize:11, fontWeight:700, color:"#059669", background:"#ecfdf5", border:"1px solid #6ee7b7", borderRadius:20, padding:"3px 10px" }}>✓ آمن</span>
//               : <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:20, padding:"3px 10px" }}>⚠️ تحقق</span>
//             }
//           </div>
//         </div>
//         <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
//           {med.dosage && (
//             <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #bfdbfe", borderRadius:10, padding:"6px 12px" }}>
//               <span style={{ fontSize:13 }}>💊</span>
//               <span style={{ fontSize:12, fontWeight:700, color:"#1e40af" }}>الجرعة: {med.dosage}</span>
//             </div>
//           )}
//           {med.frequency && (
//             <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:10, padding:"6px 12px" }}>
//               <span style={{ fontSize:13 }}>🕐</span>
//               <span style={{ fontSize:12, fontWeight:700, color:"#065f46" }}>{med.frequency}</span>
//             </div>
//           )}
//           {med.route && (
//             <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #e9d5ff", borderRadius:10, padding:"6px 12px" }}>
//               <span style={{ fontSize:13 }}>🩺</span>
//               <span style={{ fontSize:12, fontWeight:700, color:"#6d28d9" }}>{med.route}</span>
//             </div>
//           )}
//           {med.duration && (
//             <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #fed7aa", borderRadius:10, padding:"6px 12px" }}>
//               <span style={{ fontSize:13 }}>⏱️</span>
//               <span style={{ fontSize:12, fontWeight:700, color:"#c2410c" }}>{med.duration}</span>
//             </div>
//           )}
//         </div>
//         {med.description_ar && (
//           <div style={{ marginTop:12, fontSize:13, color:"#374151", lineHeight:1.75, background:"#fff", borderRadius:10, padding:"10px 14px", border:"1px solid #e5edff" }}>
//             {med.description_ar}
//           </div>
//         )}
//         {med.warnings?.length > 0 && (
//           <div style={{ marginTop:10, display:"flex", gap:8, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"8px 12px" }}>
//             <span>⚠️</span>
//             <span style={{ fontSize:12, color:"#92400e", lineHeight:1.6 }}>{med.warnings.join(" · ")}</span>
//           </div>
//         )}
//         {safeRows.length > 0 && (
//           <button onClick={() => setOpen(o => !o)}
//             style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:"1px solid #dbeafe", background:"#fff", borderRadius:10, padding:"8px 14px", cursor:"pointer" }}>
//             <span style={{ fontSize:12, fontWeight:700, color:"#1e40af" }}>{open ? "إخفاء التفاصيل الكاملة" : "عرض التفاصيل الكاملة"}</span>
//             <svg style={{ transform:open?"rotate(180deg)":"none", transition:"transform .22s" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
//           </button>
//         )}
//       </div>
//       {open && (
//         <div>
//           {safeRows.map((r, i) => (
//             <div key={i} style={{ display:"flex", gap:12, padding:"12px 20px", borderBottom:i<safeRows.length-1?"1px solid #f1f5f9":"none", background:i%2===0?"#fff":"#fafcff", alignItems:"flex-start" }}>
//               <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{r.icon}</span>
//               <div>
//                 <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3, textTransform:"uppercase" }}>{r.label}</div>
//                 <div style={{ fontSize:13, color:"#1f2937", lineHeight:1.7 }}>{r.value}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Home({ go }) {
//   const isMobile = useIsMobile();
//   const cards = [
//     { id:"chat",   icon:"💬", label:"صيدلى ذكى",       sub:"اسأل عن أي دواء أو أعراض — أو ارفع روشتة",   accent:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
//     { id:"search", icon:"🔍", label:"بحث الأدوية",      sub:"ابحث بالاسم التجاري أو المادة الفعالة",       accent:"#0284c7", bg:"#e0f2fe", border:"#7dd3fc" },
//     { id:"rx",     icon:"📋", label:"تحليل الروشتة",    sub:"ارفع الروشتة وحللها بالذكاء الاصطناعي",       accent:"#7c3aed", bg:"#f5f3ff", border:"#c4b5fd" },
//     { id:"alt",    icon:"🔄", label:"البدائل الدوائية", sub:"ابحث عن بديل مناسب لأي دواء",                 accent:"#059669", bg:"#ecfdf5", border:"#6ee7b7" },
//   ];
//   return (
//     <div style={{ flex:1, overflowY:"auto", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "16px" : "24px 28px", animation:"fadeUp .3s ease" }}>
//       <div style={{
//         display:"grid",
//         gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
//         gap: isMobile ? 12 : 16,
//         width:"100%",
//         maxWidth:900,
//       }}>
//         {cards.map((c, i) => (
//           <button key={c.id} onClick={() => go(c.id)}
//             style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:20, padding: isMobile ? "18px 16px" : "28px 24px", display:"flex", alignItems:"center", gap: isMobile ? 14 : 20, cursor:"pointer", textAlign:"right", animation:`pop .3s ease ${i*.07}s both`, transition:"all .2s", boxShadow:"0 1px 6px rgba(0,0,0,.06)", position:"relative", overflow:"hidden" }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor=c.accent; e.currentTarget.style.boxShadow=`0 8px 28px ${c.accent}22`; e.currentTarget.style.transform="translateY(-3px)"; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.06)"; e.currentTarget.style.transform="none"; }}>
//             <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${c.accent},${c.accent}88)`, borderRadius:"20px 20px 0 0" }} />
//             <div style={{ width: isMobile ? 46 : 56, height: isMobile ? 46 : 56, borderRadius:16, background:c.bg, border:`1.5px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 22 : 26, flexShrink:0 }}>{c.icon}</div>
//             <div style={{ flex:1 }}>
//               <div style={{ fontSize: isMobile ? 15 : 18, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{c.label}</div>
//               <div style={{ fontSize: isMobile ? 11.5 : 12.5, color:"#64748b", lineHeight:1.6, marginBottom: isMobile ? 8 : 12 }}>{c.sub}</div>
//               <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:c.accent }}>
//                 ابدأ الآن
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// const PIPELINE_STEPS = [
//   { id:"ocr" }, { id:"confirm" }, { id:"db" }, { id:"analysis" },
// ];

// function AgenticPipeline({ activeStep, imgPreview }) {
//   const steps = ["بقرأ الروشتة وبحدد النص","بتحقق من أسماء الأدوية","ببحث في قاعدة البيانات","بحلل الروشتة وبجهز النتيجة"];
//   const done   = steps.slice(0, activeStep).join(" · ");
//   const active = activeStep < steps.length ? steps[activeStep] : null;
//   return (
//     <div style={{ display:"flex", gap:10, alignItems:"flex-start", animation:"fadeUp .2s ease", marginBottom:4 }}>
//       <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
//       </div>
//       <div style={{ background:"#f8faff", border:"1px solid #e5edff", borderRadius:"4px 16px 16px 16px", padding:"12px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", maxWidth:"72%" }}>
//         {imgPreview && <img src={imgPreview} alt="rx" style={{ width:70, borderRadius:8, border:"1px solid #dbeafe", display:"block", marginBottom:10 }}/>}
//         <div style={{ fontSize:13, color:"#64748b", lineHeight:1.8 }}>
//           {done && <span style={{ color:"#10b981" }}>✓ {done}</span>}
//           {done && active && <span style={{ color:"#cbd5e1" }}> · </span>}
//           {active && <span style={{ color:"#1e3a8a", fontWeight:600 }}>{active}<span style={{ animation:"blink 1s ease infinite" }}>…</span></span>}
//           {!active && <span style={{ color:"#10b981", marginRight:6 }}>✓ اكتمل التحليل</span>}
//         </div>
//       </div>
//     </div>
//   );
// }

// const QUICK = [
//   { label:"صداع شديد",    icon:"🤕", text:"عندي صداع شديد، إيه الأدوية المناسبة؟" },
//   { label:"ألم في البطن", icon:"🤢", text:"بطني بتوجعني، ماذا أفعل؟" },
//   { label:"كحة وزكام",    icon:"🤧", text:"عندي كحة وزكام، ما التوصية الدوائية؟" },
//   { label:"ألم مفاصل",    icon:"🦴", text:"عندي ألم في مفاصلي، ما المناسب لي؟" },
//   { label:"حساسية وحكة",  icon:"☢",  text:"أعاني من حساسية وحكة في الجلد، ما الحل؟" },
//   { label:"حموضة وحرقان", icon:"🔥", text:"عندي حموضة وحرقان في المعدة، ما الدواء؟" },
//   { label:"ألم أسنان",    icon:"🦷", text:"عندي ألم أسنان شديد، ما المسكن المناسب؟" },
//   { label:"قيء ومغص",     icon:"😣", text:"أعاني من قيء ومغص، ما التوصية؟" },
// ];

// function Chat() {
//   const isMobile = useIsMobile();
//   const [msgs, setMsgs]             = useState([]);
//   const [recs, setRecs]             = useState([]);
//   const [inp, setInp]               = useState("");
//   const [load, setLoad]             = useState(false);
//   const [started, setStarted]       = useState(false);
//   const [rxFile, setRxFile]         = useState(null);
//   const [rxPreview, setRxPreview]   = useState(null);
//   const [rxProcessing, setRxProc]   = useState(false);
//   const [rxActiveStep, setRxStep]   = useState(0);
//   const [showPipeline, setShowPipe] = useState(false);
//   const [rxImgSnap, setRxImgSnap]   = useState(null);
//   const endRef      = useRef();
//   const fileRef     = useRef();
//   const rxResultRef = useRef("");

//   useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, recs, load, rxProcessing]);
//   useEffect(() => () => { if (rxPreview) URL.revokeObjectURL(rxPreview); }, [rxPreview]);

//   const onFileSelect = (f) => {
//     if (!f) return;
//     if (!f.type.startsWith("image/") && f.type !== "application/pdf") return;
//     setRxFile(f);
//     setRxPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
//   };

//   const send = async (text) => {
//     if (!text.trim() || load) return;
//     setStarted(true); setRecs([]);
//     const next = [...msgs, { role:"user", content:text }];
//     setMsgs(next); setInp(""); setLoad(true);
//     try {
//       const res = await API.chat({ patient_id: getPatientId() ?? 1, messages: next.slice(-12).map(m => ({ role:m.role, content:m.content })) });
//       const rd = res.body.getReader(), dc = new TextDecoder(); let txt = "";
//       setMsgs(m => [...m, { role:"assistant", content:"" }]);
//       while (true) {
//         const { done, value } = await rd.read();
//         if (done) break;
//         for (const line of dc.decode(value).split("\n")) {
//           if (!line.startsWith("data: ")) continue;
//           const raw = line.slice(6).trim();
//           if (raw === "[DONE]") break;
//           try {
//             const p = JSON.parse(raw);
//             if (p.t === "c" && p.d) { txt += p.d; setMsgs(m => { const u=[...m]; u[u.length-1]={role:"assistant",content:txt}; return u; }); }
//             if (p.t === "done" && p.recommendations) setRecs(p.recommendations);
//           } catch {}
//         }
//       }
//     } catch(e) { setMsgs(m => [...m, { role:"assistant", content:"⚠️ حدث خطأ: "+e.message }]); }
//     finally { setLoad(false); }
//   };

//   const sendRx = async () => {
//     if (!rxFile || rxProcessing) return;
//     rxResultRef.current = "";
//     setStarted(true); setRxProc(true); setRxStep(0); setShowPipe(true);
//     setRxImgSnap(rxPreview);
//     setMsgs(m => [...m, { role:"user", content:"📋 تحليل روشتة طبية", isRx:true, rxPreview }]);
//     setRxFile(null); setRxPreview(null);
//     const fd = new FormData(); fd.append("image", rxFile);
//     try {
//       await API.analyzeStream(fd, (s) => setRxStep(s), (c) => { rxResultRef.current = c; });
//       setRxStep(PIPELINE_STEPS.length);
//     } catch(e) {
//       setMsgs(m => [...m, { role:"assistant", content:"⚠️ حدث خطأ أثناء تحليل الروشتة: "+e.message }]);
//     } finally {
//       setRxProc(false); setShowPipe(false);
//       if (rxResultRef.current) setMsgs(m => [...m, { role:"assistant", isRxResult:true, content: rxResultRef.current }]);
//     }
//   };

//   const onSend = () => rxFile && !rxProcessing ? sendRx() : send(inp);
//   const sendDisabled = load || rxProcessing || (!inp.trim() && !rxFile);

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#f1f5f9", padding: isMobile ? "10px 10px 0" : "20px 24px" }}>
//       <style>{`@keyframes chatBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
//       <div style={{ display:"flex", flexDirection:"column", flex:1, maxWidth:860, width:"100%", margin:"0 auto" }}>

//         {!started && (
//           <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding: isMobile ? "16px 12px" : "28px 24px", gap:10, animation:"fadeUp .3s ease" }}>
//             <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4, boxShadow:"0 4px 20px rgba(37,99,235,.12)" }}>
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
//             </div>
//             <div style={{ fontSize: isMobile ? 18 : 22, fontWeight:800, color:"#0f172a" }}>كيف يمكنني مساعدتك؟</div>
//             {/* على الموبايل: 2 columns — على الديسك توب: 4 columns */}
//             <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap:10, width:"100%", maxWidth:700, marginTop:16 }}>
//               {QUICK.map((q, i) => (
//                 <button key={i} onClick={() => send(q.text)}
//                   style={{ display:"flex", alignItems:"center", gap: isMobile ? 8 : 11, background:"#f8faff", border:"1.5px solid #e5edff", borderRadius:14, padding: isMobile ? "10px 10px" : "13px 15px", textAlign:"right", cursor:"pointer", transition:"all .18s" }}>
//                   <div style={{ width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 16 : 18, flexShrink:0 }}>{q.icon}</div>
//                   <span style={{ fontSize: isMobile ? 11.5 : 13, fontWeight:600, color:"#1f2937" }}>{q.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {started && (
//           <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "12px 8px" : "24px 20px", display:"flex", flexDirection:"column", gap:14 }}>
//             {msgs.map((m, i) => (
//               <div key={i}>
//                 {m.role === "user" && (
//                   <div style={{ display:"flex", gap:10, alignItems:"flex-end", flexDirection:"row-reverse", animation:"fadeUp .18s ease" }}>
//                     {m.isRx ? (
//                       <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, maxWidth:"85%" }}>
//                         {m.rxPreview && <img src={m.rxPreview} alt="rx" style={{ maxWidth:140, borderRadius:12, border:"2px solid #bfdbfe", boxShadow:"0 2px 10px rgba(37,99,235,.15)" }}/>}
//                         <div style={{ padding:"10px 16px", fontSize:13, background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", borderRadius:"16px 4px 16px 16px" }}>📋 تحليل روشتة طبية</div>
//                       </div>
//                     ) : (
//                       <div style={{ padding:"12px 16px", fontSize: isMobile ? 13 : 14, lineHeight:1.75, maxWidth:"85%", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", borderRadius:"16px 4px 16px 16px" }}>{m.content}</div>
//                     )}
//                   </div>
//                 )}
//                 {m.role === "assistant" && m.isRxResult && (
//                   <div style={{ display:"flex", gap:8, alignItems:"flex-start", animation:"fadeUp .18s ease" }}>
//                     <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:4 }}>
//                       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
//                     </div>
//                     <div style={{ flex:1 }}>
//                       {(() => {
//                         try { const parsed = JSON.parse(m.content); return <RxAnalysisResult analysis={parsed} />; }
//                         catch { return <RxTextRenderer text={m.content} />; }
//                       })()}
//                     </div>
//                   </div>
//                 )}
//                 {m.role === "assistant" && !m.isRxResult && (
//                   <div style={{ display:"flex", gap:8, alignItems:"flex-end", animation:"fadeUp .18s ease" }}>
//                     <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//                       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
//                     </div>
//                     <div style={{ padding:"12px 16px", fontSize: isMobile ? 13 : 14, lineHeight:1.75, maxWidth:"85%", background:"#fff", color:"#1f2937", borderRadius:"4px 16px 16px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", border:"1px solid #e5edff" }}>{m.content}</div>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {showPipeline && <AgenticPipeline activeStep={rxActiveStep} imgPreview={rxImgSnap} />}
//             {load && <ChatLoadingIndicator />}
//             {recs.length > 0 && (
//               <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:6, animation:"fadeUp .3s ease" }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"linear-gradient(135deg,#ecfdf5,#d1fae5)", border:"1px solid #6ee7b7", borderRadius:12 }}>
//                   <span style={{ fontSize:16 }}>💊</span>
//                   <span style={{ fontSize:13, fontWeight:700, color:"#065f46" }}>التوصيات الدوائية المقترحة:</span>
//                 </div>
//                 {recs.map((d, i) => <DrugCard key={i} drug={d.details||d} reason={d.reason} dosageNote={d.dosage_note}/>)}
//               </div>
//             )}
//             <div ref={endRef}/>
//           </div>
//         )}

//         {rxFile && !rxProcessing && (
//           <div style={{ margin:"0 0 8px 0", display:"flex", alignItems:"center", gap:10, background:"#fff", border:"1.5px solid #bfdbfe", borderRadius:14, padding:"10px 14px" }}>
//             {rxPreview ? <img src={rxPreview} alt="" style={{ width:44, height:44, objectFit:"cover", borderRadius:9, border:"1px solid #dbeafe", flexShrink:0 }}/> : <div style={{ width:44, height:44, borderRadius:9, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>📄</div>}
//             <div style={{ flex:1 }}>
//               <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{rxFile.name}</div>
//               <div style={{ fontSize:11, color:"#9ca3af" }}>روشتة جاهزة للتحليل</div>
//             </div>
//             <button onClick={() => { setRxFile(null); setRxPreview(null); }} style={{ width:26, height:26, borderRadius:"50%", background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
//           </div>
//         )}

//         {/* Input bar */}
//         <div style={{ padding: isMobile ? "10px 6px 14px" : "14px 18px 25px", display:"flex", gap:8, alignItems:"center" }}>
//           <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display:"none" }} onChange={e => onFileSelect(e.target.files[0])}/>
//           <div style={{ flex:1, display:"flex", alignItems:"center", background:"#fff", border:"1.5px solid #dbeafe", borderRadius:26, padding:"0 8px 0 18px", gap:8 }}
//             onFocusCapture={e => e.currentTarget.style.borderColor="#2563eb"}
//             onBlurCapture={e  => e.currentTarget.style.borderColor="#dbeafe"}>
//             <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter" && onSend()}
//               placeholder={rxFile ? "اضغط إرسال لتحليل الروشتة…" : "اكتب سؤالك الدوائي…"}
//               disabled={load || rxProcessing}
//               style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 14 : 15, padding:"13px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
//             <button onClick={() => fileRef.current?.click()} disabled={rxProcessing}
//               style={{ width:34, height:34, flexShrink:0, borderRadius:"50%", border:"none", background:rxFile?"linear-gradient(135deg,#eff6ff,#dbeafe)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:rxProcessing?"not-allowed":"pointer", opacity:rxProcessing?0.4:1 }}>
//               {rxFile ? (
//                 <div style={{ width:22, height:22, borderRadius:6, overflow:"hidden", border:"1.5px solid #93c5fd" }}>
//                   {rxPreview ? <img src={rxPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>📄</div>}
//                 </div>
//               ) : (
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round">
//                   <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
//                 </svg>
//               )}
//             </button>
//           </div>
//           <button onClick={onSend} disabled={sendDisabled}
//             style={{ width:46, height:46, flexShrink:0, borderRadius:"50%", border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", opacity:sendDisabled?0.4:1, boxShadow:"0 3px 12px rgba(37,99,235,.4)" }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Search() {
//   const isMobile = useIsMobile();
//   const [q, setQ]    = useState("");
//   const [res, setR]  = useState(null);
//   const [err, setE]  = useState(null);
//   const [load, setL] = useState(false);
//   const inputRef     = useRef();

//   const go = async () => {
//     if (!q.trim()) return;
//     setL(true); setR(null); setE(null);
//     try { setR(await API.search({ query: q })); }
//     catch(e) { setE(e.message); }
//     finally { setL(false); }
//   };

//   const drugs = res?.results || (Array.isArray(res) ? res : null);

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
//       <div style={{ padding: isMobile ? "16px 12px 14px" : "24px 20px 20px", background:"#fff", borderBottom:"1px solid #e5edff", flexShrink:0 }}>
//         <div style={{ maxWidth:640, margin:"0 auto" }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1e40af", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
//             <span style={{ fontSize:16 }}>🔍</span> البحث في قاعدة الأدوية
//           </div>
//           <div style={{ display:"flex", gap:10 }}>
//             <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"#f5f8ff", border:"1.5px solid #dbeafe", borderRadius:14, padding:"0 16px", transition:"all .18s" }}
//               onFocusCapture={e => { e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.background="#fff"; }}
//               onBlurCapture={e  => { e.currentTarget.style.borderColor="#dbeafe"; e.currentTarget.style.background="#f5f8ff"; }}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
//               <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key==="Enter" && go()}
//                 placeholder="ابحث باسم الدواء أو المادة الفعالة…"
//                 style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 13 : 14, padding:"14px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
//               {q && <button onClick={() => { setQ(""); setR(null); inputRef.current?.focus(); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:18, padding:0, lineHeight:1 }}>×</button>}
//             </div>
//             <button onClick={go} disabled={load||!q.trim()}
//               style={{ padding: isMobile ? "0 16px" : "0 26px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", opacity:load||!q.trim()?0.4:1, boxShadow:"0 3px 12px rgba(37,99,235,.35)", whiteSpace:"nowrap" }}>
//               بحث
//             </button>
//           </div>
//         </div>
//       </div>
//       <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "14px 10px" : "20px", display:"flex", flexDirection:"column", gap:12, background:"#f5f8ff" }}>
//         <div style={{ maxWidth:640, margin:"0 auto", width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
//           {!load && !res && (
//             <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", gap:12 }}>
//               <div style={{ fontSize:52, lineHeight:1 }}>💊</div>
//               <div style={{ fontSize:15, fontWeight:700, color:"#374151" }}>ابحث عن دواء للبدء</div>
//               <div style={{ fontSize:13, color:"#9ca3af" }}>يمكنك البحث بالاسم التجاري أو المادة الفعالة</div>
//             </div>
//           )}
//           {load && <Spinner/>}
//           {err  && <ErrBox msg={err}/>}
//           {drugs && drugs.length===0 && (
//             <div style={{ textAlign:"center", padding:"80px 0" }}>
//               <div style={{ fontSize:44, lineHeight:1, marginBottom:12 }}>🔎</div>
//               <div style={{ fontWeight:700, color:"#374151", marginBottom:6 }}>لا توجد نتائج</div>
//               <div style={{ fontSize:13, color:"#9ca3af" }}>لم يتم العثور على "{q}"</div>
//             </div>
//           )}
//           {drugs && drugs.map((d, i) => <DrugCard key={i} drug={d}/>)}
//           {res && !drugs && <ResBox data={res}/>}
//         </div>
//       </div>
//     </div>
//   );
// }

// const PIPELINE_NODES = [
//   { id:"ocr",     label:"Pass 1\nMasked OCR",  subLabel:"قراءة أولية",           model:"Qwen VL",          icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
//   { id:"db",      label:"DB Anchor\nSearch",   subLabel:"مطابقة DB",             model:"LKE + Fuzzy",      icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg> },
//   { id:"confirm", label:"Pass 2\nConfirm",     subLabel:"تأكيد الأسماء",         model:"Qwen VL",          icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
//   { id:"gpt",     label:"GPT-4o\nAnalysis",   subLabel:"التحليل الكامل",        model:"دلالات + سلامة",   icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
// ];

// const NODE_STYLE = {
//   idle:    { bg:"#f8faff", border:"#e5edff", color:"#9ca3af" },
//   running: { bg:"#eff6ff", border:"#2563eb", color:"#1e40af" },
//   done:    { bg:"#ecfdf5", border:"#10b981", color:"#065f46" },
//   error:   { bg:"#fef2f2", border:"#ef4444", color:"#991b1b" },
// };

// function Rx() {
//   const isMobile = useIsMobile();
//   const [file, setFile]             = useState(null);
//   const [prev, setPrev]             = useState(null);
//   const [dragging, setDragging]     = useState(false);
//   const [nodeStatus, setNodeStatus] = useState({});
//   const [running, setRunning]       = useState(false);
//   const [done, setDone]             = useState(false);
//   const [analysis, setAnalysis]     = useState(null);
//   const [err, setErr]               = useState(null);
//   const resultsRef                  = useRef();

//   useEffect(() => () => { if (prev) URL.revokeObjectURL(prev); }, [prev]);
//   const setNode = (id, status) => setNodeStatus(p => ({ ...p, [id]: status }));

//   const analyze = async (targetFile) => {
//     if (!targetFile || running) return;
//     setRunning(true); setNodeStatus({}); setAnalysis(null); setErr(null); setDone(false);
//     const fd = new FormData(); fd.append("image", targetFile);
//     try {
//       const res = await API.analyzeStreamRaw(fd);
//       const reader = res.body.getReader(), dc = new TextDecoder(); let buffer = "";
//       while (true) {
//         const { done: sd, value } = await reader.read();
//         if (sd) break;
//         buffer += dc.decode(value, { stream:true });
//         const lines = buffer.split("\n"); buffer = lines.pop();
//         for (const line of lines) {
//           if (!line.startsWith("data: ")) continue;
//           const raw = line.slice(6).trim();
//           if (raw === "[DONE]") break;
//           try {
//             const ev = JSON.parse(raw);
//             if (ev.step === "pass1"    && ev.status === "running") setNode("ocr",     "running");
//             if (ev.step === "pass1"    && ev.status === "done")    setNode("ocr",     "done");
//             if (ev.step === "pass2"    && ev.status === "running") setNode("confirm", "running");
//             if (ev.step === "pass2"    && ev.status === "done")    setNode("confirm", "done");
//             if (ev.step === "db"       && ev.status === "running") setNode("db",      "running");
//             if (ev.step === "db"       && ev.status === "done")    setNode("db",      "done");
//             if (ev.step === "analysis" && ev.status === "running") setNode("gpt",     "running");
//             if (ev.step === "analysis" && ev.status === "done")    setNode("gpt",     "done");
//             if (ev.step === "result" && ev.status === "done" && ev.data) {
//               const raw2 = ev.data;
//               let analysisObj;
//               if (raw2.analysis?.success !== false) {
//                 analysisObj = raw2.analysis;
//               } else {
//                 const meds = (raw2.db_matching?.details || []).map(d => ({
//                   corrected_name: d.confirmed, arabic_name: d.ocr, is_safe: true, db_details: {}, warnings: [],
//                 }));
//                 analysisObj = { medications: meds, interactions: [], summary_ar: `تم التعرف على ${meds.length} أدوية من الروشتة.`, overall_risk_level: "moderate_risk" };
//               }
//               setAnalysis(analysisObj);
//             }
//           } catch {}
//         }
//       }
//       setNodeStatus(p => { const n={...p}; PIPELINE_NODES.forEach(nd => { if(n[nd.id]==="running") n[nd.id]="done"; }); return n; });
//       setDone(true);
//       setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth" }), 200);
//     } catch(e) { setErr(e.message); setDone(true); }
//     finally { setRunning(false); }
//   };

//   const onFile = (f) => {
//     if (!f) return;
//     setFile(f); setPrev(URL.createObjectURL(f));
//     setNodeStatus({}); setAnalysis(null); setErr(null); setDone(false);
//     analyze(f);
//   };

//   const reset = () => {
//     setFile(null); setPrev(null); setNodeStatus({}); setAnalysis(null);
//     setErr(null); setDone(false); setRunning(false);
//   };

//   return (
//     <>
//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} @keyframes pulseDot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
//       <div style={{ flex:1, overflowY:"auto", background:"#f1f5f9", padding: isMobile ? "16px 10px" : "40px 24px" }}>
//         <div style={{ maxWidth:980, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>

//           {/* على الموبايل: فوق بعض — على الديسك توب: جنب بعض */}
//           <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:20, alignItems:"flex-start" }}>

//             {/* Upload box */}
//             <div style={{ flex: isMobile ? "unset" : "0 0 260px", width: isMobile ? "100%" : undefined }}>
//               <label
//                 onDragOver={e => { e.preventDefault(); setDragging(true); }}
//                 onDragLeave={() => setDragging(false)}
//                 onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) onFile(f); }}
//                 style={{ display:"flex", alignItems:"center", justifyContent:"center", height: isMobile ? 200 : 260, border:`2px dashed ${dragging?"#2563eb":"#bfdbfe"}`, borderRadius:20, cursor:"pointer", background:dragging?"#eff6ff":"#fff", overflow:"hidden", transition:"all .22s", boxShadow:dragging?"0 0 0 4px rgba(37,99,235,.1)":"0 2px 10px rgba(37,99,235,.07)" }}>
//                 <input type="file" accept="image/*" onChange={e => onFile(e.target.files[0])} style={{ display:"none" }}/>
//                 {prev ? (
//                   <div style={{ width:"100%", height:"100%", position:"relative" }}>
//                     <img src={prev} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
//                     <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", background:"rgba(15,23,42,.65)", backdropFilter:"blur(10px)", color:"#fff", fontSize:11, padding:"5px 14px", borderRadius:22, whiteSpace:"nowrap" }}>📷 اضغط لتغيير الصورة</div>
//                   </div>
//                 ) : (
//                   <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:28, textAlign:"center" }}>
//                     <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
//                     </div>
//                     <div>
//                       <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginTop:6 }}>ارفع صورة الروشتة</div>
//                       <div style={{ fontSize:12, color:"#6b7280" }}>اسحب وأفلت أو اضغط للاختيار</div>
//                     </div>
//                   </div>
//                 )}
//               </label>
//               {file && (
//                 <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fff", border:"1px solid #dbeafe", borderRadius:12, padding:"10px 14px", marginTop:10 }}>
//                   <div style={{ fontSize:20 }}>📄</div>
//                   <div style={{ flex:1, overflow:"hidden" }}>
//                     <div style={{ fontSize:12, fontWeight:600, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{file.name}</div>
//                     <div style={{ fontSize:11, color:"#9ca3af" }}>{(file.size/1024).toFixed(1)} KB</div>
//                   </div>
//                   {!running && <button onClick={reset} style={{ width:24, height:24, borderRadius:"50%", background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
//                 </div>
//               )}
//             </div>

//             {/* Pipeline */}
//             <div style={{ flex:1, width: isMobile ? "100%" : undefined }}>
//               <div style={{ background:"#fff", border:"1.5px solid #e5edff", borderRadius:20, padding: isMobile ? "16px 14px" : "22px 24px", boxShadow:"0 2px 14px rgba(37,99,235,.07)", minHeight: isMobile ? 180 : 260, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
//                 <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                     <div style={{ width:8, height:8, borderRadius:"50%", background:running?"#2563eb":done?"#10b981":"#d1d5db", animation:running?"pulseDot 1.2s ease infinite":"none" }}/>
//                     <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", letterSpacing:1 }}>Agentic Pipeline</span>
//                   </div>
//                   {done && !err  && <span style={{ fontSize:11, fontWeight:700, color:"#065f46", background:"#ecfdf5", border:"1px solid #6ee7b7", borderRadius:20, padding:"3px 12px" }}>✓ اكتمل</span>}
//                   {running       && <span style={{ fontSize:11, fontWeight:700, color:"#1e40af", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:20, padding:"3px 12px" }}>⟳ يعمل…</span>}
//                   {!running && !done && <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", background:"#f8faff", border:"1px solid #e5edff", borderRadius:20, padding:"3px 12px" }}>— انتظار</span>}
//                 </div>

//                 {/* Pipeline nodes — على الموبايل يكونوا أصغر */}
//                 <div style={{ display:"flex", alignItems:"center", gap:0 }}>
//                   {PIPELINE_NODES.map((node, i) => {
//                     const st = nodeStatus[node.id] || "idle";
//                     const c  = NODE_STYLE[st];
//                     return (
//                       <div key={node.id} style={{ display:"flex", alignItems:"center", flex:1 }}>
//                         {i > 0 && (
//                           <div style={{ flex:"0 0 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                             <svg width="14" height="10" viewBox="0 0 22 12">
//                               <line x1="7" y1="6" x2="22" y2="6" stroke={st!=="idle"?"#2563eb":"#dbeafe"} strokeWidth="1.5"/>
//                               <polyline points="11,2 7,6 11,10" fill="none" stroke={st!=="idle"?"#2563eb":"#dbeafe"} strokeWidth="1.5" strokeLinecap="round"/>
//                             </svg>
//                           </div>
//                         )}
//                         <div style={{ flex:1, background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:12, padding: isMobile ? "10px 4px" : "14px 8px", textAlign:"center", transition:"all .3s", position:"relative", overflow:"hidden" }}>
//                           {st === "running" && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#2563eb 0%,#60a5fa 50%,#2563eb 100%)", backgroundSize:"200%", animation:"shimmer 1.2s linear infinite" }}/>}
//                           <div style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", color:c.color }}>
//                             {node.icon(c.color)}
//                           </div>
//                           {!isMobile && <div style={{ fontSize:11, fontWeight:800, color:c.color, lineHeight:1.3, marginBottom:3, whiteSpace:"pre-line" }}>{node.label}</div>}
//                           {!isMobile && <div style={{ fontSize:9, color:"#9ca3af", background:"#f1f5f9", borderRadius:6, padding:"2px 6px", display:"inline-block", marginBottom:5 }}>{node.model}</div>}
//                           <div style={{ fontSize: isMobile ? 9 : 10, fontWeight:600, color:c.color }}>{node.subLabel}</div>
//                           {st === "done"    && <div style={{ fontSize:12, marginTop:4 }}>✅</div>}
//                           {st === "running" && <div style={{ width:12, height:12, borderRadius:"50%", border:"2px solid #dbeafe", borderTopColor:"#2563eb", animation:"spin .7s linear infinite", margin:"4px auto 0" }}/>}
//                           {st === "error"   && <div style={{ fontSize:12, marginTop:4 }}>❌</div>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {(done || file) && (
//                   <div style={{ display:"flex", gap:10, marginTop:16 }}>
//                     <button onClick={reset}
//                       style={{ padding:"11px 18px", borderRadius:14, border:"1.5px solid #dbeafe", background:"#fff", color:"#1e40af", fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                       ↩ إعادة
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {done && (
//             <div ref={resultsRef} style={{ animation:"fadeUp .35s ease", display:"flex", flexDirection:"column", gap:16 }}>
//               {err && <ErrBox msg={err}/>}
//               {analysis && <RxAnalysisResult analysis={analysis} />}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// const SUGG = ["Augmentin","Panadol","Brufen","Concor","Glucophage","Aspirin"];

// function Alt() {
//   const isMobile = useIsMobile();
//   const [d, setD]    = useState("");
//   const [res, setR]  = useState(null);
//   const [err, setE]  = useState(null);
//   const [load, setL] = useState(false);

//   const go = async () => {
//     if (!d.trim()) return;
//     setL(true); setR(null); setE(null);
//     try { setR(await API.findAlt({ patient_id: getPatientId(), drug_name: d })); }
//     catch(e) { setE(e.message); }
//     finally { setL(false); }
//   };

//   return (
//     <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "14px 10px" : "24px 20px", background:"#f5f8ff" }}>
//       <div style={{ maxWidth:600, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
//         <div style={{ background:"#fff", border:"1.5px solid #e5edff", borderRadius:20, padding: isMobile ? "18px 14px" : "24px", boxShadow:"0 2px 10px rgba(37,99,235,.07)" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
//             <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🔄</div>
//             <div>
//               <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>ابحث عن بديل دوائي</div>
//               <div style={{ fontSize:12, color:"#6b7280", marginTop:1 }}>أدخل اسم الدواء الأصلي للحصول على بدائل مناسبة</div>
//             </div>
//           </div>
//           <div style={{ display:"flex", alignItems:"center", gap:10, background:"#f5f8ff", border:"1.5px solid #dbeafe", borderRadius:12, padding:"0 14px", marginBottom:14 }}
//             onFocusCapture={e => { e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.background="#fff"; }}
//             onBlurCapture={e  => { e.currentTarget.style.borderColor="#dbeafe"; e.currentTarget.style.background="#f5f8ff"; }}>
//             <span style={{ fontSize:16 }}>💊</span>
//             <input value={d} onChange={e => setD(e.target.value)} onKeyDown={e => e.key==="Enter" && go()}
//               placeholder="مثال: Augmentin أو Panadol"
//               style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 13 : 14, padding:"13px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
//             {d && <button onClick={() => { setD(""); setR(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:17, padding:0 }}>×</button>}
//           </div>
//           <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
//             <span style={{ fontSize:11, color:"#9ca3af", marginLeft:2 }}>اختر سريعاً:</span>
//             {SUGG.map(sg => (
//               <button key={sg} onClick={() => setD(sg)}
//                 style={{ fontSize:12, fontWeight:600, color:d===sg?"#fff":"#1e40af", background:d===sg?"linear-gradient(135deg,#1e40af,#2563eb)":"#eff6ff", border:"1px solid", borderColor:d===sg?"transparent":"#bfdbfe", borderRadius:20, padding:"5px 14px", cursor:"pointer" }}>
//                 {sg}
//               </button>
//             ))}
//           </div>
//         </div>

//         <button onClick={go} disabled={load||!d.trim()}
//           style={{ padding:"15px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", opacity:load||!d.trim()?0.38:1, boxShadow:"0 5px 18px rgba(37,99,235,.4)" }}>
//           {load ? "⏳ جارٍ البحث…" : "🔄 ابحث عن البديل"}
//         </button>

//         {load && <Spinner/>}
//         {err  && <ErrBox msg={err}/>}

//         {res && (
//           <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//             {!res.exact_match && res.did_you_mean?.length > 0 && (
//               <div style={{ background:"#fffbeb", border:"1.5px solid #fcd34d", borderRadius:16, padding:"18px 20px", animation:"fadeUp .25s ease" }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
//                   <span style={{ fontSize:18 }}>🤔</span>
//                   <div>
//                     <div style={{ fontSize:14, fontWeight:800, color:"#92400e" }}>هل تقصد؟</div>
//                     <div style={{ fontSize:12, color:"#b45309", marginTop:2 }}>{res.message}</div>
//                   </div>
//                 </div>
//                 <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//                   {res.did_you_mean.map((name, i) => (
//                     <button key={i} onClick={() => { setD(name); setR(null); }}
//                       style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", border:"1.5px solid #fde68a", borderRadius:12, padding:"11px 16px", cursor:"pointer", textAlign:"right" }}>
//                       <span style={{ fontSize:13, fontWeight:600, color:"#1f2937" }}>{name}</span>
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {res.original_drug && <div><div style={{ fontSize:12, fontWeight:700, color:"#6b7280", marginBottom:8 }}>الدواء الأصلي</div><DrugCard drug={res.original_drug}/></div>}
//             {res.alternatives?.length > 0 && <div><div style={{ fontSize:12, fontWeight:700, color:"#059669", marginBottom:8 }}>البدائل المتاحة</div>{res.alternatives.map((alt,i) => <DrugCard key={i} drug={alt}/>)}</div>}
//             {res.alternatives?.length === 0 && res.exact_match && <div style={{ textAlign:"center", padding:"40px 0", color:"#9ca3af" }}>لا توجد بدائل متاحة</div>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Main App ────────────────────────────────────────────────────────────────
// export default function PharmacyApp() {
//   const [screen, setScreen] = useState("home");
//   const isMobile = useIsMobile();

//   const CONTENT = {
//     home:   <Home go={setScreen}/>,
//     chat:   <Chat/>,
//     search: <Search/>,
//     rx:     <Rx/>,
//     alt:    <Alt/>,
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
//         *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
//         body { background:#f5f8ff; color:#0f172a; font-family:'Cairo',sans-serif; direction:rtl; -webkit-font-smoothing:antialiased; }
//         input, textarea, button { font-family:'Cairo',sans-serif; }
//         @keyframes spin      { to { transform:rotate(360deg); } }
//         @keyframes fadeUp    { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes pop       { 0% { opacity:0; transform:scale(.93); } 100% { opacity:1; transform:scale(1); } }
//         @keyframes blink     { 0%,100% { opacity:.2; } 50% { opacity:1; } }
//         @keyframes pulse     { 0%,100% { opacity:.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
//         @keyframes chatBounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-7px);opacity:1} }
//         .app-shell { display:flex; flex-direction:column; height:100vh; overflow:hidden; }

//         /* ── Navbar desktop ── */
//         .navbar { flex-shrink:0; background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6e 60%,#1e40af 100%); padding:0 36px; box-shadow:0 2px 24px rgba(15,31,61,.4); position:relative; z-index:10; }
//         .navbar-inner { display:flex; align-items:center; gap:24px; height:96px; }
//         .nav-brand { display:flex; align-items:center; gap:16px; flex-shrink:0; margin-left:auto; }
//         .nav-photo { width:300px; height:100px; border-radius:18px; overflow:hidden; border:3px solid rgba(255,255,255,.35); flex-shrink:0; box-shadow:0 6px 20px rgba(0,0,0,.35); }
//         .nav-photo img { width:100%; height:100%; object-fit:cover; }
//         .nav-name { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; background:linear-gradient(90deg,#fff,#93c5fd); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.2; white-space:nowrap; }
//         .nav-tabs { display:flex; align-items:center; gap:4px; flex:1; }
//         .nav-tab  { display:flex; align-items:center; gap:7px; padding:10px 18px; border-radius:12px; border:none; background:transparent; color:rgba(255,255,255,.45); font-size:14px; font-weight:600; font-family:'Cairo',sans-serif; cursor:pointer; transition:all .16s; white-space:nowrap; position:relative; }
//         .nav-tab:hover  { background:rgba(255,255,255,.1); color:rgba(255,255,255,.85); }
//         .nav-tab.active { background:rgba(255,255,255,.15); color:#fff; }
//         .nav-tab.active::after { content:''; position:absolute; bottom:-4px; right:14px; left:14px; height:3px; background:#60a5fa; border-radius:3px 3px 0 0; }
//         .nav-tab-icon { font-size:18px; }
//         .nav-tab-login { display:flex; align-items:center; gap:7px; padding:9px 18px; font-size:20px; font-weight:900;  cursor:pointer; transition:all .18s; white-space:nowrap; text-decoration:none; margin-left:6px; }
//         .nav-tab-login:hover { background:rgba(255,255,255,.18); border-color:rgba(255,255,255,.6); }

//         /* ── Bottom nav mobile ── */
//         .bottom-nav { display:none; }

//         @media (max-width: 767px) {
//           .navbar { padding:0 14px; }
//           .navbar-inner { height:64px; gap:10px; }
//           .nav-name { font-size:14px; }
//           .nav-photo { width:40px; height:40px; border-radius:12px; border-width:2px; }
//           .nav-tabs { display:none; }
//           .nav-tab-login { display:none; }

//           /* Bottom navigation bar */
//           .bottom-nav {
//             display:flex;
//             align-items:center;
//             justify-content:space-around;
//             position:fixed;
//             bottom:0; left:0; right:0;
//             height:64px;
//             background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6e 60%,#1e40af 100%);
//             box-shadow:0 -2px 20px rgba(15,31,61,.35);
//             z-index:100;
//             padding:0 4px;
//           }
//           .bottom-tab {
//             display:flex; flex-direction:column; align-items:center; justify-content:center;
//             gap:3px; flex:1; height:100%; border:none; background:transparent;
//             color:rgba(255,255,255,.45); font-size:10px; font-weight:600;
//             font-family:'Cairo',sans-serif; cursor:pointer; transition:all .16s;
//             position:relative; padding:0;
//           }
//           .bottom-tab.active { color:#fff; }
//           .bottom-tab.active::before { content:''; position:absolute; top:0; left:20%; right:20%; height:2.5px; background:#60a5fa; border-radius:0 0 4px 4px; }
//           .bottom-tab-icon { font-size:20px; line-height:1; }
//           .bottom-tab-login {
//             display:flex; flex-direction:column; align-items:center; justify-content:center;
//             gap:3px; flex:1; height:100%; border:none; background:transparent;
//             color:rgba(255,255,255,.7); font-size:10px; font-weight:700;
//             font-family:'Cairo',sans-serif; cursor:pointer; text-decoration:none;
//           }

//           /* content padding bottom so bottom nav doesn't cover it */
//           .content-area { padding-bottom:64px; }
//         }

//         .content-area { flex:1; overflow:hidden; display:flex; flex-direction:column; }
//         .page { flex:1; overflow-y:auto; animation:fadeUp .22s ease; display:flex; flex-direction:column; }
//         ::-webkit-scrollbar { width:4px; }
//         ::-webkit-scrollbar-track { background:transparent; }
//         ::-webkit-scrollbar-thumb { background:#dbeafe; border-radius:8px; }
//         ::-webkit-scrollbar-thumb:hover { background:#93c5fd; }
//       `}</style>

//       <div className="app-shell">
//         {/* ── Navbar (desktop + mobile header) ── */}
//         <nav className="navbar">
//           <div className="navbar-inner">
//             {/* Tabs — مخفية على الموبايل بالـ CSS */}
//             <div className="nav-tabs">
//                {/* زر تسجيل الدخول */}
//               <a href="/register" className="nav-tab-login text-white font-bold">
//              ↪
//               </a>
//               {TABS.map(t => (
//                 <button key={t.id} className={`nav-tab ${screen===t.id?"active":""}`} onClick={() => setScreen(t.id)}>
//                   <span className="nav-tab-icon">{t.icon}</span>
//                   <span>{t.label}</span>
//                 </button>
//               ))}
             
//             </div>

//             {/* Brand */}
//             <div className="nav-brand">
              
//               <div className="nav-photo"><img src={nadaImg} alt="Dr Nada"/></div>
//             </div>
//           </div>
//         </nav>

//         {/* ── Content ── */}
//         <div className="content-area">
//           <div className="page" key={screen}>{CONTENT[screen]}</div>
//         </div>

//         {/* ── Bottom Navigation (mobile only) ── */}
//         <nav className="bottom-nav">
//           {TABS.map(t => (
//             <button key={t.id} className={`bottom-tab ${screen===t.id?"active":""}`} onClick={() => setScreen(t.id)}>
//               <span className="bottom-tab-icon">{t.icon}</span>
//               <span>{t.label}</span>
//             </button>
//           ))}
//           {/* تسجيل الدخول في الـ bottom nav */}
//           <a href="/register" className="bottom-tab-login">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
//               <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
//             </svg>
//             <span>دخول</span>
//           </a>
//         </nav>
//       </div>
//     </>
//   );
// }





import { useState, useRef, useEffect } from "react";
import nadaImg from "../../src/assets/img/pharmacy_logo.png";
import { API } from "../../src/pharmacy/PharmacyApi";

// ─── hook للـ responsive ──────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const getPatientId = () => {
  try {
    const patient = localStorage.getItem("patient");
    if (!patient) return undefined;
    const data = JSON.parse(patient);
    return data?.id || data?.patient_id || undefined;
  } catch { return undefined; }
};

const TABS = [
  { id: "home",   label: "الرئيسية", icon: "🏠" },
  { id: "chat",   label: "المحادثة", icon: "💬" },
  { id: "search", label: "بحث دواء", icon: "🔍" },
  { id: "rx",     label: "الروشتة",  icon: "📋" },
  { id: "alt",    label: "البدائل",  icon: "🔄" },
];

const Spinner = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"52px 0" }}>
    <div style={{ width:36, height:36, border:"3px solid #E0EAFF", borderTopColor:"#1a56db", borderRadius:"50%", animation:"spin .75s linear infinite" }} />
    <span style={{ fontSize:13, color:"#6b7280", fontWeight:500 }}>جارٍ المعالجة…</span>
  </div>
);

const ErrBox = ({ msg }) => (
  <div style={{ display:"flex", gap:12, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:"14px 18px", fontSize:13, color:"#991b1b", lineHeight:1.6 }}>
    <span style={{ fontSize:16 }}>⚠️</span><span>{msg}</span>
  </div>
);

const ResBox = ({ data }) => {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  if (!text) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(26,86,219,.07)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:"linear-gradient(135deg,#eff6ff,#e0eaff)", borderBottom:"1px solid #dbeafe" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", animation:"pulse 2s ease infinite" }} />
        <span style={{ fontSize:12, fontWeight:700, color:"#1a56db", letterSpacing:.5 }}>نتيجة التحليل</span>
      </div>
      <pre style={{ padding:18, fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, lineHeight:1.9, whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#374151", margin:0 }}>{text}</pre>
    </div>
  );
};

const ChatLoadingIndicator = () => (
  <div style={{ display:"flex", gap:10, alignItems:"flex-end", animation:"fadeUp .18s ease", marginBottom:14 }}>
    <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    </div>
    <div style={{ padding:"14px 18px", background:"#f8faff", border:"1px solid #e5edff", borderRadius:"4px 16px 16px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", display:"flex", alignItems:"center", gap:6 }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <span key={i} style={{ width:8, height:8, borderRadius:"50%", background:"linear-gradient(135deg,#1e40af,#2563eb)", display:"inline-block", animation:`chatBounce 1.1s ${delay}s ease-in-out infinite` }}/>
      ))}
    </div>
  </div>
);

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight:800, color:"#0f172a" }}>{p}</strong>
      : p
  );
}

function RxTextRenderer({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, fontFamily:"'Cairo',sans-serif", direction:"rtl" }}>
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} style={{ height:6 }} />;
        if (t.startsWith("### ") || t.startsWith("## ") || t.startsWith("# ")) {
          const heading = t.replace(/^#+\s*\d*\.?\s*/, "").replace(/\*\*/g, "");
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", marginTop:10, background:"linear-gradient(135deg,#1e3a8a11,#2563eb0a)", border:"1px solid #dbeafe", borderRadius:12 }}>
              <div style={{ width:4, height:20, borderRadius:4, background:"linear-gradient(180deg,#1e40af,#2563eb)", flexShrink:0 }} />
              <span style={{ fontSize:14, fontWeight:800, color:"#1e3a8a" }}>{heading}</span>
            </div>
          );
        }
        if (t.includes("⚠️") || /disclaimer|warning|تحذير/i.test(t)) {
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
              <p style={{ fontSize:13, color:"#92400e", fontWeight:600, lineHeight:1.7, margin:0 }}>{t.replace(/⚠️/g, "").replace(/\*\*/g, "").trim()}</p>
            </div>
          );
        }
        if (/contraindic|danger|خطر|ممنوع|خطير/i.test(t)) {
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>🚨</span>
              <p style={{ fontSize:13, color:"#991b1b", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
            </div>
          );
        }
        if (/تفاعل|interaction|تعارض/i.test(t)) {
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>🔗</span>
              <p style={{ fontSize:13, color:"#c2410c", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
            </div>
          );
        }
        if (/recommend|توصي|نصائح|يُنصح|ينصح/i.test(t)) {
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", marginTop:6 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
              <p style={{ fontSize:13, color:"#166534", fontWeight:600, lineHeight:1.7, margin:0 }}>{renderBold(t.replace(/^[-•#]*\s*\d*\.?\s*/, ""))}</p>
            </div>
          );
        }
        if (t.startsWith("- ") || t.startsWith("• ")) {
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"3px 6px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#2563eb", flexShrink:0, marginTop:8 }} />
              <span style={{ fontSize:13.5, color:"#374151", lineHeight:1.75 }}>{renderBold(t.replace(/^[-•]\s*/, ""))}</span>
            </div>
          );
        }
        if (/^\d+[.)\-]\s/.test(t)) {
          const num = t.match(/^\d+/)[0];
          const rest = t.replace(/^\d+[.)\-]\s*/, "");
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"3px 6px" }}>
              <span style={{ minWidth:22, height:22, borderRadius:6, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#1e40af", flexShrink:0 }}>{num}</span>
              <span style={{ fontSize:13.5, color:"#374151", lineHeight:1.75 }}>{renderBold(rest)}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ fontSize:13.5, color:"#374151", lineHeight:1.8, margin:0 }}>{renderBold(t)}</p>
        );
      })}
    </div>
  );
}

const isNotRecommended = (v) =>
  v && /غير موصى|not recommended|لا يُنصح|لا ينصح|contraindicated/i.test(v);

function DrugCard({ drug, reason, dosageNote }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const infoRows = [
    { icon:"🧬", k:"المادة الفعالة",    v:drug.active_ingredient, type:"normal"   },
    { icon:"🏷️", k:"التصنيف",           v:drug.drug_class,        type:"normal"   },
    { icon:"✅", k:"الاستخدامات",        v:drug.indications,       type:"normal"   },
    { icon:"👤", k:"جرعة البالغين",     v:drug.dosage_adults,     type:"normal"   },
    { icon:"🧒", k:"جرعة الأطفال",      v:drug.dosage_children,   type:"children" },
  ].filter(r => r.v);

  const safetyRows = [
    { icon:"⚠️", k:"أعراض جانبية",    v:drug.side_effects_common,  type:"normal"  },
    { icon:"🚨", k:"أعراض خطيرة",     v:drug.side_effects_serious, type:"serious" },
    { icon:"🚫", k:"موانع الاستخدام", v:drug.contraindications,    type:"normal"  },
    { icon:"⚡", k:"تحذيرات هامة",     v:drug.warnings,             type:"warning" },
    { icon:"🤰", k:"في حالة الحمل",   v:drug.pregnancy,            type:"normal"  },
    { icon:"🍼", k:"في حالة الرضاعة", v:drug.breastfeeding,        type:"normal"  },
  ].filter(r => r.v);

  const hasDetails = infoRows.length > 0 || safetyRows.length > 0;

  const renderRow = (r, i) => {
    if (r.type === "serious") return (
      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 12px" }}>
        <span style={{ fontSize:15, flexShrink:0 }}>🚨</span>
        <div><div style={{ fontSize:10, fontWeight:700, color:"#ef4444", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
        <div style={{ fontSize:12.5, color:"#991b1b", lineHeight:1.6, fontWeight:600 }}>{r.v}</div></div>
      </div>
    );
    if (r.type === "warning") return (
      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 12px" }}>
        <span style={{ fontSize:15, flexShrink:0 }}>⚡</span>
        <div><div style={{ fontSize:10, fontWeight:700, color:"#d97706", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
        <div style={{ fontSize:12.5, color:"#92400e", lineHeight:1.6, fontWeight:600 }}>{r.v}</div></div>
      </div>
    );
    if (r.type === "children") {
      const notRec = isNotRecommended(r.v);
      return (
        <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background: notRec ? "#f9fafb" : "transparent", border: notRec ? "1px solid #e5e7eb" : "none", borderRadius:10, padding:"10px 12px", opacity: notRec ? 0.65 : 1 }}>
          <span style={{ fontSize:15, flexShrink:0 }}>{notRec ? "❌" : "🧒"}</span>
          <div><div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
          <div style={{ fontSize:12.5, color: notRec ? "#9ca3af" : "#1f2937", lineHeight:1.6, fontStyle: notRec ? "italic" : "normal" }}>{r.v}</div></div>
        </div>
      );
    }
    return (
      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 12px" }}>
        <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{r.icon}</span>
        <div><div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3 }}>{r.k}</div>
        <div style={{ fontSize:12.5, color:"#1f2937", lineHeight:1.6 }}>{r.v}</div></div>
      </div>
    );
  };

  return (
    <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(26,86,219,.06)", marginBottom:12 }}>
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10, background:"#f8faff", borderBottom:"1px solid #e5edff" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round">
              <path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7"/><circle cx="17" cy="17" r="5"/><path d="M14 17h6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{drug.drug_name}</div>
            {drug.dosage_form && <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{drug.dosage_form}</div>}
          </div>
        </div>
        {reason     && <div style={{ fontSize:13, color:"#166534", lineHeight:1.5 }}><span style={{ fontWeight:800, marginLeft:6 }}>🎯 الاستخدام:</span>{reason}</div>}
        {dosageNote && <div style={{ fontSize:13, color:"#065f46", lineHeight:1.5 }}><span style={{ fontWeight:800, marginLeft:6 }}>💊 الجرعة:</span>{dosageNote}</div>}
        {hasDetails && (
          <button onClick={() => setOpen(o => !o)}
            style={{ marginTop:10, display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:"none", background:"transparent", cursor:"pointer", textAlign:"right", padding:0 }}>
            <span style={{ fontSize:12, color:"#64748b" }}>{open ? "إخفاء التفاصيل" : "عرض التفاصيل"}</span>
            <svg style={{ transform:open?"rotate(180deg)":"none", transition:"transform .22s" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        )}
      </div>
      {open && (
        <div style={{ borderTop:"1px solid #eff6ff", background:"#fff", padding:"16px 20px" }}>
          {/* على الموبايل: عمود واحد — على الديسك توب: عمودين */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"10px 20px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {infoRows.length > 0 && <div style={{ fontSize:10, fontWeight:800, color:"#6b7280", letterSpacing:.8, paddingBottom:4, borderBottom:"1px solid #f1f5f9", marginBottom:2 }}>📋 معلومات عامة</div>}
              {infoRows.map((r, i) => renderRow(r, i))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {safetyRows.length > 0 && <div style={{ fontSize:10, fontWeight:800, color:"#6b7280", letterSpacing:.8, paddingBottom:4, borderBottom:"1px solid #f1f5f9", marginBottom:2 }}>🛡️ السلامة والتحذيرات</div>}
              {safetyRows.map((r, i) => renderRow(r, i))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RxAnalysisResult({ analysis }) {
  const { medications = [], interactions = [], summary_ar, overall_risk_level } = analysis;
  const RISK = {
    low_risk:      { label:"منخفض", color:"#059669", bg:"#ecfdf5", border:"#6ee7b7", icon:"🟢" },
    moderate_risk: { label:"متوسط", color:"#d97706", bg:"#fffbeb", border:"#fcd34d", icon:"🟡" },
    high_risk:     { label:"مرتفع", color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:"🔴" },
  };
  const risk = RISK[overall_risk_level] ?? RISK.moderate_risk;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14  }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a5a,#2463ab)", borderRadius:20, padding:"20px 24px", color:"#fff", boxShadow:"0 4px 20px rgba(37,99,235,.35)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>📋</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800 }}>نتيجة تحليل الروشتة</div>
            <div style={{ fontSize:12, opacity:.7, marginTop:2 }}>{medications.length} أدوية تم تحليلها</div>
          </div>
        </div>
        {summary_ar && (
          <div style={{ fontSize:13.5, lineHeight:1.85, background:"rgba(255,255,255,.1)", borderRadius:12, padding:"12px 16px", marginBottom:12 }}>
            {summary_ar}
          </div>
        )}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:risk.bg, border:`1.5px solid ${risk.border}`, borderRadius:10, padding:"7px 14px" }}>
          <span style={{ fontSize:16 }}>{risk.icon}</span>
          <span style={{ fontSize:13, fontWeight:700, color:risk.color }}>مستوى الخطر: {risk.label}</span>
        </div>
      </div>
      {medications.map((med, i) => (
        <RxMedFullCard key={i} med={med} index={i} />
      ))}
      {interactions?.length > 0 && (
        <div style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:16, padding:"18px 20px" }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#c2410c", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <span>🔗</span> تفاعلات دوائية محتملة
          </div>
          {interactions.map((inter, i) => (
            <div key={i} style={{ fontSize:13, color:"#7c2d12", lineHeight:1.75, padding:"10px 0", borderBottom:i<interactions.length-1?"1px solid #fed7aa":"none" }}>
              {inter.drugs_involved && (
                <div style={{ fontWeight:800, color:"#c2410c", marginBottom:4 }}>{inter.drugs_involved.join(" + ")}</div>
              )}
              {inter.description_ar || inter.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RxMedFullCard({ med, index }) {
  const [open, setOpen] = useState(false);
  const db = med.db_details || {};

  const safeRows = [
    { icon:"⚠️", label:"أعراض جانبية شائعة", value:db.side_effects_common },
    { icon:"🚨", label:"أعراض خطيرة",         value:db.side_effects_serious },
    { icon:"🚫", label:"موانع الاستخدام",      value:db.contraindications },
    { icon:"⚡", label:"تحذيرات",              value:db.warnings },
    { icon:"🤰", label:"الحمل",                value:db.pregnancy },
    { icon:"🍼", label:"الرضاعة",              value:db.breastfeeding },
    { icon:"✅", label:"الاستخدامات",           value:db.indications },
    { icon:"👤", label:"جرعة البالغين",         value:db.dosage_adults },
    { icon:"🧒", label:"جرعة الأطفال",          value:db.dosage_children },
  ].filter(r => r.value);

  return (
    <div style={{ background:"#fff", border:"1px solid #e5edff", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 14px rgba(26,86,219,.07)" }}>
      <div style={{ background:"linear-gradient(135deg,#f8faff,#eff6ff)", padding:"18px 20px", borderBottom:"1px solid #e5edff" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>💊</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>{med.corrected_name}</div>
            <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{med.arabic_name} {db.active_ingredient ? `· ${db.active_ingredient}` : ""}</div>
            {db.drug_class && (
              <div style={{ fontSize:11, color:"#2563eb", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:20, padding:"3px 10px", display:"inline-block", marginTop:6, fontWeight:600 }}>
                {db.drug_class}
              </div>
            )}
          </div>
          <div>
            {med.is_safe
              ? <span style={{ fontSize:11, fontWeight:700, color:"#059669", background:"#ecfdf5", border:"1px solid #6ee7b7", borderRadius:20, padding:"3px 10px" }}>✓ آمن</span>
              : <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:20, padding:"3px 10px" }}>⚠️ تحقق</span>
            }
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
          {med.dosage && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #bfdbfe", borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontSize:13 }}>💊</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#1e40af" }}>الجرعة: {med.dosage}</span>
            </div>
          )}
          {med.frequency && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontSize:13 }}>🕐</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#065f46" }}>{med.frequency}</span>
            </div>
          )}
          {med.route && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #e9d5ff", borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontSize:13 }}>🩺</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#6d28d9" }}>{med.route}</span>
            </div>
          )}
          {med.duration && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #fed7aa", borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontSize:13 }}>⏱️</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#c2410c" }}>{med.duration}</span>
            </div>
          )}
        </div>
        {med.description_ar && (
          <div style={{ marginTop:12, fontSize:13, color:"#374151", lineHeight:1.75, background:"#fff", borderRadius:10, padding:"10px 14px", border:"1px solid #e5edff" }}>
            {med.description_ar}
          </div>
        )}
        {med.warnings?.length > 0 && (
          <div style={{ marginTop:10, display:"flex", gap:8, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"8px 12px" }}>
            <span>⚠️</span>
            <span style={{ fontSize:12, color:"#92400e", lineHeight:1.6 }}>{med.warnings.join(" · ")}</span>
          </div>
        )}
        {safeRows.length > 0 && (
          <button onClick={() => setOpen(o => !o)}
            style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:"1px solid #dbeafe", background:"#fff", borderRadius:10, padding:"8px 14px", cursor:"pointer" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#1e40af" }}>{open ? "إخفاء التفاصيل الكاملة" : "عرض التفاصيل الكاملة"}</span>
            <svg style={{ transform:open?"rotate(180deg)":"none", transition:"transform .22s" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        )}
      </div>
      {open && (
        <div>
          {safeRows.map((r, i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"12px 20px", borderBottom:i<safeRows.length-1?"1px solid #f1f5f9":"none", background:i%2===0?"#fff":"#fafcff", alignItems:"flex-start" }}>
              <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{r.icon}</span>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:.6, marginBottom:3, textTransform:"uppercase" }}>{r.label}</div>
                <div style={{ fontSize:13, color:"#1f2937", lineHeight:1.7 }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Home({ go }) {
  const isMobile = useIsMobile();
  const cards = [
    { id:"chat",   icon:"💬", label:"صيدلى ذكى",       sub:"اسأل عن أي دواء أو أعراض — أو ارفع روشتة",   accent:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
    { id:"search", icon:"🔍", label:"بحث الأدوية",      sub:"ابحث بالاسم التجاري أو المادة الفعالة",       accent:"#0284c7", bg:"#e0f2fe", border:"#7dd3fc" },
    { id:"rx",     icon:"📋", label:"تحليل الروشتة",    sub:"ارفع الروشتة وحللها بالذكاء الاصطناعي",       accent:"#7c3aed", bg:"#f5f3ff", border:"#c4b5fd" },
    { id:"alt",    icon:"🔄", label:"البدائل الدوائية", sub:"ابحث عن بديل مناسب لأي دواء",                 accent:"#059669", bg:"#ecfdf5", border:"#6ee7b7" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "16px" : "24px 28px", animation:"fadeUp .3s ease" }}>
      <div style={{
        display:"grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 12 : 16,
        width:"100%",
        maxWidth:900,
      }}>
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => go(c.id)}
            style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:20, padding: isMobile ? "18px 16px" : "28px 24px", display:"flex", alignItems:"center", gap: isMobile ? 14 : 20, cursor:"pointer", textAlign:"right", animation:`pop .3s ease ${i*.07}s both`, transition:"all .2s", boxShadow:"0 1px 6px rgba(0,0,0,.06)", position:"relative", overflow:"hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=c.accent; e.currentTarget.style.boxShadow=`0 8px 28px ${c.accent}22`; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.06)"; e.currentTarget.style.transform="none"; }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${c.accent},${c.accent}88)`, borderRadius:"20px 20px 0 0" }} />
            <div style={{ width: isMobile ? 46 : 56, height: isMobile ? 46 : 56, borderRadius:16, background:c.bg, border:`1.5px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 22 : 26, flexShrink:0 }}>{c.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize: isMobile ? 15 : 18, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{c.label}</div>
              <div style={{ fontSize: isMobile ? 11.5 : 12.5, color:"#64748b", lineHeight:1.6, marginBottom: isMobile ? 8 : 12 }}>{c.sub}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:c.accent }}>
                ابدأ الآن
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const PIPELINE_STEPS = [
  { id:"ocr" }, { id:"confirm" }, { id:"db" }, { id:"analysis" },
];

function AgenticPipeline({ activeStep, imgPreview }) {
  const steps = ["بقرأ الروشتة وبحدد النص","بتحقق من أسماء الأدوية","ببحث في قاعدة البيانات","بحلل الروشتة وبجهز النتيجة"];
  const done   = steps.slice(0, activeStep).join(" · ");
  const active = activeStep < steps.length ? steps[activeStep] : null;
  return (
    <div style={{ display:"flex", gap:10, alignItems:"flex-start", animation:"fadeUp .2s ease", marginBottom:4 }}>
      <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </div>
      <div style={{ background:"#f8faff", border:"1px solid #e5edff", borderRadius:"4px 16px 16px 16px", padding:"12px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", maxWidth:"72%" }}>
        {imgPreview && <img src={imgPreview} alt="rx" style={{ width:70, borderRadius:8, border:"1px solid #dbeafe", display:"block", marginBottom:10 }}/>}
        <div style={{ fontSize:13, color:"#64748b", lineHeight:1.8 }}>
          {done && <span style={{ color:"#10b981" }}>✓ {done}</span>}
          {done && active && <span style={{ color:"#cbd5e1" }}> · </span>}
          {active && <span style={{ color:"#1e3a8a", fontWeight:600 }}>{active}<span style={{ animation:"blink 1s ease infinite" }}>…</span></span>}
          {!active && <span style={{ color:"#10b981", marginRight:6 }}>✓ اكتمل التحليل</span>}
        </div>
      </div>
    </div>
  );
}

const QUICK = [
  { label:"صداع شديد",    icon:"🤕", text:"عندي صداع شديد، إيه الأدوية المناسبة؟" },
  { label:"ألم في البطن", icon:"🤢", text:"بطني بتوجعني، ماذا أفعل؟" },
  { label:"كحة وزكام",    icon:"🤧", text:"عندي كحة وزكام، ما التوصية الدوائية؟" },
  { label:"ألم مفاصل",    icon:"🦴", text:"عندي ألم في مفاصلي، ما المناسب لي؟" },
  { label:"حساسية وحكة",  icon:"☢",  text:"أعاني من حساسية وحكة في الجلد، ما الحل؟" },
  { label:"حموضة وحرقان", icon:"🔥", text:"عندي حموضة وحرقان في المعدة، ما الدواء؟" },
  { label:"ألم أسنان",    icon:"🦷", text:"عندي ألم أسنان شديد، ما المسكن المناسب؟" },
  { label:"قيء ومغص",     icon:"😣", text:"أعاني من قيء ومغص، ما التوصية؟" },
];

function Chat() {
  const isMobile = useIsMobile();
  const [msgs, setMsgs]             = useState([]);
  const [recs, setRecs]             = useState([]);
  const [inp, setInp]               = useState("");
  const [load, setLoad]             = useState(false);
  const [started, setStarted]       = useState(false);
  const [rxFile, setRxFile]         = useState(null);
  const [rxPreview, setRxPreview]   = useState(null);
  const [rxProcessing, setRxProc]   = useState(false);
  const [rxActiveStep, setRxStep]   = useState(0);
  const [showPipeline, setShowPipe] = useState(false);
  const [rxImgSnap, setRxImgSnap]   = useState(null);
  const endRef      = useRef();
  const fileRef     = useRef();
  const rxResultRef = useRef("");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, recs, load, rxProcessing]);
  useEffect(() => () => { if (rxPreview) URL.revokeObjectURL(rxPreview); }, [rxPreview]);

  const onFileSelect = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") return;
    setRxFile(f);
    setRxPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  const send = async (text) => {
    if (!text.trim() || load) return;
    setStarted(true); setRecs([]);
    const next = [...msgs, { role:"user", content:text }];
    setMsgs(next); setInp(""); setLoad(true);
    try {
      const res = await API.chat({ patient_id: getPatientId() ?? 1, messages: next.slice(-12).map(m => ({ role:m.role, content:m.content })) });
      const rd = res.body.getReader(), dc = new TextDecoder(); let txt = "";
      setMsgs(m => [...m, { role:"assistant", content:"" }]);
      while (true) {
        const { done, value } = await rd.read();
        if (done) break;
        for (const line of dc.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const p = JSON.parse(raw);
            if (p.t === "c" && p.d) { txt += p.d; setMsgs(m => { const u=[...m]; u[u.length-1]={role:"assistant",content:txt}; return u; }); }
            if (p.t === "done" && p.recommendations) setRecs(p.recommendations);
          } catch {}
        }
      }
    } catch(e) { setMsgs(m => [...m, { role:"assistant", content:"⚠️ حدث خطأ: "+e.message }]); }
    finally { setLoad(false); }
  };

  const sendRx = async () => {
    if (!rxFile || rxProcessing) return;
    rxResultRef.current = "";
    setStarted(true); setRxProc(true); setRxStep(0); setShowPipe(true);
    setRxImgSnap(rxPreview);
    setMsgs(m => [...m, { role:"user", content:"📋 تحليل روشتة طبية", isRx:true, rxPreview }]);
    setRxFile(null); setRxPreview(null);
    const fd = new FormData(); fd.append("image", rxFile);
    try {
      await API.analyzeStream(fd, (s) => setRxStep(s), (c) => { rxResultRef.current = c; });
      setRxStep(PIPELINE_STEPS.length);
    } catch(e) {
      setMsgs(m => [...m, { role:"assistant", content:"⚠️ حدث خطأ أثناء تحليل الروشتة: "+e.message }]);
    } finally {
      setRxProc(false); setShowPipe(false);
      if (rxResultRef.current) setMsgs(m => [...m, { role:"assistant", isRxResult:true, content: rxResultRef.current }]);
    }
  };

  const onSend = () => rxFile && !rxProcessing ? sendRx() : send(inp);
  const sendDisabled = load || rxProcessing || (!inp.trim() && !rxFile);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#f1f5f9", padding: isMobile ? "10px 10px 0" : "20px 24px" }}>
      <style>{`@keyframes chatBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      <div style={{ display:"flex", flexDirection:"column", flex:1, maxWidth:860, width:"100%", margin:"0 auto" }}>

        {!started && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding: isMobile ? "16px 12px" : "28px 24px", gap:10, animation:"fadeUp .3s ease" }}>
            <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4, boxShadow:"0 4px 20px rgba(37,99,235,.12)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight:800, color:"#0f172a" }}>كيف يمكنني مساعدتك؟</div>
            {/* على الموبايل: 2 columns — على الديسك توب: 4 columns */}
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap:10, width:"100%", maxWidth:700, marginTop:16 }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => send(q.text)}
                  style={{ display:"flex", alignItems:"center", gap: isMobile ? 8 : 11, background:"#f8faff", border:"1.5px solid #e5edff", borderRadius:14, padding: isMobile ? "10px 10px" : "13px 15px", textAlign:"right", cursor:"pointer", transition:"all .18s" }}>
                  <div style={{ width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? 16 : 18, flexShrink:0 }}>{q.icon}</div>
                  <span style={{ fontSize: isMobile ? 11.5 : 13, fontWeight:600, color:"#1f2937" }}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {started && (
          <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "12px 8px" : "24px 20px", display:"flex", flexDirection:"column", gap:14 }}>
            {msgs.map((m, i) => (
              <div key={i}>
                {m.role === "user" && (
                  <div style={{ display:"flex", gap:10, alignItems:"flex-end", flexDirection:"row-reverse", animation:"fadeUp .18s ease" }}>
                    {m.isRx ? (
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, maxWidth:"85%" }}>
                        {m.rxPreview && <img src={m.rxPreview} alt="rx" style={{ maxWidth:140, borderRadius:12, border:"2px solid #bfdbfe", boxShadow:"0 2px 10px rgba(37,99,235,.15)" }}/>}
                        <div style={{ padding:"10px 16px", fontSize:13, background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", borderRadius:"16px 4px 16px 16px" }}>📋 تحليل روشتة طبية</div>
                      </div>
                    ) : (
                      <div style={{ padding:"12px 16px", fontSize: isMobile ? 13 : 14, lineHeight:1.75, maxWidth:"85%", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", borderRadius:"16px 4px 16px 16px" }}>{m.content}</div>
                    )}
                  </div>
                )}
                {m.role === "assistant" && m.isRxResult && (
                  <div style={{ display:"flex", gap:8, alignItems:"flex-start", animation:"fadeUp .18s ease" }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      {(() => {
                        try { const parsed = JSON.parse(m.content); return <RxAnalysisResult analysis={parsed} />; }
                        catch { return <RxTextRenderer text={m.content} />; }
                      })()}
                    </div>
                  </div>
                )}
                {m.role === "assistant" && !m.isRxResult && (
                  <div style={{ display:"flex", gap:8, alignItems:"flex-end", animation:"fadeUp .18s ease" }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                    <div style={{ padding:"12px 16px", fontSize: isMobile ? 13 : 14, lineHeight:1.75, maxWidth:"85%", background:"#fff", color:"#1f2937", borderRadius:"4px 16px 16px 16px", boxShadow:"0 1px 6px rgba(0,0,0,.05)", border:"1px solid #e5edff" }}>{m.content}</div>
                  </div>
                )}
              </div>
            ))}
            {showPipeline && <AgenticPipeline activeStep={rxActiveStep} imgPreview={rxImgSnap} />}
            {load && <ChatLoadingIndicator />}
            {recs.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:6, animation:"fadeUp .3s ease" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"linear-gradient(135deg,#ecfdf5,#d1fae5)", border:"1px solid #6ee7b7", borderRadius:12 }}>
                  <span style={{ fontSize:16 }}>💊</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#065f46" }}>التوصيات الدوائية المقترحة:</span>
                </div>
                {recs.map((d, i) => <DrugCard key={i} drug={d.details||d} reason={d.reason} dosageNote={d.dosage_note}/>)}
              </div>
            )}
            <div ref={endRef}/>
          </div>
        )}

        {rxFile && !rxProcessing && (
          <div style={{ margin:"0 0 8px 0", display:"flex", alignItems:"center", gap:10, background:"#fff", border:"1.5px solid #bfdbfe", borderRadius:14, padding:"10px 14px" }}>
            {rxPreview ? <img src={rxPreview} alt="" style={{ width:44, height:44, objectFit:"cover", borderRadius:9, border:"1px solid #dbeafe", flexShrink:0 }}/> : <div style={{ width:44, height:44, borderRadius:9, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>📄</div>}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{rxFile.name}</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>روشتة جاهزة للتحليل</div>
            </div>
            <button onClick={() => { setRxFile(null); setRxPreview(null); }} style={{ width:26, height:26, borderRadius:"50%", background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding: isMobile ? "10px 6px 14px" : "14px 18px 25px", display:"flex", gap:8, alignItems:"center" }}>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display:"none" }} onChange={e => onFileSelect(e.target.files[0])}/>
          <div style={{ flex:1, display:"flex", alignItems:"center", background:"#fff", border:"1.5px solid #dbeafe", borderRadius:26, padding:"0 8px 0 18px", gap:8 }}
            onFocusCapture={e => e.currentTarget.style.borderColor="#2563eb"}
            onBlurCapture={e  => e.currentTarget.style.borderColor="#dbeafe"}>
            <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter" && onSend()}
              placeholder={rxFile ? "اضغط إرسال لتحليل الروشتة…" : "اكتب سؤالك الدوائي…"}
              disabled={load || rxProcessing}
              style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 14 : 15, padding:"13px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
            <button onClick={() => fileRef.current?.click()} disabled={rxProcessing}
              style={{ width:34, height:34, flexShrink:0, borderRadius:"50%", border:"none", background:rxFile?"linear-gradient(135deg,#eff6ff,#dbeafe)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:rxProcessing?"not-allowed":"pointer", opacity:rxProcessing?0.4:1 }}>
              {rxFile ? (
                <div style={{ width:22, height:22, borderRadius:6, overflow:"hidden", border:"1.5px solid #93c5fd" }}>
                  {rxPreview ? <img src={rxPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>📄</div>}
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </button>
          </div>
          <button onClick={onSend} disabled={sendDisabled}
            style={{ width:46, height:46, flexShrink:0, borderRadius:"50%", border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", opacity:sendDisabled?0.4:1, boxShadow:"0 3px 12px rgba(37,99,235,.4)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Search() {
  const isMobile = useIsMobile();
  const [q, setQ]    = useState("");
  const [res, setR]  = useState(null);
  const [err, setE]  = useState(null);
  const [load, setL] = useState(false);
  const inputRef     = useRef();

  const go = async () => {
    if (!q.trim()) return;
    setL(true); setR(null); setE(null);
    try { setR(await API.search({ query: q })); }
    catch(e) { setE(e.message); }
    finally { setL(false); }
  };

  const drugs = res?.results || (Array.isArray(res) ? res : null);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding: isMobile ? "16px 12px 14px" : "24px 20px 20px", background:"#fff", borderBottom:"1px solid #e5edff", flexShrink:0 }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1e40af", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>🔍</span> البحث في قاعدة الأدوية
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"#f5f8ff", border:"1.5px solid #dbeafe", borderRadius:14, padding:"0 16px", transition:"all .18s" }}
              onFocusCapture={e => { e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.background="#fff"; }}
              onBlurCapture={e  => { e.currentTarget.style.borderColor="#dbeafe"; e.currentTarget.style.background="#f5f8ff"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key==="Enter" && go()}
                placeholder="ابحث باسم الدواء أو المادة الفعالة…"
                style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 13 : 14, padding:"14px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
              {q && <button onClick={() => { setQ(""); setR(null); inputRef.current?.focus(); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:18, padding:0, lineHeight:1 }}>×</button>}
            </div>
            <button onClick={go} disabled={load||!q.trim()}
              style={{ padding: isMobile ? "0 16px" : "0 26px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", opacity:load||!q.trim()?0.4:1, boxShadow:"0 3px 12px rgba(37,99,235,.35)", whiteSpace:"nowrap" }}>
              بحث
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "14px 10px" : "20px", display:"flex", flexDirection:"column", gap:12, background:"#f5f8ff" }}>
        <div style={{ maxWidth:640, margin:"0 auto", width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
          {!load && !res && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", gap:12 }}>
              <div style={{ fontSize:52, lineHeight:1 }}>💊</div>
              <div style={{ fontSize:15, fontWeight:700, color:"#374151" }}>ابحث عن دواء للبدء</div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>يمكنك البحث بالاسم التجاري أو المادة الفعالة</div>
            </div>
          )}
          {load && <Spinner/>}
          {err  && <ErrBox msg={err}/>}
          {drugs && drugs.length===0 && (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:44, lineHeight:1, marginBottom:12 }}>🔎</div>
              <div style={{ fontWeight:700, color:"#374151", marginBottom:6 }}>لا توجد نتائج</div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>لم يتم العثور على "{q}"</div>
            </div>
          )}
          {drugs && drugs.map((d, i) => <DrugCard key={i} drug={d}/>)}
          {res && !drugs && <ResBox data={res}/>}
        </div>
      </div>
    </div>
  );
}

const PIPELINE_NODES = [
  { id:"ocr",     label:"Pass 1\nMasked OCR",  subLabel:"قراءة أولية",           model:"Qwen VL",          icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  { id:"db",      label:"DB Anchor\nSearch",   subLabel:"مطابقة DB",             model:"LKE + Fuzzy",      icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg> },
  { id:"confirm", label:"Pass 2\nConfirm",     subLabel:"تأكيد الأسماء",         model:"Qwen VL",          icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { id:"gpt",     label:"GPT-4o\nAnalysis",   subLabel:"التحليل الكامل",        model:"دلالات + سلامة",   icon:(c)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
];

const NODE_STYLE = {
  idle:    { bg:"#f8faff", border:"#e5edff", color:"#9ca3af" },
  running: { bg:"#eff6ff", border:"#2563eb", color:"#1e40af" },
  done:    { bg:"#ecfdf5", border:"#10b981", color:"#065f46" },
  error:   { bg:"#fef2f2", border:"#ef4444", color:"#991b1b" },
};

function Rx() {
  const isMobile = useIsMobile();
  const [file, setFile]             = useState(null);
  const [prev, setPrev]             = useState(null);
  const [dragging, setDragging]     = useState(false);
  const [nodeStatus, setNodeStatus] = useState({});
  const [running, setRunning]       = useState(false);
  const [done, setDone]             = useState(false);
  const [analysis, setAnalysis]     = useState(null);
  const [err, setErr]               = useState(null);
  const resultsRef                  = useRef();

  useEffect(() => () => { if (prev) URL.revokeObjectURL(prev); }, [prev]);
  const setNode = (id, status) => setNodeStatus(p => ({ ...p, [id]: status }));

  const analyze = async (targetFile) => {
    if (!targetFile || running) return;
    setRunning(true); setNodeStatus({}); setAnalysis(null); setErr(null); setDone(false);
    const fd = new FormData(); fd.append("image", targetFile);
    try {
      const res = await API.analyzeStreamRaw(fd);
      const reader = res.body.getReader(), dc = new TextDecoder(); let buffer = "";
      while (true) {
        const { done: sd, value } = await reader.read();
        if (sd) break;
        buffer += dc.decode(value, { stream:true });
        const lines = buffer.split("\n"); buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const ev = JSON.parse(raw);
            if (ev.step === "pass1"    && ev.status === "running") setNode("ocr",     "running");
            if (ev.step === "pass1"    && ev.status === "done")    setNode("ocr",     "done");
            if (ev.step === "pass2"    && ev.status === "running") setNode("confirm", "running");
            if (ev.step === "pass2"    && ev.status === "done")    setNode("confirm", "done");
            if (ev.step === "db"       && ev.status === "running") setNode("db",      "running");
            if (ev.step === "db"       && ev.status === "done")    setNode("db",      "done");
            if (ev.step === "analysis" && ev.status === "running") setNode("gpt",     "running");
            if (ev.step === "analysis" && ev.status === "done")    setNode("gpt",     "done");
            if (ev.step === "result" && ev.status === "done" && ev.data) {
              const raw2 = ev.data;
              let analysisObj;
              if (raw2.analysis?.success !== false) {
                analysisObj = raw2.analysis;
              } else {
                const meds = (raw2.db_matching?.details || []).map(d => ({
                  corrected_name: d.confirmed, arabic_name: d.ocr, is_safe: true, db_details: {}, warnings: [],
                }));
                analysisObj = { medications: meds, interactions: [], summary_ar: `تم التعرف على ${meds.length} أدوية من الروشتة.`, overall_risk_level: "moderate_risk" };
              }
              setAnalysis(analysisObj);
            }
          } catch {}
        }
      }
      setNodeStatus(p => { const n={...p}; PIPELINE_NODES.forEach(nd => { if(n[nd.id]==="running") n[nd.id]="done"; }); return n; });
      setDone(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth" }), 200);
    } catch(e) { setErr(e.message); setDone(true); }
    finally { setRunning(false); }
  };

  const onFile = (f) => {
    if (!f) return;
    setFile(f); setPrev(URL.createObjectURL(f));
    setNodeStatus({}); setAnalysis(null); setErr(null); setDone(false);
    analyze(f);
  };

  const reset = () => {
    setFile(null); setPrev(null); setNodeStatus({}); setAnalysis(null);
    setErr(null); setDone(false); setRunning(false);
  };

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} @keyframes pulseDot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
      <div style={{ flex:1, overflowY:"auto", background:"#f1f5f9", padding: isMobile ? "16px 10px" : "40px 24px" }}>
        <div style={{ maxWidth:980, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>

          {/* على الموبايل: فوق بعض — على الديسك توب: جنب بعض */}
          <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:20, alignItems:"flex-start" }}>

            {/* Upload box */}
            <div style={{ flex: isMobile ? "unset" : "0 0 260px", width: isMobile ? "100%" : undefined }}>
              <label
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) onFile(f); }}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", height: isMobile ? 200 : 260, border:`2px dashed ${dragging?"#2563eb":"#bfdbfe"}`, borderRadius:20, cursor:"pointer", background:dragging?"#eff6ff":"#fff", overflow:"hidden", transition:"all .22s", boxShadow:dragging?"0 0 0 4px rgba(37,99,235,.1)":"0 2px 10px rgba(37,99,235,.07)" }}>
                <input type="file" accept="image/*" onChange={e => onFile(e.target.files[0])} style={{ display:"none" }}/>
                {prev ? (
                  <div style={{ width:"100%", height:"100%", position:"relative" }}>
                    <img src={prev} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", background:"rgba(15,23,42,.65)", backdropFilter:"blur(10px)", color:"#fff", fontSize:11, padding:"5px 14px", borderRadius:22, whiteSpace:"nowrap" }}>📷 اضغط لتغيير الصورة</div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:28, textAlign:"center" }}>
                    <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginTop:6 }}>ارفع صورة الروشتة</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>اسحب وأفلت أو اضغط للاختيار</div>
                    </div>
                  </div>
                )}
              </label>
              {file && (
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fff", border:"1px solid #dbeafe", borderRadius:12, padding:"10px 14px", marginTop:10 }}>
                  <div style={{ fontSize:20 }}>📄</div>
                  <div style={{ flex:1, overflow:"hidden" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{file.name}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{(file.size/1024).toFixed(1)} KB</div>
                  </div>
                  {!running && <button onClick={reset} style={{ width:24, height:24, borderRadius:"50%", background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
                </div>
              )}
            </div>

            {/* Pipeline */}
            <div style={{ flex:1, width: isMobile ? "100%" : undefined }}>
              <div style={{ background:"#fff", border:"1.5px solid #e5edff", borderRadius:20, padding: isMobile ? "16px 14px" : "22px 24px", boxShadow:"0 2px 14px rgba(37,99,235,.07)", minHeight: isMobile ? 180 : 260, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:running?"#2563eb":done?"#10b981":"#d1d5db", animation:running?"pulseDot 1.2s ease infinite":"none" }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", letterSpacing:1 }}>Agentic Pipeline</span>
                  </div>
                  {done && !err  && <span style={{ fontSize:11, fontWeight:700, color:"#065f46", background:"#ecfdf5", border:"1px solid #6ee7b7", borderRadius:20, padding:"3px 12px" }}>✓ اكتمل</span>}
                  {running       && <span style={{ fontSize:11, fontWeight:700, color:"#1e40af", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:20, padding:"3px 12px" }}>⟳ يعمل…</span>}
                  {!running && !done && <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", background:"#f8faff", border:"1px solid #e5edff", borderRadius:20, padding:"3px 12px" }}>— انتظار</span>}
                </div>

                {/* Pipeline nodes — على الموبايل يكونوا أصغر */}
                <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                  {PIPELINE_NODES.map((node, i) => {
                    const st = nodeStatus[node.id] || "idle";
                    const c  = NODE_STYLE[st];
                    return (
                      <div key={node.id} style={{ display:"flex", alignItems:"center", flex:1 }}>
                        {i > 0 && (
                          <div style={{ flex:"0 0 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <svg width="14" height="10" viewBox="0 0 22 12">
                              <line x1="7" y1="6" x2="22" y2="6" stroke={st!=="idle"?"#2563eb":"#dbeafe"} strokeWidth="1.5"/>
                              <polyline points="11,2 7,6 11,10" fill="none" stroke={st!=="idle"?"#2563eb":"#dbeafe"} strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                        <div style={{ flex:1, background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:12, padding: isMobile ? "10px 4px" : "14px 8px", textAlign:"center", transition:"all .3s", position:"relative", overflow:"hidden" }}>
                          {st === "running" && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#2563eb 0%,#60a5fa 50%,#2563eb 100%)", backgroundSize:"200%", animation:"shimmer 1.2s linear infinite" }}/>}
                          <div style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", color:c.color }}>
                            {node.icon(c.color)}
                          </div>
                          {!isMobile && <div style={{ fontSize:11, fontWeight:800, color:c.color, lineHeight:1.3, marginBottom:3, whiteSpace:"pre-line" }}>{node.label}</div>}
                          {!isMobile && <div style={{ fontSize:9, color:"#9ca3af", background:"#f1f5f9", borderRadius:6, padding:"2px 6px", display:"inline-block", marginBottom:5 }}>{node.model}</div>}
                          <div style={{ fontSize: isMobile ? 9 : 10, fontWeight:600, color:c.color }}>{node.subLabel}</div>
                          {st === "done"    && <div style={{ fontSize:12, marginTop:4 }}>✅</div>}
                          {st === "running" && <div style={{ width:12, height:12, borderRadius:"50%", border:"2px solid #dbeafe", borderTopColor:"#2563eb", animation:"spin .7s linear infinite", margin:"4px auto 0" }}/>}
                          {st === "error"   && <div style={{ fontSize:12, marginTop:4 }}>❌</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(done || file) && (
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button onClick={reset}
                      style={{ padding:"11px 18px", borderRadius:14, border:"1.5px solid #dbeafe", background:"#fff", color:"#1e40af", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                      ↩ إعادة
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {done && (
            <div ref={resultsRef} style={{ animation:"fadeUp .35s ease", display:"flex", flexDirection:"column", gap:16 }}>
              {err && <ErrBox msg={err}/>}
              {analysis && <RxAnalysisResult analysis={analysis} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const SUGG = ["Augmentin","Panadol","Brufen","Concor","Glucophage","Aspirin"];

function Alt() {
  const isMobile = useIsMobile();
  const [d, setD]    = useState("");
  const [res, setR]  = useState(null);
  const [err, setE]  = useState(null);
  const [load, setL] = useState(false);

  const go = async () => {
    if (!d.trim()) return;
    setL(true); setR(null); setE(null);
    try { setR(await API.findAlt({ patient_id: getPatientId(), drug_name: d })); }
    catch(e) { setE(e.message); }
    finally { setL(false); }
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "14px 10px" : "24px 20px", background:"#f5f8ff" }}>
      <div style={{ maxWidth:600, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:"#fff", border:"1.5px solid #e5edff", borderRadius:20, padding: isMobile ? "18px 14px" : "24px", boxShadow:"0 2px 10px rgba(37,99,235,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#eff6ff,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🔄</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>ابحث عن بديل دوائي</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:1 }}>أدخل اسم الدواء الأصلي للحصول على بدائل مناسبة</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"#f5f8ff", border:"1.5px solid #dbeafe", borderRadius:12, padding:"0 14px", marginBottom:14 }}
            onFocusCapture={e => { e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.background="#fff"; }}
            onBlurCapture={e  => { e.currentTarget.style.borderColor="#dbeafe"; e.currentTarget.style.background="#f5f8ff"; }}>
            <span style={{ fontSize:16 }}>💊</span>
            <input value={d} onChange={e => setD(e.target.value)} onKeyDown={e => e.key==="Enter" && go()}
              placeholder="مثال: Augmentin أو Panadol"
              style={{ flex:1, border:"none", background:"transparent", color:"#0f172a", fontSize: isMobile ? 13 : 14, padding:"13px 0", outline:"none", fontFamily:"'Cairo',sans-serif" }}/>
            {d && <button onClick={() => { setD(""); setR(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:17, padding:0 }}>×</button>}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:11, color:"#9ca3af", marginLeft:2 }}>اختر سريعاً:</span>
            {SUGG.map(sg => (
              <button key={sg} onClick={() => setD(sg)}
                style={{ fontSize:12, fontWeight:600, color:d===sg?"#fff":"#1e40af", background:d===sg?"linear-gradient(135deg,#1e40af,#2563eb)":"#eff6ff", border:"1px solid", borderColor:d===sg?"transparent":"#bfdbfe", borderRadius:20, padding:"5px 14px", cursor:"pointer" }}>
                {sg}
              </button>
            ))}
          </div>
        </div>

        <button onClick={go} disabled={load||!d.trim()}
          style={{ padding:"15px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#1e40af,#2563eb)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", opacity:load||!d.trim()?0.38:1, boxShadow:"0 5px 18px rgba(37,99,235,.4)" }}>
          {load ? "⏳ جارٍ البحث…" : "🔄 ابحث عن البديل"}
        </button>

        {load && <Spinner/>}
        {err  && <ErrBox msg={err}/>}

        {res && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {!res.exact_match && res.did_you_mean?.length > 0 && (
              <div style={{ background:"#fffbeb", border:"1.5px solid #fcd34d", borderRadius:16, padding:"18px 20px", animation:"fadeUp .25s ease" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:18 }}>🤔</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:"#92400e" }}>هل تقصد؟</div>
                    <div style={{ fontSize:12, color:"#b45309", marginTop:2 }}>{res.message}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {res.did_you_mean.map((name, i) => (
                    <button key={i} onClick={() => { setD(name); setR(null); }}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", border:"1.5px solid #fde68a", borderRadius:12, padding:"11px 16px", cursor:"pointer", textAlign:"right" }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#1f2937" }}>{name}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {res.original_drug && <div><div style={{ fontSize:12, fontWeight:700, color:"#6b7280", marginBottom:8 }}>الدواء الأصلي</div><DrugCard drug={res.original_drug}/></div>}
            {res.alternatives?.length > 0 && <div><div style={{ fontSize:12, fontWeight:700, color:"#059669", marginBottom:8 }}>البدائل المتاحة</div>{res.alternatives.map((alt,i) => <DrugCard key={i} drug={alt}/>)}</div>}
            {res.alternatives?.length === 0 && res.exact_match && <div style={{ textAlign:"center", padding:"40px 0", color:"#9ca3af" }}>لا توجد بدائل متاحة</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function PharmacyApp() {
  const [screen, setScreen] = useState("home");
  const isMobile = useIsMobile();

  const CONTENT = {
    home:   <Home go={setScreen}/>,
    chat:   <Chat/>,
    search: <Search/>,
    rx:     <Rx/>,
    alt:    <Alt/>,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#f5f8ff; color:#0f172a; font-family:'Cairo',sans-serif; direction:rtl; -webkit-font-smoothing:antialiased; }
        input, textarea, button { font-family:'Cairo',sans-serif; }
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop       { 0% { opacity:0; transform:scale(.93); } 100% { opacity:1; transform:scale(1); } }
        @keyframes blink     { 0%,100% { opacity:.2; } 50% { opacity:1; } }
        @keyframes pulse     { 0%,100% { opacity:.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
        @keyframes chatBounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-7px);opacity:1} }
        .app-shell { display:flex; flex-direction:column; height:100vh; overflow:hidden; }

        /* ── Navbar desktop ── */
        .navbar { flex-shrink:0; background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6e 60%,#1e40af 100%); padding:0 36px; box-shadow:0 2px 24px rgba(15,31,61,.4); position:relative; z-index:10; }
        .navbar-inner { display:flex; align-items:center; gap:24px; height:96px; }
        .nav-brand { display:flex; align-items:center; gap:16px; flex-shrink:0; margin-left:auto; }
        .nav-photo { width:66px; height:66px; border-radius:18px; overflow:hidden; border:3px solid rgba(255,255,255,.35); flex-shrink:0; box-shadow:0 6px 20px rgba(0,0,0,.35); }
        .nav-photo img { width:100%; height:100%; object-fit:cover; }
        .nav-tabs { display:flex; align-items:center; gap:4px; flex:1; }
        .nav-tab  { display:flex; align-items:center; gap:7px; padding:10px 18px; border-radius:12px; border:none; background:transparent; color:rgba(255,255,255,.45); font-size:14px; font-weight:600; font-family:'Cairo',sans-serif; cursor:pointer; transition:all .16s; white-space:nowrap; position:relative; }
        .nav-tab:hover  { background:rgba(255,255,255,.1); color:rgba(255,255,255,.85); }
        .nav-tab.active { background:rgba(255,255,255,.15); color:#fff; }
        .nav-tab.active::after { content:''; position:absolute; bottom:-4px; right:14px; left:14px; height:3px; background:#60a5fa; border-radius:3px 3px 0 0; }
        .nav-tab-icon { font-size:18px; }
        .nav-tab-login { display:flex; align-items:center; gap:7px; padding:9px 18px; font-size:20px; font-weight:900;  cursor:pointer; transition:all .18s; white-space:nowrap; text-decoration:none; margin-left:6px; }
        .nav-tab-login:hover { background:rgba(255,255,255,.18); border-color:rgba(255,255,255,.6); }

        /* ── Bottom nav mobile ── */
        .bottom-nav { display:none; }

        @media (max-width: 767px) {
          .navbar { padding:0 14px; }
          .navbar-inner { height:64px; gap:10px; }
          .nav-name { font-size:14px; }
          .nav-photo { width:40px; height:40px; border-radius:12px; border-width:2px; }
          .nav-tabs { display:none; }
          .nav-tab-login { display:none; }

          /* Bottom navigation bar */
          .bottom-nav {
            display:flex;
            align-items:center;
            justify-content:space-around;
            position:fixed;
            bottom:0; left:0; right:0;
            height:64px;
            background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6e 60%,#1e40af 100%);
            box-shadow:0 -2px 20px rgba(15,31,61,.35);
            z-index:100;
            padding:0 4px;
          }
          .bottom-tab {
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            gap:3px; flex:1; height:100%; border:none; background:transparent;
            color:rgba(255,255,255,.45); font-size:10px; font-weight:600;
            font-family:'Cairo',sans-serif; cursor:pointer; transition:all .16s;
            position:relative; padding:0;
          }
          .bottom-tab.active { color:#fff; }
          .bottom-tab.active::before { content:''; position:absolute; top:0; left:20%; right:20%; height:2.5px; background:#60a5fa; border-radius:0 0 4px 4px; }
          .bottom-tab-icon { font-size:20px; line-height:1; }
          .bottom-tab-login {
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            gap:3px; flex:1; height:100%; border:none; background:transparent;
            color:rgba(255,255,255,.7); font-size:10px; font-weight:700;
            font-family:'Cairo',sans-serif; cursor:pointer; text-decoration:none;
          }

          /* content padding bottom so bottom nav doesn't cover it */
          .content-area { padding-bottom:64px; }
        }

        .content-area { flex:1; overflow:hidden; display:flex; flex-direction:column; }
        .page { flex:1; overflow-y:auto; animation:fadeUp .22s ease; display:flex; flex-direction:column; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#dbeafe; border-radius:8px; }
        ::-webkit-scrollbar-thumb:hover { background:#93c5fd; }
      `}</style>

      <div className="app-shell">
        {/* ── Navbar (desktop + mobile header) ── */}
        <nav className="navbar">
          <div className="navbar-inner">
            {/* Tabs — مخفية على الموبايل بالـ CSS */}
            <div className="nav-tabs">
               {/* زر تسجيل الدخول */}
              <a href="/register" className="nav-tab-login text-white font-bold">
             ↪
              </a>
              {TABS.map(t => (
                <button key={t.id} className={`nav-tab ${screen===t.id?"active":""}`} onClick={() => setScreen(t.id)}>
                  <span className="nav-tab-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
             
            </div>

            {/* Brand */}
            <div className="nav-brand">
              <img src={nadaImg} alt="ElMona Pharmacy" style={{ height:"72px", width:"auto", objectFit:"contain" }} />
            </div>
          </div>
        </nav>

        {/* ── Content ── */}
        <div className="content-area">
          <div className="page" key={screen}>{CONTENT[screen]}</div>
        </div>

        {/* ── Bottom Navigation (mobile only) ── */}
        <nav className="bottom-nav">
          {TABS.map(t => (
            <button key={t.id} className={`bottom-tab ${screen===t.id?"active":""}`} onClick={() => setScreen(t.id)}>
              <span className="bottom-tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
          {/* تسجيل الدخول في الـ bottom nav */}
          <a href="/register" className="bottom-tab-login">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span>دخول</span>
          </a>
        </nav>
      </div>
    </>
  );
}

