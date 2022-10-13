import React, { forwardRef } from 'react';

import { SplitContainer } from '@integritymarketing/ui-container-components';

import styles from './styles.module.scss';

const SplitContentLeadingImageSection = forwardRef(
    ({ altImage = '', children, className = '', image }, ref) => (
        <section
            className={`${className} ${styles.splitContentLeadingImageSection}`}
            ref={ref}
        >
            <SplitContainer>
                <img alt={altImage} className={styles.image} src={image} />

                <div className={styles.container}>{children}</div>
            </SplitContainer>
        </section>
    )
);

export default SplitContentLeadingImageSection;
