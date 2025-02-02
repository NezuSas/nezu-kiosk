export interface MosaicoCardProps {
    title: string;
    images: string[];
    layout: "left" | "right";
    onClick?: () => void;
}