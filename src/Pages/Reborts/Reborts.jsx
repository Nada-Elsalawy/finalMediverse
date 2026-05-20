
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/authContext';
import api from '../../APi/api';
import toast from 'react-hot-toast';
import { Loader2, Star, MapPin } from 'lucide-react';

export default function FollowUpAppointment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pid = user?.user_id || user?.id || user?.patient_id;

  const [reason, setReason] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selDoc, setSelDoc] = useState(null);
  const [mode, setMode] = useState('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.specialties().then(r => setDepartments(r.specialties || [])).catch(() => {});
    if (pid) api.patientAppointments(pid).then(r => setAppointments(r.appointments || r || [])).catch(() => {});
  }, [pid]);

  useEffect(() => {
    if (!selectedDepartment) { setDoctors([]); setSelDoc(null); return; }
    setLoadingDocs(true); setSelDoc(null); setSlots([]); setSelectedTime(''); setMode('now');
    api.bookingDoctors(selectedDepartment)
      .then(r => setDoctors(r.doctors || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDocs(false));
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selDoc || !selectedDate || mode !== 'scheduled') { setSlots([]); return; }
    setLoadingSlots(true); setSelectedTime('');
    api.doctorSlots(selDoc.id, selectedDate)
      .then(r => setSlots(r.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selDoc, selectedDate, mode]);

  const onlineDoctors = doctors.filter(d => d.is_online);
  const displayDoctors = mode === 'now' ? onlineDoctors : doctors;

  const bookNow = async () => {
    if (!selDoc) return;
    setSubmitting(true);
    try {
      const result = await api.joinQueue({ 
        patient_id: pid, 
        doctor_id: selDoc.id, 
        severity_level: 5 
      });

      // ✅ حفظ الـ queue_id الحقيقي
      localStorage.setItem('queueData', JSON.stringify({
        queue_id: result.queue_id || result.id || result.queueId,
        position: result.position || (result.people_ahead + 1) || 1,
        estimated_wait_minutes: result.estimated_wait_minutes || result.wait_minutes || 0,
        doctor: {
          name: selDoc.name,
          specialty: selDoc.specialty,
          specialty_ar: selDoc.specialty_ar,
          floor: selDoc.floor,
          room: selDoc.room,
        }
      }));

      const ahead = result.people_ahead || 0;
      const wait = result.estimated_wait_minutes || 0;
      if (ahead === 0) toast.success(`✅ تم الحجز مع ${selDoc.name}! ادخل دلوقتي`);
      else toast.success(`📋 ترتيبك #${result.position} — قبلك ${ahead} — ≈${wait} دقيقة`);
      setTimeout(() => navigate('/wating'), 1500);

    } catch (e) {
      const msg = e?.response?.data?.detail || e?.response?.data?.message || e?.message || '';
      
      if (msg.toLowerCase().includes('already in')) {
        toast.success('لديك حجز نشط! جاري التوجيه...');

        // ✅ التعديل - نجيب الـ queue_id الحقيقي من الـ API
        try {
          const activeQueue = await api.activeQueue(pid);
          const queueId = activeQueue?.queue_id || activeQueue?.id;

          localStorage.setItem('queueData', JSON.stringify({
            queue_id: queueId, // ✅ دلوقتي مش null
            position: activeQueue?.position || 1,
            estimated_wait_minutes: activeQueue?.estimated_wait_minutes || 0,
            doctor: {
              name: selDoc.name,
              specialty: selDoc.specialty,
              specialty_ar: selDoc.specialty_ar,
              floor: selDoc.floor,
              room: selDoc.room,
            }
          }));
        } catch {
          // لو فشلت نحافظ على اللي موجود في localStorage
          if (!localStorage.getItem('queueData')) {
            localStorage.setItem('queueData', JSON.stringify({
              queue_id: null,
              position: 1,
              estimated_wait_minutes: 0,
              doctor: {
                name: selDoc.name,
                specialty: selDoc.specialty,
                specialty_ar: selDoc.specialty_ar,
                floor: selDoc.floor,
                room: selDoc.room,
              }
            }));
          }
        }

        setTimeout(() => navigate('/wating'), 1000);
      } else {
        toast.error(msg || 'فشل الحجز');
      }
    } finally { 
      setSubmitting(false); 
    }
  };

  const bookScheduled = async () => {
    if (!selDoc || !selectedDate || !selectedTime) { toast.error('من فضلك املأ كل الحقول!'); return; }
    if (new Date(`${selectedDate}T${selectedTime}`) < new Date()) { toast.error('لا يمكن الحجز في وقت ماضي!'); return; }
    setSubmitting(true);
    try {
      await api.book({
        patient_id: pid, doctor_id: selDoc.id,
        appointment_date: selectedDate, appointment_time: selectedTime,
        appointment_type: 'scheduled', specialty: selectedDepartment,
        notes: reason || 'Follow-up appointment',
      });
      toast.success(`✅ تم حجز موعد مع ${selDoc.name} يوم ${selectedDate} الساعة ${selectedTime}`);
      if (pid) { const r = await api.patientAppointments(pid).catch(() => []); setAppointments(r.appointments || r || []); }
      setSelectedTime(''); setReason('');
    } catch (e) { toast.error(e?.message || 'فشل الحجز'); }
    finally { setSubmitting(false); }
  };

  const cancelAppt = async (id) => {
    try {
      await api.cancelAppt(id);
      toast.success('تم الإلغاء');
      setAppointments(prev => prev.map(a => a.appointment_id === id ? { ...a, status: 'cancelled' } : a));
    } catch (e) { toast.error(e?.message || 'فشل'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">

        <button onClick={() => window.history.back()} className="text-blue-800 text-sm font-semibold mb-4 hover:underline">
          ← Back
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-blue-900 mb-1">📅 Schedule Your Follow-Up Appointment</h1>
          <p className="text-gray-500 text-sm">Please confirm the details for your upcoming visit</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" dir="ltr">
          <h2 className="text-lg font-bold text-blue-800 mb-4">Appointment Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-blue-800 mb-1">Select Department</label>
            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400">
              <option value="">-- Choose Department --</option>
              {departments.map((s, i) => {
                const val = typeof s === 'string' ? s : s.key || s.name;
                const lbl = typeof s === 'string' ? s : (s.name_ar ? `${s.name_ar} (${s.key})` : s.name);
                return <option key={i} value={val}>{lbl}</option>;
              })}
            </select>
          </div>

          {selectedDepartment && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-800 mb-2">Booking Type</label>
              <div className="flex gap-3">
                <button onClick={() => { setMode('now'); setSelDoc(null); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${mode === 'now' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  ⚡ Book Now (Join Queue)
                </button>
                <button onClick={() => { setMode('scheduled'); setSelDoc(null); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${mode === 'scheduled' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  📅 Schedule for Later
                </button>
              </div>
            </div>
          )}

          {selectedDepartment && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                {mode === 'now' ? 'Select Doctor (Online Now)' : 'Select Doctor'}
              </label>
              {loadingDocs ? (
                <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading doctors...</div>
              ) : displayDoctors.length > 0 ? (
                <div className="space-y-2">
                  {displayDoctors.map(d => (
                    <div key={d.id} onClick={() => setSelDoc(d)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selDoc?.id === d.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-blue-800">{d.name}</p>
                          <p className="text-xs text-gray-500">{d.specialty_ar || d.specialty}</p>
                          {d.shift_start && d.shift_end && (
                            <p className="text-xs text-gray-400 mt-0.5">🕐 {d.shift_start?.slice(0,5)} — {d.shift_end?.slice(0,5)}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-yellow-600 flex items-center justify-end gap-1"><Star size={12} fill="currentColor" /> {d.rating}/5</p>
                          <p className="text-xs text-gray-400"><MapPin size={10} className="inline" /> Floor {d.floor} - Room {d.room}</p>
                          {d.is_online ? (
                            <p className={`text-xs font-bold mt-1 ${d.current_status === 'available' ? 'text-green-600' : d.current_status === 'busy' ? 'text-orange-600' : 'text-yellow-600'}`}>
                              {d.current_status === 'available' ? '✅ Available Now'
                                : d.current_status === 'busy' ? `🔴 Busy (${d.current_patients} in queue — ≈${d.estimated_wait_minutes} min)`
                                : '☕ On Break'}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 mt-1">⚫ Offline</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500">
                    {mode === 'now' ? '❌ لا يوجد أطباء متاحون الآن في هذا القسم' : 'لا يوجد أطباء في هذا التخصص'}
                  </p>
                  {mode === 'now' && doctors.length > 0 && (
                    <button onClick={() => setMode('scheduled')} className="mt-2 text-blue-600 font-bold text-sm underline">
                      جرب الحجز المجدول بدلاً من ذلك ←
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {selDoc && mode === 'now' && (
            <div className="bg-blue-50 rounded-xl p-5 mb-4 border border-blue-200">
              <div className="mb-3">
                {selDoc.current_status === 'available' && selDoc.current_patients === 0 ? (
                  <p className="text-green-700 font-bold text-sm">✅ الدكتور {selDoc.name} فاضي — هتدخل حالاً!</p>
                ) : selDoc.current_status === 'on_break' ? (
                  <p className="text-yellow-700 font-bold text-sm">☕ الدكتور {selDoc.name} في استراحة — هيرجع قريباً</p>
                ) : (
                  <p className="text-orange-700 font-bold text-sm">⏳ في {selDoc.current_patients} مريض قبلك — الانتظار ≈{selDoc.estimated_wait_minutes} دقيقة</p>
                )}
              </div>
              <button onClick={bookNow} disabled={submitting}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'جاري الحجز...' : `احجز الآن مع ${selDoc.name}`}
              </button>
            </div>
          )}

          {selDoc && mode === 'scheduled' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-800 mb-1">Preferred Date</label>
                <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
                {selDoc.shift_start && selDoc.shift_end && (
                  <p className="text-xs text-gray-400 mt-1">🕐 Shift: {selDoc.shift_start?.slice(0,5)} — {selDoc.shift_end?.slice(0,5)}</p>
                )}
              </div>

              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-blue-800 mb-1">Available Time Slots</label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading slots...</div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {slots.map(s => (
                        <button key={s.time} onClick={() => s.available && setSelectedTime(s.time)} disabled={!s.available}
                          className={`py-2.5 rounded-lg text-xs font-bold transition ${
                            selectedTime === s.time ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : s.available ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                            : 'bg-red-50 text-red-300 cursor-not-allowed line-through'}`}>
                          {s.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">لا يوجد مواعيد في هذا اليوم</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-800 mb-1">Reason for Visit (Optional)</label>
                <textarea className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
                  rows={2} placeholder="Enter reason..." value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <button onClick={bookScheduled} disabled={!selectedDate || !selectedTime || submitting}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'جاري الحجز...' : `📅 حجز موعد ${selectedDate} الساعة ${selectedTime}`}
              </button>
            </>
          )}
        </div>

        {appointments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">📋 مواعيدي</h2>
            <div className="space-y-3" dir="ltr">
              {appointments.map((a, i) => (
                <div key={a.appointment_id || i} className="border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-blue-800">{a.doctor_name || '—'}</p>
                    <p className="text-xs text-gray-500">{a.specialty || ''} — {a.appointment_date} @ {a.appointment_time}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      a.status === 'scheduled' ? 'bg-blue-100 text-blue-700'
                      : a.status === 'queued' ? 'bg-purple-100 text-purple-700'
                      : a.status === 'completed' ? 'bg-green-100 text-green-700'
                      : a.status === 'cancelled' ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'}`}>
                      {a.status === 'queued' ? 'In Queue' : a.status}
                    </span>
                  </div>
                  {a.status === 'scheduled' && (
                    <button onClick={() => cancelAppt(a.appointment_id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600">
                      إلغاء
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}