import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import useDeviceType from "hooks/useDeviceType";

import EditIcon from "components/icons/icon-edit";

import { Button } from "components/ui/Button";

import { formatPhoneNumber } from "utils/phones";

import styles from "./styles.module.scss";

const PharmacyItem = ({ pharmacy, onEditPharmacy }) => {
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
                icon={<EditIcon />}
                label="Edit"
                className={styles.editButton}
                onClick={() => {
                    onEditPharmacy(pharmacy);
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
    onEditPharmacy: PropTypes.func.isRequired,
};
