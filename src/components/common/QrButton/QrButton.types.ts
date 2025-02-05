export interface QrButtonProps {
    className?: string;
}

export interface QrModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrUrl: string;
}