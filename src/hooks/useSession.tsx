import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";

type UserData = Record<string, unknown>;

interface SessionContextProps {
  token: string | null;
  user: UserData | null;
  saveToken: (token: string) => void;
  saveUser: (user: UserData) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined,
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(function () {
    setToken(localStorage.getItem("token"));
    const userStored = localStorage.getItem("user");
    if (userStored) setUser(JSON.parse(userStored));
  }, []);

  const saveToken = function (newToken: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    return;
  };

  const saveUser = function (userData: UserData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return;
  };

  const logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    return;
  };

  return (
    <SessionContext.Provider
      value={{
        token,
        user,
        saveToken,
        saveUser,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = function (): SessionContextProps {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};
