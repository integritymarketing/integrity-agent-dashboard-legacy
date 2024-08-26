import { styled } from "@mui/system";
import Popover from "@mui/material/Popover";
import styles from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import Filter from "./Filter";

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        width: "400px",
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

function ReUseFilters({ anchorEl, handleClose, handleSummaryBarInfo, campaignId }) {
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
                            Filter Contacts
                        </Typography>
                        <StyledIconButton onClick={handleClose} />
                    </Box>
                    <Filter handleSummaryBarInfo={handleSummaryBarInfo} campaignId={campaignId} />
                </Box>
            </Box>
        </StyledPopover>
    );
}

export default ReUseFilters;