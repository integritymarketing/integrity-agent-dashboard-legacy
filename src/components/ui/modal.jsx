import React, { useEffect, useRef } from "react";
import ExitIcon from "components/icons/exit";
import PageCard from "components/ui/page-card";
import Container from "components/ui/container";
import CrossIcon from "components/icons/cross2";

const Modal = ({
  header,
  open = false,
  wide = false,
  size,
  onClose,
  children,
  labeledById,
  descById,
  testId,
  isVideo,
  providerModal,
  footer,
  cssClassName = "",
  className = "",
  ...props
}) => {
  const scrollRef = useRef(null);
  // close window on ESC
  useEffect(() => {
    const onKeydown = (event) => {
      if (event.keyCode === 27 && onClose) {
        onClose();
      }
    };
    document.body.addEventListener("keydown", onKeydown);
    return () => document.body.removeEventListener("keydown", onKeydown);
  }, [onClose]);

  // disable scroll when open
  useEffect(() => {
    document.body.classList.toggle("disable-scroll", open);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    return () => document.body.classList.remove("disable-scroll");
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "unset");
  }, [open]);

  return (
    <div
      className={`modal ${open ? "modal--show" : "modal--hide"} ${
        isVideo ? "modal--video" : ""
      } ${cssClassName}`}
      {...props}
      onClick={(event) => {
        if (event.target.matches(".modal") && onClose) {
          onClose();
        }
      }}
    >
      <Container size={size || (wide ? "wide" : "medium")}>
        <PageCard
          className={`${className} modal__card`}
          scrollRef={scrollRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labeledById}
          aria-describedby={descById}
          data-testid={testId}
          providerModal={providerModal ? providerModal : false}
        >
          {providerModal && (
            <div className="p_header">
              {header && (
                <h2
                  style={{ color: "#052A63" }}
                  id="dialog_help_label"
                  className="hdg hdg--2 mb-1 mble-title"
                >
                  {header}
                </h2>
              )}
              {onClose && (
                <button className={`close-icon`} onClick={onClose}>
                  <CrossIcon />
                  <span className="visually-hidden">Close modal window</span>
                </button>
              )}
            </div>
          )}
          {!providerModal && onClose && (
            <div className="modal__header">
              <button
                className={`modal__exit icon-btn ${
                  providerModal && "provider-close"
                }`}
                onClick={onClose}
              >
                <ExitIcon />
                <span className="visually-hidden">Close modal window</span>
              </button>
            </div>
          )}

          <div className="modal__content">{children}</div>
        </PageCard>
        {footer && <div className="modal__footer">{footer}</div>}
      </Container>
    </div>
  );
};

export default Modal;
