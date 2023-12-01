import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_OPTS, SELECT_PRODUCT_TEXT } from '../ScopeOfAppointmentContainer.constants';
import styles from './ProductSelection.module.scss';
import { Checked, Unchecked } from '../Icons';

export const ProductSelection = ({ listOfProducts = [] }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleProductSelection = useCallback((value) => {
        setSelectedProducts(currentProducts =>
            currentProducts.includes(value)
                ? currentProducts.filter(product => product !== value)
                : [...currentProducts, value]
        );
    }, []);

    const renderListOfProducts = () => (
        <>
            <div>{SELECT_PRODUCT_TEXT}</div>
            {listOfProducts.map((product, index) => (
                <div key={index} className={`${styles.productOpts} ${styles.products}`}>
                    <div className={styles.label}>{product}</div>
                </div>
            ))}
        </>
    );

    const renderProductOptions = () => (
        <>
            <div className={styles.label}>{SELECT_PRODUCT_TEXT}</div>
            {PRODUCT_OPTS.map((product, index) => (
                <div key={index} className={styles.productOpts} onClick={() => toggleProductSelection(product.value)}>
                    <span className={styles.checkboxStyle}>
                        {selectedProducts.includes(product.value) ? <Checked /> : <Unchecked />}
                    </span>
                    <span>{product.label}</span>
                </div>
            ))}
        </>
    );

    return (
        <div className={styles.selectPdtContainer}>
            {listOfProducts.length > 0 ? renderListOfProducts() : renderProductOptions()}
        </div>
    );
};

ProductSelection.propTypes = {
    listOfProducts: PropTypes.arrayOf(PropTypes.string)
};
