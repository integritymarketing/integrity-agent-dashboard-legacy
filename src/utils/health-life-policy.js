import { LifeActive } from "components/icons/Life/active";
import { LifeDeclined } from "components/icons/Life/declined";
import { LifeInactive } from "components/icons/Life/inactive";
import { LifePending } from "components/icons/Life/pending";
import { LifeReturned } from "components/icons/Life/returned";
import { LifeStarted } from "components/icons/Life/started";
import { LifeSubmitted } from "components/icons/Life/submitted";
import { LifeUnlinked } from "components/icons/Life/unlinked";
import { LifeUpcoming } from "components/icons/Life/upcoming";
import { Started } from "components/icons/Health/started";
import { Active } from "components/icons/Health/active";
import { Submitted } from "components/icons/Health/submitted";
import { Pending } from "components/icons/Health/pending";
import { Inactive } from "components/icons/Health/inactive";
import { Declined } from "components/icons/Health/declined";
import { Upcoming } from "components/icons/Health/upcoming";
import { Unlinked } from "components/icons/Health/unlinked";
import { Returned } from "components/icons/Health/returned";

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

export const getLifeIcons = (status) => {
    console.log(lifeIcons[status])
    return lifeIcons[status]
};
export const getHealthIcons = (status) => healthIcons[status];