import React, { useState } from 'react'
import styles from './Accordion.module.scss'
import { Chevron, Delete, Info } from '../../Icons'
import Label from '../Label'

const Accordion = function ({ label, items }) {
    const [open, setOpen] = useState(true)

    return <div className={styles.container}>
        <div className={styles.labelContainer} >
            <div className={`${styles.chevronIcon} ${open ? '' : styles.rotateIcon}`} onClick={() => setOpen(value => !value)} >
                <Chevron />
            </div>
            <Label value={label} size="16px" />
            <Info />
        </div>
        {open && <div className={styles.itemsContainer}>
            {items.map(item => <div className={styles.itemContainer} key={item.label}>
                <Delete />
                <Label value={item.label} size="16px" color="#434A51" />
            </div>)}
        </div>
        }
    </div>
}

export default Accordion