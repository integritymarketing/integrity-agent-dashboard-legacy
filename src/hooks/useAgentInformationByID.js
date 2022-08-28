import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "contexts/auth";
import callRecordingsService from "services/callRecordingsService";

export default () => {
  const auth = useContext(AuthContext);
  const [agentInfomration, setAgentInfomration] = useState({});

 const getAgentAvailability = useCallback(async() => {
  const user = await auth.getUser();
  const { agentid } = user.profile;
  const response = await callRecordingsService.getAgentAvailability(agentid);
  setAgentInfomration({...response});
 },[setAgentInfomration, auth])

  useEffect(() => {
    getAgentAvailability();
  }, [getAgentAvailability]);

  return agentInfomration;
};
