import { Box } from "@mui/material";
import { UpArrow } from "components/icons/QuickQuote";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const QuoteModalCard = ({ children, action }) => {
    return (
        <>
            {action && (
                <Box className={styles.upArrow} onClick={action}>
                    <UpArrow />
                </Box>
            )}

            <Box>{children}</Box>
        </>
    );
};

QuoteModalCard.propTypes = {
    children: PropTypes.node.isRequired,
    action: PropTypes.func,
};

export default QuoteModalCard;
