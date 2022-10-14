import React, { forwardRef } from 'react';

import image from './image.jpg';

import styles from './styles.module.scss';

const SplitContentImageSection = forwardRef(
    ({ altImage = '', children, className = '' }, ref) => (
        <section
            className={`${className} ${styles.splitContentImageSection}`}
            ref={ref}
        >
            <div className={styles.splitContainer}>
                <img alt={altImage} className={styles.image} src={image} />

                <div className={styles.container}>{children}</div>
            </div>
        </section>
    )
);

export default SplitContentImageSection;
