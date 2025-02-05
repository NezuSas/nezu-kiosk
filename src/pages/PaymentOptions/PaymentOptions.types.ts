export interface UserData {
    businessName: string;
    ruc: string;
    address: string;
    email: string;
    paymentMethod: string;
}

export interface QRCodeOption {
    label: string;
    value: string;
}

export interface PaymentOptionsProps {
    userData?: UserData;
    qrCodes?: QRCodeOption[];
}