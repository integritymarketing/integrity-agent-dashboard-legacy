import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import DeleteIcon from "components/icons/version-2/Delete";
import { Button } from "components/ui/Button";
import { formatPhoneNumber } from "utils/phones";
import styles from "./styles.module.scss";
import { Chip } from "@mui/material";
import { useWindowSize } from "hooks/useWindowSize";
import { formatAddress } from "utils/addressFormatter";

const PharmacyItem = ({ pharmacy, handleSetAsPrimary, onDeletePharmacy }) => {
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;
    const { address1, address2, city, state, zip } = pharmacy;
    const isPrimary = pharmacy.isPrimary;
    const formattedAddress = formatAddress({
        address1,
        address2,
        city,
        stateCode: state,
        postalCode: zip,
        defaultValue: "Digital Pharmacy",
    });

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.info}>
                <Box className={styles.name}>{pharmacy.name}</Box>
                <Box className={styles.phoneBox}>
                    <Box className={styles.phone}>{formatPhoneNumber(pharmacy.pharmacyPhone)}</Box>
                    {isMobile && (
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
                    )}
                </Box>
            </Box>
            {!isMobile && (
                <Box className={styles.address}>
                    {formattedAddress}
                    {isPrimary ? (
                        <Chip className={styles.primaryTag} color="primary" variant="filled" label="Primary" />
                    ) : (
                        <Button
                            label="Set as Primary"
                            className={styles.setAsPrimaryButton}
                            onClick={() => {
                                handleSetAsPrimary(pharmacy.pharmacyId);
                            }}
                            type="tertiary"
                        />
                    )}
                </Box>
            )}

            {!isMobile && (
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
            )}
            {isMobile && (
                <Box className={`${styles.address} ${styles.addressMobile}`}>
                    {formattedAddress}
                    {isPrimary ? (
                        <Chip className={styles.primaryTag} color="primary" variant="filled" label="Primary" />
                    ) : (
                        <Button
                            label="Set as Primary"
                            className={styles.setAsPrimaryButton}
                            onClick={() => {
                                handleSetAsPrimary(pharmacy.pharmacyId);
                            }}
                            type="tertiary"
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default PharmacyItem;

PharmacyItem.propTypes = {
    pharmacy: PropTypes.shape({
        pharmacyId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        pharmacyPhone: PropTypes.string.isRequired,
        isDigital: PropTypes.bool.isRequired,
        isPrimary: PropTypes.bool.isRequired,
        address1: PropTypes.string,
        address2: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
    }).isRequired,
    handleSetAsPrimary: PropTypes.func.isRequired,
    onDeletePharmacy: PropTypes.func.isRequired,
};
