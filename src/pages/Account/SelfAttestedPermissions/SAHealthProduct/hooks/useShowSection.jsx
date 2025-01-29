import { hasNoUniqueCarriers } from "../utils/helper";
import useRoles from "hooks/useRoles";

function useShowSection(agents) {
    const { isNonRTS_User } = useRoles();
    const hasCarriers = !hasNoUniqueCarriers(agents);

    return  !isNonRTS_User && hasCarriers;
}

export default useShowSection;
