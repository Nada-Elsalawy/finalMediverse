



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueueStatus, cancelQueue } from '../../QueueApi';

export default function WaitingQueue() {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('waiting');
  const [cancelling, setCancelling] = useState(false);
  const [showCalledNotification, setShowCalledNotification] = useState(false);
  const pollingInterval = useRef(null);

  useEffect(() => {
    const savedQueueData = localStorage.getItem('queueData');
    if (!savedQueueData) {
      setError('لا توجد بيانات للقائمة. يرجى الحجز مرة أخرى.');
      setLoading(false);
      return;
    }
    try {
      const parsedData = JSON.parse(savedQueueData);
      // normalize queue_id من أي حقل ممكن يجي فيه
      const queueId = parsedData.queue_id || parsedData.id || parsedData.queue?.id || null;
      const normalizedData = { ...parsedData, queue_id: queueId };
      console.log('📦 queueData from localStorage:', parsedData, '| resolved queue_id:', queueId);
      setQueueData(normalizedData);
      setLoading(false);

      if (!queueId) {
        setError('لا يوجد رقم طابور. يرجى الحجز مرة أخرى.');
        return;
      }

      startPolling(queueId);
    } catch {
      setError('خطأ في تحميل البيانات');
      setLoading(false);
    }
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const startPolling = (queueId) => {
    updateQueueStatus(queueId);
    pollingInterval.current = setInterval(() => updateQueueStatus(queueId), 10000);
  };

  const triggerCalledNotification = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setShowCalledNotification(true);
  };

  const updateQueueStatus = async (queueId) => {
    try {
      const status = await getQueueStatus(queueId);
      // الـ API بيرجع queue_status مش status
      const currentStat = status.queue_status || status.status || 'waiting';

      setQueueData(prev => ({
        ...prev,
        position: status.queue_position ?? status.position ?? prev?.position,
        estimated_wait_minutes: status.estimated_wait_minutes ?? prev?.estimated_wait_minutes,
        status: currentStat,
        doctor: prev?.doctor ? {
          ...prev.doctor,
          name: status.doctor_name || prev.doctor.name,
          floor: status.doctor_floor ?? prev.doctor.floor,
          room: status.doctor_room || prev.doctor.room,
          specialty_ar: status.doctor_specialty_ar || prev.doctor.specialty_ar,
          specialty: status.doctor_specialty || prev.doctor.specialty,
        } : prev?.doctor,
      }));
      setCurrentStatus(currentStat);

      if (
        currentStat === 'called' ||
        currentStat === 'ready' ||
        currentStat === 'in_progress' ||
        currentStat === 'consulting' ||
        status.your_turn === true
      ) {
        triggerCalledNotification();
      }
    } catch (err) {
      if (err?.message?.includes('404') || err?.message?.includes('not found')) {
        setError('لم يتم العثور على القائمة. ربما تم إلغاؤها.');
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    }
  };

  const handleCancelQueue = async () => {
    if (!queueData?.queue_id) return;
    const confirmCancel = window.confirm('هل أنت متأكد من مغادرة قائمة الانتظار؟');
    if (!confirmCancel) return;
    try {
      setCancelling(true);
      await cancelQueue(queueData.queue_id);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      localStorage.removeItem('queueData');
      navigate('/');
    } catch (err) {
      alert(`خطأ في إلغاء القائمة: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !queueData) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-base">جاري تحميل بيانات القائمة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const isCalled =
    currentStatus === 'called' ||
    currentStatus === 'ready' ||
    currentStatus === 'in_progress' ||
    currentStatus === 'consulting';

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center px-4 py-10" dir="rtl">

      {/* ── Notification Overlay لما الدكتور يعمل Call ── */}
      {showCalledNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-extrabold text-green-600 mb-2">دورك الآن!</h2>
            <p className="text-gray-600 mb-1">
              الطبيب{' '}
              <span className="font-bold text-blue-800">
                {queueData?.doctor?.name || ''}
              </span>
              {' '}جاهز لاستقبالك
            </p>
            <p className="text-gray-500 text-sm mb-6">
              📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
            </p>
            <button
              onClick={() => setShowCalledNotification(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm transition"
            >
              حسناً ✓
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">

        {/* ── Title ── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
            غرفة الانتظار
            <span className="text-2xl">🕐</span>
          </h1>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-[#1e4d8c] rounded-3xl shadow-2xl overflow-hidden mb-4">

          {/* Position Block */}
          <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
            <p className="text-blue-200 text-sm font-medium mb-3">موقفك في الطابور</p>
            <div className="w-24 h-24 rounded-full bg-[#2a5fa8] flex items-center justify-center shadow-inner mb-4">
              {isCalled ? (
                <span className="text-4xl">✅</span>
              ) : (
                <span className="text-5xl font-extrabold text-white">
                  {queueData?.position ?? 1}
                </span>
              )}
            </div>
            {isCalled ? (
              <p className="text-green-300 font-bold text-lg animate-pulse">دورك الآن </p>
            ) : (
              <p className="text-blue-100 text-base font-semibold">
                الانتظار المتوقع:{' '}
                <span className="text-white font-bold">
                  {queueData?.estimated_wait_minutes ?? 0} دقيقة
                </span>
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-px bg-[#1a4278] mx-4 mb-4 rounded-2xl overflow-hidden">
            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1"></p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {queueData?.doctor?.name ? `${queueData.doctor.name}` : 'Dr: —'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">التخصص</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || queueData?.specialty || '—'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">الحالة</p>
              <p className={`text-sm font-bold flex items-center gap-1 ${isCalled ? 'text-green-600' : 'text-yellow-600'}`}>
                {isCalled ? '✅ دورك الآن' : '⏳ في الانتظار'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">الغرفة</p>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="px-4 pb-6">
            <button
              onClick={handleCancelQueue}
              disabled={cancelling || isCalled}
              className="w-full bg-[#e63946] hover:bg-[#c1121f] disabled:bg-gray-400 text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {cancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  جاري الإلغاء...
                </>
              ) : (
                'إلغاء الانتظار'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
