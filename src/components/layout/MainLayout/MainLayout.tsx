import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/common/Footer";
import styles from "./MainLayout.module.css";
import { type MainLayoutProps } from "./MainLayout.types";

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [isIdle, setIsIdle] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  let idleTimer: NodeJS.Timeout;

  useEffect(() => {
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      setIsIdle(false);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 300000);
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [navigate]);

  useEffect(() => {
    if (isIdle && videoRef.current) {
      videoRef.current.volume = 0.5;
    }
  }, [isIdle]);
  const handleInteraction = () => {
    setIsIdle(false);
  };

  return (
    <div
      className={styles.container}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {isIdle && (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            autoPlay
            loop
            muted={false}
            playsInline
          >
            <source src="/src/assets/videos/inactivity.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
      )}
      {!isIdle && (
        <div className={styles.content}>{children || <Outlet />}</div>
      )}
      {!isHome && !isIdle && (
        <Footer
          className={styles.footer}
          logo="/src/assets/images/logo_color.png"
          slogan="Tu empresa, tu futuro"
          contact="nezu.ec@nezuecuador.com"
          location="123 Calle Principal, Ciudad"
          branchName="Sucursal Centro"
        />
      )}
    </div>
  );
};
