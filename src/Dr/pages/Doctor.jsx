
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import doctorAPI from '../Services/DoctorServices';

// const DoctorDashboard = () => {
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showXrayModal, setShowXrayModal] = useState(false);
//   const [showBloodTestModal, setShowBloodTestModal] = useState(false);
//   const [xrayZoom, setXrayZoom] = useState(1);
//   const [labZoom, setLabZoom] = useState(1);
//   const [activeFilter, setActiveFilter] = useState('normal');
//   const [activeLabFilter, setActiveLabFilter] = useState('normal');
//   const [uploadedXray, setUploadedXray] = useState(null);
//   const [uploadedLab, setUploadedLab] = useState(null);
//   const [isConsulting, setIsConsulting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [doctorProfile, setDoctorProfile] = useState(null);
//   const [patientQueue, setPatientQueue] = useState([]);
//   const [currentPatient, setCurrentPatient] = useState(null);
//   const [diagnosis, setDiagnosis] = useState('');
//   const [notes, setNotes] = useState('');
//   const [aiEvaluation, setAiEvaluation] = useState('');
//   const [patientMedicalFiles, setPatientMedicalFiles] = useState([]);
//   const [xrayFiles, setXrayFiles] = useState([]);
//   const [labTestFiles, setLabTestFiles] = useState([]);
//   const [treatmentHistory, setTreatmentHistory] = useState([]);

//   const [xrayPosition, setXrayPosition] = useState({ x: 0, y: 0 });
//   const [isDraggingXray, setIsDraggingXray] = useState(false);
//   const [xrayDragStart, setXrayDragStart] = useState({ x: 0, y: 0 });

//   const [labPosition, setLabPosition] = useState({ x: 0, y: 0 });
//   const [isDraggingLab, setIsDraggingLab] = useState(false);
//   const [labDragStart, setLabDragStart] = useState({ x: 0, y: 0 });

//   const [currentXrayIndex, setCurrentXrayIndex] = useState(0);
//   const [currentLabIndex, setCurrentLabIndex] = useState(0);

//   const xrayFileInputRef = useRef(null);
//   const labTestFileInputRef = useRef(null);
//   const queuePollingRef = useRef(null);
//   const isConsultingRef = useRef(false);

//   useEffect(() => {
//     isConsultingRef.current = isConsulting;
//   }, [isConsulting]);

//   const toArray = (data) =>
//     Array.isArray(data) ? data : data?.queue || data?.patients || data?.data || [];

//   // Normalize patient 
//   const normalizePatient = (raw) => {
//     if (!raw) return raw;
//     const p = raw.patient || raw;
//     const consultations = raw.consultations || [];
//     const latestConsult = consultations[0] || {};
//     let age = p.age;
//     if (!age && (p.date_of_birth || p.dob)) {
//       const dob = new Date(p.date_of_birth || p.dob);
//       age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
//     }
//     let bmi = p.BMI || p.bmi;
//     if (!bmi && p.weight && p.height) {
//       const hM = p.height / 100;
//       bmi = (p.weight / (hM * hM)).toFixed(1);
//     }
//     return {
//       ...raw,
//       id: p.id || p.patient_id || raw.patient_id,
//       name: p.full_name || p.name || p.patient_name || raw.patient_name || 'Unknown',
//       national_id: p.national_id || p.nationalId,
//       age,
//       gender: p.gender || p.sex,
//       blood_type: p.blood_type || p.bloodType || p.blood_group,
//       bmi,
//       weight: p.weight,
//       height: p.height,
//       chronic_diseases: p.chronic_diseases || p.chronicDiseases,
//       allergies: p.allergies,
//       medications: p.current_medications || p.medications || p.currentMedications,
//       symptoms: latestConsult.symptoms || raw.symptoms,
//       _ai: {
//         diagnosis: latestConsult.ai_diagnosis || raw.ai_diagnosis,
//         confidence: latestConsult.severity ? latestConsult.severity * 10 : null,
//         department: latestConsult.specialty || raw.specialty,
//       },
//       _consultations: consultations,
//     };
//   };

//   const getFullUrl = (url) => {
//     const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';
//     if (!url) return null;
//     if (url.startsWith('http')) return url;
//     return `${BASE_URL}${url}`;
//   };


//   const fetchImageAsBlob = async (url) => {
//     if (!url) return null;
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(url, {
//         headers: {
//           'ngrok-skip-browser-warning': 'true',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         }
//       });
//       if (!res.ok) return url; 
//       const blob = await res.blob();
//       return URL.createObjectURL(blob);
//     } catch {
//       return url;
//     }
//   };

//   const pollQueue = useCallback(async () => {
//     if (isConsultingRef.current) return;
//     try {
//       const queue = await doctorAPI.getQueue();
      
//       const filtered = toArray(queue).filter(p =>
//         p.queue_status !== 'called' && p.queue_status !== 'in_progress' && p.queue_status !== 'in_consultation'
//       );
//       setPatientQueue(filtered);
//     } catch (err) {
//       console.warn('Queue polling error:', err);
//     }
//   }, []);

//   const startQueuePolling = useCallback(() => {
//     if (queuePollingRef.current) clearInterval(queuePollingRef.current);
//     queuePollingRef.current = setInterval(pollQueue, 10000);
//   }, [pollQueue]);

//   const stopQueuePolling = useCallback(() => {
//     if (queuePollingRef.current) {
//       clearInterval(queuePollingRef.current);
//       queuePollingRef.current = null;
//     }
//   }, []);

//   //  helper لتحميل ملفات المريض + treatment history
//   const loadPatientFiles = async (patientId) => {
//     try {
//       const allFiles = await doctorAPI.getPatientFiles(patientId);
//       console.log('🔍 Files response:', JSON.stringify(allFiles, null, 2));
//       const filesArray = allFiles?.files && Array.isArray(allFiles.files)
//         ? allFiles.files
//         : Array.isArray(allFiles) ? allFiles : [];
//       const rawFiles = filesArray.map(f => ({ ...f, file_url: getFullUrl(f.file_url || f.url) }));


//       const fixedFiles = await Promise.all(
//         rawFiles.map(async f => ({
//           ...f,
//           file_url: await fetchImageAsBlob(f.file_url),
//         }))
//       );

//       setPatientMedicalFiles(fixedFiles);
//       const xrays = fixedFiles.filter(f => f.file_type === 'xray');
//       const labTests = fixedFiles.filter(f => f.file_type === 'lab_test');
//       setXrayFiles(xrays);
//       setLabTestFiles(labTests);
//       if (xrays.length > 0) setUploadedXray(xrays[0].file_url);
//       if (labTests.length > 0) setUploadedLab(labTests[0].file_url);
//     } catch (fileError) {
//       console.warn('⚠️ Could not load patient files:', fileError);
//     }

//     // هنجيبtreatment history من الـ API
//     try {
//       const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';
//       const token = localStorage.getItem('token');
//       const historyRes = await fetch(`${BASE_URL}/patients/${patientId}/history`, {
//         headers: {
//           'ngrok-skip-browser-warning': 'true',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         }
//       });
//       if (historyRes.ok) {
//         const historyData = await historyRes.json();
//         console.log('✅ Treatment history:', historyData);
//         const historyArray = Array.isArray(historyData)
//           ? historyData
//           : historyData?.history || historyData?.data || historyData?.records || [];
//         setTreatmentHistory(historyArray);
//       }
//     } catch (histErr) {
//       console.warn('⚠️ Could not load treatment history:', histErr);
//     }
//   };

//   useEffect(() => {
//     loadInitialData();
//     startQueuePolling();
//     return () => stopQueuePolling();
//   }, []);

//   const loadInitialData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
     
//       let doctorData = null;
      
//       try {
//         const profile = await doctorAPI.getProfile();
//         doctorData = profile?.doctor || profile;

//         if (!doctorData?.floor || !doctorData?.room) {
//           const savedQueue = localStorage.getItem('queueData');
//           if (savedQueue) {
//             const queueDoctor = JSON.parse(savedQueue)?.doctor;
//             if (queueDoctor) {
//               doctorData = {
//                 floor: queueDoctor.floor,
//                 room: queueDoctor.room,
//                 specialty: queueDoctor.specialty,
//                 specialty_ar: queueDoctor.specialty_ar,
//                 ...doctorData,
//               };
//             }
//           }
//         }

//         setDoctorProfile(doctorData);
//         localStorage.setItem('selectedDoctor', JSON.stringify(doctorData));
//       } catch {
//         // fallback للـ localStorage لو الـ API فشل
//         const savedDoctor = localStorage.getItem('selectedDoctor');
//         if (savedDoctor) {
//           doctorData = JSON.parse(savedDoctor);
//         } else {
//           // جيب بيانات الدكتور من queueData لو selectedDoctor مش موجود
//           const savedQueue = localStorage.getItem('queueData');
//           if (savedQueue) {
//             doctorData = JSON.parse(savedQueue)?.doctor || null;
//           }
//         }
//         if (doctorData) setDoctorProfile(doctorData);
//       }

//       //  isAvailable من بيانات الدكتور الفعلية
//       if (doctorData) {
//         const statusFromServer = doctorData.status || doctorData.availability_status;
//         if (statusFromServer) {
//           setIsAvailable(statusFromServer === 'available');
//         }
//       }

//       const savedPatient = localStorage.getItem('currentPatient');
//       if (savedPatient) {
//         const patientData = normalizePatient(JSON.parse(savedPatient));
//         console.log('✅ Patient data loaded (normalized):', patientData);
//         setCurrentPatient(patientData);
//         setIsConsulting(true);
//         isConsultingRef.current = true;
//         stopQueuePolling();
//         if (patientData.id) {
//           await loadPatientFiles(patientData.id);
//         }
//         setPatientQueue([]);
//       } else {
//         const queue = await doctorAPI.getQueue();
//         setPatientQueue(toArray(queue));
//       }
//     } catch (err) {
//       setError('Failed to load data: ' + err.message);
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

 
//   const toggleStatus = async () => {
//     const newStatus = !isAvailable;
//     setIsAvailable(newStatus); 
//     try {
//       setLoading(true);
//       const result = await doctorAPI.updateStatus({ available: newStatus });
//       console.log('✅ Status updated to:', newStatus ? 'available' : 'break', result);
//     } catch (err) {
//       setIsAvailable(!newStatus); 
    
//       const errMsg = typeof err?.message === 'string'
//         ? err.message
//         : JSON.stringify(err);
//       setError('Failed to update status: ' + errMsg);
//       console.error('❌ Status update failed:', errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // callNextPatient مع handling ل
//   const callNextPatient = async () => {
//     if (!isAvailable || patientQueue.length === 0) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await doctorAPI.callNext();
//       console.log('📋 callNext response:', JSON.stringify(response, null, 2));

//       if (response && response.patient) {
//         const patientId = response.patient.patient_id || response.patient.id;
//         console.log('🔍 Fetching patient details for ID:', patientId);

//         let patientDetails = {};
//         try {
//           patientDetails = await doctorAPI.getPatient(patientId);
//           console.log('✅ Patient details:', JSON.stringify(patientDetails, null, 2));
//         } catch (patientErr) {
//           console.warn('⚠️ Could not fetch full patient details, using queue data:', patientErr);
//           //  لو getPatient فشل استخدم البيانات الموجودة في response
//           patientDetails = response.patient;
//         }

//         // دمج صح لأي structure ترجع من الـ API
//         const mergedPatient = {
//           ...response.patient,
//           ...patientDetails,
//           id: patientDetails?.id || patientDetails?.patient_id || response.patient?.patient_id || response.patient?.id,
//           queue_id: response.patient?.queue_id || response.queue_id,
//           name: patientDetails?.name || patientDetails?.patient_name || patientDetails?.full_name || response.patient?.patient_name || 'Unknown',
//           severity: response.patient?.severity_level || response.patient?.severity,
//         };

//         console.log('✅ Merged patient:', JSON.stringify(mergedPatient, null, 2));

//         const calledPatientId = mergedPatient.id || mergedPatient.patient_id;
//         const calledQueueId = mergedPatient.queue_id || response.patient?.queue_id || response.queue_id;

//         //  شيل المريض فوراً من الـ queue
//         setPatientQueue(prev => prev.filter(p => {
//           const pid = p.patient_id || p.id;
//           const qid = p.queue_id;
//           return pid !== calledPatientId && qid !== calledQueueId;
//         }));

//         setCurrentPatient(normalizePatient(mergedPatient));
//         setIsConsulting(true);
//         isConsultingRef.current = true;
//         stopQueuePolling();

//         if (calledPatientId) {
//           await loadPatientFiles(calledPatientId);
//         }

//         //  sync مع الـ server - بشيل المريض المستدعي من النتيجة
//         try {
//           const updatedQueue = await doctorAPI.getQueue();
//           const filtered = toArray(updatedQueue).filter(p => {
//             const pid = p.patient_id || p.id;
//             const qid = p.queue_id;
//             return pid !== calledPatientId && qid !== calledQueueId;
//           });
//           setPatientQueue(filtered);
//         } catch (_) {}
//       } else {
//         console.warn('⚠️ No patient in response:', response);
//         setError('No patient available in queue.');
//       }
//     } catch (err) {
//       setError('Failed to call next patient: ' + err.message);
//       console.error('❌ callNextPatient error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompleteConsultation = async () => {
//     if (!currentPatient) return;
//     try {
//       setLoading(true);
//       setError(null);

//       const consultationData = {
//         diagnosis,
//         notes,
//         ai_evaluation: aiEvaluation,
//         xray_uploaded: !!uploadedXray,
//         lab_test_uploaded: !!uploadedLab,
//         symptoms: currentPatient.symptoms || '',
//         patient_id: currentPatient.id,
//         timestamp: new Date().toISOString()
//       };

//       localStorage.removeItem('selectedDoctor');
//       localStorage.removeItem('currentPatient');
//       localStorage.removeItem('queueData');

//       await doctorAPI.completeConsultation(
//         currentPatient.queue_id || currentPatient.id,
//         consultationData
//       );

//       setIsConsulting(false);
//       isConsultingRef.current = false;
//       setCurrentPatient(null);
//       setDiagnosis('');
//       setNotes('');
//       setAiEvaluation('');
//       setUploadedXray(null);
//       setUploadedLab(null);
//       setPatientMedicalFiles([]);
//       setXrayFiles([]);
//       setLabTestFiles([]);
//       setTreatmentHistory([]);

//       const updatedQueue = await doctorAPI.getQueue();
//       setPatientQueue(toArray(updatedQueue));
//       startQueuePolling();

//       alert('Consultation completed successfully!');
//       window.location.href = '/';
//     } catch (err) {
//       setError('Failed to complete consultation: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNoShow = async () => {
//     if (!currentPatient) return;
//     if (!window.confirm('❌ Mark this patient as no-show?')) return;

//     try {
//       setLoading(true);

//       await doctorAPI.markNoShow(currentPatient.queue_id || currentPatient.id);

//       //  امسح بيانات المريض الحاليـ selectedDoctor
//       localStorage.removeItem('currentPatient');
//       localStorage.removeItem('queueData');

//       //  reset بيانات المريض وارجع للـ queue بدون redirect
//       setIsConsulting(false);
//       isConsultingRef.current = false;
//       setCurrentPatient(null);
//       setDiagnosis('');
//       setNotes('');
//       setAiEvaluation('');
//       setUploadedXray(null);
//       setUploadedLab(null);
//       setPatientMedicalFiles([]);
//       setXrayFiles([]);
//       setLabTestFiles([]);
//       setTreatmentHistory([]);

//       const updatedQueue = await doctorAPI.getQueue();
//       setPatientQueue(toArray(updatedQueue));
//       startQueuePolling();

//       //  مفيش redirect فضل في نفس الصفحة
//     } catch (err) {
//       setError('Failed to mark no-show: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNote = async (noteText) => {
//     if (!currentPatient || !noteText.trim()) return;
//     try {
//       await doctorAPI.addNote({ patient_id: currentPatient.id, note: noteText });
//       alert('Note added successfully!');
//     } catch (err) {
//       setError('Failed to add note: ' + err.message);
//     }
//   };

//   const handleDeleteMedicalFile = async (fileId, fileType) => {
//     if (!window.confirm('Are you sure you want to delete this file?')) return;
//     try {
//       setLoading(true);
//       await doctorAPI.deleteMedicalFile(fileId);
//       setPatientMedicalFiles(prev => prev.filter(f => f.id !== fileId));
//       if (fileType === 'xray') {
//         setXrayFiles(prev => prev.filter(f => f.id !== fileId));
//         if (xrayFiles.length > 1) {
//           const nextFile = xrayFiles.find(f => f.id !== fileId);
//           setUploadedXray(nextFile?.file_url || nextFile?.url);
//         } else {
//           setUploadedXray(null);
//         }
//       } else if (fileType === 'lab_test') {
//         setLabTestFiles(prev => prev.filter(f => f.id !== fileId));
//         if (labTestFiles.length > 1) {
//           const nextFile = labTestFiles.find(f => f.id !== fileId);
//           setUploadedLab(nextFile?.file_url || nextFile?.url);
//         } else {
//           setUploadedLab(null);
//         }
//       }
//       alert('File deleted successfully!');
//     } catch (err) {
//       setError('Failed to delete file: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleXrayFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (file && currentPatient) {
//       try {
//         setLoading(true);

//         //  ارفع الملف
//         const result = await doctorAPI.uploadMedicalFile({
//           file,
//           patientId: currentPatient.id,
//           fileType: 'xray',
//           title: `X-ray - ${new Date().toLocaleDateString()}`,
//           description: 'Uploaded during consultation',
//           doctorId: doctorProfile?.id
//         });

//         // AI analysis
//         let aiResult = null;
//         try {
//           aiResult = await doctorAPI.analyzeMedicalImage({
//             file,
//             patientId: currentPatient.id,
//             symptoms: currentPatient.symptoms || '',
//           });
//           console.log('✅ AI analysis result:', aiResult);
//         } catch (aiErr) {
//           console.warn('⚠️ AI analysis failed:', aiErr);
//         }

//         // الـ ai_analysis في الـ result
//         let aiText = null;
//         if (aiResult) {
//           if (aiResult.success && aiResult.analysis) {
//             aiText = aiResult.analysis;
//           } else if (!aiResult.success && aiResult.error) {
//             aiText = `⚠️ AI analysis unavailable: ${aiResult.error}`;
//           }
//         }

        
//         const localXrayUrl = URL.createObjectURL(file);
//         const remoteXrayUrl = getFullUrl(result.file_url || result.url);
//         const blobXrayUrl = remoteXrayUrl ? await fetchImageAsBlob(remoteXrayUrl) : localXrayUrl;

//         const enrichedResult = {
//           ...result,
//           file_url: blobXrayUrl || localXrayUrl,
//           ai_analysis: aiText,
//           title: result.title || aiResult?.suggested_title,
//           created_at: result.created_at || aiResult?.analyzed_at,
//         };

//         setUploadedXray(enrichedResult.file_url);
//         setXrayFiles(prev => [enrichedResult, ...prev]);
//         setCurrentXrayIndex(0);
//         setShowXrayModal(true);
//         alert('X-ray uploaded successfully!');
//         event.target.value = null;
//       } catch (err) {
//         setError('Failed to upload X-ray: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     } else if (file && !currentPatient) {
//       setUploadedXray(URL.createObjectURL(file));
//       setShowXrayModal(true);
//       event.target.value = null;
//     }
//   };

//   const handleLabTestFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (file && currentPatient) {
//       try {
//         setLoading(true);

//         // ارفع الملف
//         const result = await doctorAPI.uploadMedicalFile({
//           file,
//           patientId: currentPatient.id,
//           fileType: 'lab_test',
//           title: `Lab Test - ${new Date().toLocaleDateString()}`,
//           description: 'Uploaded during consultation',
//           doctorId: doctorProfile?.id
//         });

//         //  حاول تعمل AI analysis
//         let aiResult = null;
//         try {
//           aiResult = await doctorAPI.analyzeMedicalImage({
//             file,
//             patientId: currentPatient.id,
//             symptoms: currentPatient.symptoms || '',
//           });
//           console.log(' AI analysis result:', aiResult);
//         } catch (aiErr) {
//           console.warn(' AI analysis failed:', aiErr);
//         }

//         //  ادمج الـ ai_analysis في الـ result
//         let aiTextLab = null;
//         if (aiResult) {
//           if (aiResult.success && aiResult.analysis) {
//             aiTextLab = aiResult.analysis;
//           } else if (!aiResult.success && aiResult.error) {
//             aiTextLab = `⚠️ AI analysis unavailable: ${aiResult.error}`;
//           }
//         }

      
//         const localLabUrl = URL.createObjectURL(file);
//         const remoteLabUrl = getFullUrl(result.file_url || result.url);
//         const blobLabUrl = remoteLabUrl ? await fetchImageAsBlob(remoteLabUrl) : localLabUrl;

//         const enrichedResult = {
//           ...result,
//           file_url: blobLabUrl || localLabUrl,
//           ai_analysis: aiTextLab,
//           title: result.title || aiResult?.suggested_title,
//           created_at: result.created_at || aiResult?.analyzed_at,
//         };

//         setUploadedLab(enrichedResult.file_url);
//         setLabTestFiles(prev => [enrichedResult, ...prev]);
//         setCurrentLabIndex(0);
//         setShowBloodTestModal(true);
//         alert('Lab test uploaded successfully!');
//         event.target.value = null;
//       } catch (err) {
//         setError('Failed to upload lab test: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     } else if (file && !currentPatient) {
//       setUploadedLab(URL.createObjectURL(file));
//       setShowBloodTestModal(true);
//       event.target.value = null;
//     }
//   };

//   const getSeverityClasses = (level) => {
//     switch (level) {
//       case 'high': return 'border-r-red-500 bg-red-50';
//       case 'medium': return 'border-r-orange-500 bg-orange-50';
//       case 'low': return 'border-r-green-500 bg-green-50';
//       default: return 'border-r-gray-300 bg-white';
//     }
//   };

//   const getSeverityBadgeClasses = (level) => {
//     switch (level) {
//       case 'high': return 'bg-red-500 text-white';
//       case 'medium': return 'bg-orange-500 text-white';
//       case 'low': return 'bg-green-500 text-white';
//       default: return 'bg-gray-500 text-white';
//     }
//   };

//   const handleZoomIn = () => setXrayZoom(prev => prev + 0.2);
//   const handleZoomOut = () => xrayZoom > 0.4 && setXrayZoom(prev => prev - 0.2);
//   const handleResetZoom = () => { setXrayZoom(1); setXrayPosition({ x: 0, y: 0 }); };
//   const handleXrayMouseDown = (e) => { setIsDraggingXray(true); setXrayDragStart({ x: e.clientX - xrayPosition.x, y: e.clientY - xrayPosition.y }); };
//   const handleXrayMouseMove = (e) => { if (!isDraggingXray) return; setXrayPosition({ x: e.clientX - xrayDragStart.x, y: e.clientY - xrayDragStart.y }); };
//   const handleXrayMouseUp = () => setIsDraggingXray(false);

//   const handleLabZoomIn = () => setLabZoom(prev => prev + 0.2);
//   const handleLabZoomOut = () => labZoom > 0.4 && setLabZoom(prev => prev - 0.2);
//   const handleResetLabZoom = () => { setLabZoom(1); setLabPosition({ x: 0, y: 0 }); };
//   const handleLabMouseDown = (e) => { setIsDraggingLab(true); setLabDragStart({ x: e.clientX - labPosition.x, y: e.clientY - labPosition.y }); };
//   const handleLabMouseMove = (e) => { if (!isDraggingLab) return; setLabPosition({ x: e.clientX - labDragStart.x, y: e.clientY - labDragStart.y }); };
//   const handleLabMouseUp = () => setIsDraggingLab(false);

//   const getFilterStyle = () => {
//     switch (activeFilter) {
//       case 'contrast': return { filter: 'contrast(1.5)' };
//       case 'brightness': return { filter: 'brightness(1.3)' };
//       case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
//       case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
//       default: return { filter: 'none' };
//     }
//   };

//   const getLabFilterStyle = () => {
//     switch (activeLabFilter) {
//       case 'contrast': return { filter: 'contrast(1.5)' };
//       case 'brightness': return { filter: 'brightness(1.3)' };
//       case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
//       case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
//       default: return { filter: 'none' };
//     }
//   };

//   if (loading && !doctorProfile) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-slate-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderBold = (text) => {
//     const parts = text.split(/\*\*(.+?)\*\*/g);
//     return parts.map((part, i) =>
//       i % 2 === 1 ? <strong key={i}>{part}</strong> : part
//     );
//   };

//   const renderAiAnalysis = (text) => {
//     if (!text) return <p className="text-gray-400 text-sm">No AI analysis available</p>;
//     return (
//       <div className="space-y-1.5 text-sm leading-relaxed">
//         {text.split('\n').map((line, i) => {
//           const t = line.trim();
//           if (!t) return <div key={i} className="h-1" />;
//           if (t.startsWith('### ') || t.startsWith('## ')) {
//             const h = t.replace(/^##+\s*\d*\.?\s*/, '').replace(/\*\*/g, '');
//             return <h4 key={i} className="font-bold text-blue-800 text-base mt-3 mb-1">{h}</h4>;
//           }
//           if (t.includes('⚠️') || t.toLowerCase().includes('disclaimer') || t.toLowerCase().includes('warning'))
//             return <p key={i} className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 rounded text-yellow-800 font-semibold text-sm">{t.replace(/\*\*/g, '')}</p>;
//           if (/contraindic|danger|خطر/i.test(t))
//             return <p key={i} className="bg-red-50 border-l-4 border-red-400 px-3 py-2 rounded text-red-700 font-semibold text-sm">{t.replace(/\*\*/g, '')}</p>;
//           if (/abnormal|غير طبيعي/i.test(t))
//             return <h4 key={i} className="font-bold text-orange-600 mt-3 mb-1">{t.replace(/\*\*/g, '').replace(/^[-•#]*\s*\d*\.?\s*/, '')}</h4>;
//           if (/recommend|توصي|نصائح/i.test(t))
//             return <h4 key={i} className="font-bold text-green-700 mt-3 mb-1">{t.replace(/\*\*/g, '').replace(/^[-•#]*\s*\d*\.?\s*/, '')}</h4>;
//           if (t.startsWith('- ') || t.startsWith('• '))
//             return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-400 mt-0.5">•</span><span className="text-gray-700">{renderBold(t.replace(/^[-•]\s*/, ''))}</span></div>;
//           if (/^\d+[\.] /.test(t))
//             return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-800 font-bold min-w-[20px]">{t.match(/^\d+/)[0]}.</span><span className="text-gray-700">{renderBold(t.replace(/^\d+[\.] /, ''))}</span></div>;
//           return <p key={i} className="text-gray-700">{renderBold(t)}</p>;
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="w-full mx-auto bg-[#e8f3f9] shadow-sm">

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//             <button onClick={() => setError(null)} className="mt-2 text-sm underline">Dismiss</button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="bg-white border border-blue-200 rounded-2xl mx-1 mb-1 p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center" dir='rtl'>
//           <div className='px-5'>
//             <h1 className="text-2xl font-bold text-[#2C5F8D]">
//               {doctorProfile?.name || doctorProfile?.full_name || doctorProfile?.doctor_name || ''}
//             </h1>
//             <p className="text-sm text-[#5B9BD5]">
//               {doctorProfile?.specialty_ar || doctorProfile?.specialty || doctorProfile?.specialization || ''}
//             </p>
//             <p className="text-xs text-slate-500">
//               {(doctorProfile?.floor || doctorProfile?.room) ? `دور ${doctorProfile?.floor ?? '—'} – غرفة ${doctorProfile?.room || doctorProfile?.room_number || '—'}` : ''}
//             </p>
//           </div>
//           <div className="flex gap-3 items-center max-sm:justify-between">
//             {/*  Status badge ي*/}
//             <span className={`px-5 py-2 rounded-lg font-medium text-sm ${
//               !isAvailable
//                 ? 'bg-gray-100 text-gray-600'
//                 : (isConsulting ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')
//             }`}>
//               Status: {!isAvailable ? 'Break' : (isConsulting ? 'Busy' : 'Available')}
//             </span>
//             <button
//               onClick={toggleStatus}
//               disabled={loading}
//               className="px-5 py-2 bg-azraq-400 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : (isAvailable ? 'Take Break' : 'Return to Work')}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr]">
//           {/* Patient Queue Sidebar */}
//           <div className="bg-slate-50 border-l ms-1 rounded-2xl border-blue-200 border lg:p-6 lg:sticky p-5 lg:top-0 lg:h-screen overflow-y-auto">
//             <div className="flex justify-between items-center mb-5">
//               <h2 className="text-xl font-bold text-slate-800">Patient Queue</h2>
//               <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
//                 {patientQueue.length} waiting
//               </span>
//             </div>
//             <div className="space-y-3">
//               {patientQueue.map((patient, index) => (
//                 <div
//                   key={patient.id || patient.queue_id || index}
//                   className={`bg-white p-4 rounded-xl border-r-4 cursor-pointer transition-all hover:-translate-x-1 hover:shadow-lg ${
//                     getSeverityClasses(patient.severityLevel || patient.severity_level)
//                   }`}
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-bold text-slate-800">
//                       {patient.name || patient.patient_name || patient.full_name || 'Unknown'}
//                     </span>
//                     <span className={`px-2 py-1 rounded-xl text-xs font-bold ${
//                       getSeverityBadgeClasses(patient.severityLevel || patient.severity_level)
//                     }`}>
//                       {patient.severity || patient.severityLevel || patient.severity_level || '?'}/10
//                     </span>
//                   </div>
//                   <div className="text-sm text-slate-600">
//                     Wait time: {patient.waitTime || patient.wait_time || '~5 minutes'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={callNextPatient}
//               disabled={!isAvailable || loading || patientQueue.length === 0}
//               className="w-full mt-5 py-4 bg-gradient-to-r from-azraq-400 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Loading...' : 'Call Next Patient'}
//             </button>
//           </div>

//           {/* Main Patient Panel */}
//           <div className="p-4 sm:p-6 lg:p-8 space-y-6">
//             {/*  الشرط بيشيك على isConsulting و currentPatient مع بعض */}
//             {!isConsulting || !currentPatient ? (
//               <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
//                 <span className="text-8xl">🏥</span>
//                 <h2 className="text-2xl font-bold text-slate-500">No Active Patient</h2>
//                 <p>Select "Call Next Patient" from the queue to start.</p>
//               </div>
//             ) : (
//               <>
//                 {/* Patient Information */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-azraq-400 mb-5 flex items-center gap-3">
//                     👤 Patient Information
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="font-bold text-2xs text-slate-800 mb-1">Patient ID</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.id}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Name</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.name}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">National ID</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.national_id || '—'}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Age / Gender</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.age ? `${currentPatient.age} years` : '—'} / {currentPatient.gender || '—'}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Blood Type</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.blood_type || '—'}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">BMI</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.bmi || '—'}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-red-50 p-4 rounded-xl">
//                       <p className="font-bold text-red-700 mb-2">⚠️ Chronic Diseases</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const diseases = currentPatient.chronic_diseases;
//                           if (!diseases || diseases === '' || (Array.isArray(diseases) && diseases.length === 0))
//                             return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(diseases))
//                             return diseases.map((d, i) => <li key={i} className="text-slate-700">• {d}</li>);
//                           if (typeof diseases === 'string' && diseases.trim())
//                             return diseases.split(',').map((d, i) => <li key={i} className="text-slate-700">• {d.trim()}</li>);
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                     <div className="bg-orange-50 p-4 rounded-xl">
//                       <p className="font-bold text-orange-700 mb-2">🚫 Allergies</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const allergies = currentPatient.allergies;
//                           if (!allergies || allergies === '' || (Array.isArray(allergies) && allergies.length === 0))
//                             return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(allergies))
//                             return allergies.map((a, i) => <li key={i} className="text-slate-700">• {a}</li>);
//                           if (typeof allergies === 'string' && allergies.trim())
//                             return allergies.split(',').map((a, i) => <li key={i} className="text-slate-700">• {a.trim()}</li>);
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                     <div className="bg-green-50 p-4 rounded-xl">
//                       <p className="font-bold text-green-700 mb-2">💊 Current Medications</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const medications = currentPatient.medications;
//                           if (!medications || medications === '' || (Array.isArray(medications) && medications.length === 0))
//                             return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(medications))
//                             return medications.map((m, i) => <li key={i} className="text-slate-700">• {m}</li>);
//                           if (typeof medications === 'string' && medications.trim())
//                             return medications.split(',').map((m, i) => <li key={i} className="text-slate-700">• {m.trim()}</li>);
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* AI Preliminary Analysis */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     🤖 AI Preliminary Analysis
//                   </h2>
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-500">
//                     <div className="flex justify-between items-center mb-1">
//                       <div className="font-bold text-blue-900">Reported Symptoms</div>
//                     </div>
//                     <p className='py-3'>
//                       {currentPatient.symptoms || currentPatient._consultations?.[0]?.symptoms || 'No symptoms reported'}
//                     </p>
//                     <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <div className="text-2xs text-slate-600 mb-1">AI Diagnosis</div>
//                         <div className="font-bold text-slate-800">
//                           {currentPatient._ai?.diagnosis || 'N/A'}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-2xs text-slate-600 mb-1">Confidence Level</div>
//                         <div className="font-bold text-slate-800">
//                           {currentPatient._ai?.confidence
//                             ? `${currentPatient._ai.confidence}%`
//                             : 'N/A'}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-2xs text-slate-600 mb-1">Recommended Department</div>
//                         <div className="font-bold text-slate-800">
//                           {currentPatient._ai?.department || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Treatment History */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     📋 Treatment History
//                   </h2>
//                   <div className="space-y-3">
//                     {(() => {
//                       const history = treatmentHistory.length > 0
//                         ? treatmentHistory
//                         : currentPatient._consultations || [];
//                       if (history.length === 0)
//                         return <p className="text-slate-400 text-sm">No treatment history available.</p>;
//                       return history.map((item, index) => (
//                         <div key={index} className="bg-slate-50 p-4 rounded-lg border-r-4 border-blue-500">
//                           <div className="flex justify-between items-center mb-2">
//                             <div className="font-bold text-slate-800">
//                               {item.ai_diagnosis || item.condition || item.diagnosis || item.chief_complaint || 'N/A'}
//                             </div>
//                             <div className="text-sm text-slate-600">
//                               {item.date || item.visit_date || item.created_at
//                                 ? new Date(item.date || item.visit_date || item.created_at).toLocaleDateString()
//                                 : ''}
//                             </div>
//                           </div>
//                           <div className="text-sm text-slate-600 mt-1">
//                             {item.symptoms && <span>🩺 {item.symptoms}</span>}
//                           </div>
//                           <div className="text-xs text-slate-400 mt-1">
//                             {item.specialty && `Dept: ${item.specialty}`}
//                             {item.severity && ` · Severity: ${item.severity}/10`}
//                           </div>
//                         </div>
//                       ));
//                     })()}
//                   </div>
//                 </div>

//                 {/* Reports & Scans */}
//                 {(xrayFiles.length > 0 || labTestFiles.length > 0) && (
//                   <div className="bg-white border border-slate-200 rounded-xl p-6">
//                     <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                       🔬 Reports & Scans
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {xrayFiles.length > 0 && (
//                         <div
//                           onClick={() => setShowXrayModal(true)}
//                           className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
//                         >
//                           <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
//                             <img
//                               src={xrayFiles[currentXrayIndex]?.file_url || xrayFiles[currentXrayIndex]?.url}
//                               alt="X-ray"
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                           <div className="p-4 bg-white">
//                             <div className="flex justify-between items-center">
//                               <div className="font-bold text-slate-800 text-lg">X-ray</div>
//                               <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                                 {xrayFiles.length} file{xrayFiles.length > 1 ? 's' : ''}
//                               </span>
//                             </div>
//                             <div className="text-sm text-slate-600">Click to view details</div>
//                           </div>
//                         </div>
//                       )}
//                       {labTestFiles.length > 0 && (
//                         <div
//                           onClick={() => setShowBloodTestModal(true)}
//                           className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
//                         >
//                           <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
//                             <img
//                               src={labTestFiles[currentLabIndex]?.file_url || labTestFiles[currentLabIndex]?.url}
//                               alt="Lab Test"
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                           <div className="p-4 bg-white">
//                             <div className="flex justify-between items-center">
//                               <div className="font-bold text-slate-800 text-lg">Blood Test</div>
//                               <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                                 {labTestFiles.length} file{labTestFiles.length > 1 ? 's' : ''}
//                               </span>
//                             </div>
//                             <div className="text-sm text-slate-600">Click to view details</div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Quick Actions */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     ⚡ Quick Actions
//                   </h2>
//                   <input type="file" ref={xrayFileInputRef} onChange={handleXrayFileChange} accept="image/*" className="hidden" />
//                   <input type="file" ref={labTestFileInputRef} onChange={handleLabTestFileChange} accept="image/*" className="hidden" />
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <button
//                       onClick={() => xrayFileInputRef.current.click()}
//                       className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
//                     >
//                       <span className="text-4xl">📷</span>
//                       <span className="font-bold text-lg">Analyze X-ray</span>
//                       <span className="text-sm opacity-90">Upload and analyze medical images</span>
//                     </button>
//                     <button
//                       onClick={() => labTestFileInputRef.current.click()}
//                       className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
//                     >
//                       <span className="text-4xl">📋</span>
//                       <span className="font-bold text-lg">Review Lab Test</span>
//                       <span className="text-sm opacity-90">Upload and review lab results</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Complete Consultation */}
//                 <div className="bg-white rounded-xl p-6 shadow-lg border-t-2 border-b-2 border-t-azraq-400">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     ✍️ Complete Consultation
//                   </h2>
//                   <div className="bg-slate-50 p-5 rounded-xl space-y-5">
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-2">Final Diagnosis:</label>
//                       <textarea
//                         value={diagnosis}
//                         onChange={(e) => setDiagnosis(e.target.value)}
//                         className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]"
//                         placeholder="Enter final diagnosis..."
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-2">Doctor's Notes:</label>
//                       <textarea
//                         value={notes}
//                         onChange={(e) => setNotes(e.target.value)}
//                         className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]"
//                         placeholder="Enter additional notes..."
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-3">AI Diagnosis Evaluation:</label>
//                       <div className="flex gap-5">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input type="radio" name="aiEvaluation" value="agree" checked={aiEvaluation === 'agree'} onChange={(e) => setAiEvaluation(e.target.value)} className="w-5 h-5 text-green-500" />
//                           <span className="text-slate-700 font-medium">Agree with AI</span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input type="radio" name="aiEvaluation" value="disagree" checked={aiEvaluation === 'disagree'} onChange={(e) => setAiEvaluation(e.target.value)} className="w-5 h-5 text-red-500" />
//                           <span className="text-slate-700 font-medium">Disagree with AI</span>
//                         </label>
//                       </div>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button
//                         onClick={handleCompleteConsultation}
//                         disabled={loading}
//                         className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
//                       >
//                         {loading ? 'Completing...' : '✅ Complete Consultation'}
//                       </button>
//                       <button
//                         onClick={handleNoShow}
//                         disabled={loading}
//                         className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
//                       >
//                         {loading ? 'Marking...' : '❌ Mark No-Show'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* X-ray Modal */}
//       {showXrayModal && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5">
//           <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
//             <div className='flex justify-between items-center'>
//               <h2 className="text-xl font-bold text-azraq-400">
//                 X-ray {xrayFiles[currentXrayIndex]?.title ? `- ${xrayFiles[currentXrayIndex].title}` : ''}
//               </h2>
//               <button onClick={() => setShowXrayModal(false)} className="w-10 h-9 text-black flex items-center justify-center text-2xl hover:bg-red-600 hover:text-white">×</button>
//             </div>
//             <hr className='my-4 text-gray-300' />
//             <div className="bg-slate-900 p-5 rounded-xl mb-4 overflow-hidden">
//               <div className="relative h-[500px] overflow-hidden cursor-move flex justify-center items-center"
//                 onMouseDown={handleXrayMouseDown} onMouseMove={handleXrayMouseMove} onMouseUp={handleXrayMouseUp} onMouseLeave={handleXrayMouseUp}>
//                 <img
//                   src={xrayFiles[currentXrayIndex]?.file_url || xrayFiles[currentXrayIndex]?.url || uploadedXray}
//                   alt="X-ray"
//                   className="absolute rounded-lg transition-transform select-none w-1/2"
//                   style={{ transform: `translate(${xrayPosition.x}px, ${xrayPosition.y}px) scale(${xrayZoom})`, transformOrigin: 'center center', cursor: isDraggingXray ? 'grabbing' : 'grab', ...getFilterStyle() }}
//                   draggable="false"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 mb-4 flex-wrap">
//               <button onClick={handleZoomIn} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">+ Zoom In</button>
//               <button onClick={handleResetZoom} className="px-5 py-2 bg-[#4c5361] text-white rounded-lg font-bold hover:bg-blue-600">↻ Reset</button>
//               <button onClick={handleZoomOut} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">- Zoom Out</button>
//               {xrayFiles.length > 1 && (
//                 <>
//                   <button onClick={() => setCurrentXrayIndex(prev => Math.max(0, prev - 1))} disabled={currentXrayIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">← Previous</button>
//                   <button onClick={() => setCurrentXrayIndex(prev => Math.min(xrayFiles.length - 1, prev + 1))} disabled={currentXrayIndex === xrayFiles.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">Next →</button>
//                 </>
//               )}
//               {xrayFiles[currentXrayIndex]?.id && (
//                 <button onClick={() => handleDeleteMedicalFile(xrayFiles[currentXrayIndex].id, 'xray')} className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">🗑️ Delete</button>
//               )}
//             </div>
//             <div className="mb-4">
//               <strong className="block mb-2 text-slate-800">Filters:</strong>
//               <div className="flex gap-2 flex-wrap">
//                 {['normal', 'contrast', 'brightness', 'sharpen', 'grayscale'].map((filter) => (
//                   <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === filter ? 'bg-[#214371] text-white' : 'bg-slate-600 text-white hover:bg-slate-700'}`}>
//                     {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-[#e8f3f9] p-5 rounded-xl">
//               <h3 className="font-bold text-lg mb-4 text-azraq-400">Report Information:</h3>
//               <div className='flex justify-between pe-9'>
//                 <div>
//                   <h2 className='text-lg text-azraq-400'>Report Type</h2>
//                   <p className='pb-4'>X-ray</p>
//                   <h2 className='text-lg text-azraq-400'>Upload time</h2>
//                   <p>{xrayFiles[currentXrayIndex]?.created_at ? new Date(xrayFiles[currentXrayIndex].created_at).toLocaleTimeString() : '-'}</p>
//                 </div>
//                 <div>
//                   <h2 className='text-lg text-azraq-400'>Date</h2>
//                   <p className='pb-4'>{xrayFiles[currentXrayIndex]?.created_at ? new Date(xrayFiles[currentXrayIndex].created_at).toLocaleDateString() : '-'}</p>
//                   <h2 className='text-lg text-azraq-400'>Analyzed by</h2>
//                   <p className='pb-4'>{doctorProfile?.name || doctorProfile?.name || 'Doctor'}</p>
//                 </div>
//               </div>
//               <div className='bg-white p-3'>
//                 <h2 className="font-bold text-blue-800 mb-2">AI Analysis</h2>
//                 {renderAiAnalysis(xrayFiles[currentXrayIndex]?.ai_analysis)}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Lab Test Modal */}
//       {showBloodTestModal && (
//         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-5">
//           <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
//             <div className='flex justify-between items-center'>
//               <h2 className="text-xl font-bold text-azraq-400">
//                 Blood Test {labTestFiles[currentLabIndex]?.title ? `- ${labTestFiles[currentLabIndex].title}` : ''}
//               </h2>
//               <button onClick={() => setShowBloodTestModal(false)} className="w-10 h-9 text-black flex items-center justify-center text-2xl hover:bg-red-600 hover:text-white">×</button>
//             </div>
//             <hr className='my-4 text-gray-300' />
//             <div className="bg-slate-900 p-5 rounded-xl mb-4 overflow-hidden">
//               <div className="relative h-[500px] overflow-hidden cursor-move flex justify-center items-center"
//                 onMouseDown={handleLabMouseDown} onMouseMove={handleLabMouseMove} onMouseUp={handleLabMouseUp} onMouseLeave={handleLabMouseUp}>
//                 <img
//                   src={labTestFiles[currentLabIndex]?.file_url || labTestFiles[currentLabIndex]?.url || uploadedLab}
//                   alt="Lab Test"
//                   className="absolute rounded-lg transition-transform select-none w-1/2"
//                   style={{ transform: `translate(${labPosition.x}px, ${labPosition.y}px) scale(${labZoom})`, transformOrigin: 'center center', cursor: isDraggingLab ? 'grabbing' : 'grab', ...getLabFilterStyle() }}
//                   draggable="false"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 mb-4 flex-wrap">
//               <button onClick={handleLabZoomIn} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">+ Zoom In</button>
//               <button onClick={handleResetLabZoom} className="px-5 py-2 bg-[#4c5361] text-white rounded-lg font-bold hover:bg-blue-600">↻ Reset</button>
//               <button onClick={handleLabZoomOut} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">- Zoom Out</button>
//               {labTestFiles.length > 1 && (
//                 <>
//                   <button onClick={() => setCurrentLabIndex(prev => Math.max(0, prev - 1))} disabled={currentLabIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">← Previous</button>
//                   <button onClick={() => setCurrentLabIndex(prev => Math.min(labTestFiles.length - 1, prev + 1))} disabled={currentLabIndex === labTestFiles.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">Next →</button>
//                 </>
//               )}
//               {labTestFiles[currentLabIndex]?.id && (
//                 <button onClick={() => handleDeleteMedicalFile(labTestFiles[currentLabIndex].id, 'lab_test')} className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">🗑️ Delete</button>
//               )}
//             </div>
//             <div className="mb-4">
//               <strong className="block mb-2 text-slate-800">Filters:</strong>
//               <div className="flex gap-2 flex-wrap">
//                 {['normal', 'contrast', 'brightness', 'sharpen', 'grayscale'].map((filter) => (
//                   <button key={filter} onClick={() => setActiveLabFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeLabFilter === filter ? 'bg-[#214371] text-white' : 'bg-slate-600 text-white hover:bg-slate-700'}`}>
//                     {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-[#e8f3f9] p-5 rounded-xl">
//               <h3 className="font-bold text-lg mb-4 text-azraq-400">Report Information:</h3>
//               <div className='flex justify-between pe-9'>
//                 <div>
//                   <h2 className='text-lg text-azraq-400'>Report Type</h2>
//                   <p className='pb-4'>Blood Test</p>
//                   <h2 className='text-lg text-azraq-400'>Upload time</h2>
//                   <p>{labTestFiles[currentLabIndex]?.created_at ? new Date(labTestFiles[currentLabIndex].created_at).toLocaleTimeString() : '-'}</p>
//                 </div>
//                 <div>
//                   <h2 className='text-lg text-azraq-400'>Date</h2>
//                   <p className='pb-4'>{labTestFiles[currentLabIndex]?.created_at ? new Date(labTestFiles[currentLabIndex].created_at).toLocaleDateString() : '-'}</p>
//                   <h2 className='text-lg text-azraq-400'>Analyzed by</h2>
//                   <p className='pb-4'>{doctorProfile?.name || doctorProfile?.name || 'Doctor'}</p>
//                 </div>
//               </div>
//               <div className='bg-white p-3'>
//                 <h2 className="font-bold text-blue-800 mb-2 my-3">AI Analysis</h2>
//                 {renderAiAnalysis(labTestFiles[currentLabIndex]?.ai_analysis)}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;







import React, { useState, useRef, useEffect, useCallback } from 'react';
import doctorAPI from '../Services/DoctorServices';

const DoctorDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showXrayModal, setShowXrayModal] = useState(false);
  const [showBloodTestModal, setShowBloodTestModal] = useState(false);
  const [xrayZoom, setXrayZoom] = useState(1);
  const [labZoom, setLabZoom] = useState(1);
  const [activeFilter, setActiveFilter] = useState('normal');
  const [activeLabFilter, setActiveLabFilter] = useState('normal');
  const [uploadedXray, setUploadedXray] = useState(null);
  const [uploadedLab, setUploadedLab] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientQueue, setPatientQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState('');
  const [patientMedicalFiles, setPatientMedicalFiles] = useState([]);
  const [xrayFiles, setXrayFiles] = useState([]);
  const [labTestFiles, setLabTestFiles] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
const [showAllHistory, setShowAllHistory] = useState(false);
  const [xrayPosition, setXrayPosition] = useState({ x: 0, y: 0 });
  const [isDraggingXray, setIsDraggingXray] = useState(false);
  const [xrayDragStart, setXrayDragStart] = useState({ x: 0, y: 0 });

  const [labPosition, setLabPosition] = useState({ x: 0, y: 0 });
  const [isDraggingLab, setIsDraggingLab] = useState(false);
  const [labDragStart, setLabDragStart] = useState({ x: 0, y: 0 });

  const [currentXrayIndex, setCurrentXrayIndex] = useState(0);
  const [currentLabIndex, setCurrentLabIndex] = useState(0);

  // NEW: pending states for the new quick-action flow
  const [pendingXrayFile, setPendingXrayFile] = useState(null);
  const [pendingXrayUrl, setPendingXrayUrl] = useState(null);
  const [pendingXrayAnalysis, setPendingXrayAnalysis] = useState(null);
  const [xrayAnalyzing, setXrayAnalyzing] = useState(false);
  const [savingXray, setSavingXray] = useState(false);

  const [pendingLabFile, setPendingLabFile] = useState(null);
  const [pendingLabUrl, setPendingLabUrl] = useState(null);
  const [pendingLabAnalysis, setPendingLabAnalysis] = useState(null);
  const [labAnalyzing, setLabAnalyzing] = useState(false);
  const [savingLab, setSavingLab] = useState(false);

  const xrayFileInputRef = useRef(null);
  const labTestFileInputRef = useRef(null);
  const queuePollingRef = useRef(null);
  const isConsultingRef = useRef(false);

  useEffect(() => {
    isConsultingRef.current = isConsulting;
  }, [isConsulting]);

  const toArray = (data) =>
    Array.isArray(data) ? data : data?.queue || data?.patients || data?.data || [];

  const normalizePatient = (raw) => {
    if (!raw) return raw;
    const p = raw.patient || raw;
    const consultations = raw.consultations || [];
    const latestConsult = consultations[0] || {};
    let age = p.age;
    if (!age && (p.date_of_birth || p.dob)) {
      const dob = new Date(p.date_of_birth || p.dob);
      age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    }
    let bmi = p.BMI || p.bmi;
    if (!bmi && p.weight && p.height) {
      const hM = p.height / 100;
      bmi = (p.weight / (hM * hM)).toFixed(1);
    }
    return {
      ...raw,
      id: p.id || p.patient_id || raw.patient_id,
      name: p.full_name || p.name || p.patient_name || raw.patient_name || 'Unknown',
      national_id: p.national_id || p.nationalId,
      age,
      gender: p.gender || p.sex,
      blood_type: p.blood_type || p.bloodType || p.blood_group,
      bmi,
      weight: p.weight,
      height: p.height,
      chronic_diseases: p.chronic_diseases || p.chronicDiseases,
      allergies: p.allergies,
      medications: p.current_medications || p.medications || p.currentMedications,
      symptoms: latestConsult.symptoms || raw.symptoms,
      _ai: {
        diagnosis: latestConsult.ai_diagnosis || raw.ai_diagnosis,
        confidence: latestConsult.severity ? latestConsult.severity * 10 : null,
        department: latestConsult.specialty || raw.specialty,
      },
      _consultations: consultations,
    };
  };

  const getFullUrl = (url) => {
    const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  const fetchImageAsBlob = async (url) => {
    if (!url) return null;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });
      if (!res.ok) return url;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      return url;
    }
  };

  const pollQueue = useCallback(async () => {
    if (isConsultingRef.current) return;
    try {
      const queue = await doctorAPI.getQueue();
      const filtered = toArray(queue).filter(p =>
        p.queue_status !== 'called' && p.queue_status !== 'in_progress' && p.queue_status !== 'in_consultation'
      );
      setPatientQueue(filtered);
    } catch (err) {
      console.warn('Queue polling error:', err);
    }
  }, []);

  const startQueuePolling = useCallback(() => {
    if (queuePollingRef.current) clearInterval(queuePollingRef.current);
    queuePollingRef.current = setInterval(pollQueue, 10000);
  }, [pollQueue]);

  const stopQueuePolling = useCallback(() => {
    if (queuePollingRef.current) {
      clearInterval(queuePollingRef.current);
      queuePollingRef.current = null;
    }
  }, []);

  const loadPatientFiles = async (patientId) => {
    try {
      const allFiles = await doctorAPI.getPatientFiles(patientId);
      const filesArray = allFiles?.files && Array.isArray(allFiles.files)
        ? allFiles.files
        : Array.isArray(allFiles) ? allFiles : [];
      const rawFiles = filesArray.map(f => ({ ...f, file_url: getFullUrl(f.file_url || f.url) }));
      const fixedFiles = await Promise.all(
        rawFiles.map(async f => ({ ...f, file_url: await fetchImageAsBlob(f.file_url) }))
      );
      setPatientMedicalFiles(fixedFiles);
      const xrays = fixedFiles.filter(f => f.file_type === 'xray');
      const labTests = fixedFiles.filter(f => f.file_type === 'lab_test');
      setXrayFiles(xrays);
      setLabTestFiles(labTests);
      if (xrays.length > 0) setUploadedXray(xrays[0].file_url);
      if (labTests.length > 0) setUploadedLab(labTests[0].file_url);
    } catch (fileError) {
      console.warn('Could not load patient files:', fileError);
    }

    try {
      const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';
      const token = localStorage.getItem('token');
      const historyRes = await fetch(`${BASE_URL}/patients/${patientId}/history`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const historyArray = Array.isArray(historyData)
          ? historyData
          : historyData?.history || historyData?.data || historyData?.records || [];
        setTreatmentHistory(historyArray);
      }
    } catch (histErr) {
      console.warn('Could not load treatment history:', histErr);
    }
  };

  useEffect(() => {
    loadInitialData();
    startQueuePolling();
    return () => stopQueuePolling();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      let doctorData = null;
      try {
        const profile = await doctorAPI.getProfile();
        doctorData = profile?.doctor || profile;
        if (!doctorData?.floor || !doctorData?.room) {
          const savedQueue = localStorage.getItem('queueData');
          if (savedQueue) {
            const queueDoctor = JSON.parse(savedQueue)?.doctor;
            if (queueDoctor) {
              doctorData = { floor: queueDoctor.floor, room: queueDoctor.room, specialty: queueDoctor.specialty, specialty_ar: queueDoctor.specialty_ar, ...doctorData };
            }
          }
        }
        setDoctorProfile(doctorData);
        localStorage.setItem('selectedDoctor', JSON.stringify(doctorData));
      } catch {
        const savedDoctor = localStorage.getItem('selectedDoctor');
        if (savedDoctor) {
          doctorData = JSON.parse(savedDoctor);
        } else {
          const savedQueue = localStorage.getItem('queueData');
          if (savedQueue) doctorData = JSON.parse(savedQueue)?.doctor || null;
        }
        if (doctorData) setDoctorProfile(doctorData);
      }

      if (doctorData) {
        const statusFromServer = doctorData.status || doctorData.availability_status;
        if (statusFromServer) setIsAvailable(statusFromServer === 'available');
      }

      const savedPatient = localStorage.getItem('currentPatient');
      if (savedPatient) {
        const patientData = normalizePatient(JSON.parse(savedPatient));
        setCurrentPatient(patientData);
        setIsConsulting(true);
        isConsultingRef.current = true;
        stopQueuePolling();
        if (patientData.id) await loadPatientFiles(patientData.id);
        setPatientQueue([]);
      } else {
        const queue = await doctorAPI.getQueue();
        setPatientQueue(toArray(queue));
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    try {
      setLoading(true);
      await doctorAPI.updateStatus({ available: newStatus });
    } catch (err) {
      setIsAvailable(!newStatus);
      setError('Failed to update status: ' + (err?.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const callNextPatient = async () => {
    if (!isAvailable || patientQueue.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const response = await doctorAPI.callNext();
      if (response && response.patient) {
        const patientId = response.patient.patient_id || response.patient.id;
        let patientDetails = {};
        try {
          patientDetails = await doctorAPI.getPatient(patientId);
        } catch {
          patientDetails = response.patient;
        }
        const mergedPatient = {
          ...response.patient,
          ...patientDetails,
          id: patientDetails?.id || patientDetails?.patient_id || response.patient?.patient_id || response.patient?.id,
          queue_id: response.patient?.queue_id || response.queue_id,
          name: patientDetails?.name || patientDetails?.patient_name || patientDetails?.full_name || response.patient?.patient_name || 'Unknown',
          severity: response.patient?.severity_level || response.patient?.severity,
        };
        const calledPatientId = mergedPatient.id || mergedPatient.patient_id;
        const calledQueueId = mergedPatient.queue_id || response.patient?.queue_id || response.queue_id;
        setPatientQueue(prev => prev.filter(p => {
          const pid = p.patient_id || p.id;
          const qid = p.queue_id;
          return pid !== calledPatientId && qid !== calledQueueId;
        }));
        setCurrentPatient(normalizePatient(mergedPatient));
        setIsConsulting(true);
        isConsultingRef.current = true;
        stopQueuePolling();
        if (calledPatientId) await loadPatientFiles(calledPatientId);
        try {
          const updatedQueue = await doctorAPI.getQueue();
          const filtered = toArray(updatedQueue).filter(p => {
            const pid = p.patient_id || p.id;
            const qid = p.queue_id;
            return pid !== calledPatientId && qid !== calledQueueId;
          });
          setPatientQueue(filtered);
        } catch (_) {}
      } else {
        setError('No patient available in queue.');
      }
    } catch (err) {
      setError('Failed to call next patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!currentPatient) return;
    try {
      setLoading(true);
      setError(null);
      const consultationData = {
        diagnosis, notes, ai_evaluation: aiEvaluation,
        xray_uploaded: !!uploadedXray, lab_test_uploaded: !!uploadedLab,
        symptoms: currentPatient.symptoms || '',
        patient_id: currentPatient.id,
        timestamp: new Date().toISOString()
      };
      localStorage.removeItem('selectedDoctor');
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('queueData');
      await doctorAPI.completeConsultation(currentPatient.queue_id || currentPatient.id, consultationData);
      setIsConsulting(false);
      isConsultingRef.current = false;
      setCurrentPatient(null);
      setDiagnosis(''); setNotes(''); setAiEvaluation('');
      setUploadedXray(null); setUploadedLab(null);
      setPatientMedicalFiles([]); setXrayFiles([]); setLabTestFiles([]);
      setTreatmentHistory([]);
      const updatedQueue = await doctorAPI.getQueue();
      setPatientQueue(toArray(updatedQueue));
      startQueuePolling();
      alert('Consultation completed successfully!');
      window.location.href = '/';
    } catch (err) {
      setError('Failed to complete consultation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoShow = async () => {
    if (!currentPatient) return;
    if (!window.confirm('❌ Mark this patient as no-show?')) return;
    try {
      setLoading(true);
      await doctorAPI.markNoShow(currentPatient.queue_id || currentPatient.id);
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('queueData');
      setIsConsulting(false);
      isConsultingRef.current = false;
      setCurrentPatient(null);
      setDiagnosis(''); setNotes(''); setAiEvaluation('');
      setUploadedXray(null); setUploadedLab(null);
      setPatientMedicalFiles([]); setXrayFiles([]); setLabTestFiles([]);
      setTreatmentHistory([]);
      const updatedQueue = await doctorAPI.getQueue();
      setPatientQueue(toArray(updatedQueue));
      startQueuePolling();
    } catch (err) {
      setError('Failed to mark no-show: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicalFile = async (fileId, fileType) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      setLoading(true);
      await doctorAPI.deleteMedicalFile(fileId);
      setPatientMedicalFiles(prev => prev.filter(f => f.id !== fileId));
      if (fileType === 'xray') {
        setXrayFiles(prev => prev.filter(f => f.id !== fileId));
        if (xrayFiles.length > 1) {
          const nextFile = xrayFiles.find(f => f.id !== fileId);
          setUploadedXray(nextFile?.file_url || nextFile?.url);
        } else setUploadedXray(null);
      } else if (fileType === 'lab_test') {
        setLabTestFiles(prev => prev.filter(f => f.id !== fileId));
        if (labTestFiles.length > 1) {
          const nextFile = labTestFiles.find(f => f.id !== fileId);
          setUploadedLab(nextFile?.file_url || nextFile?.url);
        } else setUploadedLab(null);
      }
      alert('File deleted successfully!');
    } catch (err) {
      setError('Failed to delete file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── NEW FLOW: Step 1 Xray – pick file → open modal → analyze ──
  const handleXrayFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = null;

    const localUrl = URL.createObjectURL(file);
    setPendingXrayFile(file);
    setPendingXrayUrl(localUrl);
    setPendingXrayAnalysis(null);
    setXrayAnalyzing(true);
    setShowXrayModal(true);

    try {
      const aiResult = await doctorAPI.analyzeMedicalImage({
        file,
        patientId: currentPatient?.id,
        symptoms: currentPatient?.symptoms || '',
      });
      if (aiResult?.success && aiResult?.analysis) {
        setPendingXrayAnalysis(aiResult.analysis);
      } else if (aiResult?.error) {
        setPendingXrayAnalysis(`⚠️ AI analysis unavailable: ${aiResult.error}`);
      } else {
        setPendingXrayAnalysis(null);
      }
    } catch (err) {
      setPendingXrayAnalysis(`⚠️ AI analysis failed: ${err.message}`);
    } finally {
      setXrayAnalyzing(false);
    }
  };

  // ── NEW FLOW: Step 2 Xray – save to server ──
  const handleSaveXray = async () => {
    if (!pendingXrayFile) return;
    setSavingXray(true);
    try {
      const result = await doctorAPI.uploadMedicalFile({
        file: pendingXrayFile,
        patientId: currentPatient?.id,
        fileType: 'xray',
        title: `X-ray - ${new Date().toLocaleDateString()}`,
        description: 'Uploaded during consultation',
        doctorId: doctorProfile?.id
      });
      const remoteUrl = getFullUrl(result.file_url || result.url);
      const blobUrl = remoteUrl ? await fetchImageAsBlob(remoteUrl) : pendingXrayUrl;
      const enrichedResult = {
        ...result,
        file_url: blobUrl || pendingXrayUrl,
        ai_analysis: pendingXrayAnalysis,
        title: result.title || `X-ray - ${new Date().toLocaleDateString()}`,
        created_at: result.created_at || new Date().toISOString(),
      };
      setXrayFiles(prev => [enrichedResult, ...prev]);
      setUploadedXray(enrichedResult.file_url);
      setCurrentXrayIndex(0);
      setPendingXrayFile(null);
      setPendingXrayUrl(null);
      setPendingXrayAnalysis(null);
      alert('X-ray saved to patient records!');
    } catch (err) {
      setError('Failed to save X-ray: ' + err.message);
    } finally {
      setSavingXray(false);
    }
  };

  const handleDiscardXray = () => {
    setPendingXrayFile(null);
    setPendingXrayUrl(null);
    setPendingXrayAnalysis(null);
    setXrayAnalyzing(false);
    if (xrayFiles.length === 0) setShowXrayModal(false);
  };

  // ── NEW FLOW: Step 1 Lab – pick file → open modal → analyze ──
  const handleLabTestFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = null;

    const localUrl = URL.createObjectURL(file);
    setPendingLabFile(file);
    setPendingLabUrl(localUrl);
    setPendingLabAnalysis(null);
    setLabAnalyzing(true);
    setShowBloodTestModal(true);

    try {
      const aiResult = await doctorAPI.analyzeMedicalImage({
        file,
        patientId: currentPatient?.id,
        symptoms: currentPatient?.symptoms || '',
      });
      if (aiResult?.success && aiResult?.analysis) {
        setPendingLabAnalysis(aiResult.analysis);
      } else if (aiResult?.error) {
        setPendingLabAnalysis(`⚠️ AI analysis unavailable: ${aiResult.error}`);
      } else {
        setPendingLabAnalysis(null);
      }
    } catch (err) {
      setPendingLabAnalysis(`⚠️ AI analysis failed: ${err.message}`);
    } finally {
      setLabAnalyzing(false);
    }
  };

  // ── NEW FLOW: Step 2 Lab – save to server ──
  const handleSaveLab = async () => {
    if (!pendingLabFile) return;
    setSavingLab(true);
    try {
      const result = await doctorAPI.uploadMedicalFile({
        file: pendingLabFile,
        patientId: currentPatient?.id,
        fileType: 'lab_test',
        title: `Lab Test - ${new Date().toLocaleDateString()}`,
        description: 'Uploaded during consultation',
        doctorId: doctorProfile?.id
      });
      const remoteUrl = getFullUrl(result.file_url || result.url);
      const blobUrl = remoteUrl ? await fetchImageAsBlob(remoteUrl) : pendingLabUrl;
      const enrichedResult = {
        ...result,
        file_url: blobUrl || pendingLabUrl,
        ai_analysis: pendingLabAnalysis,
        title: result.title || `Lab Test - ${new Date().toLocaleDateString()}`,
        created_at: result.created_at || new Date().toISOString(),
      };
      setLabTestFiles(prev => [enrichedResult, ...prev]);
      setUploadedLab(enrichedResult.file_url);
      setCurrentLabIndex(0);
      setPendingLabFile(null);
      setPendingLabUrl(null);
      setPendingLabAnalysis(null);
      alert('Lab test saved to patient records!');
    } catch (err) {
      setError('Failed to save lab test: ' + err.message);
    } finally {
      setSavingLab(false);
    }
  };

  const handleDiscardLab = () => {
    setPendingLabFile(null);
    setPendingLabUrl(null);
    setPendingLabAnalysis(null);
    setLabAnalyzing(false);
    if (labTestFiles.length === 0) setShowBloodTestModal(false);
  };

  const getSeverityClasses = (level) => {
    switch (level) {
      case 'high': return 'border-r-red-500 bg-red-50';
      case 'medium': return 'border-r-orange-500 bg-orange-50';
      case 'low': return 'border-r-green-500 bg-green-50';
      default: return 'border-r-gray-300 bg-white';
    }
  };

  const getSeverityBadgeClasses = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleZoomIn = () => setXrayZoom(prev => prev + 0.2);
  const handleZoomOut = () => xrayZoom > 0.4 && setXrayZoom(prev => prev - 0.2);
  const handleResetZoom = () => { setXrayZoom(1); setXrayPosition({ x: 0, y: 0 }); };
  const handleXrayMouseDown = (e) => { setIsDraggingXray(true); setXrayDragStart({ x: e.clientX - xrayPosition.x, y: e.clientY - xrayPosition.y }); };
  const handleXrayMouseMove = (e) => { if (!isDraggingXray) return; setXrayPosition({ x: e.clientX - xrayDragStart.x, y: e.clientY - xrayDragStart.y }); };
  const handleXrayMouseUp = () => setIsDraggingXray(false);

  const handleLabZoomIn = () => setLabZoom(prev => prev + 0.2);
  const handleLabZoomOut = () => labZoom > 0.4 && setLabZoom(prev => prev - 0.2);
  const handleResetLabZoom = () => { setLabZoom(1); setLabPosition({ x: 0, y: 0 }); };
  const handleLabMouseDown = (e) => { setIsDraggingLab(true); setLabDragStart({ x: e.clientX - labPosition.x, y: e.clientY - labPosition.y }); };
  const handleLabMouseMove = (e) => { if (!isDraggingLab) return; setLabPosition({ x: e.clientX - labDragStart.x, y: e.clientY - labDragStart.y }); };
  const handleLabMouseUp = () => setIsDraggingLab(false);

  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'contrast': return { filter: 'contrast(1.5)' };
      case 'brightness': return { filter: 'brightness(1.3)' };
      case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
      case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
      default: return { filter: 'none' };
    }
  };

  const getLabFilterStyle = () => {
    switch (activeLabFilter) {
      case 'contrast': return { filter: 'contrast(1.5)' };
      case 'brightness': return { filter: 'brightness(1.3)' };
      case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
      case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
      default: return { filter: 'none' };
    }
  };

  if (loading && !doctorProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderBold = (text) => {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  const renderAiAnalysis = (text) => {
    if (!text) return <p className="text-gray-400 text-sm">No AI analysis available</p>;
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
          if (/^\d+[\.] /.test(t))
            return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-800 font-bold min-w-[20px]">{t.match(/^\d+/)[0]}.</span><span className="text-gray-700">{renderBold(t.replace(/^\d+[\.] /, ''))}</span></div>;
          return <p key={i} className="text-gray-700">{renderBold(t)}</p>;
        })}
      </div>
    );
  };

  // helper: which image/analysis to show in modal
  const xrayModalImage = pendingXrayUrl || xrayFiles[currentXrayIndex]?.file_url || xrayFiles[currentXrayIndex]?.url || uploadedXray;
  const xrayModalAnalysis = pendingXrayUrl ? pendingXrayAnalysis : xrayFiles[currentXrayIndex]?.ai_analysis;
  const xrayModalTitle = pendingXrayUrl ? `New X-ray – ${new Date().toLocaleDateString()}` : (xrayFiles[currentXrayIndex]?.title || '');
  const xrayModalDate = pendingXrayUrl ? new Date().toISOString() : xrayFiles[currentXrayIndex]?.created_at;

  const labModalImage = pendingLabUrl || labTestFiles[currentLabIndex]?.file_url || labTestFiles[currentLabIndex]?.url || uploadedLab;
  const labModalAnalysis = pendingLabUrl ? pendingLabAnalysis : labTestFiles[currentLabIndex]?.ai_analysis;
  const labModalTitle = pendingLabUrl ? `New Lab Test – ${new Date().toLocaleDateString()}` : (labTestFiles[currentLabIndex]?.title || '');
  const labModalDate = pendingLabUrl ? new Date().toISOString() : labTestFiles[currentLabIndex]?.created_at;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto bg-[#e8f3f9] shadow-sm">

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-sm underline">Dismiss</button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border border-blue-200 rounded-2xl mx-1 mb-1 p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center" dir='rtl'>
          <div className='px-5'>
            <h1 className="text-2xl font-bold text-[#2C5F8D]">
              {doctorProfile?.name || doctorProfile?.full_name || doctorProfile?.doctor_name || ''}
            </h1>
            <p className="text-sm text-[#5B9BD5]">
              {doctorProfile?.specialty_ar || doctorProfile?.specialty || doctorProfile?.specialization || ''}
            </p>
            <p className="text-xs text-slate-500">
              {(doctorProfile?.floor || doctorProfile?.room) ? `دور ${doctorProfile?.floor ?? '—'} – غرفة ${doctorProfile?.room || doctorProfile?.room_number || '—'}` : ''}
            </p>
          </div>
          <div className="flex gap-3 items-center max-sm:justify-between">
            <span className={`px-5 py-2 rounded-lg font-medium text-sm ${
              !isAvailable ? 'bg-gray-100 text-gray-600' : (isConsulting ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')
            }`}>
              Status: {!isAvailable ? 'Break' : (isConsulting ? 'Busy' : 'Available')}
            </span>
            <button
              onClick={toggleStatus}
              disabled={loading}
              className="px-5 py-2 bg-azraq-400 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : (isAvailable ? 'Take Break' : 'Return to Work')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr]">
          {/* Patient Queue Sidebar */}
          <div className="bg-slate-50 border-l ms-1 rounded-2xl border-blue-200 border lg:p-6 lg:sticky p-5 lg:top-0 lg:h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Patient Queue</h2>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {patientQueue.length} waiting
              </span>
            </div>
            <div className="space-y-3">
              {patientQueue.map((patient, index) => (
                <div
                  key={patient.id || patient.queue_id || index}
                  className={`bg-white p-4 rounded-xl border-r-4 cursor-pointer transition-all hover:-translate-x-1 hover:shadow-lg ${getSeverityClasses(patient.severityLevel || patient.severity_level)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">
                      {patient.name || patient.patient_name || patient.full_name || 'Unknown'}
                    </span>
                    <span className={`px-2 py-1 rounded-xl text-xs font-bold ${getSeverityBadgeClasses(patient.severityLevel || patient.severity_level)}`}>
                      {patient.severity || patient.severityLevel || patient.severity_level || '?'}/10
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Wait time: {patient.waitTime || patient.wait_time || '~5 minutes'}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={callNextPatient}
              disabled={!isAvailable || loading || patientQueue.length === 0}
              className="w-full mt-5 py-4 bg-gradient-to-r from-azraq-400 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Call Next Patient'}
            </button>
          </div>

          {/* Main Patient Panel */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {!isConsulting || !currentPatient ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                <span className="text-8xl">🏥</span>
                <h2 className="text-2xl font-bold text-slate-500">No Active Patient</h2>
                <p>Select "Call Next Patient" from the queue to start.</p>
              </div>
            ) : (
              <>
                {/* Patient Information */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-azraq-400 mb-5 flex items-center gap-3">👤 Patient Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {[
                      { label: 'Patient ID', value: currentPatient.id },
                      { label: 'Name', value: currentPatient.name },
                      { label: 'National ID', value: currentPatient.national_id || '—' },
                      { label: 'Age / Gender', value: `${currentPatient.age ? `${currentPatient.age} years` : '—'} / ${currentPatient.gender || '—'}` },
                      { label: 'Blood Type', value: currentPatient.blood_type || '—' },
                      { label: 'BMI', value: currentPatient.bmi || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="font-bold text-2xs text-slate-800 mb-1">{label}</div>
                        <div className="text-lg font-semibold text-slate-500">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: '⚠️ Chronic Diseases', key: 'chronic_diseases', bg: 'bg-red-50', color: 'text-red-700' },
                      { label: '🚫 Allergies', key: 'allergies', bg: 'bg-orange-50', color: 'text-orange-700' },
                      { label: '💊 Current Medications', key: 'medications', bg: 'bg-green-50', color: 'text-green-700' },
                    ].map(({ label, key, bg, color }) => {
                      const val = currentPatient[key];
                      const items = !val || val === '' || (Array.isArray(val) && val.length === 0)
                        ? null
                        : Array.isArray(val) ? val : typeof val === 'string' ? val.split(',').map(s => s.trim()) : null;
                      return (
                        <div key={key} className={`${bg} p-4 rounded-xl`}>
                          <p className={`font-bold ${color} mb-2`}>{label}</p>
                          <ul className="text-sm space-y-1">
                            {items ? items.map((d, i) => <li key={i} className="text-slate-700">• {d}</li>) : <li className="text-slate-500">None reported</li>}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Preliminary Analysis */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">🤖 AI Preliminary Analysis</h2>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-500">
                    <div className="font-bold text-blue-900 mb-1">Reported Symptoms</div>
                    <p className='py-3'>{currentPatient.symptoms || currentPatient._consultations?.[0]?.symptoms || 'No symptoms reported'}</p>
                    <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xs text-slate-600 mb-1">AI Diagnosis</div>
                        <div className="font-bold text-slate-800">{currentPatient._ai?.diagnosis || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-2xs text-slate-600 mb-1">Confidence Level</div>
                        <div className="font-bold text-slate-800">{currentPatient._ai?.confidence ? `${currentPatient._ai.confidence}%` : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-2xs text-slate-600 mb-1">Recommended Department</div>
                        <div className="font-bold text-slate-800">{currentPatient._ai?.department || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* Treatment History */}
<div className="bg-white border border-slate-200 rounded-xl p-6">
  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">📋 Treatment History</h2>
  <div className="space-y-3">
    {(() => {
      const history = treatmentHistory.length > 0 ? treatmentHistory : currentPatient._consultations || [];
      if (history.length === 0) return <p className="text-slate-400 text-sm">No treatment history available.</p>;
      
      const displayed = showAllHistory ? history : history.slice(0, 3);
      
      return (
        <>
          {displayed.map((item, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-lg border-r-4 border-blue-500">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-slate-800">{item.ai_diagnosis || item.condition || item.diagnosis || item.chief_complaint || 'N/A'}</div>
                <div className="text-sm text-slate-600">
                  {item.date || item.visit_date || item.created_at ? new Date(item.date || item.visit_date || item.created_at).toLocaleDateString() : ''}
                </div>
              </div>
              <div className="text-sm text-slate-600 mt-1">{item.symptoms && <span>🩺 {item.symptoms}</span>}</div>
              <div className="text-xs text-slate-400 mt-1">
                {item.specialty && `Dept: ${item.specialty}`}{item.severity && ` · Severity: ${item.severity}/10`}
              </div>
            </div>
          ))}

          {history.length > 3 && (
            <button
              onClick={() => setShowAllHistory(prev => !prev)}
              className="w-full mt-2 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
            >
              {showAllHistory ? '▲ Show Less' : `▼ See More (${history.length - 3} more)`}
            </button>
          )}
        </>
      );
    })()}
  </div>
</div>

                {/* Reports & Scans */}
                {(xrayFiles.length > 0 || labTestFiles.length > 0) && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">🔬 Reports & Scans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {xrayFiles.length > 0 && (
                        <div
                          onClick={() => { setPendingXrayUrl(null); setShowXrayModal(true); }}
                          className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
                        >
                          <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src={xrayFiles[currentXrayIndex]?.file_url || xrayFiles[currentXrayIndex]?.url} alt="X-ray" className="h-full w-full object-cover" />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-slate-800 text-lg">X-ray</div>
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">{xrayFiles.length} file{xrayFiles.length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="text-sm text-slate-600">Click to view details</div>
                          </div>
                        </div>
                      )}
                      {labTestFiles.length > 0 && (
                        <div
                          onClick={() => { setPendingLabUrl(null); setShowBloodTestModal(true); }}
                          className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
                        >
                          <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src={labTestFiles[currentLabIndex]?.file_url || labTestFiles[currentLabIndex]?.url} alt="Lab Test" className="h-full w-full object-cover" />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-slate-800 text-lg">Blood Test</div>
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">{labTestFiles.length} file{labTestFiles.length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="text-sm text-slate-600">Click to view details</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">⚡ Quick Actions</h2>
                  <input type="file" ref={xrayFileInputRef} onChange={handleXrayFileChange} accept="image/*" className="hidden" />
                  <input type="file" ref={labTestFileInputRef} onChange={handleLabTestFileChange} accept="image/*" className="hidden" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => xrayFileInputRef.current.click()}
                      className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
                    >
                      <span className="text-4xl">📷</span>
                      <span className="font-bold text-lg">Analyze X-ray</span>
                      <span className="text-sm opacity-90">Upload and analyze medical images</span>
                    </button>
                    <button
                      onClick={() => labTestFileInputRef.current.click()}
                      className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
                    >
                      <span className="text-4xl">📋</span>
                      <span className="font-bold text-lg">Review Lab Test</span>
                      <span className="text-sm opacity-90">Upload and review lab results</span>
                    </button>
                  </div>
                </div>

                {/* Complete Consultation */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-2 border-b-2 border-t-azraq-400">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">✍️ Complete Consultation</h2>
                  <div className="bg-slate-50 p-5 rounded-xl space-y-5">
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Final Diagnosis:</label>
                      <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" placeholder="Enter final diagnosis..." />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Doctor's Notes:</label>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" placeholder="Enter additional notes..." />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-3">AI Diagnosis Evaluation:</label>
                      <div className="flex gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="aiEvaluation" value="agree" checked={aiEvaluation === 'agree'} onChange={(e) => setAiEvaluation(e.target.value)} className="w-5 h-5 text-green-500" />
                          <span className="text-slate-700 font-medium">Agree with AI</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="aiEvaluation" value="disagree" checked={aiEvaluation === 'disagree'} onChange={(e) => setAiEvaluation(e.target.value)} className="w-5 h-5 text-red-500" />
                          <span className="text-slate-700 font-medium">Disagree with AI</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleCompleteConsultation} disabled={loading} className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50">
                        {loading ? 'Completing...' : '✅ Complete Consultation'}
                      </button>
                      <button onClick={handleNoShow} disabled={loading} className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50">
                        {loading ? 'Marking...' : '❌ Mark No-Show'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* X-ray Modal */}
      {showXrayModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className='flex justify-between items-center'>
              <h2 className="text-xl font-bold text-azraq-400">
                X-ray {xrayModalTitle ? `- ${xrayModalTitle}` : ''}
              </h2>
              <button
                onClick={() => { handleDiscardXray(); setShowXrayModal(false); }}
                className="w-10 h-9 text-black flex items-center justify-center text-2xl hover:bg-red-600 hover:text-white"
              >×</button>
            </div>
            <hr className='my-4 text-gray-300' />

            <div className="bg-slate-900 p-5 rounded-xl mb-4 overflow-hidden">
              <div
                className="relative h-[500px] overflow-hidden cursor-move flex justify-center items-center"
                onMouseDown={handleXrayMouseDown} onMouseMove={handleXrayMouseMove}
                onMouseUp={handleXrayMouseUp} onMouseLeave={handleXrayMouseUp}
              >
                {xrayModalImage ? (
                  <img
                    src={xrayModalImage}
                    alt="X-ray"
                    className="absolute rounded-lg transition-transform select-none w-1/2"
                    style={{ transform: `translate(${xrayPosition.x}px, ${xrayPosition.y}px) scale(${xrayZoom})`, transformOrigin: 'center center', cursor: isDraggingXray ? 'grabbing' : 'grab', ...getFilterStyle() }}
                    draggable="false"
                  />
                ) : (
                  <p className="text-slate-400">No image</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-4 flex-wrap">
              <button onClick={handleZoomIn} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">+ Zoom In</button>
              <button onClick={handleResetZoom} className="px-5 py-2 bg-[#4c5361] text-white rounded-lg font-bold hover:bg-blue-600">↻ Reset</button>
              <button onClick={handleZoomOut} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">- Zoom Out</button>
              {/* Navigation only for saved files */}
              {!pendingXrayUrl && xrayFiles.length > 1 && (
                <>
                  <button onClick={() => setCurrentXrayIndex(prev => Math.max(0, prev - 1))} disabled={currentXrayIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">← Previous</button>
                  <button onClick={() => setCurrentXrayIndex(prev => Math.min(xrayFiles.length - 1, prev + 1))} disabled={currentXrayIndex === xrayFiles.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">Next →</button>
                </>
              )}
              {/* Delete only for saved files */}
              {!pendingXrayUrl && xrayFiles[currentXrayIndex]?.id && (
                <button onClick={() => handleDeleteMedicalFile(xrayFiles[currentXrayIndex].id, 'xray')} className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">🗑️ Delete</button>
              )}
            </div>

            <div className="mb-4">
              <strong className="block mb-2 text-slate-800">Filters:</strong>
              <div className="flex gap-2 flex-wrap">
                {['normal', 'contrast', 'brightness', 'sharpen', 'grayscale'].map((filter) => (
                  <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === filter ? 'bg-[#214371] text-white' : 'bg-slate-600 text-white hover:bg-slate-700'}`}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#e8f3f9] p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-azraq-400">Report Information:</h3>
              <div className='flex justify-between pe-9'>
                <div>
                  <h2 className='text-lg text-azraq-400'>Report Type</h2>
                  <p className='pb-4'>X-ray</p>
                  <h2 className='text-lg text-azraq-400'>Upload time</h2>
                  <p>{xrayModalDate ? new Date(xrayModalDate).toLocaleTimeString() : '-'}</p>
                </div>
                <div>
                  <h2 className='text-lg text-azraq-400'>Date</h2>
                  <p className='pb-4'>{xrayModalDate ? new Date(xrayModalDate).toLocaleDateString() : '-'}</p>
                  <h2 className='text-lg text-azraq-400'>Analyzed by</h2>
                  <p className='pb-4'>{doctorProfile?.name || 'Doctor'}</p>
                </div>
              </div>
              <div className='bg-white p-3 rounded-lg'>
                <h2 className="font-bold text-blue-800 mb-2">AI Analysis</h2>
                {xrayAnalyzing ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-slate-500 text-sm">Analyzing...</span>
                  </div>
                ) : (
                  renderAiAnalysis(xrayModalAnalysis)
                )}
              </div>

              {/* Save / Discard – only when pending and analysis done */}
              {pendingXrayUrl && !xrayAnalyzing && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleSaveXray}
                    disabled={savingXray}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-base hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {savingXray ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Saving...
                      </span>
                    ) : '💾 Save to Patient Records'}
                  </button>
                  <button
                    onClick={handleDiscardXray}
                    disabled={savingXray}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-300 transition-all disabled:opacity-50"
                  >
                    🗑️ Discard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lab Test Modal */}
      {showBloodTestModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className='flex justify-between items-center'>
              <h2 className="text-xl font-bold text-azraq-400">
                Blood Test {labModalTitle ? `- ${labModalTitle}` : ''}
              </h2>
              <button
                onClick={() => { handleDiscardLab(); setShowBloodTestModal(false); }}
                className="w-10 h-9 text-black flex items-center justify-center text-2xl hover:bg-red-600 hover:text-white"
              >×</button>
            </div>
            <hr className='my-4 text-gray-300' />

            <div className="bg-slate-900 p-5 rounded-xl mb-4 overflow-hidden">
              <div
                className="relative h-[500px] overflow-hidden cursor-move flex justify-center items-center"
                onMouseDown={handleLabMouseDown} onMouseMove={handleLabMouseMove}
                onMouseUp={handleLabMouseUp} onMouseLeave={handleLabMouseUp}
              >
                {labModalImage ? (
                  <img
                    src={labModalImage}
                    alt="Lab Test"
                    className="absolute rounded-lg transition-transform select-none w-1/2"
                    style={{ transform: `translate(${labPosition.x}px, ${labPosition.y}px) scale(${labZoom})`, transformOrigin: 'center center', cursor: isDraggingLab ? 'grabbing' : 'grab', ...getLabFilterStyle() }}
                    draggable="false"
                  />
                ) : (
                  <p className="text-slate-400">No image</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-4 flex-wrap">
              <button onClick={handleLabZoomIn} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">+ Zoom In</button>
              <button onClick={handleResetLabZoom} className="px-5 py-2 bg-[#4c5361] text-white rounded-lg font-bold hover:bg-blue-600">↻ Reset</button>
              <button onClick={handleLabZoomOut} className="px-5 py-2 bg-[#82bbe4] text-white rounded-lg font-bold hover:bg-blue-600">- Zoom Out</button>
              {!pendingLabUrl && labTestFiles.length > 1 && (
                <>
                  <button onClick={() => setCurrentLabIndex(prev => Math.max(0, prev - 1))} disabled={currentLabIndex === 0} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">← Previous</button>
                  <button onClick={() => setCurrentLabIndex(prev => Math.min(labTestFiles.length - 1, prev + 1))} disabled={currentLabIndex === labTestFiles.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300">Next →</button>
                </>
              )}
              {!pendingLabUrl && labTestFiles[currentLabIndex]?.id && (
                <button onClick={() => handleDeleteMedicalFile(labTestFiles[currentLabIndex].id, 'lab_test')} className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">🗑️ Delete</button>
              )}
            </div>

            <div className="mb-4">
              <strong className="block mb-2 text-slate-800">Filters:</strong>
              <div className="flex gap-2 flex-wrap">
                {['normal', 'contrast', 'brightness', 'sharpen', 'grayscale'].map((filter) => (
                  <button key={filter} onClick={() => setActiveLabFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeLabFilter === filter ? 'bg-[#214371] text-white' : 'bg-slate-600 text-white hover:bg-slate-700'}`}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#e8f3f9] p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-azraq-400">Report Information:</h3>
              <div className='flex justify-between pe-9'>
                <div>
                  <h2 className='text-lg text-azraq-400'>Report Type</h2>
                  <p className='pb-4'>Blood Test</p>
                  <h2 className='text-lg text-azraq-400'>Upload time</h2>
                  <p>{labModalDate ? new Date(labModalDate).toLocaleTimeString() : '-'}</p>
                </div>
                <div>
                  <h2 className='text-lg text-azraq-400'>Date</h2>
                  <p className='pb-4'>{labModalDate ? new Date(labModalDate).toLocaleDateString() : '-'}</p>
                  <h2 className='text-lg text-azraq-400'>Analyzed by</h2>
                  <p className='pb-4'>{doctorProfile?.name || 'Doctor'}</p>
                </div>
              </div>
              <div className='bg-white p-3 rounded-lg'>
                <h2 className="font-bold text-blue-800 mb-2 my-3">AI Analysis</h2>
                {labAnalyzing ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-slate-500 text-sm">Analyzing...</span>
                  </div>
                ) : (
                  renderAiAnalysis(labModalAnalysis)
                )}
              </div>

              {/* Save / Discard – only when pending and analysis done */}
              {pendingLabUrl && !labAnalyzing && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleSaveLab}
                    disabled={savingLab}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-base hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {savingLab ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Saving...
                      </span>
                    ) : '💾 Save to Patient Records'}
                  </button>
                  <button
                    onClick={handleDiscardLab}
                    disabled={savingLab}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-300 transition-all disabled:opacity-50"
                  >
                    🗑️ Discard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;