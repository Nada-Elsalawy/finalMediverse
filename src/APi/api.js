
import axios from "axios";

const BASE = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";
const H = { "ngrok-skip-browser-warning": "true" };

const api = {

  specialties: () => axios.get(`${BASE}/appointments/specialties`, { headers: H }).then(r => r.data),
  bookingDoctors: (specialty) => axios.get(`${BASE}/appointments/doctors`, { params: { specialty }, headers: H }).then(r => r.data),
  doctorSlots: (doctorId, date) => axios.get(`${BASE}/appointments/doctors/${doctorId}/slots`, { params: { date }, headers: H }).then(r => r.data),
  book: (body) => axios.post(`${BASE}/appointments/book`, body, { headers: { ...H, "Content-Type": "application/json" } }).then(r => r.data),
  joinQueue: (body) => axios.post(`${BASE}/queue/join`, body, { headers: { ...H, "Content-Type": "application/json" } }).then(r => r.data),
  patientAppointments: (pid) => axios.get(`${BASE}/patients/${pid}/appointments`, { headers: H }).then(r => r.data),
  cancelAppt: (id) => axios.put(`${BASE}/appointments/${id}/cancel`, {}, { headers: H }).then(r => r.data),
  files: (pid) => axios.get(`${BASE}/medical-files/patient/${pid}`, { headers: H }).then(r => r.data),
  
  activeQueue: (pid) => axios.get(`${BASE}/queue/patient/${pid}/active`, { headers: H }).then(r => r.data),
};

export default api;