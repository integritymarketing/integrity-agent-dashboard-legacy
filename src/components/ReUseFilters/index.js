import { styled } from "@mui/system";
import PropTypes from "prop-types";
import Popover from "@mui/material/Popover";
import styles from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import Filter from "./Filter";

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        width: "480px",
        maxWidth: "calc(100vw - 35px) !important",
    },
}));

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    width: "25px",
    height: "25px",
    color: "white",
    backgroundColor: "#ccc",
    borderRadius: "100%",
    padding: "5px",
    marginTop: "5px",
    ":hover": {
        backgroundColor: "#bbb",
    },
}));

function ReUseFilters({ anchorEl, handleClose, handleSummaryBarInfo, searchId, isSingleSelect }) {
    const open = Boolean(anchorEl);
    const id = anchorEl ? "simple-popover-filters" : undefined;

    return (
        <StyledPopover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <Box className={styles.modalContentWrapper}>
                <Box>
                    <Box className={styles.filterHeader}>
                        <Typography variant="h5" sx={{ color: "#052A63" }}>
                            {isSingleSelect ? "When..." : "Filter Contacts"}
                        </Typography>
                        <StyledIconButton onClick={handleClose} />
                    </Box>
                    <Filter
                        handleSummaryBarInfo={handleSummaryBarInfo}
                        searchId={searchId}
                        isSingleSelect={isSingleSelect}
                        handleClose={handleClose}
                    />
                </Box>
            </Box>
        </StyledPopover>
    );
}

ReUseFilters.propTypes = {
    anchorEl: PropTypes.object,
    handleClose: PropTypes.func,
    handleSummaryBarInfo: PropTypes.func,
    searchId: PropTypes.string,
    isSingleSelect: PropTypes.bool,
};

export default ReUseFilters;
