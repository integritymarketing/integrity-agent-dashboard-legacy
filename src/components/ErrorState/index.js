import React, { useState } from "react";
import TooltipMUI from "packages/ToolTip";
import Dialog from "packages/Dialog";
import "./style.scss";

const ErrorState = ({ isError, emptyList, icon, heading, content, link }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {isError && (
        <div className="error-container">
          <p className="error-text">Status Temporarily Unavailable</p>
          <TooltipMUI
            titleData={
              "Service partner is not returning current status. Please try again later."
            }
            onClick={() => setDialogOpen(true)}
          />
          <Dialog
            title="ERROR"
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            titleWithIcon={false}
          >
            <p>
              Service partner is not returning current status. Please try again
              later.
            </p>
          </Dialog>
        </div>
      )}
      {!isError && emptyList && (
        <div className="no-data-container">
          <div className="no-data-icon-container">
            <img src={icon} className="no-data-icon" alt={heading} />
          </div>
          <div className="no-data-text-container">
            <p className="no-data-text-heading">{heading}</p>
            <p className="no-data-text-desc">
              {content}
              {link && (
                <a href={link} className="click-here-link">
                  Click here
                </a>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorState;
