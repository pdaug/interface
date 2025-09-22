// hooks
import useSystem from "./useSystem";

// types
import { TypeUserRole } from "../types/User";
import { TypeInstancePlan } from "../types/Instance";

// pages
import NoPermission from "../pages/NoPermission";

const usePermission = function () {
  const { user, instance } = useSystem();

  const checkByRole = function (needs: TypeUserRole): boolean {
    if (!user) return false;
    const currentRole = user?.role || "collaborator";
    const permissions = {
      collaborator: ["collaborator"],
      admin: ["collaborator", "admin"],
      master: ["collaborator", "admin", "master"],
    };
    return permissions[currentRole].includes(needs);
  };

  const renderByRole = function (
    needs: TypeUserRole,
    children: React.ReactNode,
  ): React.ReactNode {
    const hasPermission = checkByRole(needs);
    return hasPermission ? children : <NoPermission />;
  };

  const checkByPlan = function (needs: TypeInstancePlan) {
    if (!instance) return false;
    const currentPlan = instance?.paymentPlan || "personal";
    const permissions = {
      personal: ["personal"],
      advanced: ["personal", "advanced"],
      professional: ["personal", "advanced", "professional"],
    };
    return permissions[currentPlan].includes(needs);
  };

  const renderByPlan = function (
    needs: TypeInstancePlan,
    children: React.ReactNode,
  ): React.ReactNode {
    const hasPermission = checkByPlan(needs);
    return hasPermission ? children : <NoPermission />;
  };

  return { checkByRole, renderByRole, checkByPlan, renderByPlan };
};

export default usePermission;
