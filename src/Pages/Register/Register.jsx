// import React, { useState, useContext } from 'react';
// import { Button } from "@heroui/button";
// import CameraCapture from "../camera/Camera";
// import { zodResolver } from '@hookform/resolvers/zod';
// import { scheme } from "../../schema/IdSchema";
// import { useForm } from 'react-hook-form';
// import { Input } from '@heroui/react';
// import { useNavigate } from 'react-router-dom';
// import { checkFace, checkNationalID } from "../../APi/AuthService";
// import { CameraContext } from "../../Contexts/CameraContext";
// import { authContext } from '../../Contexts/authContext'; 

// // ------- Base64 → File -------
// function base64ToFile(base64, filename) {
//   if (!base64 || !base64.startsWith('data:image')) {
//     console.error('Invalid base64 format');
//     return null;
//   }

//   const arr = base64.split(",");
//   const mime = arr[0].match(/:(.*?);/)[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);

//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }

//   return new File([u8arr], filename, { type: mime });
// }

// export default function Register() {
//   const navigate = useNavigate();
//   const { login } = useContext(authContext);

//   const { handleSubmit, register, formState: { errors }, reset } = useForm({
//     resolver: zodResolver(scheme),
//     mode: "onBlur"
//   });

//   const [loading, setLoading] = useState(false);

//   // --------- CAMERA CONTEXT ---------
//   const { capturedImage, setCapturedImage } = useContext(CameraContext);

//   // ======================================================
//   async function handleRegister(formData) {
//     setLoading(true);

//     try {
//       const nationalID = formData.national_id?.trim();
//       const hasID = nationalID && nationalID !== "";
//       const hasImage = Boolean(capturedImage);

      
//       if (capturedImage) {
//         localStorage.setItem("capturedFaceImage", capturedImage);
//         console.log("✅ Image stored in localStorage");
//       }

//       // ==================== 1) No ID & No Image ====================
//       if (!hasID && !hasImage) {
//         alert("You must enter your national ID OR take a photo.");
//         setLoading(false);
//         return;
//       }

//       // ==================== 2) Check National ID ====================
//       if (hasID) {
//         console.log("Checking National ID:", nationalID);
        
//         try {
//           const idResult = await checkNationalID(nationalID);
//           console.log("Check ID response:", idResult);

//           // تحقق من وجود المريض
//           if (idResult?.patient && Object.keys(idResult.patient).length > 0) {
//             console.log("✅ Patient found:", idResult.patient);
            
            
//             login(idResult.patient);
            
//             navigate("/patient-Details", { replace: true });
//             return;
//           }

//           // المريض غير موجود
//           console.log("Patient not found, redirecting to FormPage");
//           navigate("/FormPage", { 
//             state: { national_id: nationalID },
//             replace: true 
//           });
//           return;
          
//         } catch (idError) {
//           console.error("ID check error:", idError);
          
//           // إذا كان 404 (المريض غير موجود)
//           if (idError?.response?.status === 404) {
//             console.log("Patient not found (404), redirecting to FormPage");
//             navigate("/FormPage", { 
//               state: { national_id: nationalID },
//               replace: true 
//             });
//             return;
//           }
          
         
//           const errorMessage = idError?.response?.data?.detail || 
//                               idError?.message || 
//                               "ID check failed";
//           alert(errorMessage);
//           setLoading(false);
//           return;
//         }
//       }

//       // ==================== 3) Check Face ====================
//       if (hasImage) {
//         console.log("Checking Face...");
        
//         const file = base64ToFile(capturedImage, "patient.jpg");
        
//         if (!file) {
//           alert("Error processing image");
//           setLoading(false);
//           return;
//         }

//         const form = new FormData();
//         form.append("image", file);

//         try {
//           const faceResult = await checkFace(form);
//           console.log("Face result:", faceResult);

//           // لو في error في الـ response
//           if (faceResult?.detail) {
//             console.log("Face quality error:", faceResult.detail);
//             alert(faceResult.detail);
//             setLoading(false);
//             return;
//           }

//           // تحقق من وجود المريض
//           if (faceResult?.patient && Object.keys(faceResult.patient).length > 0) {
//             console.log("✅ Patient found via face:", faceResult.patient);
            
            
//             login(faceResult.patient);
            
//             navigate("/patient-Details", { replace: true });
//             return;
//           }

         
//           console.log("Face not recognized, redirecting to FormPage");
//           navigate("/FormPage", { replace: true });
//           return;

//         } catch (faceError) {
//           console.error("Face check error:", faceError);
          
//           // إذا كان 404
//           if (faceError?.response?.status === 404) {
//             console.log("Face not found (404), redirecting to FormPage");
//             navigate("/FormPage", { replace: true });
//             return;
//           }
          
//           const errorMessage = faceError?.response?.data?.detail || 
//                               faceError?.message || 
//                               "Face recognition failed";
//           alert(errorMessage);
//           setLoading(false);
//           return;
//         }
//       }

//     } catch (err) {
//       console.error("Registration error:", err);
//       alert("Server Error: " + (err.message || "Unknown error"));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className='bg-[#cee3f6]'>
//       <div className="lg:flex lg:justify-evenly max-sm:w-full max-sm:px-4">

//         {/* LEFT */}
//         <div className='lg:w-[55%] mt-10 pt-8 pb-5 max-sm:w-full'>
//           <h2 className='my-5 text-[#224d7f] max-sm:text-2xl max-sm:text-center'>
//             Welcome to Our Mediversa Hospital
//           </h2>
//           <h3 className='text-white max-sm:text-base max-sm:text-center max-sm:px-2'>
//             Please Fill in your information below to complete your registration
//           </h3>

//           <form onSubmit={handleSubmit(handleRegister)} className='my-17 max-sm:my-8'>

//             <div className="lg:flex w-full sm:flex-wrap md:flex-nowrap gap-4 max-sm:flex max-sm:flex-col">
//               <Button className='lg:w-[40%] max-sm:w-full bg-[#5593ca] text-white py-9 text-3xl max-sm:text-xl max-sm:py-6 border-black border-1'>
//                 National Id
//               </Button>

//               <Input
//                 isInvalid={Boolean(errors?.national_id?.message)}
//                 errorMessage={errors?.national_id?.message}
//                 type="password"
//                 {...register("national_id")}
//                 placeholder="Enter your national ID"
//                 classNames={{
//                   input: "text-2xl max-sm:text-lg bg-white px-4",
//                   inputWrapper: "border border-black rounded-2xl bg-white py-9 max-sm:py-6",
//                   base: "w-[500px] max-sm:w-full"
//                 }}
//               />
//             </div>

//             <div className='flex w-full flex-wrap md:flex-nowrap gap-30 mt-30 max-sm:flex-col max-sm:gap-4 max-sm:mt-6'>
//               <Button 
//                 type='submit' 
//                 className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-2xl! w-[42%] max-sm:w-full bg-azraq-400 mt-2 text-white px-9 py-8 max-sm:py-6 text-2xl max-sm:text-lg font-bold"
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Submit"}
//               </Button>

//               <Button 
//                 onPress={() => {
//                   reset();
//                   setCapturedImage(null);
//                 }}
//                 className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-2xl! w-[42%] max-sm:w-full bg-white mt-2 text-azraq-400 px-9 py-8 max-sm:py-6 text-2xl max-sm:text-lg font-bold"
//                 disabled={loading}
//               >
//                 Clear Form
//               </Button>
//             </div>

//           </form>
//         </div>

//         {/* RIGHT */}
//         <div className="flex gap-2 max-sm:justify-center max-sm:pb-8">
//           <div className='size-55 mt-17 flex justify-center items-center max-sm:w-full max-sm:max-w-md max-sm:mt-6'>

//             {!capturedImage && (
//               <CameraCapture onCapture={(img) => setCapturedImage(img)} />
//             )}

//             {capturedImage && (
//               <div className="flex flex-col items-center gap-3 max-sm:w-full">
//                 <img
//                   src={capturedImage}
//                   alt="captured"
//                   className="w-full h-full object-cover rounded-lg"
//                 />

//                 <button
//                   onClick={() => setCapturedImage(null)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg max-sm:w-full"
//                 >
//                   Retake
//                 </button>
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useContext } from 'react';
import { Button } from "@heroui/button";
import CameraCapture from "../camera/Camera";
import { zodResolver } from '@hookform/resolvers/zod';
import { scheme } from "../../schema/IdSchema";
import { useForm } from 'react-hook-form';
import { Input } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { checkFace, checkNationalID } from "../../APi/AuthService";
import { CameraContext } from "../../Contexts/CameraContext";
import { authContext } from '../../Contexts/authContext';
import api from '../../APi/api';

function base64ToFile(base64, filename) {
  if (!base64 || !base64.startsWith('data:image')) {
    console.error('Invalid base64 format');
    return null;
  }
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new File([u8arr], filename, { type: mime });
}

async function checkAndNavigate(patient, navigate) {
  const patientId = patient?.user_id || patient?.id || patient?.patient_id;
  try {
    const apptResult = await api.patientAppointments(patientId);
    const appointments = apptResult.appointments || apptResult || [];
    const hasActiveQueue = appointments.some(a => a.status === 'queued');
    if (hasActiveQueue) {
      navigate("/wating", { replace: true });
      return;
    }
  } catch {}
  navigate("/patient-Details", { replace: true });
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(authContext);

  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    resolver: zodResolver(scheme),
    mode: "onBlur"
  });

  const [loading, setLoading] = useState(false);
  const { capturedImage, setCapturedImage } = useContext(CameraContext);

  async function handleRegister(formData) {
    setLoading(true);
    try {
      const nationalID = formData.national_id?.trim();
      const hasID = nationalID && nationalID !== "";
      const hasImage = Boolean(capturedImage);

      if (capturedImage) {
        localStorage.setItem("capturedFaceImage", capturedImage);
        console.log("✅ Image stored in localStorage");
      }

      if (!hasID && !hasImage) {
        alert("You must enter your national ID OR take a photo.");
        setLoading(false);
        return;
      }

      // ==================== Check National ID ====================
      if (hasID) {
        console.log("Checking National ID:", nationalID);
        try {
          const idResult = await checkNationalID(nationalID);
          console.log("Check ID response:", idResult);

          if (idResult?.patient && Object.keys(idResult.patient).length > 0) {
            console.log("✅ Patient found:", idResult.patient);
            login(idResult.patient);
            await checkAndNavigate(idResult.patient, navigate);
            return;
          }

          console.log("Patient not found, redirecting to FormPage");
          navigate("/FormPage", { state: { national_id: nationalID }, replace: true });
          return;

        } catch (idError) {
          console.error("ID check error:", idError);
          if (idError?.response?.status === 404) {
            console.log("Patient not found (404), redirecting to FormPage");
            navigate("/FormPage", { state: { national_id: nationalID }, replace: true });
            return;
          }
          const errorMessage = idError?.response?.data?.detail || idError?.message || "ID check failed";
          alert(errorMessage);
          setLoading(false);
          return;
        }
      }

      // ==================== Check Face ====================
      if (hasImage) {
        console.log("Checking Face...");
        const file = base64ToFile(capturedImage, "patient.jpg");
        if (!file) {
          alert("Error processing image");
          setLoading(false);
          return;
        }

        const form = new FormData();
        form.append("image", file);

        try {
          const faceResult = await checkFace(form);
          console.log("Face result:", faceResult);

          if (faceResult?.detail) {
            console.log("Face quality error:", faceResult.detail);
            alert(faceResult.detail);
            setLoading(false);
            return;
          }

          if (faceResult?.patient && Object.keys(faceResult.patient).length > 0) {
            console.log("✅ Patient found via face:", faceResult.patient);
            login(faceResult.patient);
            await checkAndNavigate(faceResult.patient, navigate);
            return;
          }

          console.log("Face not recognized, redirecting to FormPage");
          navigate("/FormPage", { replace: true });
          return;

        } catch (faceError) {
          console.error("Face check error:", faceError);
          if (faceError?.response?.status === 404) {
            console.log("Face not found (404), redirecting to FormPage");
            navigate("/FormPage", { replace: true });
            return;
          }
          const errorMessage = faceError?.response?.data?.detail || faceError?.message || "Face recognition failed";
          alert(errorMessage);
          setLoading(false);
          return;
        }
      }

    } catch (err) {
      console.error("Registration error:", err);
      alert("Server Error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-[#cee3f6]'>
      <div className="lg:flex lg:justify-evenly max-sm:w-full max-sm:px-4">

        {/* LEFT */}
        <div className='lg:w-[55%] mt-10 pt-8 pb-5 max-sm:w-full'>
          <h2 className='my-5 text-[#224d7f] max-sm:text-2xl max-sm:text-center'>
            Welcome to Our Mediversa Hospital
          </h2>
          <h3 className='text-white max-sm:text-base max-sm:text-center max-sm:px-2'>
            Please Fill in your information below to complete your registration
          </h3>

          <form onSubmit={handleSubmit(handleRegister)} className='my-17 max-sm:my-8'>
            <div className="lg:flex w-full sm:flex-wrap md:flex-nowrap gap-4 max-sm:flex max-sm:flex-col">
              <Button className='lg:w-[40%] max-sm:w-full bg-[#5593ca] text-white py-9 text-3xl max-sm:text-xl max-sm:py-6 border-black border-1'>
                National Id
              </Button>
              <Input
                isInvalid={Boolean(errors?.national_id?.message)}
                errorMessage={errors?.national_id?.message}
                type="password"
                {...register("national_id")}
                placeholder="Enter your national ID"
                classNames={{
                  input: "text-2xl max-sm:text-lg bg-white px-4",
                  inputWrapper: "border border-black rounded-2xl bg-white py-9 max-sm:py-6",
                  base: "w-[500px] max-sm:w-full"
                }}
              />
            </div>

            <div className='flex w-full flex-wrap md:flex-nowrap gap-30 mt-30 max-sm:flex-col max-sm:gap-4 max-sm:mt-6'>
              <Button
                type='submit'
                className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-2xl! w-[42%] max-sm:w-full bg-azraq-400 mt-2 text-white px-9 py-8 max-sm:py-6 text-2xl max-sm:text-lg font-bold"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
              <Button
                onPress={() => { reset(); setCapturedImage(null); }}
                className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-2xl! w-[42%] max-sm:w-full bg-white mt-2 text-azraq-400 px-9 py-8 max-sm:py-6 text-2xl max-sm:text-lg font-bold"
                disabled={loading}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2 max-sm:justify-center max-sm:pb-8">
          <div className='size-55 mt-17 flex justify-center items-center max-sm:w-full max-sm:max-w-md max-sm:mt-6'>
            {!capturedImage && (
              <CameraCapture onCapture={(img) => setCapturedImage(img)} />
            )}
            {capturedImage && (
              <div className="flex flex-col items-center gap-3 max-sm:w-full">
                <img src={capturedImage} alt="captured" className="w-full h-full object-cover rounded-lg" />
                <button onClick={() => setCapturedImage(null)} className="px-4 py-2 bg-red-600 text-white rounded-lg max-sm:w-full">
                  Retake
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}