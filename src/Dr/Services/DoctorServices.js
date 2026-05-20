

const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

class DoctorAPI {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // ==================== Helpers ====================

  getToken() {
    return localStorage.getItem("token");
  }

  getAuthHeaders(extraHeaders = {}) {
    const token = this.getToken();
    return {
      'ngrok-skip-browser-warning': 'true',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...extraHeaders,
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getAuthHeaders({
        'Content-Type': 'application/json',
        ...options.headers,
      }),
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          if (contentType?.includes('application/json')) {
            const error = await response.json();
            
            if (typeof error === 'string') {
              errorMessage = error;
            } else if (error.message && typeof error.message === 'string') {
              errorMessage = error.message;
            } else if (error.detail && typeof error.detail === 'string') {
              errorMessage = error.detail;
            } else {
              errorMessage = JSON.stringify(error);
            }
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (parseErr) {
          console.warn('Could not parse error response:', parseErr);
        }

        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        throw new Error(errorMessage);
      }

      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      return await response.text();

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== Doctor APIs ====================

  getProfile() {
    return this.request('/doctor/profile', { method: 'GET' });
  }

  updateProfile(data) {
    return this.request('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

 
  updateStatus(data) {
    const statusValue = data.available ? 'available' : 'on_break';
    return this.request('/doctor/status', {
      method: 'PUT',
      body: JSON.stringify({ status: statusValue }),
    });
  }

  getQueue() {
    return this.request('/doctor/queue', { method: 'GET' });
  }

  callNext() {
    return this.request('/doctor/queue/next', { method: 'POST' });
  }

  completeConsultation(queueId, data) {
    return this.request(`/doctor/queue/${queueId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  markNoShow(queueId) {
    return this.request(`/doctor/queue/${queueId}/no-show`, {
      method: 'POST',
    });
  }

  getPatient(patientId) {
    return this.request(`/doctor/patient/${patientId}`, {
      method: 'GET',
    });
  }

  addNote(data) {
    return this.request('/doctor/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getStats() {
    return this.request('/doctor/stats', { method: 'GET' });
  }

  getMyUploads() {
    return this.request('/doctor/my-uploads', { method: 'GET' });
  }

  // ==================== Medical Files ====================

  async uploadMedicalFile(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('patient_id', fileData.patientId);
    formData.append('file_type', fileData.fileType);
    if (fileData.title) formData.append('title', fileData.title);
    if (fileData.description) formData.append('description', fileData.description);
    if (fileData.doctorId) formData.append('doctor_id', fileData.doctorId);

    const response = await fetch(`${this.baseURL}/medical-files/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async analyzeMedicalImage(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    if (fileData.symptoms) formData.append('symptoms', fileData.symptoms);
    if (fileData.patientId) formData.append('patient_id', fileData.patientId);

    const response = await fetch(`${this.baseURL}/medical-files/analyze`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();

    
    if (!result.success) {
      console.warn('⚠️ AI analysis returned success:false:', result.error);

      return result;
    }

    return result;
  }

  async downloadMedicalFile(fileId) {
    const response = await fetch(`${this.baseURL}/medical-files/${fileId}/download`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return response.blob();
  }

  deleteMedicalFile(fileId) {
    return this.request(`/medical-files/${fileId}`, { method: 'DELETE' });
  }

  getPatientFiles(patientId, fileType = null) {
    const params = fileType ? `?file_type=${fileType}` : '';
    return this.request(`/medical-files/patient/${patientId}${params}`, { method: 'GET' });
  }

  // ==================== Appointments ====================

  cancelAppointment(id) {
    return this.request(`/appointments/${id}/cancel`, { method: 'PUT' });
  }

  getPatientAppointments(patientId) {
    return this.request(`/patients/${patientId}/appointments`, { method: 'GET' });
  }

  // ==================== Queue  ====================

  joinQueue(data) {
    return this.request('/queue/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getQueueStatus(queueId) {
    return this.request(`/queue/status/${queueId}`, { method: 'GET' });
  }

  getPatientActiveQueue(patientId) {
    return this.request(`/queue/patient/${patientId}/active`, { method: 'GET' });
  }

  cancelQueue(queueId) {
    return this.request(`/queue/${queueId}/cancel`, { method: 'PUT' });
  }

  getPatientNotifications(patientId) {
    return this.request(`/queue/notifications/${patientId}`, { method: 'GET' });
  }
}

export default new DoctorAPI();