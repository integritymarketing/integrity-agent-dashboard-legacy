import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import LostStageDisposition from "pages/contacts/contactRecordInfo/LostStageDisposition";
import StageStatusContext from "contexts/stageStatus";
import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";
import stageSummaryContext from "contexts/stageSummary";
import useToast from "hooks/useToast";
import { ColorOptionRender } from "utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";

const StageSelect = ({ initialValue, originalData, refreshData }) => {
    const [isLostReasonModalVisible, setLostReasonModalVisibility] = useState(false);
    const [selectedStage, setSelectedStage] = useState("");
    const { loadStageSummary } = useContext(stageSummaryContext);
    const { allStatuses, statusOptions, lostSubStatusesOptions } = useContext(StageStatusContext);
    const showToast = useToast();
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        const defaultStage = lostSubStatusesOptions?.some((opt) => opt?.label === initialValue)
            ? "Lost"
            : initialValue || "New";
        setSelectedStage(defaultStage);
    }, [lostSubStatusesOptions, initialValue]);

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
        analyticsService.fireEvent("event-sort", {
            clickedItemText: `Sort: ${selectedValue}`,
        });

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
                showToast({
                    type: "success",
                    message: "Contact successfully updated.",
                    time: 3000,
                });
            } else {
                showToast({
                    type: "error",
                    message: "Failed to update contact.",
                    time: 3000,
                });
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

    return (
        <>
            <LostStageDisposition
                open={isLostReasonModalVisible}
                onClose={handleLostReasonModalCancel}
                onSubmit={handleStageChange}
                subStatuses={lostSubStatusesOptions}
            />
            <Select
                Option={ColorOptionRender}
                initialValue={selectedStage || "New"}
                placeholder="Stage"
                options={filteredStatusOptions}
                onChange={handleStageChange}
                contactRecordPage={true}
                showValueAlways={true}
            />
        </>
    );
};

StageSelect.propTypes = {
    initialValue: PropTypes.string,
    originalData: PropTypes.object.isRequired,
    refreshData: PropTypes.func.isRequired,
};

export default StageSelect;
