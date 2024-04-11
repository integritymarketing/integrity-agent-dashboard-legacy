 
import { useCallback } from "react";
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import ArrowRight from "components/icons/version-2/ArrowRight";
import AskIntegrity from "components/icons/version-2/AskIntegrity";

import Modal from "components/Modal";
import useDeviceType from "hooks/useDeviceType";

import styles from "./AskIntegrityModal.module.scss";

const AskIntegrityModal = ({ open, onClose, askIntegrityList, leadData }) => {
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();
    const onViewContactHandle = useCallback(() => {
      navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);
  
    const fullName = `${leadData?.firstName ?? ''} ${leadData?.middleName ?? ''} ${leadData?.lastName ?? ''}`;
  
    return (
      <Modal maxWidth="sm" open={open} onClose={onClose} title={
        <Box display="flex">
          <span className={styles.askIntegrityTitleIcon}><AskIntegrity /></span>
          Ask Integrity Suggests
        </Box>
      }
      hideFooter={true}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" width="100%">
          <Box className={styles.name}>{fullName}</Box>
          <Box className={styles.link} onClick={onViewContactHandle}>
            {!isMobile && 'View Contact'} <ArrowRight />
          </Box>
        </Box>
        <Box>
          {askIntegrityList?.map((tagInfo, index) => (
            <Box key={index} className={styles.askIntegrityCard}>
              <Box className={styles.askIntegrityInfo}>
                <Box><AskIntegrity /></Box>
                <Box className={styles.tagInfo}>
                  <Box className={styles.tagName}>{tagInfo?.tag?.tagLabel}</Box>
                  <Box className={styles.tagMetaData}>{tagInfo?.tag?.metadata}</Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Modal>
    );
  };
  
  AskIntegrityModal.propTypes = {
    open: PropTypes.bool.isRequired, // Indicates if the modal is open or not
    onClose: PropTypes.func.isRequired, // Function to call on modal close
    askIntegrityList: PropTypes.array, // List of integrity suggestions
    leadData: PropTypes.object.isRequired, // Lead data including names and ID
  };
  
  export default AskIntegrityModal;