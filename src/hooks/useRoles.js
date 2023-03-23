import { useCallback } from "react";
import { useEffect, useState } from "react";
import authService from "services/authService";

export const Roles = {
  Agent: "Agent",
  NonRts: "NonRts",
};

export default () => {
  const [roles, setRoles] = useState(new Map());

  useEffect(() => {
    const fetchRoles = async () => {
      const { access_token } = await authService.getUser();
      const data = authService.parseJwt(access_token);
      const roles = typeof data.roles === "string" ? [data.roles] : data.roles;
      const rolesMap = new Map((roles || []).map((role) => [role, role]));
      setRoles(rolesMap);
    };
    fetchRoles();
  }, []);

  const isAdmin = useCallback(() => {
    return roles.size === 0;
  }, [roles]);

  const hasRole = useCallback(
    (role) => {
      // this is to be removed
      if (
        process.env.REACT_APP_NON_RTS_FLAG === "hide" &&
        role === Roles.NonRts
      )
        return false;
      return roles.has(role);
    },
    [roles]
  );

  const hasRoles = useCallback(
    (roleList) => {
      return roleList.every((role) => roles.has(role));
    },
    [roles]
  );

  return {
    isAdmin,
    hasRole,
    hasRoles,
  };
};
