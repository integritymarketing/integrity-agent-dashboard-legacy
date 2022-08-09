import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles.module.scss';
import { styled } from "@mui/system";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    cursor:'pointer',
    display: 'flex',
    marginTop: '5px',
    width: '20px',
    marginLeft: 'auto'
  }));

export default function TModal({content, open, handleClose}) {
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
                    <div className={styles.modalContentContainer}>
                        <StyledIconButton onClick={()=>{handleClose()}}>
                            <CloseIcon/>
                        </StyledIconButton>
                        {content}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
