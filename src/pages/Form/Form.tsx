import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { FormProps, FormData } from "./Form.types";
import { PAYMENT_METHODS } from "./Form.constants";
import styles from "./Form.module.css";
import io from "socket.io-client";

import { asset } from "../../utils/asset";

export const Form: React.FC<FormProps> = ({ className = "" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    ruc: "",
    address: "",
    email: "",
    paymentMethod: "QR",
  });

  const [receivedData, setReceivedData] = useState<FormData | null>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    // Establecer conexión WebSocket
    const newSocket = io("/");
    setSocket(newSocket);

    console.log("🔗 Conectado al WebSocket en /form con sesión:", sessionId);

    newSocket.on("message", (message) => {
      console.log("📩 Datos recibidos en /form:", message);
      setReceivedData(message);
    });

    return () => {
      console.log("🔌 Cerrando conexión WebSocket en /form");
      newSocket.disconnect();
    };
  }, [sessionId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId && socket) {
      socket.emit("message", { sessionId, ...formData });
      console.log("📤 Datos enviados al servidor:", { sessionId, ...formData });
      alert("Datos enviados correctamente. Por favor, vuelva al kiosko.");
    }
  };

  if (!sessionId) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.formCard}>
        <div className={styles.logoContainer}>
          <img
            src={asset("/images/logo_color.avif")}
            alt="Nezu Logo"
            className={styles.logo}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="businessName" className={styles.label}>
              Razón Social
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              placeholder="Ej: Nezu Corp"
              value={formData.businessName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ruc" className={styles.label}>
              RUC
            </label>
            <input
              type="text"
              id="ruc"
              name="ruc"
              placeholder="0000000000001"
              value={formData.ruc}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Calle Principal #123"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod" className={styles.label}>
              Método de Pago
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.button}>
            PAGAR AHORA
          </button>
        </form>

        {receivedData && (
          <div className={styles.receivedDataContainer}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>✓ Datos Enviados</h3>
            <p><strong>Razón:</strong> {receivedData.businessName}</p>
            <p><strong>RUC:</strong> {receivedData.ruc}</p>
          </div>
        )}

        <div className={styles.mobileFooter}>
          <p>© 2026 NEZU - Experiencia Digital</p>
        </div>
      </div>
    </div>
  );
};

export default Form;