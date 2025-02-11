import React from 'react'
import styles from './SectionContainer.module.scss'

const SectionContainer = function ({ children }) {
    return <div className={styles.container}>{children}</div>
}

export default SectionContainer