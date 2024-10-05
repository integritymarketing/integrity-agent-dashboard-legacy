import { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import OutNetworkIcon from "components/icons/outNetwork";
import PharmacyModal from "../SharedModals/PharmacyModal";
import styles from "./styles.module.scss";

const MailOrderNotApplicable = ({ mailOrderNotApplicable, pharmaciesList, contact, refresh, leadId }) => {
    const [openAddPharmacyModal, setOpenAddPharmacyModal] = useState(false);

    if (!mailOrderNotApplicable) {
        return null;
    }

    const selectedPharmaciesLessThanThree = pharmaciesList && pharmaciesList?.length < 3;
    const addPharmacyClassName = selectedPharmaciesLessThanThree ?
        styles.addPharmacyText : styles.addPharmacyTextDisabled;

    return (
        <div className={styles.mailOrderNotApplicable}>
            <div className={styles.mailOrderNotApplicableIcon}>
                <OutNetworkIcon />
            </div>
            <Typography
                variant="body1"
                sx={{
                    fontSize: "16px",
                    textAlign: "center",
                    color: "#434A51",
                    lineHeight: "20px",
                }}
                gutterBottom={false}
            >
                Mail Order not available with this plan. Please select or{" "}
                <span className={addPharmacyClassName} onClick={() => {
                    if(selectedPharmaciesLessThanThree) {
                        setOpenAddPharmacyModal(true);
                    }
                }}>
                    add a pharmacy
                </span>
            </Typography>
            {openAddPharmacyModal && (
                <PharmacyModal
                    open={openAddPharmacyModal}
                    onClose={() => setOpenAddPharmacyModal(false)}
                    pharmaciesPreSelected={pharmaciesList}
                    userZipCode={contact?.addresses?.[0]?.postalCode}
                    refresh={refresh}
                    leadId={leadId}
                />
            )}
        </div>
    );
};

MailOrderNotApplicable.propTypes = {
    mailOrderNotApplicable: PropTypes.bool.isRequired,
    pharmaciesList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            address: PropTypes.string,
        }),
    ).isRequired,
    contact: PropTypes.shape({
        addresses: PropTypes.arrayOf(
            PropTypes.shape({
                postalCode: PropTypes.string,
            }),
        ),
    }),
    refresh: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
};

export default MailOrderNotApplicable;
