// types
import { TypeSale } from "../types/Sale";
import { TypeOrder } from "../types/Order";

const Calculate = {
  productsOrServices: function (arr: Record<string, unknown>[]): number {
    return arr?.reduce(function (acc, item) {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity || 0);
      return acc + price * quantity;
    }, 0);
  },

  totalSale: function (sale: TypeSale) {
    const subtotalProducts = this.productsOrServices(
      (sale?.products as Record<string, unknown>[]) || [],
    );

    const subtotalAdditions = this.details(
      (sale?.details as Record<string, unknown>[])?.filter(function (detail) {
        return (
          detail?.type === "tax" ||
          detail?.type === "fee" ||
          detail?.type === "shipping"
        );
      }) || [],
      subtotalProducts,
    );

    const subtotalDeductions = this.details(
      (sale?.details as Record<string, unknown>[])?.filter(function (detail) {
        return (
          detail?.type === "discount" ||
          detail?.type === "promo" ||
          detail?.type === "coupon" ||
          detail?.type === "voucher"
        );
      }) || [],
      subtotalProducts,
    );

    const subtotalShipping = Number(sale?.shippingCost) || 0;

    const total =
      subtotalProducts +
      subtotalAdditions -
      subtotalDeductions +
      subtotalShipping;

    return {
      subtotalProducts,
      subtotalAdditions,
      subtotalDeductions,
      subtotalShipping,
      total,
    };
  },

  totalOrder: function (order: TypeOrder) {
    const subtotalServices = Calculate.productsOrServices(
      order?.services || [],
    );

    const subtotalAdditions = Calculate.details(
      order?.details?.filter(function (detail) {
        return detail?.type === "tax" || detail?.type === "fee";
      }) || [],
      subtotalServices,
    );

    const subtotalDeductions = Calculate.details(
      order?.details?.filter(function (detail) {
        return (
          detail?.type === "discount" ||
          detail?.type === "promo" ||
          detail?.type === "coupon" ||
          detail?.type === "voucher"
        );
      }) || [],
      subtotalServices,
    );

    const total = subtotalServices + subtotalAdditions - subtotalDeductions;

    return { subtotalServices, subtotalAdditions, subtotalDeductions, total };
  },

  details: function (arr: Record<string, unknown>[], total: number): number {
    const amount = arr?.reduce(function (acc, details) {
      if (details?.mode !== "amount") return acc;
      const amount = Number(details?.amount) || 0;
      return acc + amount;
    }, 0);

    const percent = arr?.reduce(function (acc, details) {
      if (details?.mode !== "percent") return acc;
      const percentParsed = Number(details?.percent) || 0;
      const percent100 = percentParsed / 100;
      const partial = total * percent100;
      return acc + partial;
    }, 0);

    return amount + percent;
  },

  getAmountByPercent: function (percent: number, total: number): number {
    if (!percent || !total) return 0;
    const percent100 = percent / 100;
    const amount = percent100 * total;
    return amount;
  },

  getPercentByAmount: function (amount: number, total: number): number {
    if (!amount || !total) return 0;
    const percent = amount / total;
    const percent100 = percent * 100;
    return percent100;
  },
};

export default Calculate;
