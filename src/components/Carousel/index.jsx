import React, { useCallback, useRef, useState } from "react";

import CarouselSlides from "components/CarouselSlides";
import Dots from "components/Dots";

import useInterval from "hooks/useInterval";

import styles from "./styles.module.scss";

const CAROUSEL_SLIDE_INTERVAL = 10000;

const Carousel = ({ className = "", items = [] }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slideCount = useRef(items.length);

  const handleRightClick = useCallback(() => {
    const nextSlide = activeSlide + 1;

    if (nextSlide < slideCount.current) {
      setActiveSlide(nextSlide);
    }
  }, [activeSlide]);

  useInterval(() => {
    if (activeSlide < slideCount.current - 1) {
      handleRightClick();
    } else {
      setActiveSlide(0);
    }
  }, CAROUSEL_SLIDE_INTERVAL);

  return (
    <div className={`${className} ${styles.carousel}`}>
      <CarouselSlides
        activeSlide={activeSlide}
        className={styles.carouselSlides}
        items={items}
      />

      <Dots
        activeDot={activeSlide}
        className={styles.dots}
        count={slideCount.current}
      />
    </div>
  );
};

export default Carousel;
