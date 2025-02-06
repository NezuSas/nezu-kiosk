import React, { useEffect } from "react";
import { useSearchParams, useNavigate  } from "react-router-dom";
import styles from "./DatafastInstructions.module.css";

export const DatafastInstructions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }
  }, [sessionId, navigate]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <img
        src="/images/logo_color.avif"
        alt="Nezu Logo"
        className={styles.logo}
      />
      <h1 className={styles.message}>Por favor, siga las instrucciones del Datafast</h1>
      <div className={styles.arrowContainer}>
        <span className={styles.arrow}>↓</span>
      </div>
    </div>
  );
};

export default DatafastInstructions;