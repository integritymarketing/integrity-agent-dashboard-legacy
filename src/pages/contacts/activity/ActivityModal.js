import React from "react";
import { Formik } from "formik";
import Modal from "components/ui/modal";
import Textfield from "components/ui/textfield";
import SuccessIcon from "components/icons/success-note";
import analyticsService from "services/analyticsService";

export default ({
  activityModalStatus,
  setActivityModalStatus,
  ...props
}) => {
  return (
    <div className="customform">
      <Modal
        open={activityModalStatus}
        onClose={setActivityModalStatus}
        labeledById="dialog_contact_label"
      >
        {true && (
          <Formik
            initialValues={{
              firstName: "",
              notes: "",
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
            }) => (
              <form
                action=""
                className="form"
                onSubmit={handleSubmit}
                noValidate
              >
                <legend
                  className="custom-modal-heading hdg hdg--2 mb-1"
                  id="dialog_contact_label"
                >
                  <span className="bgcolor-4">
                    <SuccessIcon />
                  </span>
                  <label> New Note</label>
                </legend>
                <fieldset className="form__field">
                  <Textfield
                    id="cm-ed-fname"
                    placeholder="Activity Title"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("contactCard", {
                        field: "firstName",
                      });
                      return handleBlur(e);
                    }}
                    error={
                      (touched.firstName && errors.firstName) || errors.Global
                    }
                  />
                  <Textfield
                    id="cm-ed-notes"
                    multiline={true}
                    placeholder="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("contactCard", {
                        field: "notes",
                      });
                      return handleBlur(e);
                    }}
                    error={(touched.notes && errors.notes) || errors.Global}
                  />
                  <div className="form__submit custom-form-btn">
                    <button className="cancel-btn btn" type="submit">
                      Cancel
                    </button>
                    <button className="submit-btn btn" type="submit">
                      Submit
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
};
