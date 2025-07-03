import { create } from "zustand";
import { persist } from "zustand/middleware";

// types
import { TypeUser } from "../types/User";
import { TypeInstance } from "../types/Instance";

type SystemState = {
  token: string | null;
  user: TypeUser | null;
  instance: TypeInstance | null;
  saveToken: (token: string) => void;
  saveUser: (user: TypeUser) => void;
  saveInstance: (instance: TypeInstance) => void;
  clear: () => void;
};

const useSystem = create<SystemState>()(
  persist(
    function (set) {
      const initial = {
        token: null,
        user: null,
        instance: null,
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
      const clear = function () {
        set({ ...initial });
        return;
      };
      return {
        ...initial,
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
          token: state.token,
          user: state.user,
          instance: state.instance,
        };
      },
    },
  ),
);

export default useSystem;
