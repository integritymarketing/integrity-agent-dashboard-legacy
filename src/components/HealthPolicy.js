import { Started } from "components/icons/Health/started";
import { Active } from "components/icons/Health/active";
import { Submitted } from "components/icons/Health/submitted";
import { Pending } from "components/icons/Health/pending";
import { Inactive } from "components/icons/Health/inactive";
import { Declined } from "components/icons/Health/declined";
import { Upcoming } from "components/icons/Health/upcoming";
import { Unlinked } from "components/icons/Health/unlinked";
import { Returned } from "components/icons/Health/returned";

const HealthPolicy = ({ status }) => {
    const healthIcons = {
        Started: <Started />,
        Submitted: <Submitted />,
        Pending: <Pending />,
        Active: <Active />,
        Inactive: <Inactive />,
        Declined: <Declined />,
        Upcoming: <Upcoming />,
        Unlinked: <Unlinked />,
        Returned: <Returned />,
    };

    return healthIcons[status]
};
export default HealthPolicy