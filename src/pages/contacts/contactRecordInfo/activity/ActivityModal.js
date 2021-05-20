import React, { useState, useEffect } from "react";
import Modal from "components/ui/modal";
import SuccessIcon from "components/icons/success-note";
import useToast from "../../../../hooks/useToast";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";

export default ({
  activityModalStatus,
  setActivityModalStatus,
  leadId,
  getContactRecordInfo,
  isEdit,
  activityData,
  ...props
}) => {
  const [state, setState] = useState({
    activityBody: "",
    activitySubject: "",
  });
  const { activityBody, activitySubject } = state;
  const addToast = useToast();

  const handlChange = ({ target: { name, value } }) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (isEdit) {
      setState((prevState) => ({ ...prevState, ...activityData }));
    }
  }, [isEdit, activityData]);

  const saveActivity = async (e) => {
    e.preventDefault();
    const payload = {
      activityBody,
      activitySubject,
      leadsId: leadId,
      activityTypeId: 0,
    };
    clientsService
      .createActivity(payload)
      .then((data) => {
        addToast({
          type: "success",
          message: "Activity successfully added.",
          time: 3000,
        });
        setState({ activityBody: "", activitySubject: "" });
        setActivityModalStatus();
        getContactRecordInfo();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    const payload = {
      activityBody,
      activitySubject,
      activityId: activityData.activityId,
    };
    clientsService
      .updateActivity(payload, leadId)
      .then((data) => {
        addToast({
          type: "success",
          message: "Activity successfully updated.",
          time: 3000,
        });
        setState({ activityBody: "", activitySubject: "" });
        setActivityModalStatus();
        getContactRecordInfo();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };
  return (
    <div className="customform">
      <Modal
        open={activityModalStatus}
        onClose={setActivityModalStatus}
        labeledById="dialog_contact_label"
      >
        <form action="" className="form" noValidate>
          <legend
            className="custom-modal-heading hdg hdg--2 mb-1"
            id="dialog_contact_label"
          >
            <span className="bgcolor-4">
              <SuccessIcon />
            </span>
            <label> New Note</label>
          </legend>
          <div className="newnotepopupformfield form__field">
            <input
              className="acm-ed-fname"
              type="text"
              value={activitySubject}
              onChange={handlChange}
              name="activitySubject"
              placeholder="Activity Title"
            />
          </div>
          <div className="newnotepopupformfield form__field">
            <textarea
              className="acm-ed-fname"
              type="text"
              value={activityBody}
              onChange={handlChange}
              name="activityBody"
              placeholder="Notes"
            ></textarea>
          </div>
          <div className="newnotepopupformfieldbtn form__submit custom-form-btn">
            <button
              className="cancel-btn btn"
              onClick={(e) => {
                e.preventDefault();
                setState({
                  activityBody: "",
                  activitySubject: "",
                  activityTypeId: 0,
                });
                setActivityModalStatus();
              }}
            >
              Cancel
            </button>
            <button
              className="submit-btn btn"
              onClick={isEdit ? updateActivity : saveActivity}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
