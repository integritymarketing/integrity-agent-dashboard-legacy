import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

import { CampaignActionsEllipsis } from "@integritymarketing/icons";
import ActionPopover from "./ActionPopover";

const ActionPopoverContainer = ({ campaign, refresh, advanceMode, campaignDescription, buttonDisable, page }) => {
    const [actionPopOver, setActionPopOver] = useState(null);

    const handleClick = (event) => {
        setActionPopOver(event.currentTarget);
    };
    const handleClose = () => {
        setActionPopOver(null);
    };

    return (
        <>
            <Box onClick={(event) => handleClick(event)}>
                <IconButton size="lg" className={styles.roundedIcon}>
                    <CampaignActionsEllipsis size="lg" className={styles.mIcon} />
                </IconButton>
            </Box>
            <ActionPopover
                anchorEl={actionPopOver}
                onClose={handleClose}
                campaign={campaign}
                refresh={refresh}
                advanceMode={advanceMode}
                campaignDescription={campaignDescription}
                buttonDisable={buttonDisable}
                page={page}
            />
        </>
    );
};

ActionPopoverContainer.propTypes = {
    campaign: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    advanceMode: PropTypes.bool,
    campaignDescription: PropTypes.string,
    buttonDisable: PropTypes.bool,
    page: PropTypes.string,
};

export default ActionPopoverContainer;
