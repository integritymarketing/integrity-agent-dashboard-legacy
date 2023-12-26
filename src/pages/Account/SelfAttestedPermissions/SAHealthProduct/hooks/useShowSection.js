import useFeatureFlag from "hooks/useFeatureFlag";
import useRoles from "hooks/useRoles";
import { hasNoUniqueCarriers } from "../utils/helper";

const FLAG_NAME = "REACT_APP_SELF_ATTESTED_PERMISSION_FLAG";

function useShowSection(agents) {
  const isFeatureEnabled = useFeatureFlag(FLAG_NAME);
  const { isNonRTS_User } = useRoles();
  const hasCarriers = !hasNoUniqueCarriers(agents);

  return isFeatureEnabled && !isNonRTS_User && hasCarriers;
}

export default useShowSection;
