import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import styles from "./InfoModal.module.scss";

const ProductsInfo = () => (
    <Box>
        <div className={styles.content}>
            <p>
                Product tags include details on active and historical policies and plans that are linked to a contact.
            </p>
            <ul className={styles.list}>
                <li>
                    <strong>Status - </strong>
                    Product Status includes information provided to Integrity on the progress of an application or
                    compliance activities taken that are linked to a contact.
                </li>
                <li>
                    <strong>Type - </strong>
                    Product Type is the specific category of product, policy, or plan linked to a contact, such as
                    Medicare Advantage, Final Expense, or Prescription Drug Plan (PDP).
                </li>
                <li>
                    <strong>Carrier - </strong>
                    Product Carrier is the name of the carrier providing the product, policy, or plan linked to a
                    contact.
                </li>
            </ul>
        </div>
    </Box>
);

const CampaignsInfo = () => (
    <Box>
        <div className={styles.content}>
            <p>
                Campaign tags include all information provided as part of lead generation, marketing, and advertising.
            </p>
            <ul className={styles.list}>
                <li>
                    <strong>Source</strong>
                </li>
                <li>
                    <strong>Type</strong>
                </li>
                <li>
                    <strong>Title</strong>
                </li>
            </ul>
        </div>
    </Box>
);

const RecommendationsInfo = () => (
    <Box>
        <div className={styles.content}>
            <p>
                Recommendation tags are provided through analytics and AI to help provide information to target the
                right contacts.
            </p>
            <ul className={styles.list}>
                <li>
                    <strong>Cross-sell</strong>
                </li>
                <li>
                    <strong>SEP</strong>
                </li>
                <li>
                    <strong>Switcher</strong>
                </li>
            </ul>
        </div>
    </Box>
);

const CustomInfo = () => (
    <Box>
        <div className={styles.content}>
            Other tags are available as custom context you can add to any contact in your list.
        </div>
    </Box>
);

export const InfoModal = ({ open, onClose, isMobile, label }) => {
    const title =
        label === "Other"
            ? "Custom Tags"
            : label === "Ask Integrity Recommendations"
                ? "Ask Integrity Suggests"
                : `${label?.replace(/s$/, "")} Tags`;

    return (
        <Modal maxWidth={isMobile ? "xs" : "sm"} open={open} onClose={onClose} hideFooter title={title}>
            <Box className={styles.connectModalBody}>
                <Box className={styles.contentContainer}>
                    {label === "Products" && <ProductsInfo />}
                    {label === "Campaigns" && <CampaignsInfo />}
                    {label === "Ask Integrity Recommendations" && <RecommendationsInfo />}
                    {label === "Other" && <CustomInfo />}
                </Box>
            </Box>
        </Modal>
    );
};

InfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
};

export default InfoModal;