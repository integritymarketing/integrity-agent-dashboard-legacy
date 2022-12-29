import React from "react";
import ListItem from "components/ListItem";
import TransitionUp from "components/TransitionUp";

import styles from "./styles.module.scss";

const ListContainer = ({ className = "", items = [] }) => (
  <div className={`${className} ${styles.listContainer}`}>
    {items.map(({ icon, text, title, images }) => (
      <TransitionUp key={title}>
        <ListItem icon={icon} images={images} text={text} title={title} />
      </TransitionUp>
    ))}
  </div>
);

export default ListContainer;
