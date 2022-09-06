import state from './state';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { useEffect, useState, useCallback } from 'react';
import clientsService from "services/clientsService";

const useContactDetails = (leadId) => {
    const setLeadId = useSetRecoilState(state.atoms.contactLeadIdAtom);
    const [leadDetails, setLeadDetails] = useRecoilState(state.atoms.contactLeadDetailsAtom);
    const [isLoading, setIsLoading] = useState(true);

    const getLeadDetails = useCallback(async () => {
        setIsLoading(true);
        try {   
            const results = await clientsService.getContactInfo(leadId);
            setLeadDetails(results);
        } catch(err) {
            // TODO: Handle error
            console.log(err, err.stack);
            setLeadDetails([]);
        } finally {
            setIsLoading(false);
        }
        
    }, [leadId, setLeadDetails, setIsLoading]);

    useEffect(() => {
        setLeadId(leadId);

        if(leadId) {
            getLeadDetails(leadId);
        }
    }, [setLeadId, leadId, getLeadDetails]);

    return {
        leadId,
        leadDetails,
        isLoading,
        getLeadDetails
    }
}

export default useContactDetails;