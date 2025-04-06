import PropTypes from "prop-types";
import { ListItem, ListItemText, Typography } from "@mui/material";
import styles from "./styles.module.scss";

const ContactListItem = ({ contact, handleClick }) => {
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return (
        <ListItem onClick={() => handleClick(contact, fullName)} className={styles.listItem}>
            <ListItemText
                primary={
                    <Typography color={"#434A51"} variant="subtitle1">
                        {fullName}
                    </Typography>
                }
                sx={{
                    cursor: "pointer",
                }}
            />
        </ListItem>
    );
};

ContactListItem.propTypes = {
    contact: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
    }).isRequired,
    handleClick: PropTypes.func.isRequired,
};

export default ContactListItem;
