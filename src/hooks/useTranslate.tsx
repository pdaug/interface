// assets
import Translate from "../assets/Translate";

export type TranslateLanguages = keyof typeof Translate;

const useTranslate = function () {
  const languageBrowser = navigator.language.slice(0, 2).toLowerCase() || "en";
  const languageTyped = languageBrowser as TranslateLanguages;
  return Translate[languageTyped];
};

export default useTranslate;
