import React, { forwardRef } from 'react';

import { SplitContainer } from '@integritymarketing/ui-container-components';

import image from './image.jpg';

import styles from './styles.module.scss';

const SplitContentImageSection = forwardRef(
    ({ altImage = '', children, className = '' }, ref) => (
        <section
            className={`${className} ${styles.splitContentImageSection}`}
            ref={ref}
        >
            <SplitContainer>
                <img alt={altImage} className={styles.image} src={image} />

                <div className={styles.container}>{children}</div>
            </SplitContainer>
        </section>
    )
);

export default SplitContentImageSection;
