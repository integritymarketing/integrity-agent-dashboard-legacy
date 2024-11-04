import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Checkbox } from "components/ui/version-2/Checkbox";
import { ActionsCell } from "pages/ContactsList/ContactsTable/ActionsCell";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import styles from "./styles.module.scss";
import useAnalytics from "hooks/useAnalytics";
import useAgentInformationByID from "hooks/useAgentInformationByID";

function CardHeader({ item }) {
    const { selectedContacts, setSelectedContacts, layout } = useContactsListContext();
    const { agentInformation } = useAgentInformationByID();
    const { agentID, agentNPN } = agentInformation || {};
    const { fireEvent } = useAnalytics();

    const getName = (_item) => {
        const name = [_item.firstName || "", _item.middleName || "", _item.lastName || ""].join(" ").trim();
        return name || "--";
    };

    const onChangeHandle = (e) => {
        const value = e.target.value;
        const newSelectedContacts = selectedContacts.includes(value)
            ? selectedContacts.filter((id) => id !== value)
            : [...selectedContacts, value];

        setSelectedContacts(newSelectedContacts);
    };

    const onCardTitleClick = () => {
        const eventData = { leadId: item.leadsId, agentID: agentID, agentNPN: agentNPN };
        fireEvent("Contact Map Card Details Viewed", eventData);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" className={styles.header}>
            <Box display="flex" alignItems="center">
                <Checkbox
                    checked={selectedContacts.includes(String(item.leadsId))}
                    onChange={onChangeHandle}
                    value={item.leadsId}
                />
                <Box>
                    <Link
                        to={`/contact/${item.leadsId}`}
                        className={styles.customLink}
                        onClick={layout == "map" ? onCardTitleClick : null}
                    >
                        {getName(item)}
                    </Link>
                </Box>
            </Box>
            <Box>
                <ActionsCell isCard={true} item={item} />
            </Box>
        </Box>
    );
}

CardHeader.propTypes = {
    item: PropTypes.object,
};

export default CardHeader;