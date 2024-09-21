import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Chip, Button } from "@mui/material";
import styles from "./updateView.module.scss";
import DeleteIcon from "components/icons/version-2/Delete";
import { formatPhoneNumber } from "utils/phones";
import { formatAddress } from "utils/addressFormatter";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";
import { CURRENT_PHARMACIES, DELETE, DIGITAL_PHARMACY, SET_AS_PRIMARY } from "./updateView.constants";

function UpdateView({ pharmaciesData, pharmacyCosts, onDelete, handleSetAsPrimary }) {
    if (!pharmaciesData || !pharmaciesData.length) {
        return null;
    }

    const pharmacyCostMap = useMemo(
        () => new Map(pharmacyCosts?.map((cost) => [cost.pharmacyID, cost.isNetwork])),
        [pharmacyCosts],
    );
    const handleDelete = useCallback((pharmacy) => onDelete(pharmacy), [onDelete]);
    const handleSetPrimary = useCallback((pharmacyId) => handleSetAsPrimary(pharmacyId), [handleSetAsPrimary]);

    // Sort pharmaciesData to ensure primary pharmacy is on top
    const sortedPharmaciesData = useMemo(() => {
        return [...pharmaciesData].sort((a, b) => b.isPrimary - a.isPrimary);
    }, [pharmaciesData]);

    return (
        <>
            <div className={styles.heading}>{CURRENT_PHARMACIES}</div>
            {sortedPharmaciesData.map((pharmacy) => {
                const {
                    name = "",
                    pharmacyPhone = "",
                    pharmacyId,
                    address1,
                    address2,
                    city,
                    state,
                    zip,
                    isDigital,
                    isPrimary,
                } = pharmacy;

                const address = formatAddress({ address1, address2, city, stateCode: state, postalCode: zip });
                const isCovered = pharmacyCostMap.get(pharmacyId) || false;

                return (
                    <div key={pharmacyId} className={styles.container}>
                        <div className={styles.content}>
                            <div className={styles.title}>
                                <div className={styles.name}>{name}</div>
                            </div>
                            <div className={styles.pharmacyDeleteAction}>
                                <div className={styles.phoneNo}>{formatPhoneNumber(pharmacyPhone)}</div>
                                <Button
                                    variant="text"
                                    className={styles.ctaStyle}
                                    onClick={() => handleDelete(pharmacy)}
                                    endIcon={<DeleteIcon />}
                                >
                                    <div className={styles.delete}>{DELETE}</div>
                                </Button>
                            </div>
                            <div className={styles.digitalContainer}>
                                {isCovered ? <InNetworkIcon /> : <OutNetworkIcon />}
                                <div className={styles.alignColumn}>
                                    {isDigital ? (
                                        <div>{DIGITAL_PHARMACY}</div>
                                    ) : (
                                        <div className={styles.address}>{address}</div>
                                    )}
                                    {isPrimary ? (
                                        <Chip
                                            className={styles.primaryTag}
                                            color="primary"
                                            variant="filled"
                                            label="Primary"
                                        />
                                    ) : (
                                        <Button
                                            variant="text"
                                            className={styles.ctaStyle}
                                            onClick={() => handleSetPrimary(pharmacyId)}
                                        >
                                            {SET_AS_PRIMARY}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

UpdateView.propTypes = {
    pharmaciesData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            pharmacyPhone: PropTypes.string,
            pharmacyId: PropTypes.string.isRequired,
            address1: PropTypes.string,
            address2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            zip: PropTypes.string,
            isDigital: PropTypes.bool,
            isPrimary: PropTypes.bool,
        }),
    ).isRequired,
    pharmacyCosts: PropTypes.arrayOf(
        PropTypes.shape({
            pharmacyID: PropTypes.string.isRequired,
            isNetwork: PropTypes.bool.isRequired,
        }),
    ),
    onDelete: PropTypes.func.isRequired,
    handleSetAsPrimary: PropTypes.func.isRequired,
};

export default UpdateView;
