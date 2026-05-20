// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Activity, ChevronDown } from 'lucide-react';
// import { getDashboardOverview, getAllDoctors, getLiveQueue } from '../Managment/ManagmentApi/MangServices';

// // ─────────────────────────────────────────────────────────────────────────────
// const MediVerseDashboard = () => {
//   const [loading, setLoading]       = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [doctors, setDoctors]       = useState([]);
//   const [liveQueue, setLiveQueue]   = useState([]);
//   const [showAllQ, setShowAllQ]     = useState(false);
//   const [flow, setFlow]             = useState([]);
//   const [diseases, setDiseases]     = useState([]);
//   const [revenue, setRevenue]       = useState(null);
//   const [error, setError]           = useState(null);

//   // Chart.js canvas refs
//   const pieRef  = useRef(null); const pieC  = useRef(null);
//   const lineRef = useRef(null); const lineC = useRef(null);
//   const barRef  = useRef(null); const barC  = useRef(null);

//   // ── Fetch ─────────────────────────────────────────────────────────────────
//   const fetchAll = useCallback(async () => {
//     try {
//       setError(null);
//       const token = localStorage.getItem('access_token');
//       const h = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       };
//       const base = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev/manager';
//       const g = (p) => fetch(`${base}${p}`, { headers: h }).then(r => r.json());

//       const [dashRes, docsRes, queueRes, flowRes, disRes, revRes] = await Promise.all([
//         getDashboardOverview(),
//         getAllDoctors(),
//         getLiveQueue(),
//         g('/reports/patient-flow').catch(() => ({ flow: [] })),
//         g('/reports/common-diseases').catch(() => ({ diseases: [] })),
//         g('/reports/today-revenue').catch(() => ({ total_revenue: 0 })),
//       ]);

//       setDashboardData(dashRes);
//       setFlow(flowRes.flow || []);
//       setDiseases(disRes.diseases || []);
//       setRevenue(revRes);

//       let arr = [];
//       if (Array.isArray(docsRes))               arr = docsRes;
//       else if (Array.isArray(docsRes?.data))    arr = docsRes.data;
//       else if (Array.isArray(docsRes?.doctors)) arr = docsRes.doctors;
//       setDoctors(arr);

//       const qItems = queueRes?.items || queueRes?.queue || (Array.isArray(queueRes) ? queueRes : []);
//       setLiveQueue(qItems);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load dashboard data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll();
//     const iv = setInterval(fetchAll, 8000);
//     return () => clearInterval(iv);
//   }, []);

//   // ── Chart.js ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const render = () => {
//       // Donut: Doctors by Specialty
//       if (pieRef.current && doctors.length) {
//         if (pieC.current) pieC.current.destroy();
//         const sc = {};
//         doctors.forEach(d => {
//           const key = d.specialty || 'Other';
//           sc[key] = (sc[key] || 0) + 1;
//         });
//         const cl = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b'];
//         pieC.current = new window.Chart(pieRef.current.getContext('2d'), {
//           type: 'doughnut',
//           data: {
//             labels: Object.keys(sc),
//             datasets: [{ data: Object.values(sc), backgroundColor: cl.slice(0, Object.keys(sc).length), borderWidth: 2, borderColor: '#fff' }],
//           },
//           options: {
//             responsive: true, maintainAspectRatio: false,
//             plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
//           },
//         });
//       }

//       // Line: Patient Flow
//       if (lineRef.current && flow.length) {
//         if (lineC.current) lineC.current.destroy();
//         const ctx = lineRef.current.getContext('2d');
//         const grad = ctx.createLinearGradient(0, 0, 0, 220);
//         grad.addColorStop(0, 'rgba(99,102,241,0.35)');
//         grad.addColorStop(1, 'rgba(99,102,241,0.02)');
//         lineC.current = new window.Chart(ctx, {
//           type: 'line',
//           data: {
//             labels: flow.map(f => f.hour),
//             datasets: [{
//               label: 'Patients', data: flow.map(f => f.patients),
//               borderColor: '#6366f1', backgroundColor: grad,
//               fill: true, tension: 0.4, borderWidth: 3,
//               pointRadius: 5, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointBorderWidth: 2,
//               pointHoverRadius: 7, pointHoverBackgroundColor: '#4f46e5',
//             }],
//           },
//           options: {
//             responsive: true, maintainAspectRatio: false,
//             plugins: {
//               legend: { display: false },
//               tooltip: { backgroundColor: '#4f46e5', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 },
//             },
//             scales: {
//               y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
//               x: { ticks: { font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
//             },
//           },
//         });
//       }

//       // Bar: Common Diseases
//       if (barRef.current && diseases.length) {
//         if (barC.current) barC.current.destroy();
//         const palette = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
//         barC.current = new window.Chart(barRef.current.getContext('2d'), {
//           type: 'bar',
//           data: {
//             labels: diseases.map(d => d.name.length > 25 ? d.name.slice(0, 25) + '…' : d.name),
//             datasets: [{
//               data: diseases.map(d => d.count),
//               backgroundColor: diseases.map((_, i) => palette[i % palette.length]),
//               borderRadius: 8, borderSkipped: false, barThickness: 28,
//             }],
//           },
//           options: {
//             responsive: true, maintainAspectRatio: false, indexAxis: 'x',
//             plugins: {
//               legend: { display: false },
//               tooltip: { backgroundColor: '#1e293b', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 },
//             },
//             scales: {
//               y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
//               x: { ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 30 }, grid: { display: false } },
//             },
//           },
//         });
//       }
//     };

//     const go = () => {
//       if (!window.Chart) {
//         const s = document.createElement('script');
//         s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
//         s.onload = () => setTimeout(render, 250);
//         document.head.appendChild(s);
//       } else {
//         setTimeout(render, 250);
//       }
//     };
//     go();

//     return () => {
//       if (pieC.current)  { pieC.current.destroy();  pieC.current  = null; }
//       if (lineC.current) { lineC.current.destroy(); lineC.current = null; }
//       if (barC.current)  { barC.current.destroy();  barC.current  = null; }
//     };
//   }, [doctors, flow, diseases]);

//   // ── Derived values ────────────────────────────────────────────────────────
//   const activeDocs = doctors.filter(d => d.is_online);

//   const dash = dashboardData;
//   const statsCards = [
//     { icon: '🔴', label: 'Critical Cases',   value: dash?.critical_cases      ?? dash?.stats?.critical_cases      ?? 0, border: 'border-red-500'    },
//     { icon: '⏳', label: 'Waiting Now',       value: dash?.total_waiting        ?? dash?.stats?.total_waiting        ?? 0, border: 'border-yellow-500' },
//     { icon: '👨‍⚕️', label: 'Doctors Online', value: `${activeDocs.length}/${doctors.length}`,                            border: 'border-green-500'  },
//     { icon: '💰', label: "Today's Revenue",   value: `${(revenue?.total_revenue ?? dash?.today_revenue ?? dash?.stats?.today_revenue ?? 0).toLocaleString()} EGP`, border: 'border-amber-500' },
//     { icon: '🔁', label: 'Completed Today',   value: dash?.total_patients_seen  ?? dash?.stats?.total_patients_seen  ?? 0, border: 'border-blue-500'   },
//     { icon: '📅', label: 'Appointments',      value: dash?.total_appointments   ?? dash?.stats?.total_appointments   ?? 0, border: 'border-indigo-500' },
//     { icon: '🕐', label: 'Avg Wait',          value: `${dash?.avg_wait_minutes  ?? dash?.stats?.avg_wait_minutes    ?? 0} min`, border: 'border-purple-500' },
//     { icon: '🚫', label: 'No Shows',          value: dash?.total_no_shows       ?? dash?.stats?.total_no_shows       ?? 0, border: 'border-slate-400'  },
//   ];

//   const visibleQ = showAllQ ? liveQueue : liveQueue.slice(0, 5);

//   // ── Loading / Error ───────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4" />
//         <p className="text-slate-600">Loading dashboard...</p>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center bg-red-50 p-8 rounded-lg">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button onClick={fetchAll} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Retry</button>
//       </div>
//     </div>
//   );

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div>

//       {/* ── 8 Stats Cards ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {statsCards.map((s, i) => (
//           <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${s.border}`}>
//             <div className="flex items-center gap-2 mb-3">
//               <span className="text-2xl">{s.icon}</span>
//               <p className="text-slate-600 text-sm font-semibold">{s.label}</p>
//             </div>
//             <h3 className="text-3xl font-bold text-slate-800">{s.value}</h3>
//           </div>
//         ))}
//       </div>

//       {/* ── Available Doctors Now ── */}
//       <div className="bg-white rounded-xl p-5 shadow-sm mb-5">
//         <h3 className="font-extrabold text-slate-800 mb-3">🟢 Available Doctors Now ({activeDocs.length})</h3>
//         {activeDocs.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//             {activeDocs.map(d => (
//               <div key={d.doctor_id} className="bg-blue-50 rounded-lg p-3">
//                 <p className="font-bold text-slate-800 text-sm">{d.doctor_name}</p>
//                 <p className="text-xs text-slate-500">{d.specialty_ar || d.specialty}</p>
//                 <p className="text-xs text-slate-400">Floor {d.floor_number} — Room {d.room_number}</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className={`w-2 h-2 rounded-full ${d.current_status === 'available' ? 'bg-green-500' : d.current_status === 'busy' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
//                   <span className={`text-xs font-bold ${d.current_status === 'available' ? 'text-green-600' : d.current_status === 'busy' ? 'text-orange-600' : 'text-yellow-600'}`}>
//                     {d.current_status === 'available' ? 'Available' : d.current_status === 'busy' ? `Busy (${d.current_patients_count} patients)` : 'On Break'}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-slate-400">No available doctors right now</p>
//         )}
//       </div>

//       {/* ── Live Queue ── */}
//       <div className="bg-white rounded-xl border p-5 shadow-sm mb-5">
//         <h3 className="font-bold text-slate-800 mb-3">🔴 Live Queue ({liveQueue.length})</h3>
//         {liveQueue.length > 0 ? (
//           <>
//             <div className="space-y-2">
//               {visibleQ.map((q, i) => (
//                 <div key={i} className={`rounded-lg p-3 flex justify-between items-center ${q.queue_status === 'called' || q.queue_status === 'in_progress' ? 'bg-green-50 border border-green-300' : 'bg-slate-50'}`}>
//                   <div>
//                     <p className="font-bold text-slate-800 text-sm">{q.patient_name}</p>
//                     <p className="text-xs text-slate-500">{q.doctor_name} · {q.specialty}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${q.severity_level >= 7 ? 'bg-red-100 text-red-700' : q.severity_level >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
//                       Sev: {q.severity_level}
//                     </span>
//                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${q.queue_status === 'called' || q.queue_status === 'in_progress' ? 'bg-green-600 text-white' : q.queue_status === 'waiting' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
//                       {q.queue_status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {liveQueue.length > 5 && !showAllQ && (
//               <button onClick={() => setShowAllQ(true)} className="mt-3 text-blue-500 font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
//                 <ChevronDown size={14} /> See More ({liveQueue.length - 5} more)
//               </button>
//             )}
//             {showAllQ && liveQueue.length > 5 && (
//               <button onClick={() => setShowAllQ(false)} className="mt-3 text-slate-400 font-bold text-sm hover:underline mx-auto block">
//                 Show Less
//               </button>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
//             <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
//             <p>No patients in queue right now</p>
//           </div>
//         )}
//       </div>

//       {/* ── Charts Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
//         <div className="bg-white rounded-xl p-5 shadow-sm">
//           <h3 className="font-extrabold text-slate-800 mb-3 text-sm">📊 Doctors by Specialty</h3>
//           <div style={{ height: 240 }}><canvas ref={pieRef} /></div>
//         </div>
//         <div className="bg-white rounded-xl p-5 shadow-sm">
//           <h3 className="font-extrabold text-slate-800 mb-3 text-sm">📈 Patient Flow Today</h3>
//           <div style={{ height: 240 }}><canvas ref={lineRef} /></div>
//         </div>
//         <div className="bg-white rounded-xl p-5 shadow-sm">
//           <h3 className="font-extrabold text-slate-800 mb-3 text-sm">🦠 Common Diseases Today</h3>
//           <div style={{ height: 280 }}><canvas ref={barRef} /></div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default MediVerseDashboard;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import { getDashboardOverview, getAllDoctors, getLiveQueue } from '../Managment/ManagmentApi/MangServices';

const MediVerseDashboard = () => {
  const [loading, setLoading]       = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [doctors, setDoctors]       = useState([]);
  const [liveQueue, setLiveQueue]   = useState([]);
  const [showAllQ, setShowAllQ]     = useState(false);
  const [flow, setFlow]             = useState([]);
  const [diseases, setDiseases]     = useState([]);
  const [revenue, setRevenue]       = useState(null);
  const [error, setError]           = useState(null);

  const pieRef  = useRef(null); const pieC  = useRef(null);
  const lineRef = useRef(null); const lineC = useRef(null);
  const barRef  = useRef(null); const barC  = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const h = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      };
      const base = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev/manager';
      const g = (p) => fetch(`${base}${p}`, { headers: h }).then(r => r.json());

      const [dashRes, docsRes, queueRes, flowRes, disRes, revRes] = await Promise.all([
        getDashboardOverview(),
        getAllDoctors(),
        getLiveQueue(),
        g('/reports/patient-flow').catch(() => ({ flow: [] })),
        g('/reports/common-diseases').catch(() => ({ diseases: [] })),
        g('/reports/today-revenue').catch(() => ({ total_revenue: 0 })),
      ]);

      setDashboardData(dashRes);
      setFlow(flowRes.flow || []);
      setDiseases(disRes.diseases || []);
      setRevenue(revRes);

      let arr = [];
      if (Array.isArray(docsRes))               arr = docsRes;
      else if (Array.isArray(docsRes?.data))    arr = docsRes.data;
      else if (Array.isArray(docsRes?.doctors)) arr = docsRes.doctors;
      setDoctors(arr);

      const qItems = queueRes?.items || queueRes?.queue || (Array.isArray(queueRes) ? queueRes : []);
      setLiveQueue(qItems);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 8000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const render = () => {
      if (pieRef.current && doctors.length) {
        if (pieC.current) pieC.current.destroy();
        const sc = {};
        doctors.forEach(d => {
          const key = d.specialty || 'Other';
          sc[key] = (sc[key] || 0) + 1;
        });
        const cl = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b'];
        pieC.current = new window.Chart(pieRef.current.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: Object.keys(sc),
            datasets: [{ data: Object.values(sc), backgroundColor: cl.slice(0, Object.keys(sc).length), borderWidth: 2, borderColor: '#fff' }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
          },
        });
      }

      if (lineRef.current && flow.length) {
        if (lineC.current) lineC.current.destroy();
        const ctx = lineRef.current.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 220);
        grad.addColorStop(0, 'rgba(99,102,241,0.35)');
        grad.addColorStop(1, 'rgba(99,102,241,0.02)');
        lineC.current = new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: flow.map(f => f.hour),
            datasets: [{
              label: 'Patients', data: flow.map(f => f.patients),
              borderColor: '#6366f1', backgroundColor: grad,
              fill: true, tension: 0.4, borderWidth: 3,
              pointRadius: 5, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointBorderWidth: 2,
              pointHoverRadius: 7, pointHoverBackgroundColor: '#4f46e5',
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: '#4f46e5', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 },
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { ticks: { font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
            },
          },
        });
      }

      if (barRef.current && diseases.length) {
        if (barC.current) barC.current.destroy();
        const palette = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
        barC.current = new window.Chart(barRef.current.getContext('2d'), {
          type: 'bar',
          data: {
            labels: diseases.map(d => d.name.length > 25 ? d.name.slice(0, 25) + '…' : d.name),
            datasets: [{
              data: diseases.map(d => d.count),
              backgroundColor: diseases.map((_, i) => palette[i % palette.length]),
              borderRadius: 8, borderSkipped: false, barThickness: 28,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'x',
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: '#1e293b', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 },
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 30 }, grid: { display: false } },
            },
          },
        });
      }
    };

    const go = () => {
      if (!window.Chart) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        s.onload = () => setTimeout(render, 250);
        document.head.appendChild(s);
      } else {
        setTimeout(render, 250);
      }
    };
    go();

    return () => {
      if (pieC.current)  { pieC.current.destroy();  pieC.current  = null; }
      if (lineC.current) { lineC.current.destroy(); lineC.current = null; }
      if (barC.current)  { barC.current.destroy();  barC.current  = null; }
    };
  }, [doctors, flow, diseases]);

  const activeDocs = doctors.filter(d => d.is_online);
  const dash = dashboardData;
  const statsCards = [
    { icon: '🔴', label: 'Critical Cases',   value: dash?.critical_cases      ?? dash?.stats?.critical_cases      ?? 0, border: 'border-red-500'    },
    { icon: '⏳', label: 'Waiting Now',       value: dash?.total_waiting        ?? dash?.stats?.total_waiting        ?? 0, border: 'border-yellow-500' },
    { icon: '👨‍⚕️', label: 'Doctors Online', value: `${activeDocs.length}/${doctors.length}`,                            border: 'border-green-500'  },
    { icon: '💰', label: "Today's Revenue",   value: `${(revenue?.total_revenue ?? dash?.today_revenue ?? dash?.stats?.today_revenue ?? 0).toLocaleString()} EGP`, border: 'border-amber-500' },
    { icon: '🔁', label: 'Completed Today',   value: dash?.total_patients_seen  ?? dash?.stats?.total_patients_seen  ?? 0, border: 'border-blue-500'   },
    { icon: '📅', label: 'Appointments',      value: dash?.total_appointments   ?? dash?.stats?.total_appointments   ?? 0, border: 'border-indigo-500' },
    { icon: '🕐', label: 'Avg Wait',          value: `${dash?.avg_wait_minutes  ?? dash?.stats?.avg_wait_minutes    ?? 0} min`, border: 'border-purple-500' },
    { icon: '🚫', label: 'No Shows',          value: dash?.total_no_shows       ?? dash?.stats?.total_no_shows       ?? 0, border: 'border-slate-400'  },
  ];

  const visibleQ = showAllQ ? liveQueue : liveQueue.slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4" />
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center bg-red-50 p-8 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchAll} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Retry</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${s.border}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-slate-600 text-sm font-semibold">{s.label}</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm mb-5">
        <h3 className="font-extrabold text-slate-800 mb-3">🟢 Available Doctors Now ({activeDocs.length})</h3>
        {activeDocs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeDocs.map(d => (
              <div key={d.doctor_id} className="bg-blue-50 rounded-lg p-3">
                <p className="font-bold text-slate-800 text-sm">{d.doctor_name}</p>
                <p className="text-xs text-slate-500">{d.specialty_ar || d.specialty}</p>
                <p className="text-xs text-slate-400">Floor {d.floor_number} — Room {d.room_number}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${d.current_status === 'available' ? 'bg-green-500' : d.current_status === 'busy' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <span className={`text-xs font-bold ${d.current_status === 'available' ? 'text-green-600' : d.current_status === 'busy' ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {d.current_status === 'available' ? 'Available' : d.current_status === 'busy' ? `Busy (${d.current_patients_count} patients)` : 'On Break'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No available doctors right now</p>
        )}
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm mb-5">
        <h3 className="font-bold text-slate-800 mb-3">🔴 Live Queue ({liveQueue.length})</h3>
        {liveQueue.length > 0 ? (
          <>
            <div className="space-y-2">
              {visibleQ.map((q, i) => (
                <div key={i} className={`rounded-lg p-3 flex justify-between items-center ${q.queue_status === 'called' || q.queue_status === 'in_progress' ? 'bg-green-50 border border-green-300' : 'bg-slate-50'}`}>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{q.patient_name}</p>
                    <p className="text-xs text-slate-500">{q.doctor_name} · {q.specialty}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${q.severity_level >= 7 ? 'bg-red-100 text-red-700' : q.severity_level >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      Sev: {q.severity_level}
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${q.queue_status === 'called' || q.queue_status === 'in_progress' ? 'bg-green-600 text-white' : q.queue_status === 'waiting' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {q.queue_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {liveQueue.length > 5 && !showAllQ && (
              <button onClick={() => setShowAllQ(true)} className="mt-3 text-blue-500 font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                <ChevronDown size={14} /> See More ({liveQueue.length - 5} more)
              </button>
            )}
            {showAllQ && liveQueue.length > 5 && (
              <button onClick={() => setShowAllQ(false)} className="mt-3 text-slate-400 font-bold text-sm hover:underline mx-auto block">
                Show Less
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
            <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No patients in queue right now</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-800 mb-3 text-sm">📊 Doctors by Specialty</h3>
          <div style={{ height: 240 }}><canvas ref={pieRef} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-800 mb-3 text-sm">📈 Patient Flow Today</h3>
          <div style={{ height: 240 }}><canvas ref={lineRef} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-800 mb-3 text-sm">🦠 Common Diseases Today</h3>
          <div style={{ height: 280 }}><canvas ref={barRef} /></div>
        </div>
      </div>
    </div>
  );
};

export default MediVerseDashboard;