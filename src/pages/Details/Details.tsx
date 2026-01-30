import { useParams, useNavigate } from "react-router-dom";
import { DETAILS } from "./Details.constants";
import styles from "./Details.module.css";
import { Carousel } from "@/components/common/Carousel";
import { InteractiveCarousel } from "@/components/common/InteractiveCarousel";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useProductStore } from "@/store";
import { type CartItem } from "@/store/useProductStore";

const Details = () => {
  const { category, subCategory } = useParams<{
    category: string;
    subCategory: string;
  }>();

  const navigate = useNavigate();

  // Buscar los detalles de la subcategoría seleccionada
  const detailData = DETAILS.find((detail) => detail.id === subCategory);

  if (!detailData) {
    return <p className={styles.error}>❌ No se encontraron detalles.</p>;
  }

  const projectImages = detailData.projects || [];
  const serviceImages = detailData.services.design.map((s) => s.image);
  useImagePreloader([...projectImages, ...serviceImages]);

  const { cart } = useProductStore();
  const cartItemsCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const handleGoBack = () => {
    navigate(`/categories/${category}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← Regresar
      </button>
      <div className={styles.detailContainer}>
        {/* Título principal */}
        <h1 className={styles.title}>{detailData.title}</h1>

        {/* Sección de Proyectos */}
        <h2 className={styles.sectionTitle}>Proyectos Realizados</h2>

        {/* Carrusel de imágenes */}
        <Carousel images={detailData.projects} />

        {/* Sección de Servicios */}
        <h2 className={styles.sectionTitle}>Servicios</h2>

        {/* Carrusel interactivo */}
        <InteractiveCarousel
          services={detailData.services.design}
          type={"design"}
        />

        <button 
          className={`${styles.cartButton} pulse`} 
          onClick={() => navigate("/cart")}
        >
          <div className={styles.cartContent}>
            <span>🛒 Ir al Carrito</span>
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Details;
