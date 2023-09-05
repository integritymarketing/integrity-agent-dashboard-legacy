import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  addButton: {
    backgroundColor: "#4178FF",
    borderRadius: "20px",
    color: "#FFFFFF",
    padding: "20px 16px;",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#4178FF",
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
      "& svg #Icon_Add_path": {
        // targeting the svg path by id
        fill: "transparent", // changing the fill color
      },
    },
  },
  buttonIcon: {
    marginTop: "10px",
  },
  cancelButton: {
    color: "#4178FF",
    fontSize: "16px",
    fontWeight: "600",
    height: "40px",
    padding: "10px 15px",
    textTransform: "capitalize !important",

    "&:hover": {
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      boxShadow: "inset 0px -1px 0px #CCCCCC",
    },
  },
  closeButton: {
    backgroundColor: "#DDDDDD",
    color: "#FFFFFF",
    marginBottom: "5px",
    padding: "0px",
    transform: "rotate(0deg)",
    transition: "transform 1s",
    "&:hover": {
      backgroundColor: "#BBBBBB",
      transition: "transform 1s",
      transform: "rotate(90deg)",
    },
  },
  footer: {
    backgroundColor: "#F1F1F1",
    display: "flex",
    flexDirection: "column",
  },

  footerButtons: {
    backgroundColor: "#F1F1F1",
    borderRadius: "0px 0px 8px 8px",
    justifyContent: "space-between",
    padding: "20px 24px",
    width: "100%",
    display: "flex",
  },

  title: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px 8px 0px 0px",
    boxShadow: "inset 0px -1px 0px #CCCCCC",
    color: "#052A63",
    fontFamily: "Lato",
    fontSize: "32px",
    letterSpacing: "0.32px",
  },
}));

export default function Modal({
  actionButtonName,
  onSave,
  contentStyle,
  onClose,
  onCancel,
  open,
  title,
  children,
  actionButtonDisabled,
  endIcon,
  hideFooter = false,
  customFooter,
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
        <DialogContent
          style={{ backgroundColor: "#F1F1F1", ...(contentStyle || {}) }}
        >
          {children}
        </DialogContent>
        <DialogActions className={classes.footer}>
          {!hideFooter && (
            <Box className={classes.footerButtons}>
              <Button onClick={onClose} className={classes.cancelButton}>
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className={classes.addButton}
                endIcon={<span className={classes.buttonIcon}>{endIcon}</span>}
                disabled={actionButtonDisabled}
              >
                {actionButtonName}
              </Button>
            </Box>
          )}
          {customFooter && customFooter}
        </DialogActions>
      </Dialog>
    </div>
  );
}
