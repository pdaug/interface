import { create } from "zustand";
import { persist } from "zustand/middleware";

// types
import { TypeUser } from "../types/User";
import { ApiPreference } from "../types/Api";
import { TypeInstance } from "../types/Instance";
import { TypeWorkspace } from "../types/Workspace";

type SystemState = {
  token: string;
  user: TypeUser;
  users: TypeUser[];
  instance: TypeInstance;
  workspaces: TypeWorkspace[];
  workspaceId: string;
  version: string | number;
  preferences: ApiPreference;
  saveToken: (token: string) => void;
  saveUser: (user: TypeUser) => void;
  setUsers: (users: TypeUser[]) => void;
  setPreferences: (preferences: ApiPreference) => void;
  saveInstance: (instance: TypeInstance) => void;
  saveWorkspaces: (workspaces: TypeWorkspace[]) => void;
  saveVersion: (version: string | number) => void;
  selectWorkspace: (workspaceId: string) => void;
  clear: () => void;
};

const useSystem = create<SystemState>()(
  persist(
    function (set) {
      const initial = {
        token: "",
        user: {} as TypeUser,
        users: new Array<TypeUser>(),
        instance: {} as TypeInstance,
        workspaces: [],
        version: 0.1,
        workspaceId: "",
        preferences: {},
      };
      const saveToken = function (token: string) {
        set({ token });
        return;
      };
      const saveUser = function (user: TypeUser) {
        set({ user });
        return;
      };
      const setUsers = function (users: TypeUser[]) {
        set({ users });
        return;
      };
      const setPreferences = function (preferences: ApiPreference) {
        console.log({ preferences });
        set({ preferences });
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
      const saveVersion = function (version: string | number) {
        set({ version });
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
        setUsers,
        setPreferences,
        saveInstance,
        saveWorkspaces,
        selectWorkspace,
        saveVersion,
        clear,
      };
    },
    {
      name: "storage",
      partialize: function (state) {
        return {
          token: state.token,
          user: state.user,
          users: state.users,
          instance: state.instance,
          workspaces: state.workspaces,
          workspaceId: state.workspaceId,
          preferences: state.preferences,
          version: state.version,
        };
      },
    },
  ),
);

export default useSystem;
