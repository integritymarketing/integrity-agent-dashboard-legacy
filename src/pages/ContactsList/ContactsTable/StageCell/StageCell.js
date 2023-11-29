import * as Sentry from "@sentry/react";
import { useContext, useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useToast from "hooks/useToast";

import { StageStatusContext } from "contexts/stageStatus";
import stageSummaryContext from "contexts/stageSummary";

import analyticsService from "services/analyticsService";
import clientsService from "services/clientsService";

import LostStageDispositionModal from "pages/ContactsList/ContactListModal/LostStageDispositionModal";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import { StageSelect } from "./StageSelect";

const StageCell = ({ initialValue, originalData }) => {
    const [isLostReasonModalVisible, setLostReasonModalVisibility] = useState(false);
    const [selectedStage, setSelectedStage] = useState(initialValue);
    const { loadStageSummary } = useContext(stageSummaryContext);
    const { allStatuses, statusOptions, lostSubStatusesOptions } = useContext(StageStatusContext);
    const { refreshData, layout } = useContactsListContext();
    const showToast = useToast();

    const handleLostReasonModalCancel = () => {
        setLostReasonModalVisibility(false);
        setSelectedStage(initialValue || "New");
    };

    const handleStageChange = async (selectedValue, leadSubStatus) => {
        setSelectedStage(selectedValue);
        if (selectedValue === "Lost" && !leadSubStatus) {
            setLostReasonModalVisibility(true);
            return;
        }

        setLostReasonModalVisibility(false);
        analyticsService.fireEvent("event-sort", { clickedItemText: `Sort: ${selectedValue}` });

        try {
            const subSelectData = leadSubStatus?.length ? { leadSubStatus } : {};
            const updatedClientData = {
                ...originalData,
                leadStatusId: leadSubStatus?.length
                    ? leadSubStatus[0]?.leadStatusId
                    : allStatuses.find((status) => status.statusName === selectedValue)?.leadStatusId,
                ...subSelectData,
            };

            const response = await clientsService.updateClient(originalData, updatedClientData);
            if (response?.ok) {
                await loadStageSummary();
                refreshData();
                showToast({ type: "success", message: "Contact successfully updated.", time: 3000 });
            } else {
                showToast({ type: "error", message: "Failed to update contact.", time: 3000 });
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    const filteredStatusOptions = useMemo(
        () =>
            statusOptions.filter((opt) => {
                const isClient = originalData?.contactRecordType?.toLowerCase() === "client";
                return isClient ? opt.value !== "New" : opt.value !== "Renewal";
            }),
        [statusOptions, originalData]
    );

    useEffect(() => {
        if (lostSubStatusesOptions.some((opt) => opt?.label === initialValue)) {
            setSelectedStage("Lost");
        }
    }, [lostSubStatusesOptions, initialValue]);

    return (
        <Box>
            <LostStageDispositionModal
                open={isLostReasonModalVisible}
                onClose={handleLostReasonModalCancel}
                onSubmit={handleStageChange}
                subStatuses={lostSubStatusesOptions}
            />
            <StageSelect
                options={filteredStatusOptions}
                initialValue={selectedStage || "New"}
                onChange={handleStageChange}
                customWidth={layout === "list" && 160}
            />
        </Box>
    );
};

StageCell.propTypes = {
    initialValue: PropTypes.string,
    originalData: PropTypes.object.isRequired,
    customWidth: PropTypes.number,
};

export default StageCell;
