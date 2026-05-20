

const API_BASE_URL = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

export const joinQueue = async (queueData) => {
  try {
    console.log('📤 Joining queue:', queueData);

    const response = await fetch(`${API_BASE_URL}/queue/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(queueData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || errorJson.detail || `خطأ في الانضمام للقائمة (${response.status})`);
      } catch (parseError) {
        throw new Error(`خطأ في الانضمام للقائمة (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Queue joined:', data);
    return data;

  } catch (error) {
    console.error('💥 Join Queue Error:', error);
    throw error;
  }
};


export const getQueueStatus = async (queueId) => {
  try {
    console.log('🔍 Getting queue status for:', queueId);
    
    const response = await fetch(`${API_BASE_URL}/queue/status/${queueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Status Error:', errorText);
      throw new Error(`خطأ في الحصول على حالة القائمة (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Queue status:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Queue Status Error:', error);
    throw error;
  }
};

export const getPatientActiveQueue = async (patientId) => {
  try {
    console.log('🔍 Getting active queue for patient:', patientId);
    
    const response = await fetch(`${API_BASE_URL}/queue/patient/${patientId}/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('ℹ️ No active queue found for patient');
        return null; // لا توجد قائمة انتظار نشطة
      }
      const errorText = await response.text();
      console.error('❌ Active Queue Error:', errorText);
      throw new Error(`خطأ في الحصول على القائمة النشطة (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Active queue:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Active Queue Error:', error);
    throw error;
  }
};

/**
 * إلغاءقائمة الانتظار
 */
export const cancelQueue = async (queueId) => {
  try {
    console.log('🚫 Cancelling queue:', queueId);
    
    const response = await fetch(`${API_BASE_URL}/queue/${queueId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' Cancel Error:', errorText);
      throw new Error(`خطأ في مغادرة القائمة (${response.status})`);
    }
    
    const data = await response.json();
    console.log(' Queue cancelled:', data);
    return data;
    
  } catch (error) {
    console.error(' Cancel Queue Error:', error);
    throw error;
  }
};

/**
 * الحصول على إشعارات المريض
 */
export const getPatientNotifications = async (patientId) => {
  try {
    console.log('🔔 Getting notifications for patient:', patientId);
    
    const response = await fetch(`${API_BASE_URL}/queue/notifications/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' Notifications Error:', errorText);
      throw new Error(`خطأ في الحصول على الإشعارات (${response.status})`);
    }
    
    const data = await response.json();
    console.log('Notifications:', data);
    return data;
    
  } catch (error) {
    console.error(' Notifications Error:', error);
    throw error;
  }
};