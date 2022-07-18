import React from "react";
import styles from './styles.module.scss';

const Paragraph = ({ className = '', text }) => (
    <p className={`${styles.paragraph} ${className}`}>{text}</p>
);

export default Paragraph;
