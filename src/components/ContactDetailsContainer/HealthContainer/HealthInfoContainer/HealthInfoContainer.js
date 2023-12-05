import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditHealthInfo } from "./EditHealthInfo";
import { ViewHealthInfo } from "./ViewHealthInfo";
import useFetch from "hooks/useFetch";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { UPDATE_LEAD_DETAILS } from "components/AddZipContainer/AddZipContainer.constants";

const HealthInfoContainer = () => {
    const [isEditHealthInfo, setIsEditHealthInfo] = useState(false);
    const { leadId } = useParams();
    const { getLeadDetails, leadDetails } = useContactDetails(leadId);
    const { birthdate, gender, weight, height, isTobaccoUser, modifyDate } = leadDetails;
    const smoker = isTobaccoUser ? "Yes" : "No";

    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${leadId}`)
    const onSave = async (formData) => {
        await updateLeadData({ ...leadDetails, ...formData })
        setIsEditHealthInfo(false);
        getLeadDetails()
    }

    return (
        <>
            {isEditHealthInfo
                ? <EditHealthInfo
                    birthdate={birthdate}
                    sexuality={gender}
                    wt={weight? weight : 0}
                    hFeet={height ? Math.floor(height / 12) : ""}
                    hInch={height ? height % 12 : ""}
                    smoker={smoker}
                    modifyDate={modifyDate}
                    onSave={onSave}
                    onCancel={() => setIsEditHealthInfo(false)} />
                : <ViewHealthInfo birthdate={birthdate}
                    gender={gender}
                    weight={weight ? weight : ""}
                    height={height ? `${Math.floor(height / 12)}' ${height % 12}''` : ""}
                    smoker={smoker}
                    onEdit={() => setIsEditHealthInfo(true)} />
            }
        </>
    );
}

export default HealthInfoContainer;