import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/common/Footer";
import styles from "./MainLayout.module.css";
import { type MainLayoutProps } from "./MainLayout.types";

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={styles.container}>
      {children || <Outlet />}
      {!isHome && (
        <Footer
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
