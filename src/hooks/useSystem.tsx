import { create } from "zustand";
import { persist } from "zustand/middleware";

type SystemData = Record<string, unknown>;

type SystemState = {
  token: string | null;
  user: SystemData | null;
  saveToken: (token: string) => void;
  saveUser: (user: SystemData) => void;
  clear: () => void;
};

const useSystem = create<SystemState>()(
  persist(
    function (set) {
      const initial = {
        token: null,
        user: null,
      };
      const saveToken = function (token: string) {
        set({ token });
        return;
      };
      const saveUser = function (user: SystemData) {
        set({ user });
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
        clear,
      };
    },
    {
      name: "storage",
      partialize: function (state) {
        return {
          token: state.token,
          user: state.user,
        };
      },
    },
  ),
);

export default useSystem;
