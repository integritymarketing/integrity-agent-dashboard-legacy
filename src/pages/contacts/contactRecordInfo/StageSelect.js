import React, { useContext } from "react";
import * as Sentry from "@sentry/react";
import { ColorOptionRender } from "../../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import StageStatusContext from "contexts/stageStatus";

export default ({ value, original }) => {
  const { allStatuses, statusOptions } = useContext(StageStatusContext);
  const addToast = useToast();

  const handleChangeStatus = async (val) => {
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

  return (
    <React.Fragment>
      <Select
        Option={ColorOptionRender}
        initialValue={value}
        placeholder="Stage"
        options={statusOptions.filter((opt) => {
          if (original.contactRecordType === "Client") {
            return opt.value !== "New";
          }
          return opt.value !== "Renewal";
        })}
        onChange={handleChangeStatus}
        contactRecordPage={true}
      />
    </React.Fragment>
  );
};
