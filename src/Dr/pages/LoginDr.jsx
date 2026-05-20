
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginApi } from "../Services/LoginServices";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../Dr/schema/LoginSchema";
import { authContext } from "../../Contexts/authContext";
import React from 'react'
import photo from "../../assets/img/healthcare-theme-3d-illustration-of-an-empty-emergency-room-ai-generative-free-photo.jpg"
import style from "../../Dr/pages/DrHome.module.css"
import { Button, Input } from '@heroui/react'

export default function DrHome() {
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()
    const { login } = useContext(authContext)

    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginSchema)
    })

    async function handleLogin(formData) {
        setErrMsg("")
        setIsLoading(true)
        const data = await loginApi(formData)
        setIsLoading(false)

        if (data.access_token) {
            localStorage.setItem("token", data.access_token)
            login(data.user)

            const role = data.user.role

            if (role === "super_admin") {
                navigate("/MediVerseDashboard")
            } else {
                navigate("/dr")
            }
        } else {
            setErrMsg(data.message || "بيانات غير صحيحة")
        }
    }

    return (
        
        <div className={style.container}>
            <button
      onClick={() => navigate(-1)}
      className="absolute top-6 left-6 z-50 text-white text-2xl 
                 bg-white/10 backdrop-blur-md border border-white/30 
                 rounded-full w-12 h-12 flex items-center justify-center 
                 shadow-lg"
    >
      ←
    </button>
            <img src={photo} className={style.bgg} alt="Background" /> 

            <div className='backdrop-blur-md bg-white/10 border border-white/30 rounded-3xl shadow-2xl py-12 px-8 max-w-lg w-full mx-auto'>
                
                <h1 className='text-white text-center text-5xl font-semibold pb-8 tracking-wide'>
                    تسجيل الدخول
                </h1>

                {errMsg && (
                    <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-xl mb-4">
                        {errMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-6'>
                    <div>
                        <Input 
                            isInvalid={Boolean(errors.email?.message)} 
                            errorMessage={errors.email?.message} 
                            variant="bordered"  
                            type="email" 
                            {...register("email")}
                            placeholder="البريد الإلكتروني"
                            classNames={{
                                input: "text-xl px-0 py-0 bg-white border-0 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-blue-400 block w-full px-4 py-3.5 shadow-md placeholder:text-gray-500 transition-all",
                                inputWrapper: "border border-black rounded-2xl bg-white py-9",
                            }}
                        />
                    </div>

                    <div>
                        <Input 
                            isInvalid={Boolean(errors.password?.message)} 
                            errorMessage={errors.password?.message} 
                            variant="bordered"  
                            type="password" 
                            {...register("password")}
                            placeholder="كلمة المرور"
                            classNames={{
                                input: "text-xl px-0 py-0 bg-white border-0 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-blue-400 block w-full px-4 py-3.5 shadow-md placeholder:text-gray-500 transition-all",
                                inputWrapper: "border border-black rounded-2xl bg-white py-9",
                            }}
                        />
                    </div>

                    <Button 
                        type="submit"
                        isLoading={isLoading}
                        className='w-full text-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-7 rounded-xl shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all mt-2'
                        dir="rtl"
                    >
                        {isLoading ? "جاري التحميل..." : "ارسال"}
                    </Button>

                    <div className="p-3 my-4" dir="rtl">
                        <h2 className="text-2xl text-blue-300 p-2">ملاحظات هامة</h2>
                        <p className="text-blue-50">حسابات الأطباء يتم إنشاؤها فقط من قبل الإدارة بعد المقابلة والموافقة. للحصول على حساب جديد، يرجى الاتصال بقسم الموارد البشرية.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}