import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/common/Footer";
import styles from "./MainLayout.module.css";
import { type MainLayoutProps } from "./MainLayout.types";

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isIdle, setIsIdle] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        <div className={styles.videoContainer} style={{ display: isIdle ? "flex" : "none" }}>
          <video
            ref={videoRef}
            className={styles.video}
            autoPlay
            loop
            muted={false}
            playsInline
            preload="none"
          >
            <source src="/videos/inactivity.mp4" type="video/mp4" />
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
          logo="/images/logo_color.avif"
          slogan="Tu empresa, tu futuro"
          contact="nezu.ec@nezuecuador.com"
          location="Cueva de los tallos y base sur, Cuenca, Ecuador"
        />
      )}
    </div>
  );
};
