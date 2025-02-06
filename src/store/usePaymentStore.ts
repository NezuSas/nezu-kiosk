import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import LZString from "lz-string";

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

const storageWithCompression = {
  getItem: (name: string) => {
    const compressed = localStorage.getItem(name);
    if (!compressed) return null;
    const decompressed = LZString.decompressFromUTF16(compressed);
    return decompressed ? JSON.parse(decompressed) : null;
  },
  setItem: (name: string, value: any) => {
    const compressed = LZString.compressToUTF16(JSON.stringify(value));
    localStorage.setItem(name, compressed);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

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
      storage: storageWithCompression,
    } as PersistOptions<PaymentStore>
  )
);