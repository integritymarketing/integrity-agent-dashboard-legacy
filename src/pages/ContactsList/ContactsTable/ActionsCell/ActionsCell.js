import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import PropTypes from "prop-types";

import useToast from "hooks/useToast";

import { ConnectModal } from "components/ContactDetailsContainer/ConnectModal";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import { SellingPreferenceModal } from "components/SellingPreferenceModal";
import MoreBlue from "components/icons/version-2/MoreBlue";

import clientsService from "services/clientsService";

import styles from "./styles.module.scss";

export const ACTIONS = [
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

const HEALTH = "hideHealthQuote";

// eslint-disable-next-line max-lines-per-function
function ActionsCell({ row, isCard, item }) {
    const [leadConnectModal, setLeadConnectModal] = useState(false);
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [showSellingPreferenceModal, setShowSellingPreferenceModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const showToast = useToast();

    const record = isCard ? item : row.original;
    const leadId = record.leadsId;
    const leadDetails = record;
    const postalCode = leadDetails?.addresses?.[0]?.postalCode;
    const stateCode = leadDetails?.addresses?.[0]?.stateCode;
    const county = leadDetails?.addresses?.[0]?.county;
    const countyFips = leadDetails?.addresses?.[0]?.countyFips;
    const hasFIPsCode = postalCode && county && stateCode && countyFips;
    const open = Boolean(anchorEl);
    const id = open ? leadId : undefined;

    const onStartQuoteHandle = (type) => {
        const navigateToPath = (path) => navigate(path);
        if (type === HEALTH) {
            const path = hasFIPsCode ? `/plans/${leadId}` : `/contact/${leadId}/addZip`;
            navigateToPath(path);
        } else {
            const path = `/finalexpenses/create/${leadId}`;
            navigateToPath(path);
        }
        setShowSellingPreferenceModal(false);
    };

    const handleOptionClick = (value) => {
        setAnchorEl(null);
        switch (value) {
            case "addnewreminder":
                setIsAddNewModalOpen(true);
                break;
            case "contact":
                navigate(`/${value}/${leadId}`);
                break;
            case "connect":
                setLeadConnectModal(true);
                break;
            case "startAQuote": {
                setShowSellingPreferenceModal(true);
                break;
            }
            default:
                break;
        }
    };

    const saveReminder = (payload) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
        };
        clientsService
            .createReminder(addPayload)
            .then(() => {
                showToast({
                    type: "success",
                    message: "Reminder successfully added.",
                    time: 3000,
                });
            })
            .catch(() => {
                showToast({
                    type: "error",
                    message: `Failed to Add reminders`,
                });
            });
        setIsAddNewModalOpen(false);
    };

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
                sx={{
                    ".MuiPaper-root": { borderRadius: "8px" },
                }}
            >
                <Box className={styles.selections}>
                    {ACTIONS.map((option) => (
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
            {isAddNewModalOpen && (
                <AddReminderModal
                    open={isAddNewModalOpen}
                    onClose={() => setIsAddNewModalOpen(false)}
                    onSave={saveReminder}
                    leadId={leadId}
                    selectedReminder={null}
                />
            )}
            {showSellingPreferenceModal && (
                <SellingPreferenceModal
                    isOpen={showSellingPreferenceModal}
                    onStartQuoteHandle={onStartQuoteHandle}
                    onClose={() => setShowSellingPreferenceModal(false)}
                />
            )}
        </>
    );
}

ActionsCell.propTypes = {
    row: PropTypes.object,
    isCard: PropTypes.bool,
    item: PropTypes.object,
};

export default ActionsCell;
