import React from "react";
import { Link } from '@mui/material';
import styles from './styles.module.scss';

const Hyperlink = ({ text, callback }) => (
    <Link
    className={styles.hyperlink}
    variant="subtitle1"
    onClick={(e) => {
        callback(e);
    }}
    >
    {text}
    </Link>
);

export default Hyperlink;
