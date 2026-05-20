

// export const getPatientId = () => {
//   const id = localStorage.getItem("patient_id");
//   return id ? Number(id) : undefined;
// };

export const getPatientId = () => {
  const patient = localStorage.getItem("patient");
  
  if (!patient) return undefined;
  
  try {
    const patientData = JSON.parse(patient);
    return patientData?.id || patientData?.patient_id || undefined;
  } catch (error) {
    console.error("Error parsing patient data:", error);
    return undefined;
  }
};