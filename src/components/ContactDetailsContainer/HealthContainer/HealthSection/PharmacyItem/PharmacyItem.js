import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import useDeviceType from "hooks/useDeviceType";

import DeleteIcon from "components/icons/version-2/Delete";

import { Button } from "components/ui/Button";

import { formatPhoneNumber } from "utils/phones";

import styles from "./styles.module.scss";

const PharmacyItem = ({ pharmacy, onDeletePharmacy }) => {
    const { isMobile } = useDeviceType();
    const address = `${pharmacy.address1} ${pharmacy.address2 ?? ""}, ${pharmacy.city},
    ${pharmacy.state}, ${pharmacy.zip}`;

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.info}>
                <Box className={styles.name}>{pharmacy.name}</Box>
                <Box className={styles.phone}>{formatPhoneNumber(pharmacy.pharmacyPhone)}</Box>
            </Box>
            {!isMobile && <Box className={styles.address}>{address}</Box>}
            <Button
                icon={<DeleteIcon />}
                label="Delete"
                className={styles.editButton}
                onClick={() => {
                    onDeletePharmacy(pharmacy);
                }}
                type="tertiary"
                iconPosition="right"
            />
            {isMobile && <Box className={styles.address}>{address}</Box>}
        </Box>
    );
};

export default PharmacyItem;

PharmacyItem.propTypes = {
    pharmacy: PropTypes.object.isRequired,
    onDeletePharmacy: PropTypes.func.isRequired,
};
