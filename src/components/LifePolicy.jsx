import { LifeActive } from "components/icons/Life/active";
import { LifeDeclined } from "components/icons/Life/declined";
import { LifeInactive } from "components/icons/Life/inactive";
import { LifePending } from "components/icons/Life/pending";
import { LifeReturned } from "components/icons/Life/returned";
import { LifeStarted } from "components/icons/Life/started";
import { LifeSubmitted } from "components/icons/Life/submitted";
import { LifeUnlinked } from "components/icons/Life/unlinked";
import { LifeUpcoming } from "components/icons/Life/upcoming";

const LifePolicy = ({ status }) => {
    const lifeIcons = {
        Started: <LifeStarted />,
        Submitted: <LifeSubmitted />,
        Pending: <LifePending />,
        Active: <LifeActive />,
        Inactive: <LifeInactive />,
        Declined: <LifeDeclined />,
        Upcoming: <LifeUpcoming />,
        Unlinked: <LifeUnlinked />,
        Returned: <LifeReturned />,
    };

    return lifeIcons[status]
};
export default LifePolicy