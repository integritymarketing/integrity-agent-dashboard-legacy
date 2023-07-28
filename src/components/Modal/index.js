import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import ArrowForwardWithCircle from "./Icons/ArrowForwardWithCirlce";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  addButton: {
    backgroundColor: "#4178FF",
    borderRadius: "20px",
    color: "#FFFFFF",
    textTransform: "unset",
    transition: "transform 0.5s",
    "&:hover": {
      backgroundColor: "#4178FF",
      transform: "scale(1.1)",
    },
    "&.Mui-disabled": {
      backgroundColor: "#B3C9FF",
      color: "#FFFFFF",
      cursor: "not-allowed",
      "& svg #Icon_Arrow_path": {
        // targeting the svg path by id
        fill: "transparent", // changing the fill color
      },
      "& svg #Icon_circle_path": {
        // targeting the svg path by id
        fill: "#FFFFFF", // changing the fill color
      },
    },
  },
  cancelButton: {
    color: "#4178FF",
    fontSize: "16px",
    fontWeight: "600",
    height: "40px",
    textTransform: "unset",
    transition: "transform 0.5s",
    width: "104px",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      transform: "scale(1.1)",
    },
  },
  closeButton: {
    backgroundColor: "#DDDDDD",
    color: "#FFFFFF",
    marginBottom: "5px",
    padding: "0px",
    "&:hover": {
      backgroundColor: "#BBBBBB",
    },
  },

  footer: {
    backgroundColor: "#F1F1F1",
    borderRadius: "0px 0px 8px 8px",
    justifyContent: "space-between",
    padding: "20px 24px",
  },

  title: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px 8px 0px 0px",
    boxShadow: "inset 0px -1px 0px var(--gray-mid-cccccc)",
    color: "#052A63",
    fontFamily: "Lato",
    fontSize: "32px",
    letterSpacing: "0.32px",
  },
}));

export default function Modal({
  actionButtonName,
  onSave,
  onClose,
  open,
  title,
  children,
  actionButtonDisabled,
}) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        style={{
          borderRadius: 8,
        }}
      >
        <DialogTitle disableTypography className={classes.title}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{title}</span>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#F1F1F1" }}>
          {children}
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button onClick={onClose} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className={classes.addButton}
            endIcon={<ArrowForwardWithCircle />}
            disabled={actionButtonDisabled}
          >
            {actionButtonName}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
