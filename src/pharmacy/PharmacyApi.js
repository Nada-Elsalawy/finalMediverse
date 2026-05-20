



const BASE_URL = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";
const J = { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" };
const F = { "ngrok-skip-browser-warning": "true" };

export const API = {
  analyzeStream: async (fd, onStep, onChunk) => {
    const res = await fetch(`${BASE_URL}/pharmacy/prescription/analyze-stream`, { method:"POST", headers:F, body:fd });
    const rd = res.body.getReader(), dc = new TextDecoder();
    const stepMap = { pass1:0, db:1, pass2:2, analysis:3 };
    let buffer = "";

    const processLine = (line) => {
      if (!line.startsWith("data: ")) return;
      try {
        const ev = JSON.parse(line.slice(6).trim());

        if (ev.status === "running" && stepMap[ev.step] !== undefined)
          onStep(stepMap[ev.step]);

        if (ev.step === "result" && ev.status === "done" && ev.data) {
          onStep(4);
          const raw = ev.data;

          let analysisObj;

          if (raw.analysis?.success !== false) {
            analysisObj = raw.analysis;
          } else {
            const meds = (raw.db_matching?.details || []).map(d => ({
              corrected_name: d.confirmed,
              arabic_name: d.ocr,
              is_safe: true,
              db_details: {},
              warnings: [],
            }));
            analysisObj = {
              medications: meds,
              interactions: [],
              summary_ar: `تم التعرف على ${meds.length} أدوية من الروشتة.`,
              overall_risk_level: "moderate_risk",
            };
          }

          onChunk(JSON.stringify(analysisObj));
        }
      } catch {}
    };

    while (true) {
      const { done, value } = await rd.read();
      if (done) {
        if (buffer.trim()) processLine(buffer.trim());
        break;
      }
      buffer += dc.decode(value);
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) processLine(line);
    }
  },

  analyzeStreamRaw: (fd) => fetch(`${BASE_URL}/pharmacy/prescription/analyze-stream`, { method:"POST", headers:F, body:fd }),
  findAlt: (b) => fetch(`${BASE_URL}/pharmacy/alternative`,  { method:"POST", headers:J, body:JSON.stringify(b) }).then(r => r.json()),
  search:  (b) => fetch(`${BASE_URL}/pharmacy/drug/search`,  { method:"POST", headers:J, body:JSON.stringify(b) }).then(r => r.json()),
  chat:    (b) => fetch(`${BASE_URL}/pharmacy/chat`,         { method:"POST", headers:J, body:JSON.stringify(b) }),
};