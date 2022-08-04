import React from "react";
import Check from "./Check.svg";
import "./renderModalItem.scss";
function renderModalItem({
  icon,
  title,
  phoneNumber,
  MODAL_LEAD_TYPE,
  handleClick,
  activedPhone,
  dataSource,
  renderType,
  handleOpenPhone,
}) {
  const renderContent = () => {
    switch (renderType) {
      case "phoneList":
        return Object.keys(dataSource).map((itemKey, idx) => {
          const { icon, title, phoneNumber } = dataSource[itemKey];
          const isActivedPhone = activedPhone === itemKey;
          return (
            <div
              className="modalItemStyle"
              onClick={() => {
                handleClick({ type: renderType, value: itemKey });
              }}
            >
              <img src={icon} alt="modalItem" className="modalItemImgStyle" />
              <div className="modalItemTextStyle">
                <span className="span_title">{title}:</span>
                <span className="span_type">{phoneNumber}</span>
              </div>
              {isActivedPhone && <img src={Check} alt="activeIcon" className="active_icon" />}
            </div>
          );
        });

      default:
        return (
          <>
            <div
              className="modalItemStyle"
              onClick={() => {
                handleOpenPhone();
              }}
            >
              <img src={icon} alt="icon"className="modalItemImgStyle" />
              <div className="modalItemTextStyle">
                <span className="span_title">{title}:</span>
                <span className="span_type">{phoneNumber}</span>
              </div>
              <span className="span_icon">&gt;</span>
            </div>
            {MODAL_LEAD_TYPE && (
              <div className="modalItemStyle">
                <img
                  className="modalItemImgStyle"
                  alt="itemIcon"
                  src={MODAL_LEAD_TYPE[0]["icon"]}
                />
                <div className="modalItemTextStyle">
                  <span className="span_title">
                    {MODAL_LEAD_TYPE[0]["title"]}:
                  </span>
                  <span className="span_type">
                    {MODAL_LEAD_TYPE[0]["type"]}
                  </span>
                </div>
                <span className="span_icon">&gt;</span>
              </div>
            )}
          </>
        );
    }
  };
  return <div>{renderContent()}</div>;
}
export default renderModalItem;
