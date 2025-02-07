import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const getSignalRConnection = (profileAgentId) => {
  if (window.connection) {
    return window.connection;
  }
  const toggleURI = `${process.env.REACT_APP_AGENT_MANAGEMENT_SIGNALR}/api/?agentid=${profileAgentId}`;
  const connection = new HubConnectionBuilder()
    .withUrl(toggleURI)
    .configureLogging(LogLevel.Information)
    .build();
  connection.start().catch(console.error);
  window.connection = connection;
  return connection;
};
