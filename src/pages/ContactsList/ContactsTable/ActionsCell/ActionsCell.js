import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import PropTypes from "prop-types";

import { ConnectModal } from "components/ContactDetailsContainer/ConnectModal";
import MoreBlue from "components/icons/version-2/MoreBlue";

import ReminderModal from "pages/contacts/contactRecordInfo/reminder/ReminderModal";

import styles from "./styles.module.scss";

export const MORE_ACTIONS = [
    {
        label: "View Contact",
        value: "contact",
    },
    {
        label: "Start a Quote",
        value: "startAQuote",
    },
    {
        label: "Connect",
        value: "connect",
    },
    {
        label: "Add Reminder",
        value: "addnewreminder",
    },
];

export const PLAN_ACTION = {
    label: "Find a Plan",
    value: "plans",
};

function ActionsCell({ row, isCard, item }) {
    const [leadConnectModal, setLeadConnectModal] = useState(false);
    const [showAddNewModal, setShowAddNewModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const record = isCard ? item : row.original;
    const leadId = record.leadsId;
    const leadDetails = record;
    const postalCode = leadDetails?.addresses?.[0]?.postalCode;
    const stateCode = leadDetails?.addresses?.[0]?.stateCode;
    const county = leadDetails?.addresses?.[0]?.county;
    const countyFips = leadDetails?.addresses?.[0]?.countyFips;
    const hasFIPsCode = postalCode && county && stateCode && countyFips;

    const handleOptionClick = (value) => {
        setAnchorEl(null);
        switch (value) {
            case "addnewreminder":
                setShowAddNewModal(true);
                break;
            case "plans":
            case "contact":
                navigate(`/${value}/${leadId}`);
                break;
            case "connect":
                setLeadConnectModal(true);
                break;
            case "startAQuote": {
                if (hasFIPsCode) {
                    navigate(`/plans/${leadId}`);
                } else {
                    navigate(`/contact/${leadId}/addZip`);
                }
                break;
            }
            default:
                break;
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? leadId : undefined;
    const options = MORE_ACTIONS.slice(0);
    if (
        row?.original?.addresses?.[0]?.postalCode &&
        row?.original?.addresses?.[0]?.county &&
        row?.original?.addresses?.[0]?.stateCode
    ) {
        options.splice(1, 0, PLAN_ACTION);
    }

    return (
        <>
            <Box onClick={(event) => setAnchorEl(event.currentTarget)} className={styles.moreButton}>
                <MoreBlue />
            </Box>
            <Popover
                className={styles.customPopover}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box className={styles.selections}>
                    {options.map((option) => (
                        <Box
                            className={styles.selection}
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </Box>
                    ))}
                </Box>
            </Popover>
            <ConnectModal
                open={leadConnectModal}
                onClose={() => setLeadConnectModal(false)}
                leadId={leadId}
                leadDetails={leadDetails}
            />
            <ReminderModal
                reminder={null}
                getContactRecordInfo={null}
                reminderModalStatus={showAddNewModal}
                setReminderModalStatus={() => setShowAddNewModal(false)}
                leadId={leadId}
            />
        </>
    );
}

ActionsCell.propTypes = {
    row: PropTypes.object,
    isCard: PropTypes.bool,
    item: PropTypes.object,
};

export default ActionsCell;
