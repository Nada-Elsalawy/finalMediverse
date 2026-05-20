import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { getAllDoctors, createDoctor, toggleDoctorActivation } from '../Managment/ManagmentApi/MangServices';

const DoctorsManagement = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newDoctorForm, setNewDoctorForm] = useState({
    full_name: '',
    email: '',
    password: '',
    gender: 'Male',
    date_of_birth: '',
    marital_status: 'Single',
    specialization: '',
    work_schedule: '',
    floor_number: '',
    room_number: '',
    phone: '',
    years_of_experience: '',
    consultation_fee_egp: '',
    certifications: '',
    languages_spoken: '',
    national_id: '',
    license_number: '',
    max_patients_per_day: 20,
    average_consultation_minutes: 15,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      const raw = Array.isArray(response)
        ? response
        : response?.data ?? response?.doctors ?? [];

      const normalized = raw
        .filter(d => d.is_active !== false && d.is_active !== 0)
        .map(d => ({
          id:                   d.doctor_id,
          full_name:            d.doctor_name,
          email:                d.email                || '',
          phone:                d.phone_number         || '',
          gender:               d.gender               || '',
          specialization:       d.specialty            || '',
          floor_number:         d.floor_number         || '',
          room_number:          d.room_number          || '',
          years_of_experience:  d.years_of_experience  ?? '',
          consultation_fee_egp: d.consultation_fee_egp ?? '',
          work_schedule:        d.work_schedule        || '',
          date_of_birth:        d.date_of_birth        || '',
          marital_status:       d.marital_status       || '',
          certifications:       d.certifications       || '',
          languages_spoken:     d.languages_spoken     || '',
          is_active:            d.is_active,
        }))
        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

      setDoctors(normalized);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await toggleDoctorActivation(doctorToDelete.id, false);
      setDoctors(doctors.filter(doc => doc.id !== doctorToDelete.id));
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    } catch (err) {
      console.error('Error deactivating doctor:', err);
      alert('Failed to deactivate doctor. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  const handleAddDoctor = async () => {
    try {
      setSubmitting(true);
      const doctorData = {
        full_name: newDoctorForm.full_name,
        email: newDoctorForm.email,
        password: newDoctorForm.password,
        gender: newDoctorForm.gender,
        date_of_birth: newDoctorForm.date_of_birth,
        marital_status: newDoctorForm.marital_status,
        specialization: newDoctorForm.specialization,
        work_schedule: newDoctorForm.work_schedule,
        floor_number: parseInt(newDoctorForm.floor_number) || 1,
        room_number: newDoctorForm.room_number,
        phone: newDoctorForm.phone,
        years_of_experience: parseInt(newDoctorForm.years_of_experience) || 0,
        consultation_fee_egp: parseFloat(newDoctorForm.consultation_fee_egp) || 0,
        certifications: newDoctorForm.certifications,
        languages_spoken: newDoctorForm.languages_spoken,
        national_id: newDoctorForm.national_id,
        license_number: newDoctorForm.license_number,
        max_patients_per_day: parseInt(newDoctorForm.max_patients_per_day) || 20,
        average_consultation_minutes: parseInt(newDoctorForm.average_consultation_minutes) || 15,
      };

      await createDoctor(doctorData);
      setShowAddDoctorModal(false);
      setNewDoctorForm({
        full_name: '', email: '', password: '', gender: 'Male', date_of_birth: '',
        marital_status: 'Single', specialization: '', work_schedule: '', floor_number: '',
        room_number: '', phone: '', years_of_experience: '', consultation_fee_egp: '',
        certifications: '', languages_spoken: '', national_id: '', license_number: '',
        max_patients_per_day: 20, average_consultation_minutes: 15,
      });
      await fetchDoctors();
      alert('Doctor added successfully!');
    } catch (err) {
      console.error('Error creating doctor:', err);
      alert('Failed to create doctor. Please check all fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Doctors Management</h2>
        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Doctor
        </button>
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-auto shadow-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800">This page says</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 text-sm leading-relaxed">
                Are you sure you want to delete this doctor? This will remove them from the system.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-3 flex justify-end gap-3 border-t border-slate-200">
              <button onClick={confirmDelete} disabled={submitting} className="px-6 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-medium disabled:opacity-50">
                {submitting ? 'Deleting...' : 'OK'}
              </button>
              <button onClick={cancelDelete} disabled={submitting} className="px-6 py-1.5 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Doctor Modal ── */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white rounded-lg w-full max-w-xl mx-4 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Doctor</h2>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Dr. John Doe" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.full_name} onChange={(e) => setNewDoctorForm({...newDoctorForm, full_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="doctor@hospital.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.email} onChange={(e) => setNewDoctorForm({...newDoctorForm, email: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.password} onChange={(e) => setNewDoctorForm({...newDoctorForm, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white" value={newDoctorForm.gender} onChange={(e) => setNewDoctorForm({...newDoctorForm, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.date_of_birth} onChange={(e) => setNewDoctorForm({...newDoctorForm, date_of_birth: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Marital Status <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white" value={newDoctorForm.marital_status} onChange={(e) => setNewDoctorForm({...newDoctorForm, marital_status: e.target.value})}>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white" value={newDoctorForm.specialization} onChange={(e) => setNewDoctorForm({...newDoctorForm, specialization: e.target.value})}>
                      <option value="">-- Select Specialization --</option>
                      <option value="General Practitioner">General Practitioner</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Psychiatry">Psychiatry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Schedule</label>
                    <input type="text" placeholder="Sat-Wed, 8 AM - 4 PM" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.work_schedule} onChange={(e) => setNewDoctorForm({...newDoctorForm, work_schedule: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Floor Number <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.floor_number} onChange={(e) => setNewDoctorForm({...newDoctorForm, floor_number: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Number <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="205" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.room_number} onChange={(e) => setNewDoctorForm({...newDoctorForm, room_number: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="+20 100 123 4567" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.phone} onChange={(e) => setNewDoctorForm({...newDoctorForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="10" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.years_of_experience} onChange={(e) => setNewDoctorForm({...newDoctorForm, years_of_experience: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Consultation Fee (EGP) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="500" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.consultation_fee_egp} onChange={(e) => setNewDoctorForm({...newDoctorForm, consultation_fee_egp: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">National ID <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="29012011234567" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.national_id} onChange={(e) => setNewDoctorForm({...newDoctorForm, national_id: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
                  <input type="text" placeholder="MED-12345" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.license_number} onChange={(e) => setNewDoctorForm({...newDoctorForm, license_number: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Certifications (comma-separated)</label>
                  <input type="text" placeholder="Board Certified, Masters in Medicine" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.certifications} onChange={(e) => setNewDoctorForm({...newDoctorForm, certifications: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages Spoken (comma-separated)</label>
                  <input type="text" placeholder="Arabic, English, French" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" value={newDoctorForm.languages_spoken} onChange={(e) => setNewDoctorForm({...newDoctorForm, languages_spoken: e.target.value})} />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
              <button onClick={() => setShowAddDoctorModal(false)} disabled={submitting} className="px-5 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium">
                Cancel
              </button>
              <button onClick={handleAddDoctor} disabled={submitting} className="px-5 py-2 text-sm bg-slate-700 text-white rounded hover:bg-slate-800 transition font-medium disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}

{/* ── Doctor Cards ── */}
      {doctors.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">🩺</div>
          <p className="font-bold text-slate-500">No active doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const certList = doctor.certifications
              ? doctor.certifications.split(',').map(c => c.trim()).filter(Boolean)
              : [];
            const langList = doctor.languages_spoken
              ? doctor.languages_spoken.split(',').map(l => l.trim()).filter(Boolean)
              : [];
            const age = doctor.date_of_birth
              ? new Date().getFullYear() - new Date(doctor.date_of_birth).getFullYear()
              : null;

            return (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border-t-4 border-slate-600 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-slate-800 leading-tight mb-1">{doctor.full_name}</h3>
                      <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full">{doctor.specialization}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDoctor(doctor)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    {doctor.gender && <div className="flex"><span className="text-slate-500 w-24">Gender:</span><span className="text-slate-800 font-medium">{doctor.gender}</span></div>}
                    {age && <div className="flex"><span className="text-slate-500 w-24">Age:</span><span className="text-slate-800 font-medium">{age} years</span></div>}
                    {doctor.marital_status && <div className="flex"><span className="text-slate-500 w-24">Marital:</span><span className="text-slate-800 font-medium">{doctor.marital_status}</span></div>}
                    {doctor.work_schedule && <div className="flex"><span className="text-slate-500 w-24">Schedule:</span><span className="text-slate-800 font-medium">{doctor.work_schedule}</span></div>}
                    {(doctor.floor_number || doctor.room_number) && <div className="flex"><span className="text-slate-500 w-24">Location:</span><span className="text-slate-800 font-medium">Floor {doctor.floor_number} - Room {doctor.room_number}</span></div>}
                    {doctor.phone && <div className="flex"><span className="text-slate-500 w-24">Phone:</span><span className="text-slate-800 font-medium">{doctor.phone}</span></div>}
                    {doctor.email && <div className="flex"><span className="text-slate-500 w-24">Email:</span><span className="text-slate-800 font-medium text-xs">{doctor.email}</span></div>}
                    {doctor.years_of_experience !== '' && <div className="flex"><span className="text-slate-500 w-24">Experience:</span><span className="text-slate-800 font-medium">{doctor.years_of_experience} years</span></div>}
                    {doctor.consultation_fee_egp !== '' && <div className="flex"><span className="text-slate-500 w-24">Fee:</span><span className="text-slate-800 font-medium">{doctor.consultation_fee_egp} EGP</span></div>}
                  </div>

                  {certList.length > 0 && (
                    <div className="mt-4">
                      <p className="text-slate-500 text-sm mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {certList.map((cert, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{cert}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {langList.length > 0 && (
                    <div className="mt-4">
                      <p className="text-slate-500 text-sm mb-2">Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {langList.map((lang, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">{lang}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;