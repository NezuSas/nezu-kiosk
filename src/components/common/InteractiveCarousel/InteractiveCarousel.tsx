import { useState, useEffect, useRef } from "react";
import styles from "./InteractiveCarousel.module.css";
import { InteractiveCarouselProps } from "./InteractiveCarousel.types";
import { useProductStore } from "@/store";
import { useParams } from "react-router-dom";
import { formatPrice, kioskConfig } from "@/kiosk.config";

export const InteractiveCarousel: React.FC<InteractiveCarouselProps> = ({
  services,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showText, setShowText] = useState(true);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchMoveX = useRef<number | null>(null);
  const { category, subCategory } = useParams<{
    category: string;
    subCategory: string;
  }>();

  const { addToCart, addedToCart } = useProductStore();

  // Cambio automático cada 5s si no hay interacción
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      );

      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left:
            sliderRef.current.clientWidth *
            ((currentIndex + 1) % services.length),
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, services.length]);

  // Mover con el mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    setIsPaused(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current || !isDragging.current || startX.current === null)
      return;
    const diff = startX.current - e.clientX;

    if (Math.abs(diff) > 50) {
      const newIndex =
        diff > 0
          ? Math.min(currentIndex + 1, services.length - 1)
          : Math.max(currentIndex - 1, 0);

      setCurrentIndex(newIndex);
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });

      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (!showDescription) setIsPaused(false);
  };

  // Manejo táctil (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchMoveX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchMoveX.current) return;

    const diff = touchStartX.current - touchMoveX.current;

    if (Math.abs(diff) > 50) {
      const newIndex =
        diff > 0
          ? Math.min(currentIndex + 1, services.length - 1)
          : Math.max(currentIndex - 1, 0);

      setCurrentIndex(newIndex);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: sliderRef.current.clientWidth * newIndex,
          behavior: "smooth",
        });
      }
    }

    touchStartX.current = null;
    touchMoveX.current = null;
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carousel}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {services.map((service) => (
          <div key={service.id} className={styles.imageWrapper}>
            {/* Imagen */}
            <span
              className={`${styles.titleImage} ${
                showDescription ? styles.hiddenTitle : styles.showTitle
              }`}
            >
              {service.title}
            </span>
            <img
              src={service.image}
              alt={service.title}
              className={styles.projectImage}
              onClick={() => setShowDescription(!showDescription)}
            />

            {/* Descripción dentro de la imagen en la mitad derecha */}
            <div
              className={`${styles.descriptionContainer} ${
                showDescription ? styles.show : ""
              }`}
              onClick={() => setShowDescription(false)}
            >
              <h2 className={styles.productTitle}>{service.title}</h2>
              <span className={styles.priceTag}>{formatPrice(service.price)}</span>
              <p className={styles.productDescription}>{service.description}</p>
              
              <button
                className={`${styles.addButton} ${
                  addedToCart[service.id] ? styles.added : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();

                  if (!addedToCart[service.id]) {
                    const cartItem = {
                      id: service.id,
                      name: service.title,
                      price: service.price,
                      image: service.image,
                      quantity: 1,
                      category: category ?? "unknown",
                      subCategory: subCategory ?? "unknown",
                      serviceType: "service",
                    };
                    addToCart(cartItem);

                    // Pequeña animación de feedback inmediato
                    setShowText(false);
                    setTimeout(() => setShowText(true), 600);
                  }
                }}
                disabled={addedToCart[service.id]}
              >
                <span className={styles.cartIcon}>{addedToCart[service.id] ? "✅" : "🛒"}</span>
                <span
                  className={`${styles.buttonText} ${
                    !showText ? styles.hiddenText : ""
                  }`}
                >
                  {showText
                    ? addedToCart[service.id]
                      ? kioskConfig.texts.added
                      : kioskConfig.texts.acquire
                    : ""}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores (no se modificó) */}
      <div className={styles.indicators}>
        {services.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};
