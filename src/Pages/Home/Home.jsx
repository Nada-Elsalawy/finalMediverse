import { useEffect, useRef } from "react";
import Typed from "typed.js";
import style from "../Home/Home.module.css";
import photo from "../../assets/img/healthcare-theme-3d-illustration-of-an-empty-emergency-room-ai-generative-free-photo.jpg";
import Splash from "../Splash/Splash";
export default function Home() {

  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Welcome to Mediverse Hospital.",
        "Advanced HealthCare for Every Patient.",
        "Your Health ,Our Priority "
      ],
      typeSpeed: 40,
      backSpeed: 20,
      loop: true
    });

    return () => typed.destroy(); // cleanup
  }, []);

  return <>
    <div className={style.container}>
      <img src={photo} className={style.bg} />

      <h1 className={style.typing}>
        <span ref={typedRef}></span>
      </h1>
    </div>
     <Splash/>
  </>;
 
}