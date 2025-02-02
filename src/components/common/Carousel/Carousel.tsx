import { useState, useEffect, useRef } from "react";
import styles from "./Carousel.module.css";
import { CarouselProps } from "./Carousel.types";

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Para gestos táctiles
  const touchStartX = useRef<number | null>(null);
  const touchMoveX = useRef<number | null>(null);

  // Cambio automático cada 5s si no hay interacción
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );

      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left:
            sliderRef.current.clientWidth *
            ((currentIndex + 1) % images.length),
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, images.length]);

  // Mover el carrusel con el mouse (drag)
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
          ? Math.min(currentIndex + 1, images.length - 1)
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
    setIsPaused(false);
  };

  // 🔹 Manejo táctil (Touch events)
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
          ? Math.min(currentIndex + 1, images.length - 1)
          : Math.max(currentIndex - 1, 0);

      setCurrentIndex(newIndex);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: sliderRef.current.clientWidth * newIndex,
          behavior: "smooth",
        });
      }
    }

    // Reset touch variables
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
        onTouchStart={handleTouchStart} // Soporte táctil
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Project ${index + 1}`}
            className={styles.projectImage}
          />
        ))}
      </div>

      {/* Indicadores */}
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: sliderRef.current.clientWidth * index,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};