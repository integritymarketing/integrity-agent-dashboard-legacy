import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import styles from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  width: "30px",
  height: "30px",
  color: "#2175F4",
}));

const StyledPopover = styled(Popover)(() => ({
  ".MuiPopover-paper": {
    marginTop: "10px",
    top: "0px !important"
  },
}));

export default function Filter({
  heading,
  content,
  open,
  onToggle,
  Icon,
  ActiveIcon,
  filtered,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterToggle, setFilterToggle] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    onToggle(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onToggle(false);
  };

  //const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ mr: 2 }}>
      <div
        className={
          filterToggle || open || filtered
            ? `${styles.filterActive} ${styles.filter} `
            : styles.filter
        }
        onClick={handleClick}
      >
        {filterToggle || open || filtered ? (
          <ActiveIcon onMouseOut={() => setFilterToggle(false)} />
        ) : (
          <Icon onMouseOver={() => setFilterToggle(true)} />
        )}
      </div>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        top={0}
      >
        <Box
          sx={{
            height: "auto",
            width: 388,
          }}
        >
          <Box sx={{ py: 3, px: 3, backgroundColor: "#F4F8FB" }}>
            <Box className={styles.filterHeader}>
              <Typography variant="h5" sx={{ color: "#093577" }}>
                {heading}
              </Typography>
              <StyledIconButton onClick={handleClose} />
            </Box>
            {content}
          </Box>
        </Box>
      </StyledPopover>
    </Box>
  );
}
