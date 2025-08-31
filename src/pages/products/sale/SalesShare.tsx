import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// assets
import {
  SaleDetailsMode,
  SaleDetailsType,
  SaleShippingMethod,
} from "../../../assets/Sale";
import { MaskPostalCode } from "../../../assets/Mask";

// utils
import Calculate from "../../../utils/Calculate";
import PhoneNumber from "../../../utils/PhoneNumber";
import { GenerateNumbers } from "../../../utils/GenerateId";

// types
import {
  TypeSale,
  TypeSaleStage,
  TypeSaleDetails,
  TypeSaleProduct,
} from "../../../types/Sale";
import { TypeCustomer } from "../../../types/Customers";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
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
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const SalesShare = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Currency = useCurrency();
  const navigate = useNavigate();
  const { user, token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);

  const [form, setForm] = useState<Partial<TypeSale>>({
    saleId: GenerateNumbers(6),
    stage: "draft" as TypeSaleStage,
    description: "",

    customerId: "",
    customerName: "",
    customerMobile: "",
    customerDocument: "",

    products: new Array<TypeSaleProduct>(),

    details: new Array<TypeSaleDetails>(),

    shippingMethod: undefined,
    shippingCost: "0.00",
    shippingFromAddress: "",
    shippingFromPostal: "",
    shippingToAddress: "",
    shippingToPostal: "",

    userId: user.id,
    sellerId: user.id,
    accountId: "",

    createdAt: format(new Date(), "yyyy-MM-dd"),
  });

  const subtotalProducts = Calculate.productsOrServices(form?.products || []);

  const subtotalAdditions = Calculate.details(
    form?.details?.filter(function (detail) {
      return detail?.type === "tax" || detail?.type === "fee";
    }) || [],
    subtotalProducts,
  );

  const subtotalDeductions = Calculate.details(
    form?.details?.filter(function (detail) {
      return (
        detail?.type === "discount" ||
        detail?.type === "promo" ||
        detail?.type === "coupon" ||
        detail?.type === "voucher"
      );
    }) || [],
    subtotalProducts,
  );

  const subtotalShipping = Number(form?.shippingCost) || 0;

  const total =
    subtotalProducts +
    subtotalAdditions -
    subtotalDeductions +
    subtotalShipping;

  // fetch sale
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Sale.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/sales");
        return;
      }
      setForm(response.data.result);
      return;
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

  // fetch customers
  useAsync(async function () {
    try {
      const response = await apis.Customer.list<
        ApiResponsePaginate<TypeCustomer>
      >(
        token,
        instance.name,
        {
          pageSize: 999,
          pageCurrent: 1,
          orderField: "name",
          orderSort: "asc",
        },
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      if (response.data.result.items?.[0])
        setForm(function (prevState) {
          const newForm = { ...prevState };
          if (!newForm?.customerId) {
            newForm.customerId = response.data.result.items[0].id;
            newForm.customerName = response.data.result.items[0].name;
            newForm.customerMobile = response.data.result.items[0].mobile;
            newForm.customerDocument = response.data.result.items[0]?.document1;
          }
          return newForm;
        });
      setCustomers(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("src/pages/products/sale/SalesShare.tsx]", err);
      return;
    }
  }, []);

  const customer = customers.find(function (customer) {
    return customer.id === form.customerId;
  });

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
                <div>{form.saleId}</div>
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
        rows={form?.products || []}
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

      {form?.details && form.details?.length > 0 && (
        <Sheets
          title={t.sale.details}
          empty={t.sale.no_details}
          rows={form?.details || []}
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

      {form?.shippingMethod && (
        <Wrapper title={t.sale.title_address}>
          <Vertical internal={1} className="flex1">
            <Horizontal internal={1}>
              <InputSelect
                disabled
                name="shippingMethod"
                id="sale_shipping_method"
                empty={t.stacks.no_option}
                label={t.sale.shipping_method}
                value={form?.shippingMethod || ""}
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
                value={form?.shippingCost || "0.00"}
                onChange={function () {
                  return;
                }}
              />
              <Input
                readOnly
                name="shippingDescription"
                id="sale_shipping_description"
                label={t.sale.shipping_description}
                value={form?.shippingDescription || ""}
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
                value={form?.shippingFromPostal || ""}
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
                value={form?.shippingFromAddress || ""}
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
                value={form?.shippingToPostal || ""}
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
                value={form?.shippingToAddress || ""}
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
