import React from 'react'
import img1 from "../../assets/img/doctors-checking-medical-history.jpg"
import img2 from "../../assets/img/coronavirus-outbreak-update-phone-application.jpg"
import img3 from "../../assets/img/man-working-as-pharmacist.jpg"
import splashStyle from "../../Pages/Splash/Splash.module.css"
import {Button} from "@heroui/react";
import { useNavigate } from 'react-router-dom';
export default function Splash() {
   const navigate = useNavigate();
  return <>
  <div className='lg:mt-0  lg:pb-15'>
    
    <div className="container mx-auto text-center">
      <p className='lg:mt-10 bg-linear-to-r from-azraq-400 to-azraq-400 bg-clip-text text-5xl font-bold text-transparent p-8 '>Our Services</p>
      <div className= {`${splashStyle.underLine}   pb-3`}>
  
          <div className={`${splashStyle.leftLine}`}></div>
          <i className="fa-solid fa-star text-main"> </i>
          <div className={`${splashStyle.rightLine}`}></div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 '>
        <div className='p-4 '>
          <img src={img1} alt="" className='w-full rounded-4xl' />
        <p className='text-azraq-400 py-3'>Our Mediverse brings together a wide network of highly experienced doctors and nurses, all powered by AI. They provide accurate advice, personalized care, and reliable guidance to keep you healthy and confident.</p>
        <Button onPress= {()=> navigate("register")} className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-lg! bg-azraq-500 mt-4 text-white px-9 py-6 text-xl">
  Register Now
</Button>
  
        </div>
         <div className='p-4 ' >
          <img src={img2} alt=""className='w-full rounded-4xl' />
        <p className='text-azraq-400 py-3' >You can easily check on your health by registering in our AI-powered chatbot program. It provides guidance, answers your questions, tracks your progress, and ensures you stay informed and cared for.</p>
       <Button onPress= {()=> navigate("chatBot")} className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-lg! bg-azraq-500 mt-3.5 text-white px-9 py-6 text-xl">
  Register Now 
</Button>
        </div>
         <div className='p-4'>
          <img src={img3} alt="" className='w-full rounded-4xl ' />
        <p className='text-azraq-400 py-3'>Our pharmacy offers a wide range of medications and health products, all easily accessible online. With AI-powered guidance, you can get accurate recommendations, track your orders, and ensure safe and timely delivery.</p>
      <Button  onPress= {()=> navigate("pharmacy")} className="shadow-[4px_9px_10px_rgba(0,0,0,0.5)]! rounded-lg! bg-azraq-500 mt-7.5 text-white px-9 py-6 text-xl">
  Register Now
</Button>
        </div>
      </div>
    </div>
  </div>
  
  
  
  </>

}
