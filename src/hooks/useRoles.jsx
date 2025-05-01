import { useCallback, useEffect, useState } from 'react';

import useUserProfile from 'hooks/useUserProfile';

export const Roles = {
  Agent: 'Agent',
  nonRts: 'nonRts',
};

const useRoles = () => {
  const userProfile = useUserProfile();
  const [roles, setRoles] = useState(new Map());

  useEffect(() => {
    const fetchRoles = async () => {
      const { roles } = userProfile || {};
      const userRoles = typeof roles === 'string' ? [roles] : roles;
      const rolesMap = new Map((userRoles || []).map(role => [role, role]));
      setRoles(rolesMap);
    };
    fetchRoles();
  }, [userProfile]);

  const isAdmin = useCallback(() => {
    return roles.size === 0;
  }, [roles]);

  const hasRole = useCallback(
    role => {
      return roles.has(role);
    },
    [roles]
  );

  const hasRoles = useCallback(
    roleList => {
      return roleList.every(role => roles.has(role));
    },
    [roles]
  );

  const isNonRTS_User = hasRole(Roles.nonRts);

  return {
    isAdmin,
    hasRole,
    hasRoles,
    isNonRTS_User,
  };
};

export default useRoles;
