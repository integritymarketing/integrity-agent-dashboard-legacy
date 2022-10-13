import React, { forwardRef } from 'react';
import { useParallax } from 'react-scroll-parallax';

import Laptop from 'components/Laptop';
import Mobile from 'components/Mobile';

import styles from './styles.module.scss';

const Devices = forwardRef(({ className = '' }, ref) => {
    const parallax = useParallax({
        speed: -5
    });

    return (
        <div className={`${className} ${styles.devices}`} ref={ref}>
            <Laptop />

            <Mobile className={styles.mobile} ref={parallax.ref} />
        </div>
    );
});

export default Devices;
