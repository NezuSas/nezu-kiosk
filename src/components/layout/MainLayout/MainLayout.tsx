import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/common/Footer";
import styles from "./MainLayout.module.css";
import { type MainLayoutProps } from "./MainLayout.types";
import { asset } from "@/utils/asset";
import { kioskConfig } from "@/kiosk.config";

const { business, idle } = kioskConfig;

/**
 * Shell of every kiosk screen: content, footer (except on the start screen) and the idle behaviour. After
 * `idle.returnHomeAfterSeconds` without touches the kiosk plays the attract video, if one is configured, or goes
 * back to the start screen so the next customer never finds someone else's cart half done.
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [isIdle, setIsIdle] = useState(false);
  const timer = useRef<number | null>(null);

  const armTimer = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (idle.returnHomeAfterSeconds <= 0) return;
    timer.current = window.setTimeout(() => {
      if (idle.attractVideo) setIsIdle(true);
      else navigate("/");
    }, idle.returnHomeAfterSeconds * 1000);
  }, [navigate]);

  useEffect(() => {
    armTimer();
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [armTimer, location.pathname]);

  const handleInteraction = () => {
    if (isIdle) {
      setIsIdle(false);
      navigate("/");
    }
    armTimer();
  };

  return (
    <div
      className={styles.container}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {isIdle && idle.attractVideo && (
        <div className={`${styles.videoContainer} ${styles.active}`}>
          <video className={styles.video} autoPlay loop muted playsInline preload="none">
            <source src={asset(idle.attractVideo)} type="video/mp4" />
          </video>
        </div>
      )}
      {!isIdle && (
        <div className={styles.content}>{children || <Outlet />}</div>
      )}
      {!isHome && !isIdle && (
        <Footer
          className={styles.footer}
          logo={asset(business.logoColor)}
          slogan={business.slogan}
          contact={business.contact}
          location={business.location}
        />
      )}
    </div>
  );
};
