import React, { useState } from 'react';
import type { FormProps, FormData } from './Form.types';
import { PAYMENT_METHODS } from './Form.constants';
import styles from './Form.module.css';

export const Form: React.FC<FormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ruc: '',
    address: '',
    email: '',
    paymentMethod: 'DE UNA'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí puedes agregar la lógica para enviar los datos
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.logoContainer}>
        <img src="/src/assets/images/logo_color.png" alt="Nezu Logo" className={styles.logo} />
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
            value={formData.ruc}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>
            Dir.
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod" className={styles.label}>
            Método
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={styles.select}
            required
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.button}>
          CONFIRMAR
        </button>
      </form>
    </div>
  );
};