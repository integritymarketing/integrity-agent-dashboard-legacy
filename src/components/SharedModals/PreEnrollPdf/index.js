import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import ArrowForwardWithCircle from "../Icons/ArrowForwardWithCirlce";

const PREFIX = 'PreEnrollPDFModal';

const classes = {
  container: `${PREFIX}-container`,
  text: `${PREFIX}-text`
};

const StyledModal = styled(Modal)(() => ({
  [`& .${classes.container}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  [`& .${classes.text}`]: {
    color: "#434A51",
    fontSize: 16,
    fontFamily: "Lato",
    letterSpacing: "0.16px",
    marginBottom: 10,
  }
}));

const PreEnrollPDFModal = ({ open, onClose }) => {


  const downloadPdf = () => {
    const url = `${process.env.REACT_APP_RESOURCES_URL}/MedicareCENTER-Pre-Enrollment-Checklist.pdf`;
    window.open(url, "_blank");
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      title="Pre-Enrollment Checklist"
      onSave={downloadPdf}
      actionButtonName="Download Checklist"
      endIcon={<ArrowForwardWithCircle />}
    >
      <Box className={classes.container}>
        <Typography className={classes.text}>
          CMS requires agents to explain the effect of their enrollment choice
          on their current coverage. Please make sure you have thoroughly
          covered the material in the Pre-Enrollment Checklist and that your
          Client understands.
        </Typography>
      </Box>
    </StyledModal>
  );
};

PreEnrollPDFModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PreEnrollPDFModal;