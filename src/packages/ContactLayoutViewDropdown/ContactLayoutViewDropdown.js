import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import CardViewIcon from "components/icons/version-2/CardView";
import ListViewIcon from "components/icons/version-2/ListView";
import { styled } from "@mui/system";
import Map from "components/icons/map";
import styles from "./styles.module.scss";
import useAnalytics from "hooks/useAnalytics";
import useAgentInformationByID from "hooks/useAgentInformationByID";

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        width: "170px",
        maxWidth: "calc(100vw - 35px) !important",
    },
}));

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "transparent",
            color: "#717171",
            boxShadow: "none",
            fontSize: 12,
            border: "none",
        },
    })
);

function ContactLayoutViewDropdown({ currentLayout, onSwitchLayout }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { fireEvent } = useAnalytics();
    const { agentInformation } = useAgentInformationByID();
    const { agentID, agentNPN } = agentInformation || {};

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    }, []);

    const handleSwitchLayout = useCallback(
        (layout) => {
            onSwitchLayout(layout);
            if (layout === "map") {
                fireEvent("Contact Map Viewed", {
                    "type of contact list view": "map view",
                    agentID,
                    agentNPN,
                });
            }
            handleClose();
        },
        [onSwitchLayout, handleClose, fireEvent, agentID, agentNPN]
    );

    const option = useCallback(
        (name, className, icon, label) => (
            <Box onClick={() => handleSwitchLayout(name)} className={`${styles.option} ${className}`}>
                {icon}
                <span className={styles.optionName}>{label}</span>
            </Box>
        ),
        [handleSwitchLayout]
    );

    const ListViewOption = useMemo(() => option("list", styles.optionList, <ListViewIcon />, "List View"), [option]);
    const CardViewOption = useMemo(() => option("card", styles.optionCard, <CardViewIcon />, "Card View"), [option]);
    const MapViewOption = useMemo(() => option("map", styles.optionMap, <Map />, "Map View"), [option]);

    const options = useCallback(() => {
        if (currentLayout === "list") {
            return [ListViewOption, MapViewOption, CardViewOption];
        } else if (currentLayout === "card") {
            return [CardViewOption, ListViewOption, MapViewOption];
        }
        return [MapViewOption, ListViewOption, CardViewOption];
    }, [currentLayout, ListViewOption, CardViewOption, MapViewOption]);

    const id = isOpen ? "simple-popover" : undefined;

    const RenderTooltip = (
        <LightTooltip title={"Change view"} placement="top">
            <div className={styles.iconWrap} onClick={handleClick}>
                {currentLayout === "list" && (
                    <div className={styles.listIconActive}>
                        <ListViewIcon />
                    </div>
                )}
                {currentLayout === "card" && <CardViewIcon />}
                {currentLayout === "map" && <Map />}
            </div>
        </LightTooltip>
    );

    const RenderPopover = (
        <StyledPopover
            id={id}
            open={isOpen}
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
            <Box className={styles.body}>{options()}</Box>
        </StyledPopover>
    );

    return (
        <Box sx={{ mr: 2 }}>
            {RenderTooltip}
            {RenderPopover}
        </Box>
    );
}

ContactLayoutViewDropdown.propTypes = {
    currentLayout: PropTypes.string.isRequired,
    onSwitchLayout: PropTypes.func.isRequired,
};

export default ContactLayoutViewDropdown;
