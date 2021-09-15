import React, { useContext, useState } from "react";
import * as Sentry from "@sentry/react";
import { ColorOptionRender } from "../../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import StageStatusContext from "contexts/stageStatus";
import analyticsService from "services/analyticsService";
import Media from "react-media";

export default ({ value, original }) => {
  const { allStatuses, statusOptions } = useContext(StageStatusContext);
  const addToast = useToast();
  const [isMobile, setIsMobile] = useState(false);

  const handleChangeStatus = async (val) => {
    analyticsService.fireEvent("event-sort", {
      clickedItemText: `Sort: ${val}`,
    });
    try {
      const response = await clientsService.updateClient(original, {
        ...original,
        leadStatusId: allStatuses.find((status) => status.statusName === val)
          ?.leadStatusId,
      });
      if (response.ok) {
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
            <option value={sts.value} selected={value === sts.value}>
              {sts.label}
            </option>
          ))}
        </select>
      ) : (
        <Select
          Option={ColorOptionRender}
          initialValue={value || "New"}
          placeholder="Stage"
          options={filteredStatuses}
          onChange={handleChangeStatus}
          contactRecordPage={true}
        />
      )}
    </React.Fragment>
  );
};
