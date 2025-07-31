const Bytes = {
  getBytesObject: function (value: object | object[]): number {
    try {
      const parseString = JSON.stringify(value);
      const size = new TextEncoder().encode(parseString).length;
      return size;
    } catch (err) {
      console.error("[src/utils/Bytes.ts]", err);
      return 0;
    }
  },
  getMegabytes: function (bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(decimals)} MB`;
  },
};

export default Bytes;
