import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";

// apis
import apis from "../apis";

type InstanceData = Record<string, unknown>;

interface InstanceContextProps {
  instance: InstanceData | null;
  saveInstance: (instance: InstanceData | null) => void;
}

const InstanceContext = createContext<InstanceContextProps | undefined>(
  undefined,
);

export const InstanceProvider = function ({
  children,
}: {
  children: ReactNode;
}) {
  const [name, setName] = useState<string | null>(null);
  const [instance, setInstance] = useState<InstanceData | null>(null);

  // styling instance
  useEffect(
    function () {
      if (!instance) return;
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = instance.favicon as string;
      document.title = instance.companyName as string;
      document.head.appendChild(link);
    },
    [instance],
  );

  // get subdomain instance
  useEffect(function () {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts?.[0] && parts.length >= 3) {
      setName(parts?.[0]);
      return;
    }
    setName(null);
    return;
  }, []);

  // fetch instance
  useEffect(function () {
    if (!name) return;
    apis.Instance.search<Record<string, unknown>>(name)
      .then(function (response) {
        if (!response || !response?.data || !response.data?.result) return;
        setInstance(response.data.result);
        return;
      })
      .catch(function (err) {
        console.error("[src/hooks/useInstance.tsx]", err);
        return;
      });
    return;
  }, []);

  // restore instance stored
  useEffect(function () {
    const instanceStored = localStorage.getItem("instance");
    if (instanceStored) setInstance(JSON.parse(instanceStored));
  }, []);

  // to save instance
  const saveInstance = function (instaceData: InstanceData | null) {
    localStorage.setItem("instance", JSON.stringify(instaceData));
    setInstance(instaceData);
    return;
  };

  return (
    <InstanceContext.Provider
      value={{
        instance,
        saveInstance,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
};

export const useInstance = function (): InstanceContextProps {
  const context = useContext(InstanceContext);
  if (!context)
    throw new Error("useInstance must be used within a InstanceProvider");
  return context;
};
