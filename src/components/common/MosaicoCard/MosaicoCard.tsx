import { type MosaicoCardProps } from "./MosaicoCard.types";
import styles from "./MosaicoCard.module.css";

export const MosaicoCard = ({
  title,
  images,
  layout = "left", // Puede ser "left" o "right"
  onClick,
}: MosaicoCardProps) => (
  <div className={styles.container} onClick={onClick}>
    <div
      className={`${styles.imageGrid} ${
        layout === "left" ? styles.leftLayout : styles.rightLayout
      }`}
    >
      {/* Imagen principal */}
      <img src={images[0]} alt={title} className={styles.mainImage} />

      {/* Contenedor de imágenes secundarias */}
      <div className={styles.sideImages}>
        <img src={images[1]} alt={`${title} secondary 1`} className={styles.sideImage} />
        <img src={images[2]} alt={`${title} secondary 2`} className={styles.sideImage} />
      </div>
    </div>

    {/* Título dentro de la imagen */}
    <h3 className={styles.title}>{title}</h3>
  </div>
);