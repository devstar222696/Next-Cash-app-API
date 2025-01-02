import { PermissionsMap } from "@/constants/permissions";
import useRole from "@/hooks/use-role";
import { hasPermissionForRole } from "@/lib/permission-utils";
import React from "react";

const AccessControl = ({ requiredPermissions, children }: { requiredPermissions: Array<PermissionsMap>, children: React.ReactNode}) => {
  const { role } = useRole();

  const hasPermission = hasPermissionForRole(role, requiredPermissions);

  return hasPermission ? children : null;
};

export default AccessControl;
