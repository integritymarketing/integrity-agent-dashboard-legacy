import React from "react";
import { useInView } from "react-intersection-observer";

import { Heading, Text } from "@integritymarketing/ui-text-components";

import Icon from "components/Icon";

import styles from "./styles.module.scss";

const ListItem = ({ icon, images, text, title }) => {
  const { ref: listItemRef, inView: listItemInView } = useInView({
    threshold: 0,
  });

  const handleImageClick = (link) => window.open(link, "_blank");

  return (
    <div
      className={`${listItemInView ? styles.animate : ""} ${styles.listItem}`}
      ref={listItemRef}
    >
      {icon || <Icon className={styles.icon} />}

      <Heading className={styles.heading} text={title} />

      <Text className={styles.text} text={text} />

      {images && (
        <div className={styles.imagesContainer}>
          {images.map(({ altText, image, link }) => (
            <img
              key={altText}
              className={styles.image}
              alt={altText}
              src={image}
              onClick={() => handleImageClick(link)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListItem;
