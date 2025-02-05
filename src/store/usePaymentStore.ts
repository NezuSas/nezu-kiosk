import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  businessName: string;
  ruc: string;
  address: string;
  email: string;
  paymentMethod: string;
}

interface QRCodeOption {
  label: string;
  value: string;
}

interface PaymentStore {
  userData: UserData | null;
  qrCodes: QRCodeOption[];
  
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      userData: null,
      qrCodes: [
        { label: "Banco Pichincha - Deuna", value: "https://www.pichincha.com/deuna" },
        { label: "Banco Internacional - +Pagos", value: "https://www.bancointernacional.com.ec/producto/qr-link-de-pagos-establecimientos/" },
        { label: "Banco Guayaquil - Billetera Móvil Bimo", value: "https://www.bancoguayaquil.com/cuentas/bimo/" },
      ],

      setUserData: (data) => set({ userData: data }),
      clearUserData: () => set({ userData: null }),
    }),
    {
      name: "payment-storage",
    }
  )
);