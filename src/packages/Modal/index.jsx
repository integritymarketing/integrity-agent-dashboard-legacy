import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import { styled } from "@mui/system";
import Media from "react-media";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  marginTop: "5px",
  width: "30px",
  height: "30px",
  color: "#0052CE",
  marginLeft: "auto",
}));

export default function TModal({
  style = { width: "400px" },
  content,
  open,
  handleClose,
}) {
  const [isMobile, setIsMobile] = useState(false);

  const mobileStyle = { width: "90%", maxHeight: "95%" };
  return (
    <div>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <div
            className={styles.modalContentContainer}
            style={isMobile ? mobileStyle : style}
          >
            <StyledIconButton
              onClick={() => {
                handleClose();
              }}
            />
            {content}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
