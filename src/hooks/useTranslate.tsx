// hooks
import useSystem from "./useSystem";

// assets
import Translate from "../assets/Translate";

export type TranslateLanguages = keyof typeof Translate;

const useTranslate = function () {
  const { instance } = useSystem();
  const languageInstance = instance?.language || "en";
  const languageBrowser =
    navigator?.language?.slice(0, 2)?.toLowerCase() || "en";
  const languageTyped = (languageInstance ||
    languageBrowser) as TranslateLanguages;
  return Translate[languageTyped];
};

export default useTranslate;
