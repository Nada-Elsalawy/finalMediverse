import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../Contexts/authContext';
import api from '../../APi/api';
import { FileText, Image, FlaskConical, Bot, ZoomIn, ZoomOut, RotateCw, X, Download } from 'lucide-react';

const API = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

function AIText({ text }) {
  if (!text) return null;
  const renderBold = (s) => s.split(/\*\*(.*?)\*\*/g).map((p, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-blue-800">{p}</strong> : p
  );
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {text.split('\n').map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        if (t.startsWith('### ') || t.startsWith('## ')) {
          const h = t.replace(/^##+\s*\d*\.?\s*/, '').replace(/\*\*/g, '');
          return <h4 key={i} className="font-bold text-blue-800 text-base mt-3 mb-1">{h}</h4>;
        }
        if (t.includes('⚠️') || t.toLowerCase().includes('disclaimer') || t.toLowerCase().includes('warning'))
          return <p key={i} className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 rounded text-yellow-800 font-semibold text-sm">{t.replace(/\*\*/g, '')}</p>;
        if (/contraindic|danger|خطر/i.test(t))
          return <p key={i} className="bg-red-50 border-l-4 border-red-400 px-3 py-2 rounded text-red-700 font-semibold text-sm">{t.replace(/\*\*/g, '')}</p>;
        if (/abnormal|غير طبيعي/i.test(t))
          return <h4 key={i} className="font-bold text-orange-600 mt-3 mb-1">{t.replace(/\*\*/g, '').replace(/^[-•#]*\s*\d*\.?\s*/, '')}</h4>;
        if (/recommend|توصي|نصائح/i.test(t))
          return <h4 key={i} className="font-bold text-green-700 mt-3 mb-1">{t.replace(/\*\*/g, '').replace(/^[-•#]*\s*\d*\.?\s*/, '')}</h4>;
        if (t.startsWith('- ') || t.startsWith('• '))
          return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-400 mt-0.5">•</span><span className="text-gray-700">{renderBold(t.replace(/^[-•]\s*/, ''))}</span></div>;
        if (/^\d+[\.]\s/.test(t))
          return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-800 font-bold min-w-[20px]">{t.match(/^\d+/)[0]}.</span><span className="text-gray-700">{renderBold(t.replace(/^\d+[\.]\s*/, ''))}</span></div>;
        return <p key={i} className="text-gray-700">{renderBold(t)}</p>;
      })}
    </div>
  );
}

const FILTERS = [
  { key: 'normal', label: 'Normal', css: 'none' },
  { key: 'highContrast', label: 'High Contrast', css: 'contrast(150%)' },
  { key: 'brightness', label: 'Brightness +', css: 'brightness(130%)' },
  { key: 'sharpen', label: 'Sharpen', css: 'contrast(120%) brightness(110%)' },
  { key: 'grayscale', label: 'Grayscale', css: 'grayscale(100%) contrast(120%)' },
];

export default function Files() {
  const { user } = useAuth();
  const pid = user?.user_id || user?.id || user?.patient_id;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [imgFilter, setImgFilter] = useState('normal');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    if (pid) api.files(pid).then(r => setFiles(r.files || r || [])).catch(() => {}).finally(() => setLoading(false));
    else setLoading(false);
  }, [pid]);

  const icon = t => t === 'xray' || t === 'mri' || t === 'ct_scan'
    ? <Image size={20} className="text-blue-500" />
    : t === 'lab_test' ? <FlaskConical size={20} className="text-green-500" />
    : <FileText size={20} className="text-purple-500" />;

  const label = t => ({ xray: 'X-Ray', lab_test: 'Lab Test', mri: 'MRI', ct_scan: 'CT Scan', prescription: 'Prescription', report: 'Report' }[t] || t);
  const types = ['all', ...new Set(files.map(f => f.file_type))];
  const filtered = filter === 'all' ? files : files.filter(f => f.file_type === filter);

  const getFileUrl = (f) => {
    if (f.file_url) return `${API}${f.file_url}`;
    if (f.file_path) return `${API}/medical-files/${f.file_path}`;
    return null;
  };

  const isImage = (f) => {
    const mime = f.mime_type || '';
    const name = (f.file_name || '').toLowerCase();
    return mime.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
  };

  const openViewer = (f) => { setSelected(f); setImgFilter('normal'); setZoom(1); setPan({ x: 0, y: 0 }); };
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); setImgFilter('normal'); };
  const handleMouseDown = (e) => { if (zoom <= 1) return; setDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const handleMouseMove = (e) => { if (!dragging) return; setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setDragging(false);
  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(4, zoom + (e.deltaY > 0 ? -0.15 : 0.15)));
    setZoom(newZoom);
    if (newZoom <= 1) setPan({ x: 0, y: 0 });
  };

  const currentFilter = FILTERS.find(f => f.key === imgFilter)?.css || 'none';

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-8" dir="ltr">
        <h1 className="text-2xl font-extrabold text-blue-900 mb-1">📁 Reports & Medical Files</h1>
        <p className="text-gray-500 text-sm mb-6">All X-rays, lab tests, and reports with AI analysis</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === t ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-gray-200 hover:bg-blue-50'}`}>
              {t === 'all' ? 'All' : label(t)} {t !== 'all' && `(${files.filter(f => f.file_type === t).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-blue-400 border-t-blue-700 rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(f => {
              const url = getFileUrl(f);
              const isImg = isImage(f);
              return (
                <div key={f.file_id} onClick={() => openViewer(f)}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    {isImg && url ? (
                      <img src={url} alt={f.title || f.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-300">
                        {icon(f.file_type)}
                        <p className="text-xs mt-2">{label(f.file_type)}</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-blue-700 shadow-sm">{label(f.file_type)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-blue-900 text-sm truncate">{f.title || f.file_name}</p>
                    <p className="text-xs text-gray-400 mt-1">{f.test_date || f.upload_date?.split('T')[0]}</p>
                    {f.ai_analysis && <p className="text-[10px] text-blue-500 mt-1 flex items-center gap-1"><Bot size={10} /> AI Analysis Available</p>}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center py-10 text-gray-400 col-span-3">No files found</p>}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="bg-[#1a2744] px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">{selected.title || selected.file_name}</p>
                <p className="text-white/50 text-xs">{label(selected.file_type)} — {selected.test_date || ''}</p>
              </div>
              <div className="flex gap-2">
                {getFileUrl(selected) && (
                  <a href={getFileUrl(selected)} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-600">
                    <Download size={14} /> Download
                  </a>
                )}
                <button onClick={() => setSelected(null)} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/20">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Image Area */}
              <div className="flex-1 bg-black flex flex-col">
                <div className="flex justify-center gap-2 p-3 bg-black/50">
                  <button onClick={() => { const z = Math.max(0.5, zoom - 0.25); setZoom(z); if (z <= 1) setPan({ x: 0, y: 0 }); }}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-600">
                    <ZoomOut size={14} /> Zoom Out
                  </button>
                  <button onClick={resetView} className="px-3 py-1.5 bg-gray-600 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-gray-700">
                    <RotateCw size={14} /> Reset
                  </button>
                  <button onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-600">
                    <ZoomIn size={14} /> Zoom In
                  </button>
                  <span className="px-3 py-1.5 bg-white/10 text-white rounded text-xs font-mono">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex-1 overflow-hidden flex items-center justify-center relative"
                  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                  onWheel={handleWheel} style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}>
                  {isImage(selected) && getFileUrl(selected) ? (
                    <img ref={imgRef} src={getFileUrl(selected)} alt="" className="max-h-full max-w-full transition-transform"
                      style={{ filter: currentFilter, transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, userSelect: 'none', pointerEvents: 'none' }}
                      draggable={false} />
                  ) : (
                    <div className="text-white/30 text-center">
                      {icon(selected.file_type)}
                      <p className="mt-3 text-sm">Preview not available for this file type</p>
                      {getFileUrl(selected) && (
                        <a href={getFileUrl(selected)} target="_blank" rel="noreferrer"
                          className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Open File</a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="w-96 bg-white overflow-auto" dir="ltr">
                <div className="p-5">
                  <h3 className="font-bold text-blue-900 text-sm mb-3">🎨 Filters</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {FILTERS.map(f => (
                      <button key={f.key} onClick={() => setImgFilter(f.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${imgFilter === f.key ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <h3 className="font-bold text-blue-900 text-sm mb-3">📋 File Details</h3>
                  <div className="bg-gray-50 rounded-xl p-3 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span><span className="font-bold text-blue-800">{label(selected.file_type)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">File:</span><span className="font-bold text-blue-800 text-xs truncate max-w-[180px]">{selected.file_name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-bold text-blue-800">{selected.test_date || selected.upload_date?.split('T')[0] || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Size:</span><span className="font-bold text-blue-800">{selected.file_size_kb ? `${selected.file_size_kb} KB` : '—'}</span></div>
                    {selected.description && <div><span className="text-gray-500">Description:</span><p className="font-bold text-blue-800 text-xs mt-1">{selected.description}</p></div>}
                  </div>

                  {selected.ai_analysis ? (
                    <div>
                      <h3 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">🤖 AI Analysis Report</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="bg-white rounded-lg p-3 mb-3"><AIText text={selected.ai_analysis} /></div>
                        {selected.ai_model_used && (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div><span className="text-gray-500">Model:</span><p className="font-bold text-blue-800 mt-0.5">{selected.ai_model_used}</p></div>
                            <div><span className="text-gray-500">Status:</span><p className="font-bold text-green-600 mt-0.5">✓ Analyzed</p></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
                      <Bot size={24} className="mx-auto mb-2 opacity-30" />
                      No AI analysis available for this file
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
