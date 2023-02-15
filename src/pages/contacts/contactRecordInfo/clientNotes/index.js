import React, { useState, Fragment } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "components/ui/Button";
import clientsService from "services/clientsService";
import "./client-notes.scss";
import useToast from "../../../../hooks/useToast";

export default function ClientNotes(props) {
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(true);
  const [value, setValue] = useState(props.personalInfo.notes || "");
  const [notesLastSaved, setnotesLastSaved] = useState(
    props.personalInfo.notes || ""
  );
  const handleOnChange = (e) => {
    if (e.target.value === notesLastSaved) {
      setValue(e.currentTarget.value);
      setIsSaving(true);
    } else {
      setValue(e.currentTarget.value);
      setIsSaving(false);
    }
  };
  const handleOnEdit = () => setIsEdit(true);
  const handleOnCancel = () => {
    setValue(notesLastSaved);
    setIsEdit(false);
    setIsSaving(() => true);
  };
  const addToast = useToast();

  return (
    <Fragment>
      <div
        className="client-notes-card"
        data-gtm="contact-record-client-notes-section"
      >
        <div className="header">
          <div className="client-notes-heading">
            <h4>Client Notes</h4>
          </div>
          {!isEdit ? (
            <div
              className="client-note-btn pull-right"
              data-gtm="contact-record-client-notes-edit-button"
            >
              <Button label="Edit" onClick={handleOnEdit} type="tertiary">
                {" "}
              </Button>
            </div>
          ) : null}
        </div>
        <hr />
        <div className="client-notes-card-body">
          {!isEdit ? (
            <div className="client-notes">
              <p>{value ? value : "Write client notes here..."}</p>
            </div>
          ) : (
            <div className="client-notes-edit">
              <textarea
                style={{ resize: "none" }}
                placeholder="Write client notes here..."
                value={value}
                onChange={handleOnChange}
                rows="5"
                cols="120"
              >
                {value}
              </textarea>
            </div>
          )}
        </div>
        {isEdit ? (
          <div className="button-group">
            <Button onClick={handleOnCancel} label="Cancel" type="secondary" />
            <Button
              disabled={isSaving || !value}
              onClick={handleOnSave}
              label="Save"
            />
          </div>
        ) : null}
      </div>
    </Fragment>
  );

  async function handleOnSave() {
    try {
      setIsSaving(() => true);
      await clientsService.updateClient(props.personalInfo, {
        primaryContact: "phone",
        ...props.personalInfo,
        notes: value,
      });
      setnotesLastSaved(value);
      await props.getLeadDetails();
      addToast({
        type: "success",
        message: "Client notes successfully Updated.",
        time: 3000,
      });
      setIsEdit(false);
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Error, update unsuccessful.",
        time: 3000,
      });
      setIsSaving(() => false);
    }
  }
}
