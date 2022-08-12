import React, { useState } from "react";
import Home from "./Home.svg";
import Lead from "./Lead.svg";
import LeadSource from "./LeadSource.svg";
import Check from "./Check.svg";
import "./renderModalItem.scss";
import Arrow from "components/icons/right-arrow";
import FooterButtons from "./footerButtons";
import { Button } from "packages/Button";
import Mobile from "./Mobile.svg";

const RenderModalItem = ({
  icon,
  title,
  phoneNumber,
  handleClick,
  activeModal,
  handleButtonClick,
  leadType,
  setLeadType,
  leadSource,
  setLeadSource,
  phone,
}) => {
  const [callHover, setCallHover] = useState("");
  const [dataHover, setDataHover] = useState("");
  const [lcHover, setlcHover] = useState("");
  const [mcHover, setmcHover] = useState("");
  const BUTTONS = {
    cancel: {
      text: "Cancel",
      onClick: () => {
        handleClick("main");
      },
    },
    checkOut: {
      text: "Check Out",
      onClick: () => {
        handleButtonClick("checkOut");
      },
    },
    continue: {
      text: "Continue",
      onClick: () => {
        handleButtonClick("continue");
      },
    },
  };
  const renderContent = () => {
    switch (activeModal) {
      case "callCenter":
        return (
          <>
            <div className="modalItemStyle bb ">
              <div className="modalItemTextStyle">
                <span className="number">{phone}</span>
              </div>
            </div>

            <div className="modalItemStyle">
              <FooterButtons
                buttonOne={BUTTONS.cancel}
                buttonTwo={BUTTONS.continue}
              />
            </div>
          </>
        );
      case "leadType":
        return (
          <>
            <div
              className={`modalItemStyle bb  ${callHover ? "bg" : ""}`}
              onMouseEnter={() => setCallHover(true)}
              onMouseLeave={() => setCallHover(false)}
              onClick={() => {
                setLeadType("callLead");
              }}
            >
              <img src={Home} alt="icon" className="modalItemImgStyle" />
              <div className="modalItemTextStyle">
                <span className=".span_source-title">Call Lead</span>
              </div>

              {(callHover || leadType === "callLead") && (
                <img src={Check} alt="activeIcon" className="active_icon" />
              )}
            </div>

            <div
              className={`modalItemStyle bb  ${dataHover ? "bg" : ""}`}
              onMouseEnter={() => setDataHover(true)}
              onMouseLeave={() => setDataHover(false)}
              onClick={() => {
                setLeadType("dataLead");
              }}
            >
              <img className="modalItemImgStyle" alt="itemIcon" src={Lead} />
              <div className="modalItemTextStyle">
                <span className=".span_source-title">Data Lead</span>
              </div>
              {(dataHover || leadType === "dataLead") && (
                <img src={Check} alt="activeIcon" className="active_icon" />
              )}
            </div>

            <div className="modalItemStyle">
              <FooterButtons
                buttonOne={BUTTONS.cancel}
                buttonTwo={BUTTONS.continue}
              />
            </div>
          </>
        );
      case "leadSource":
        return (
          <>
            <div
              className={`modalItemStyle bb  ${lcHover ? "bg" : ""}`}
              onMouseEnter={() => setlcHover(true)}
              onMouseLeave={() => setlcHover(false)}
              onClick={() => {
                setLeadSource("leadCenter");
              }}
            >
              <div className="modal-lead-source">
                <div className="span_source-title">LeadCENTER</div>
                <div className="span_setup">
                  <Button variant="primary" size="small" onClick={() => {}}>
                    setup
                  </Button>
                </div>

                {lcHover || leadSource === "leadCenter" ? (
                  <img src={Check} alt="activeIcon" className="active_icon" />
                ) : (
                  <div className="active_icon"> </div>
                )}
              </div>
            </div>

            <div
              className={`modalItemStyle bb  ${mcHover ? "bg" : ""}`}
              onMouseEnter={() => setmcHover(true)}
              onMouseLeave={() => setmcHover(false)}
              onClick={() => {
                setLeadSource("pURL");
              }}
            >
              <div className="modal-lead-source">
                <span className="span_source-title">MedicareEnroll pURL</span>
                {(mcHover || leadSource === "pURL") && (
                  <img src={Check} alt="activeIcon" className="active_icon" />
                )}
              </div>
            </div>

            <div className="modalItemStyle">
              <FooterButtons
                buttonOne={BUTTONS.cancel}
                buttonTwo={BUTTONS.continue}
              />
            </div>
          </>
        );
      case "main":
        return (
          <>
            <div
              className="modalItemStyle bb"
              onClick={() => {
                handleClick("callCenter");
              }}
            >
              <img src={Mobile} alt="icon" className="modalItemImgStyle" />
              <div className="modalItemTextStyle">
                <span className="span_title">Call Number</span>
                <span className="span_type">{phone}</span>
              </div>
              <Arrow className="span_icon" />
            </div>

            <div
              className="modalItemStyle bb"
              onClick={() => {
                handleClick("leadType");
              }}
            >
              <img className="modalItemImgStyle" alt="itemIcon" src={Lead} />
              <div className="modalItemTextStyle">
                <span className="span_title">Lead Type</span>
                <span className="span_type">
                  {leadType === "callLead"
                    ? "Call"
                    : leadType === "dataLead"
                    ? "Data"
                    : "Call/Data"}
                </span>
              </div>
              <Arrow className="span_icon" />
            </div>

            <div
              className="modalItemStyle bb"
              onClick={() => {
                handleClick("leadSource");
              }}
            >
              <img
                className="modalItemImgStyle"
                alt="itemIcon"
                src={LeadSource}
              />
              <div className="modalItemTextStyle">
                <span className="span_title">Lead Source:</span>
                <span className="span_source_type">
                  {" "}
                  {leadSource === "leadCenter"
                    ? "LeadCENTER"
                    : "MedicareEnroll"}
                </span>
              </div>
              <Arrow className="span_icon" />
            </div>
            <div className="modalItemStyle">
              <FooterButtons
                buttonOne={BUTTONS.checkOut}
                buttonTwo={BUTTONS.continue}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  return <div className={`modalBox ${activeModal}-h`}>{renderContent()}</div>;
};
export default RenderModalItem;
