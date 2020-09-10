import React, { useEffect } from "react";
import ExitIcon from "components/icons/exit";
import PageCard from "components/ui/page-card";
import Container from "components/ui/container";

export default ({ open = false, onClose, children, ...props }) => {
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

    return () => document.body.classList.remove("disable-scroll");
  }, [open]);

  return (
    <div
      className={`modal ${open ? "modal--show" : "modal--hide"}`}
      {...props}
      onClick={(event) => {
        if (event.target.matches(".modal") && onClose) {
          onClose();
        }
      }}
    >
      <Container size="medium">
        <PageCard className="modal__card">
          {onClose && (
            <div className="modal__header">
              <button className="modal__exit icon-btn" onClick={onClose}>
                <ExitIcon aria-hidden="true" />
                <span className="visually-hidden">Close modal window</span>
              </button>
            </div>
          )}
          <div className="modal__content">{children}</div>
        </PageCard>
      </Container>
    </div>
  );
};
