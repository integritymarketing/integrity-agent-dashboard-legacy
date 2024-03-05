import PropTypes from "prop-types";

import { Box } from "@mui/material";

import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";

const HealthLifeCell = ({ row }) => {
    const hasLife = row.lifePolicyCount === 0 || !row.lifePolicyCount;
    const hashealth = row.healthPolicyCount === 0 || !row.healthPolicyCount;

    return (
        <Box display="flex" gap="20px">
            {!hasLife ? <Heartactive /> : <HeartInactive />}
            {!hashealth ? <HealthActive /> : <HealthInactive />}
        </Box>
    );
};

HealthLifeCell.propTypes = {
    row: PropTypes.shape({
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
        leadsId: PropTypes.string,
        leadSource: PropTypes.string,
        lifePolicyCount: PropTypes.number,
        healthPolicyCount: PropTypes.number,
    }),
};

export default HealthLifeCell;
