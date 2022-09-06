import React, { useEffect, useRef } from "react";
import ExitIcon from "components/icons/exit";
import PageCard from "components/ui/page-card";
import Container from "components/ui/container";

export default ({
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
          {onClose && (
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
