import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import styles from "./styles.module.scss";

const StyledPopover = styled(Popover)(() => ({
  ".MuiPopover-paper": {
    marginTop: "10px",
  },
}));

export default function Filter({ heading, content, open, onToggle }) {
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
          filterToggle || open
            ? `${styles.filterActive} ${styles.filter}`
            : styles.filter
        }
        onClick={handleClick}
      >
        {filterToggle || open ? (
          <ActiveFilter onMouseOut={() => setFilterToggle(false)} />
        ) : (
          <FilterIcon onMouseOver={() => setFilterToggle(true)} />
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
      >
        <Box
          sx={{
            minHeight: "100%",
            width: 388,
            backgroundColor: "#F4F8FB",
          }}
        >
          <Box sx={{ py: 2, px: 3 }}>
            <Typography variant="h5" sx={{ color: "#093577" }}>
              {heading}
            </Typography>
          </Box>
          {content}
        </Box>
      </StyledPopover>
    </Box>
  );
}
