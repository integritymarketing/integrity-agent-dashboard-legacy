import React, { useEffect, useState } from "react";

import CarouselSlide from "components/CarouselSlide";

import styles from "./styles.module.scss";

const CarouselSlides = ({ activeSlide = 0, className = "", items = [] }) => {
  const [slideAmount, setSlideAmount] = useState(0);

  useEffect(() => {
    setSlideAmount(activeSlide * -100);
  }, [activeSlide]);

  return (
    <div className={`${className} ${styles.carouselSlides}`}>
      {items.map((item, index) => {
        const isFirstSlide = index === 0;

        const inlineStyles = isFirstSlide
          ? { marginLeft: `${slideAmount}%` }
          : {};

        return (
          <CarouselSlide key={index} style={inlineStyles}>
            {item}
          </CarouselSlide>
        );
      })}
    </div>
  );
};

export default CarouselSlides;
