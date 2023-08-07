import React, { useContext, useState, useMemo, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { ColorOptionRender } from "../../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "../../../hooks/useToast";
import StageStatusContext from "contexts/stageStatus";
import analyticsService from "services/analyticsService";
import LostStageDisposition from "pages/contacts/contactRecordInfo/LostStageDisposition";
import stageSummaryContext from "contexts/stageSummary";

const StageSelect = ({ value, original, onRefresh }) => {
  const { clientsService } = useClientServiceContext();
  const [isLostReasonModalOpen, setIsLostReasonModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const { loadStageSummaryData } = useContext(stageSummaryContext);
  const { allStatuses, statusOptions, lostSubStatusesOptions } =
    useContext(StageStatusContext);

  const addToast = useToast();

  useEffect(() => {
    if (lostSubStatusesOptions) {
      let filteredValue = value
        ? lostSubStatusesOptions?.filter((opt) => opt?.label === value)
            ?.length > 0
          ? "Lost"
          : value
        : "New";
      setSelectedValue(filteredValue);
    }
  }, [lostSubStatusesOptions, value]);

  const onLostReasonModalCancel = () => {
    setIsLostReasonModalOpen(false);
    setSelectedValue(value || "New");
  };
  const handleChangeStatus = async (val, leadSubStatus) => {
    setSelectedValue(val);
    if (val === "Lost" && !leadSubStatus) {
      setIsLostReasonModalOpen(true);
      return;
    }
    setIsLostReasonModalOpen(false);
    analyticsService.fireEvent("event-sort", {
      clickedItemText: `Sort: ${val}`,
    });
    try {
      const subSelectPayload =
        leadSubStatus?.length > 0
          ? {
              leadSubStatus,
            }
          : {};
      const response = await clientsService.updateClient(original, {
        ...original,
        leadStatusId:
          leadSubStatus?.length > 0
            ? leadSubStatus[0]?.leadStatusId
            : allStatuses.find((status) => status.statusName === val)
                ?.leadStatusId,
        ...subSelectPayload,
      });
      if (response.ok) {
        await loadStageSummaryData();
        onRefresh();
        addToast({
          type: "success",
          message: "Contact successfully updated.",
          time: 3000,
        });
      } else {
        addToast({
          type: "error",
          message: "Failed to update contact.",
          time: 3000,
        });
      }
    } catch (e) {
      Sentry.captureException(e);
    }
    return false;
  };
  const filteredStatuses = useMemo(
    () =>
      statusOptions.filter((opt) => {
        if (
          original.contactRecordType &&
          original.contactRecordType.toLowerCase() === "client"
        ) {
          return opt.value !== "New";
        }
        return opt.value !== "Renewal";
      }),
    [statusOptions, original]
  );
  return (
    <React.Fragment>
      <LostStageDisposition
        open={isLostReasonModalOpen}
        onClose={onLostReasonModalCancel}
        onSubmit={handleChangeStatus}
        subStatuses={lostSubStatusesOptions}
      />

      <Select
        Option={ColorOptionRender}
        initialValue={selectedValue || "New"}
        placeholder="Stage"
        options={filteredStatuses}
        onChange={handleChangeStatus}
        contactRecordPage={true}
        showValueAlways={true}
      />
    </React.Fragment>
  );
};

export default StageSelect;
