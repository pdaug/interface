import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageBroken } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// assets
import {
  SaleDetailsMode,
  SaleDetailsType,
  SaleShippingMethod,
} from "../../../assets/Sale";
import { Master } from "../../../assets/Master";
import { MaskPostalCode } from "../../../assets/Mask";

// utils
import Calculate from "../../../utils/Calculate";
import PhoneNumber from "../../../utils/PhoneNumber";

// types
import { TypeSale } from "../../../types/Sale";
import { TypeInstance } from "../../../types/Instance";
import { TypeCustomer } from "../../../types/Customers";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useCurrency from "../../../hooks/useCurrency";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputMask,
  InputMoney,
  InputSelect,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Sheets from "../../../components/sheets/Sheets";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const SalesShare = function () {
  const play = useSounds();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [sale, setSale] = useState<TypeSale | null>(null);
  const [customer, setCustomer] = useState<TypeCustomer | null>(null);
  const [instance, setInstance] = useState<TypeInstance | null>(null);

  const t = useTranslate(instance ?? undefined);
  const Currency = useCurrency(instance ?? undefined);

  const { subtotalProducts, subtotalDeductions, subtotalAdditions, total } =
    Calculate.totalSale(sale as TypeSale);

  // change style by instance
  useEffect(
    function () {
      if (!instance) return;
      const favicon: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
      if (!favicon) return;
      favicon.type = "image/x-icon";
      favicon.rel = "shortcut icon";
      favicon.href = instance.favicon as string;
      document.title = instance.companyName as string;
      return;
    },
    [instance],
  );

  // fetch instance, sale and customer
  useAsync(async function () {
    if (!id) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_items,
      });
      return;
    }

    setLoading(true);
    try {
      // instance
      let instance: TypeInstance | null = null;
      const host = window.location.hostname;
      const parts = host.split(".");
      const subdomain = parts?.[0];
      if (subdomain && parts.length >= 3) {
        const responseInstance =
          await apis.Instance.search<TypeInstance>(subdomain);
        if (responseInstance.data?.result) {
          instance = responseInstance.data.result;
          setInstance(responseInstance.data.result);
        }
      } else {
        const responseInstance =
          await apis.Instance.search<TypeInstance>("test");
        if (responseInstance.data?.result) {
          instance = responseInstance.data.result;
          setInstance(responseInstance.data.result);
        }
      }

      if (!instance) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_instance,
        });
        return;
      }

      // sale
      const responseSale = await apis.Sale.get<TypeSale>(
        Master.token,
        instance.name,
        id,
      );
      if (!responseSale.data?.result || responseSale.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      setSale(responseSale.data.result);

      // customer
      const responseCustomer = await apis.Customer.get<TypeCustomer>(
        Master.token,
        instance.name,
        responseSale.data.result.customerId,
      );
      if (!responseCustomer.data?.result || responseCustomer.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      setCustomer(responseCustomer.data.result);
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("src/pages/products/sale/SalesShare.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <Vertical internal={1} external={1}>
      <Wrapper>
        <Horizontal className="justifyCenter">
          <i
            style={{
              color: "var(--textLight)",
              fontSize: "var(--textSmall)",
            }}
          >
            {t.components.loading}...
          </i>
        </Horizontal>
      </Wrapper>
    </Vertical>
  ) : (
    <Vertical internal={1} external={1}>
      <Horizontal internal={1} className="itemsCenter">
        <Avatar
          label=""
          size={[12, 24]}
          Icon={ImageBroken}
          photo={instance?.logoLarge ?? undefined}
        />
        <Vertical internal={0.2}>
          <div
            style={{
              color: instance?.colorPrimary,
              fontSize: "var(--textSubtitle)",
            }}
          >
            {instance?.companyName}
          </div>
          <div style={{ fontSize: "var(--textSmall)" }}>
            <a
              href={`tel:${instance?.companyMobile}`}
              style={{ color: instance?.colorSecondary }}
            >
              {PhoneNumber.Internacional(instance?.companyMobile || "")}
            </a>
            <br />
            <a
              href={`tel:${instance?.companyPhone}`}
              style={{ color: instance?.colorSecondary }}
            >
              {PhoneNumber.Internacional(instance?.companyPhone || "")}
            </a>
            <br />
            <a
              href={`mailto:${instance?.companyPhone}`}
              style={{ color: instance?.colorSecondary }}
            >
              {instance?.companyEmail}
            </a>
          </div>
        </Vertical>
      </Horizontal>

      <Wrapper>
        <Horizontal
          internal={1}
          className="itemsCenter"
          styles={{ justifyContent: "space-between" }}
        >
          <Profile
            photoSize={8}
            padding={false}
            name={customer?.name}
            photo={customer?.photo || ""}
            description={
              <Vertical>
                <div>{PhoneNumber.Internacional(customer?.mobile || "")}</div>
                <div>{sale?.saleId}</div>
              </Vertical>
            }
          />

          <Badge
            category="Info"
            styles={{ fontSize: "var(--textHighlight)" }}
            value={`${t.components.total}: ${Currency(total)}`}
          />
        </Horizontal>
      </Wrapper>

      <Sheets
        title={t.product.products}
        empty={t.sale.no_products}
        rows={sale?.products || []}
        footer={
          <Badge
            category="Info"
            value={`${t.product.products}: ${Currency(subtotalProducts)}`}
          />
        }
        formatter={{
          productName: function () {
            return {
              type: "text",
              readOnly: true,
              title: t.sale.product_name,
              onChange: function () {
                return;
              },
            };
          },
          variantName: function () {
            return {
              type: "text",
              readOnly: true,
              title: t.sale.variant_name,
              onChange: function () {
                return;
              },
            };
          },
          quantity: function () {
            return {
              min: 1,
              max: 9999,
              type: "number",
              readOnly: true,
              title: t.sale.quantity,
              placeholder: t.sale.quantity_placeholder,
              onChange: function () {
                return;
              },
            };
          },
          price: function () {
            return {
              type: "money",
              readOnly: true,
              title: t.sale.price,
              placeholder: "0.00",
              onChange: function () {
                return;
              },
            };
          },
        }}
      />

      {sale?.details && sale.details?.length > 0 && (
        <Sheets
          title={t.sale.details}
          empty={t.sale.no_details}
          rows={sale?.details || []}
          footer={
            <Horizontal internal={1}>
              <Badge
                category="Danger"
                value={`${t.sale.addition}: +${Currency(subtotalAdditions)}`}
              />
              <Badge
                category="Success"
                value={`${t.sale.deduction}: -${Currency(subtotalDeductions)}`}
              />
            </Horizontal>
          }
          formatter={{
            title: function () {
              return {
                type: "text",
                readOnly: true,
                title: t.sale.details_title,
                placeholder: t.sale.details_title_placeholder,
                onChange: function () {
                  return;
                },
              };
            },
            type: function () {
              return {
                type: "select",
                readOnly: true,
                title: t.sale.details_type,
                options: SaleDetailsType?.map(function (type) {
                  return {
                    id: type,
                    value: type,
                    text:
                      t.sale?.[type as keyof typeof t.sale] ||
                      t.components.unknown,
                  };
                }),
                onChange: function () {
                  return;
                },
              };
            },
            mode: function () {
              return {
                type: "select",
                readOnly: true,
                title: t.sale.details_mode,
                options: SaleDetailsMode?.map(function (mode) {
                  return {
                    id: mode,
                    value: mode,
                    text:
                      t.sale?.[mode as keyof typeof t.sale] ||
                      t.components.unknown,
                  };
                }),
                onChange: function () {
                  return;
                },
              };
            },
            amount: function () {
              return {
                type: "money",
                readOnly: true,
                placeholder: "0.00",
                title: t.sale.details_amount,
                onChange: function () {
                  return;
                },
              };
            },
            percent: function () {
              return {
                type: "number",
                readOnly: true,
                placeholder: "10%",
                title: t.sale.details_percent,
                onChange: function () {
                  return;
                },
              };
            },
          }}
        />
      )}

      {sale?.shippingMethod && (
        <Wrapper title={t.sale.title_address}>
          <Vertical internal={1} className="flex1">
            <Horizontal internal={1}>
              <InputSelect
                disabled
                name="shippingMethod"
                id="sale_shipping_method"
                empty={t.stacks.no_option}
                label={t.sale.shipping_method}
                value={sale?.shippingMethod || ""}
                options={SaleShippingMethod.map(function (shipping) {
                  return {
                    id: shipping,
                    value: shipping,
                    text:
                      t.sale?.[shipping as keyof typeof t.sale] ||
                      t.components.unknown,
                  };
                })}
                onChange={function () {
                  return;
                }}
              />
              <InputMoney
                readOnly
                placeholder="0.00"
                name="shippingCost"
                id="sale_shipping_cost"
                label={t.sale.shipping_cost}
                value={sale?.shippingCost || "0.00"}
                onChange={function () {
                  return;
                }}
              />
              <Input
                readOnly
                name="shippingDescription"
                id="sale_shipping_description"
                label={t.sale.shipping_description}
                value={sale?.shippingDescription || ""}
                placeholder={t.sale.shipping_description_placeholder}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>

            <Horizontal internal={1}>
              <InputMask
                readOnly
                mask={MaskPostalCode}
                name="shippingFromPostal"
                id="user_shipping_from_postal"
                label={t.sale.shipping_from_postal}
                value={sale?.shippingFromPostal || ""}
                placeholder={t.components.address_postal_code_placeholder}
                onChange={async function () {
                  return;
                }}
              />

              <Input
                readOnly
                name="shippingFromAddress"
                id="shipping_from_address"
                label={t.sale.shipping_from_address}
                value={sale?.shippingFromAddress || ""}
                placeholder={t.components.address_street_placeholder}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>

            <Horizontal internal={1}>
              <InputMask
                readOnly
                mask={MaskPostalCode}
                name="shippingToPostal"
                id="user_shipping_to_postal"
                label={t.sale.shipping_to_postal}
                value={sale?.shippingToPostal || ""}
                placeholder={t.components.address_postal_code_placeholder}
                onChange={async function () {
                  return;
                }}
              />

              <Input
                readOnly
                name="shippingToAddress"
                id="shipping_to_address"
                label={t.sale.shipping_to_address}
                value={sale?.shippingToAddress || ""}
                placeholder={t.components.address_street_placeholder}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
      )}
    </Vertical>
  );
};

export default SalesShare;
