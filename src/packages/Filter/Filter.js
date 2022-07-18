import React, {useState} from 'react';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import FilterIcon from './filter-icon.svg';
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import styles from './styles.module.scss';

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
      marginTop: '10px'
    },
  }));

export default function Filter({heading, content}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box sx={{mr: 2}}>
            <Icon onClick={handleClick}>
                <img alt="filter" className={styles.filtericon} src={FilterIcon}/>
            </Icon>
            <StyledPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            >
                <Box sx={{
                    minHeight: '100%',
                    width: 388,
                    backgroundColor: '#F4F8FB',
                }}>
                    <Box sx={{py: 2, px: 3}}>
                        <Typography variant="h5" sx={{color: "#093577"}}>{heading}</Typography>
                    </Box>
                    {content}
                </Box>
            </StyledPopover>
        </Box>
    );
}


