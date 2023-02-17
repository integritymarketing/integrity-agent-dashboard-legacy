import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import styles from "./ActivityDetailModal.module.scss";
import { TextField, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ActivityDetailModal({
  open,
  handleClose,
  activityObj,
  onComplete,
  onSave,
}) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h5" className={styles.headingSection}>
              {activityObj.name}
            </Typography>
            <div className={styles.subSection}>
              <div>
                <div className={styles.subHeading}>SOA Signed</div>
                <div className={styles.topSection}>
                  The scope of appointment is {activityObj.scope}
                  <Button
                    variant="contained"
                    size={"small"}
                    onClick={onComplete}
                  >
                    Complete
                  </Button>
                </div>
              </div>
              <div>
                <div className={styles.subHeading}>Activity Note</div>
                <div>
                  <TextField
                    hiddenLabel
                    id="outlined-multiline-static"
                    multiline
                    fullWidth
                    rows={4}
                    placeholder="Add a note about this activity"
                  />
                </div>
              </div>
            </div>
            <div className={styles.footerSection}>
              <Button variant="contained" onClick={onSave}>
                Save
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
