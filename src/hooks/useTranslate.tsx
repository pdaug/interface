// hooks
import useSystem from "./useSystem";

// assets
import Translate from "../assets/Translate";

// types
import { TypeInstance } from "../types/Instance";

export type TranslateLanguages = keyof typeof Translate;

const useTranslate = function (instanceExternal?: TypeInstance) {
  const { instance } = useSystem();

  const language =
    instance?.language || // instance
    instanceExternal?.language || // instance external
    navigator?.language?.slice(0, 2)?.toLowerCase() || // browser
    "en"; // fallback

  const languageTyped = language as TranslateLanguages;
  return Translate[languageTyped];
};

export default useTranslate;
