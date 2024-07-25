import PropTypes from "prop-types";
import { ListItem, ListItemText, Typography } from "@mui/material";

const ContactListItem = ({ contact, handleClick }) => {
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return (
        <ListItem onClick={() => handleClick(contact)}>
            <ListItemText
                primary={
                    <Typography color={"#0052ce"} variant="subtitle1">
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
