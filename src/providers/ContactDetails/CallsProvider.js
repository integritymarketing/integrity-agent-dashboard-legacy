import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";

export const CallsContext = createContext();

export const CallsProvider = ({ children }) => {
    const URL = `${process.env.REACT_APP_COMMUNICATION_API}`;
    const { Get: fetchCallsList, loading: isLoadingCallsList, error: callsListError } = useFetch(URL);
    const { Post: updateCallsViewed } = useFetch(`${URL}/Call/Records/Viewed`);
    const { Post: postMessage, Get: fetchMessageList, loading: messageListLoading } = useFetch(URL);
    const showToast = useToast();
    const [messageList, setMessageList] = useState([]);
    const [unviewedCallCount, setUnviewedCallCount] = useState(0);
    const [callsList, setCallsList] = useState([]);

    const getCallsList = useCallback(
        async (leadId) => {
            const path = `Call/Records?LeadId=${leadId}`;
            const data = await fetchCallsList(null, false, path);
            setCallsList(data || []);
            setUnviewedCallCount(data?.filter((c) => !c.hasViewed).length || 0);
        },
        [fetchCallsList],
    );

    const setCallsToViewed = useCallback(async () => {
        const unviewedCallIds = callsList?.filter((c) => !c.hasViewed)?.map((c) => c.callLogId) || [];
        if (unviewedCallIds.length) {
            const payload = { callLogIds: unviewedCallIds };
            await updateCallsViewed(payload);
        }
    }, [callsList, updateCallsViewed]);

    const getMessageList = useCallback(
        async (agentNPN, leadId) => {
            const path = `SmsLog/GetSmsLogByLead?agentNpn=${agentNPN}&leadId=${leadId}`;
            const data = await fetchMessageList(null, false, path);
            setMessageList(data || []);
            return data;
        },
        [fetchMessageList],
    );

    const postSendMessage = useCallback(
        async (postData) => {
            const response = await postMessage(postData, true, "CampaignLog/SendSms");
            if (response.ok) {
                showToast({
                    type: "success",
                    message: "Your message was delivered successfully.",
                });
            }
            return response;
        },
        [postMessage, showToast],
    );

    const postUpdateMessageRead = useCallback(
        async (data) => {
            return await postMessage(data, true, "SmsLog/Viewed");
        },
        [postMessage],
    );

    const contextValue = useMemo(
        () => ({
            getCallsList,
            callsList,
            unviewedCallCount,
            messageListLoading,
            callsListError,
            postUpdateMessageRead,
            isLoadingCallsList,
            setCallsToViewed,
            messageList,
            getMessageList,
            postSendMessage,
        }),
        [
            getCallsList,
            callsList,
            unviewedCallCount,
            messageListLoading,
            callsListError,
            postUpdateMessageRead,
            isLoadingCallsList,
            setCallsToViewed,
            messageList,
            getMessageList,
            postSendMessage,
        ],
    );

    return <CallsContext.Provider value={contextValue}>{children}</CallsContext.Provider>;
};

CallsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
