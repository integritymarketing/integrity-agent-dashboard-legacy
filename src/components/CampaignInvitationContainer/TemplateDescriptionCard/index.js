import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";

function TemplateDescriptionCard({ title = "Template Description", description }) {
    return (
        <Box className={styles.templateDescriptionCard}>
            <Typography variant="h4" color="#052A63">
                {title}
            </Typography>
            <Typography variant="body1" color="#434A51">
                {description}
            </Typography>
        </Box>
    );
}

TemplateDescriptionCard.propTypes = { title: PropTypes.string.isRequired, description: PropTypes.string.isRequired };
export default TemplateDescriptionCard;
