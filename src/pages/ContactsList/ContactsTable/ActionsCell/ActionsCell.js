import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import * as Sentry from "@sentry/react";

import PropTypes from "prop-types";

import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";

import { ConnectModal } from "components/ContactDetailsContainer/ConnectModal";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import PlansTypeModal from "components/PlansTypeModal";
import MoreBlue from "components/icons/version-2/MoreBlue";

import { useClientServiceContext } from "services/clientServiceProvider";
import { useCountyDataContext } from "providers/CountyDataProvider";
import { useLeadDetails } from "providers/ContactDetails";

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
        label: "Contact",
        value: "connect",
    },
    {
        label: "Add Reminder",
        value: "addnewreminder",
    },
];

function ActionsCell({ row, isCard, item, refreshData }) {
    const [leadConnectModal, setLeadConnectModal] = useState(false);
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [showPlanTypeModal, setShowPlanTypeModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const showToast = useToast();
    const { clientsService } = useClientServiceContext();
    const { fetchCountiesData, setZipCode, zipCode } = useCountyDataContext();
    const { updateLeadDetailsWithZipCode } = useLeadDetails();
    const record = isCard ? item : row.original;
    const leadId = record.leadsId;
    const leadDetails = record;
    const open = Boolean(anchorEl);
    const id = open ? leadId : undefined;
    const county = leadDetails?.addresses && leadDetails?.addresses[0]?.county;

    useEffect(() => {
        setZipCode(leadDetails?.addresses?.[0]?.postalCode);
    }, [leadDetails?.addresses, setZipCode]);

    const fetchData = useCallback(async () => {
        if (zipCode && !county) {
            try {
                const countiesData = await fetchCountiesData(zipCode);
                if (countiesData?.length === 1) {
                    const payload = {
                        ...leadDetails,
                        addresses: [
                            {
                                ...leadDetails?.addresses?.[0],
                                county: countiesData[0]?.countyName,
                                countyFips: countiesData[0]?.countyFIPS,
                                stateCode: countiesData[0]?.state,
                            },
                        ],
                    };
                    await updateLeadDetailsWithZipCode(payload);
                    navigate(`/plans/${leadId}`);
                }
            } catch (error) {
                Sentry.captureException(error);
            }
        }
    }, [zipCode, county, fetchCountiesData, leadDetails, updateLeadDetailsWithZipCode, navigate, leadId]);

    const handleOptionClick = async (value) => {
        setAnchorEl(null);
        switch (value) {
            case "addnewreminder":
                fireEvent("Contact List Quick Action Selected", {
                    leadid: leadId,
                    selection: "add_reminder",
                });
                setIsAddNewModalOpen(true);
                break;
            case "contact":
                fireEvent("Contact List Quick Action Selected", {
                    leadid: leadId,
                    selection: "view_contact",
                });
                navigate(`/${value}/${leadId}`);
                break;
            case "connect":
                fireEvent("Contact List Quick Action Selected", {
                    leadid: leadId,
                    selection: "connect",
                });
                setLeadConnectModal(true);
                break;
            case "startAQuote":
                fireEvent("Contact List Quick Action Selected", {
                    leadid: leadId,
                    selection: "start_quote",
                });
                await fetchData();
                setShowPlanTypeModal(true);
                break;
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
                refreshData();
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
                isOpen={leadConnectModal}
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
                    leadData={record}
                    showLink={true}
                />
            )}
            {showPlanTypeModal && (
                <PlansTypeModal
                    zipcode={zipCode}
                    showPlanTypeModal={showPlanTypeModal}
                    handleModalClose={() => setShowPlanTypeModal(false)}
                    leadId={leadId}
                    county={county}
                />
            )}
        </>
    );
}

ActionsCell.defaultProps = {
    refreshData: () => {},
};

ActionsCell.propTypes = {
    row: PropTypes.object,
    isCard: PropTypes.bool,
    item: PropTypes.object,
    refreshData: PropTypes.func,
};

export default ActionsCell;
