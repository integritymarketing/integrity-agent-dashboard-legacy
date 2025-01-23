import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui/Button';
import { Select } from 'components/ui/Select';
import Modal from 'components/ui/modal';
import './lostStageDisposition.scss';

const LostStageDisposition = ({
  subStatuses = [],
  open,
  onClose,
  onSubmit,
}) => {
  const [selectedSubStatus, setSelectedSubStatus] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      const filteredSubStatus = subStatuses
        .filter(({ value }) => value === selectedSubStatus)
        .map(({ value, label }) => ({
          leadStatusId: value,
          leadStatusName: label,
        }));
      onSubmit('Lost', filteredSubStatus);
    }
  };

  const handleClose = () => {
    setSelectedSubStatus(null);
    onClose();
  };

  return (
    <div className="lost-stage-page">
      <Modal
        open={open}
        size="small"
        cssClassName="loststage-modal"
        onClose={handleClose}
      >
        <div className="loststage-modal dialog--container">
          <div className="dialog--title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
              Lost Contact
            </h2>
          </div>
          <label className="label-reason pb-2" htmlFor="reason-label">
            Select the reason why
          </label>
          <Select
            containerHeight={250}
            className="mr-2"
            options={subStatuses}
            placeholder="Select"
            showValueAlways={true}
            onChange={setSelectedSubStatus}
            initialValue={selectedSubStatus}
          />
        </div>
        <div className="footer">
          <Button
            disabled={!selectedSubStatus}
            label="Submit"
            onClick={handleSubmit}
          />
          <Button label="Cancel" onClick={handleClose} type="secondary" />
        </div>
      </Modal>
    </div>
  );
};

LostStageDisposition.propTypes = {
  // An array of sub statuses to choose from
  subStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  // Whether the modal is open or not
  open: PropTypes.bool.isRequired,
  // Function to close the modal
  onClose: PropTypes.func.isRequired,
  // Function to handle form submission
  onSubmit: PropTypes.func.isRequired,
};

export default LostStageDisposition;
