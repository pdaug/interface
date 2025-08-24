const Calculate = {
  products: function (arr: Record<string, unknown>[]): number {
    return arr?.reduce(function (acc, product) {
      const price = Number(product?.price) || 0;
      const quantity = Number(product?.quantity || 0);
      return acc + price * quantity;
    }, 0);
  },

  details: function (arr: Record<string, unknown>[], value: number): number {
    const amount = arr?.reduce(function (acc, details) {
      if (details?.mode !== "amount") return acc;
      const amount = Number(details?.amount) || 0;
      return acc + amount;
    }, 0);

    const percent = arr?.reduce(function (acc, details) {
      if (details?.mode !== "percent") return acc;
      const percentParsed = Number(details?.percent) || 0;
      const percent100 = percentParsed / 100;
      const partial = value * percent100;
      return acc + partial;
    }, 0);

    return amount + percent;
  },
};

export default Calculate;
