import { useState } from "react";
import { Switch, Typography, IconButton, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import PropTypes from "prop-types";

const AdvancedModeToggle = () => {
    const { isAdvancedMode, handleAdvanceToggleMode } = useCampaignInvitation();
    const [showInfoIcon] = useState(false);

    return (
        <>
            <Switch
                checked={isAdvancedMode}
                onChange={handleAdvanceToggleMode}
                variant="availability"
                inputProps={{ "aria-label": "controlled" }}
            />
            <Box marginLeft="8px">
                {/* Label */}
                <Typography variant="body1" color="textPrimary">
                    Advanced Mode
                </Typography>
            </Box>
            {/* Info Icon */}
            {showInfoIcon && (
                <IconButton size="small" aria-label="information about advanced mode" color="primary">
                    <InfoOutlinedIcon />
                </IconButton>
            )}
        </>
    );
};

AdvancedModeToggle.propTypes = {
    isAdvancedMode: PropTypes.bool,
    setAdvancedMode: PropTypes.func,
};

export default AdvancedModeToggle;