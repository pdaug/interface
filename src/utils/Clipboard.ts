const Clipboard = {
  copy: async function (text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("[src/utils/Clipboard.ts]", err);
      return false;
    }
  },

  paste: async function (): Promise<string | null> {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (err) {
      console.error("[src/utils/Clipboard.ts]", err);
      return null;
    }
  },
};

export default Clipboard;
