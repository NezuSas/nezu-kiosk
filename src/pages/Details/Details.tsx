import { useParams, useNavigate } from "react-router-dom";
import { DETAILS } from "./Details.constants";
import styles from "./Details.module.css";
import { Carousel } from "@/components/common/Carousel";
import { InteractiveCarousel } from "@/components/common/InteractiveCarousel";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useProductStore } from "@/store";
import { type CartItem } from "@/store/useProductStore";
import { kioskConfig } from "@/kiosk.config";

const { texts } = kioskConfig;

const Details = () => {
  const { category, subCategory } = useParams<{
    category: string;
    subCategory: string;
  }>();
  const navigate = useNavigate();
  const detailData = DETAILS.find((detail) => detail.id === subCategory);
  const projectImages = detailData?.projects ?? [];
  const serviceImages = detailData?.services.map((service) => service.image) ?? [];
  useImagePreloader([...projectImages, ...serviceImages]);
  const { cart } = useProductStore();
  const cartItemsCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  if (!detailData) {
    return <p className={styles.error}>No encontramos esta línea de servicios.</p>;
  }

  const handleGoBack = () => {
    navigate(`/categories/${category}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← {texts.back}
      </button>
      <div className={styles.detailContainer}>
        <h1 className={styles.title}>{detailData.title}</h1>
        {detailData.description && <p className={styles.lead}>{detailData.description}</p>}

        <h2 className={styles.sectionTitle}>{texts.projects}</h2>
        <Carousel images={detailData.projects} />

        <h2 className={styles.sectionTitle}>{texts.services}</h2>
        <InteractiveCarousel services={detailData.services} />

        <button
          className={`${styles.cartButton} pulse`}
          onClick={() => navigate("/cart")}
        >
          <div className={styles.cartContent}>
            <span>🛒 {texts.goToCart}</span>
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
