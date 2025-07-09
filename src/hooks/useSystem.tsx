import { create } from "zustand";
import { persist } from "zustand/middleware";

// types
import { TypeUser } from "../types/User";
import { TypeInstance } from "../types/Instance";
import { TypeWorkspace } from "../types/Workspace";

type SystemState = {
  token: string;
  user: TypeUser;
  instance: TypeInstance;
  workspaces: TypeWorkspace[];
  workspaceId: string;
  saveToken: (token: string) => void;
  saveUser: (user: TypeUser) => void;
  saveInstance: (instance: TypeInstance) => void;
  saveWorkspaces: (workspaces: TypeWorkspace[]) => void;
  selectWorkspace: (workspaceId: string) => void;
  clear: () => void;
};

const useSystem = create<SystemState>()(
  persist(
    function (set) {
      const initial = {
        token: "",
        user: {} as TypeUser,
        instance: {} as TypeInstance,
        workspaces: [],
        workspaceId: "",
      };
      const saveToken = function (token: string) {
        set({ token });
        return;
      };
      const saveUser = function (user: TypeUser) {
        set({ user });
        return;
      };
      const saveInstance = function (instance: TypeInstance) {
        set({ instance });
        return;
      };
      const saveWorkspaces = function (workspaces: TypeWorkspace[]) {
        set({ workspaces });
        return;
      };
      const selectWorkspace = function (workspaceId: string) {
        set({ workspaceId });
        return;
      };
      const clear = function () {
        set({ ...initial });
        return;
      };
      return {
        ...initial,
        saveToken,
        saveUser,
        saveInstance,
        saveWorkspaces,
        selectWorkspace,
        clear,
      };
    },
    {
      name: "storage",
      partialize: function (state) {
        return {
          token: state.token,
          user: state.user,
          instance: state.instance,
          workspaces: state.workspaces,
          workspaceId: state.workspaceId,
        };
      },
    },
  ),
);

export default useSystem;
