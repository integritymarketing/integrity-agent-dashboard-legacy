import authService from "services/authService";

export const AGENTS_API_VERSION = "v1.0";

export class AgentsSelfService {
  _clientAPIRequest = async (path, method = "GET", body) => {
    const user = await authService.getUser();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  };

  getAgentSelfAttestations = async (agentId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentId}`,
      "GET"
    );

    return response?.json();
  };

  addAgentSelfAttestation = async (agentNpn, data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentNpn}`,
      "POST",
      data
    );

    return response?.json();
  };

  deleteAgentSelfAttestation = async (agentId, attestationId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentId}/${attestationId}`,
      "DELETE"
    );

    return response?.json();
  };
}

const agentsSelfServiceInstance = new AgentsSelfService();

export default agentsSelfServiceInstance;
