export interface FormProps {
    className?: string;
}

export interface FormData {
    businessName: string;
    ruc: string;
    address: string;
    email: string;
    paymentMethod: 'DE UNA' | 'CREDITO' | 'DATAFAST';
}