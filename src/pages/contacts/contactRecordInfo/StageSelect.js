import React, { useContext, useState } from "react";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import { ColorOptionRender } from "../../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import StageStatusContext from "contexts/stageStatus";
import analyticsService from "services/analyticsService";
import LostStageDisposition from "pages/contacts/contactRecordInfo/LostStageDisposition";
import stageSummaryContext from "contexts/stageSummary";

export default ({ value, original }) => {
  const [selectedValue, setSelectedValue] = useState(value || "New");
  const { allStatuses, statusOptions } = useContext(StageStatusContext);
  const { loadStageSummaryData } = useContext(stageSummaryContext);
  const addToast = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [isLostReasonModalOpen, setIsLostReasonModalOpen] = useState(false);
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
      // TODO: Do sub select formatting properly. Vishal format properly before you submit
      const subSelectPayload =
        leadSubStatus?.length > 0
          ? {
              leadSubStatus,
            }
          : {};
      const response = await clientsService.updateClient(original, {
        ...original,
        leadStatusId: allStatuses.find((status) => status.statusName === val)
          ?.leadStatusId,
        ...subSelectPayload,
      });
      if (response.ok) {
        await loadStageSummaryData();
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

  const filteredStatuses = statusOptions.filter((opt) => {
    if (
      original.contactRecordType &&
      original.contactRecordType.toLowerCase() === "client"
    ) {
      return opt.value !== "New";
    }
    return opt.value !== "Renewal";
  });
  return (
    <React.Fragment>
      <LostStageDisposition
        open={isLostReasonModalOpen}
        onClose={onLostReasonModalCancel}
        onSubmit={handleChangeStatus}
      />
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      {isMobile ? (
        <select
          placeholder="Stage"
          onChange={(e) => handleChangeStatus(e.target.value)}
        >
          {filteredStatuses.map((sts) => (
            <option value={sts.value} selected={selectedValue === sts.value}>
              {sts.label}
            </option>
          ))}
        </select>
      ) : (
        <Select
          Option={ColorOptionRender}
          initialValue={selectedValue || "New"}
          placeholder="Stage"
          options={filteredStatuses}
          onChange={handleChangeStatus}
          contactRecordPage={true}
        />
      )}
    </React.Fragment>
  );
};
