import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import useDeviceType from "hooks/useDeviceType";

import DeleteIcon from "components/icons/version-2/Delete";

import { Button } from "components/ui/Button";

import { formatPhoneNumber } from "utils/phones";

import styles from "./styles.module.scss";
import { Chip } from "@mui/material";
import { useWindowSize } from "hooks/useWindowSize";

const PharmacyItem = ({ pharmacy, handleSetAsPrimary, onDeletePharmacy }) => {
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;
    let address = `${pharmacy.address1} ${pharmacy.address2 ?? ""}, ${pharmacy.city},
    ${pharmacy.state}, ${pharmacy.zip}`;
    address = address ? address : pharmacy.isDigital ? "Digital Pharmacy" : "";
    const isPrimary = pharmacy.isPrimary;

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
                    {address}
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
                    {address}
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
    pharmacy: PropTypes.object.isRequired,
    onDeletePharmacy: PropTypes.func.isRequired,
};
