import { create } from "zustand";
import { persist } from "zustand/middleware";

type SystemData = Record<string, unknown>;

type SystemState = {
  module: string;
  token: string | null;
  user: SystemData | null;
  instance: SystemData | null;
  openModule: (module: string) => void;
  saveToken: (token: string) => void;
  saveUser: (user: SystemData) => void;
  saveInstance: (instance: SystemData) => void;
  clear: () => void;
};

const useSystem = create<SystemState>()(
  persist(
    function (set) {
      const initial = {
        module: "dashboard",
        token: null,
        user: null,
        instance: null,
      };
      const openModule = function (module: string) {
        set({ module });
        return;
      };
      const saveToken = function (token: string) {
        set({ token });
        return;
      };
      const saveUser = function (user: SystemData) {
        set({ user });
        return;
      };
      const saveInstance = function (instance: SystemData) {
        set({ instance });
        return;
      };
      const clear = function () {
        set({ ...initial });
        return;
      };
      return {
        ...initial,
        openModule,
        saveToken,
        saveUser,
        saveInstance,
        clear,
      };
    },
    {
      name: "storage",
      partialize: function (state) {
        return {
          module: state.module,
          token: state.token,
          user: state.user,
          instance: state.instance,
        };
      },
    },
  ),
);

export default useSystem;
