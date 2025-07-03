import { useEffect } from "react";

const useEffectAsync = function (
  effect: () => Promise<void>,
  deps: React.DependencyList,
) {
  useEffect(function () {
    let isActive = true;
    const runEffect = async function () {
      try {
        await effect();
      } catch (error) {
        if (isActive) console.error("[src/hooks/useEffectAsync.tsx]", error);
      }
    };
    runEffect();
    return function () {
      isActive = false;
    };
  }, deps);

  return;
};

export default useEffectAsync;
