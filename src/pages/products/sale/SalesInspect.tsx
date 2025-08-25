import { toast } from "sonner";
import { format } from "date-fns";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Asterisk, MapTrifold } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import Calculate from "../../../utils/Calculate";
import { GenerateNumbers } from "../../../utils/GenerateId";

// assets
import {
  SaleStages,
  SaleDetailsMode,
  SaleDetailsType,
  SaleShippingMethod,
} from "../../../assets/Sale";
import { MaskPostalCode } from "../../../assets/Mask";
import { SettingsAddressState } from "../../../assets/Settings";

// types
import {
  TypeSale,
  TypeSaleStage,
  TypeSaleDetails,
  TypeSaleShippingMethod,
  TypeSaleProduct,
} from "../../../types/Sale";
import { TypeProduct } from "../../../types/Product";
import { TypeAccount } from "../../../types/Account";
import { TypeCustomer } from "../../../types/Customers";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useSchema from "../../../hooks/useSchema";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputSelect,
  InputMask,
  InputMoney,
} from "../../../components/inputs/Input";
import Sheets from "../../../components/sheets/Sheets";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const SalesInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const Currency = useCurrency();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [form, setForm] = useState<Partial<TypeSale>>({
    saleId: GenerateNumbers(6),
    stage: "open" as TypeSaleStage,
    description: "",

    customerId: "",
    customerName: "",
    customerMobile: "",
    customerDocument: "",

    products: new Array<TypeSaleProduct>(),

    details: new Array<TypeSaleDetails>(),

    shippingMethod: undefined,
    shippingCost: "0.00",

    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressPostalCode: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "SP",

    userId: user.id,

    createdAt: format(new Date(), "yyyy-MM-dd"),
  });

  console.log(form);

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const subtotalProducts = Calculate.products(form?.products || []);

  const subtotalAdditions = Calculate.details(
    form?.details?.filter(function (detail) {
      return (
        detail?.type === "tax" ||
        detail?.type === "fee" ||
        detail?.type === "shipping"
      );
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

  const total = subtotalProducts + subtotalAdditions - subtotalDeductions;

  // get position
  useAsync(
    async function () {
      if (!form.addressStreet || !form.addressNumber || !form.addressCity)
        return;
      try {
        const response = await apis.AddressPosition({
          street: form.addressStreet,
          number: form.addressNumber,
          city: form.addressCity,
        });
        if (
          !response.data ||
          !response.data?.[0]?.lat ||
          !response.data?.[0]?.lon
        ) {
          console.warn(
            "[src/pages/settings/users/UsersInspect.tsx]",
            response.data,
          );
          return;
        }
        setPosition([
          parseFloat(String(response.data[0].lat)),
          parseFloat(String(response.data[0].lon)),
        ]);
      } catch (err) {
        console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      }
      return;
    },
    [form.addressStreet, form.addressNumber, form.addressCity],
  );

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
      console.error("[src/pages/products/sale/SalesInspect.tsx]", err);
      navigate("/f/sales");
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
      console.error("[src/pages/products/sale/SalesInspect.tsx]", err);
      return;
    }
  }, []);

  // fetch products
  useAsync(async function () {
    try {
      const response = await apis.Product.list<
        ApiResponsePaginate<TypeProduct>
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
          if (newForm?.products?.length === 0) {
            newForm.products = [
              {
                productId: response.data.result.items[0].id,
                productName: response.data.result.items[0].name,
                variantId: response.data.result.items[0].variants[0].id,
                variantName: response.data.result.items[0].variants[0].name,
                quantity: 1,
                price: response.data.result.items[0].variants[0].price,
              },
            ];
          }
          return newForm;
        });
      setProducts(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/sale/SalesInspect.tsx]", err);
      return;
    }
  }, []);

  // fetch accounts
  useAsync(async function () {
    try {
      const response = await apis.Account.list<
        ApiResponsePaginate<TypeAccount>
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
          if (!newForm.accountId)
            newForm.accountId = response.data.result.items[0].id;
          return newForm;
        });
      setAccounts(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/sale/SalesInspect.tsx]", err);
      return;
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      // is editing
      if (id) {
        const response = await apis.Sale.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/sales");
        return;
      }
      // is creating
      const response = await apis.Sale.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/sales");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/products/sale/SalesInspect.tsx]", err);
      if (
        err instanceof AxiosError &&
        err.response?.data?.result?.message === "schema_incorrect"
      ) {
        Schema(err.response.data.result.err);
        return;
      }
      toast.error(t.toast.warning_error, {
        description: id ? t.toast.error_edit : t.toast.error_create,
      });
      return;
    } finally {
      // delay to not duplicate when save
      setTimeout(function () {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "sales",
                label: t.sale.sales,
                url: "/f/sales",
              },
              {
                id: "sale",
                label: loading
                  ? t.components.empty_name
                  : form?.saleId || t.components.empty_name,
                url: `/f/sales/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.sale.title_edit : t.sale.title_create}
            description={t.sale.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="stage"
                  id="sale_stage"
                  disabled={loading}
                  label={t.sale.stage}
                  value={form.stage || ""}
                  empty={t.stacks.no_option}
                  options={SaleStages.map(function (stage) {
                    return {
                      id: stage,
                      value: stage,
                      text: t.sale[stage as keyof typeof t.sale],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.stage = (event.currentTarget?.value ||
                      "open") as TypeSaleStage;
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={12}
                  readOnly
                  name="saleId"
                  id="sale_sale_id"
                  label={t.sale.id}
                  disabled={loading}
                  placeholder="123456"
                  value={form?.saleId || ""}
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="customerId"
                  disabled={loading}
                  id="sale_customer_id"
                  label={t.sale.customer}
                  empty={t.stacks.no_option}
                  value={String(form.customerId)}
                  options={customers.map(function (customer) {
                    return {
                      id: customer.id,
                      value: customer.id,
                      text: customer.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    const customerId = event.currentTarget?.value || "";
                    const customerFinded = customers.find(function (customer) {
                      return customer.id === customerId;
                    });
                    if (customerFinded) {
                      newForm.customerId = customerFinded.id;
                      newForm.customerName = customerFinded.name;
                      newForm.customerDocument = customerFinded.document1;
                      newForm.customerMobile = customerFinded.mobile;
                      setForm(newForm);
                    }
                    return;
                  }}
                />

                <InputSelect
                  required
                  name="userId"
                  disabled={loading}
                  id="sale_user_id"
                  label={t.sale.user}
                  empty={t.stacks.no_option}
                  value={String(form.userId)}
                  options={users.map(function (customer) {
                    return {
                      id: customer.id,
                      value: customer.id,
                      text: customer.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.userId = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <InputSelect
                  required
                  name="accountId"
                  disabled={loading}
                  id="sale_account_id"
                  label={t.sale.account}
                  empty={t.stacks.no_option}
                  value={form.accountId || ""}
                  options={accounts.map(function (account) {
                    return {
                      id: account.id,
                      value: account.id,
                      text: account.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.accountId = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal>
                <InputText
                  max={256}
                  height={4}
                  name="description"
                  disabled={loading}
                  id="sale_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  placeholder={t.sale.description_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.description = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              {Boolean(id) && (
                <Horizontal internal={1}>
                  <div
                    className="flex flex1"
                    style={{ alignItems: "flex-end" }}
                  >
                    <Profile
                      padding={false}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </div>

                  <Input
                    readOnly
                    placeholder=""
                    name="updatedAt"
                    id="sale_updated_at"
                    label={t.components.updated_at}
                    value={
                      form?.updatedAt ? instanceDateTime(form.updatedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="deletedAt"
                    id="sale_deleted_at"
                    label={t.components.deletedAt}
                    value={
                      form?.deletedAt ? instanceDateTime(form.deletedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                </Horizontal>
              )}
            </Vertical>
          </Wrapper>

          <Sheets
            empty={t.sale.no_products}
            rows={form?.products || []}
            footer={
              <div style={{ fontSize: "var(--textSmall)" }}>
                <span>{t.product.products}: </span>
                <span>{Currency(subtotalProducts)}</span>
              </div>
            }
            add={function () {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.products?.push({
                  productId: products[0].id,
                  productName: products[0].name,
                  variantId: products[0].variants[0].id,
                  variantName: products[0].variants[0].name,
                  quantity: 1,
                  price: products[0].variants[0].price,
                });
                return newForm;
              });
              return;
            }}
            remove={function (index) {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.products?.splice(index, 1);
                return newForm;
              });
              return;
            }}
            formatter={{
              productId: function (index) {
                return {
                  type: "select",
                  title: t.sale.product_name,
                  options: products?.map(function (product) {
                    return {
                      id: product.id,
                      value: product.id,
                      text: product.name,
                    };
                  }),
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };

                      if (!newForm?.products || !newForm.products?.[index])
                        return newForm;

                      const ProductFind = products?.find(function (product) {
                        return product.id === (row?.productId as string);
                      });

                      newForm.products[index].productId =
                        row.productId as string;
                      newForm.products[index].productName =
                        ProductFind?.name || "";
                      newForm.products[index].variantId =
                        ProductFind?.variants?.[0]?.id || "";
                      newForm.products[index].variantName =
                        ProductFind?.variants?.[0]?.name || "";
                      newForm.products[index].price =
                        ProductFind?.variants?.[0]?.price || "";

                      return newForm;
                    });
                    return;
                  },
                };
              },
              variantId: function (index) {
                const ProductFind = products?.find(function (product) {
                  return product.id === form?.products?.[index]?.productId;
                });
                return {
                  type: "select",
                  title: t.sale.variant_name,
                  disabled: ProductFind?.category === "single",
                  options: ProductFind?.variants?.map(function (variant) {
                    return {
                      id: variant.id,
                      value: variant.id,
                      text: variant.name,
                    };
                  }),
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };

                      if (!newForm?.products || !newForm.products?.[index])
                        return newForm;

                      const VariantFind = ProductFind?.variants?.find(
                        function (variant) {
                          return variant.id === (row?.variantId as string);
                        },
                      );

                      newForm.products[index].variantId = VariantFind?.id || "";
                      newForm.products[index].variantName =
                        VariantFind?.name || "";
                      newForm.products[index].price = VariantFind?.price || "";
                      return newForm;
                    });
                    return;
                  },
                };
              },
              quantity: function (index) {
                return {
                  min: 1,
                  max: 9999,
                  type: "number",
                  title: t.sale.quantity,
                  placeholder: t.sale.quantity_placeholder,
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.products || !newForm.products?.[index])
                        return newForm;
                      row.quantity = Number(row.quantity);
                      newForm.products[index] = row as TypeSaleProduct;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              price: function (index) {
                return {
                  type: "money",
                  title: t.sale.price,
                  placeholder: "0.00",
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.products || newForm.products?.[index])
                        return newForm;
                      newForm.products[index] = row as TypeSaleProduct;
                      return newForm;
                    });
                    return;
                  },
                };
              },
            }}
          />

          <Sheets
            empty={t.sale.no_details}
            rows={form?.details || []}
            footer={
              <Horizontal internal={1}>
                <div>
                  <span>{t.sale.addition}: </span>
                  <span style={{ color: "var(--dangerColor)" }}>
                    {Currency(subtotalAdditions)}
                  </span>
                </div>
                <div>
                  <span>{t.sale.deduction}: </span>
                  <span style={{ color: "var(--successColor)" }}>
                    {Currency(subtotalDeductions)}
                  </span>
                </div>
              </Horizontal>
            }
            add={function () {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.details?.push({
                  title: "",
                  type: "fee",
                  mode: "amount",
                  amount: "0.00",
                  percent: 0,
                });
                return newForm;
              });
              return;
            }}
            remove={function (index) {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.details?.splice(index, 1);
                return newForm;
              });
              return;
            }}
            formatter={{
              title: function (index) {
                return {
                  type: "text",
                  title: t.sale.details_title,
                  placeholder: t.sale.details_title_placeholder,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeSaleDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              type: function (index) {
                return {
                  type: "select",
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
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeSaleDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              mode: function (index) {
                return {
                  type: "select",
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
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeSaleDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              amount: function (index) {
                const isModeAmount = form?.details?.[index]?.mode === "amount";
                return {
                  type: "money",
                  placeholder: "0.00",
                  disabled: !isModeAmount,
                  title: t.sale.details_amount,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const percent = Calculate.getPercentByAmount(
                        Number(data.amount),
                        subtotalProducts,
                      );
                      newForm.details[index].percent = parseFloat(
                        percent.toFixed(6),
                      );
                      newForm.details[index] = data as TypeSaleDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              percent: function (index) {
                const isModePercent =
                  form?.details?.[index]?.mode === "percent";
                return {
                  type: "number",
                  placeholder: "10%",
                  disabled: !isModePercent,
                  title: t.sale.details_percent,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const amount = Calculate.getAmountByPercent(
                        Number(data.percent),
                        subtotalProducts,
                      );
                      newForm.details[index].amount = amount.toFixed(2);
                      data.percent = Number(data.percent);
                      newForm.details[index] = data as TypeSaleDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
            }}
          />

          <Wrapper
            collapsible
            title={t.sale.title_stage}
            contentStyles={{ padding: 0 }}
            description={t.sale.subtitle_stage}
          >
            <Vertical internal={1} external={1}>
              <Horizontal internal={1}>
                <Input
                  type="date"
                  name="createdAt"
                  disabled={loading}
                  id="sale_created_at"
                  placeholder="yyyy-MM-dd"
                  label={t.components.created_at}
                  value={
                    form?.createdAt
                      ? format(new Date(form?.createdAt), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={function () {
                    return;
                  }}
                />
                <Input
                  type="date"
                  name="datePayment"
                  disabled={loading}
                  id="sale_date_payment"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_payment}
                  value={form?.datePayment || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.datePayment = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <Input
                  type="date"
                  name="dateShipped"
                  disabled={loading}
                  id="sale_date_shipped"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_shipped}
                  value={form?.dateShipped || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateShipped = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <Input
                  type="date"
                  name="dateCompleted"
                  disabled={loading}
                  id="sale_date_completed"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_completed}
                  value={form?.dateCompleted || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateCompleted = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <Input
                  type="date"
                  name="dateFailed"
                  disabled={loading}
                  id="sale_date_failed"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_failed}
                  value={form?.dateFailed || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateFailed = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <Input
                  type="date"
                  name="dateRefunded"
                  disabled={loading}
                  id="sale_date_refunded"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_refunded}
                  value={form?.dateRefunded || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateRefunded = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <Input
                  type="date"
                  name="dateCanceled"
                  disabled={loading}
                  id="sale_date_canceled"
                  placeholder="yyyy-MM-dd"
                  label={t.sale.date_canceled}
                  value={form?.dateCanceled || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateCanceled = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            collapsible
            contentStyles={{ padding: 0 }}
            title={t.sale.title_address}
            description={t.sale.subtitle_address}
          >
            <Horizontal internal={1} external={1}>
              <Vertical internal={1} className="flex1">
                <Horizontal internal={1}>
                  <InputSelect
                    disabled={loading}
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
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.shippingMethod = (event.currentTarget?.value ||
                        "") as TypeSaleShippingMethod;
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputMoney
                    disabled={loading}
                    placeholder="0.00"
                    name="shippingCost"
                    id="sale_shipping_cost"
                    label={t.sale.shipping_cost}
                    value={form?.shippingCost || "0.00"}
                    onChange={function (value) {
                      const newForm = { ...form };
                      newForm.shippingCost = value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <InputMask
                    mask={MaskPostalCode}
                    name="addressPostalCode"
                    id="user_address_postal_code"
                    disabled={loading}
                    value={form?.addressPostalCode || ""}
                    label={t.components.address_postal_code}
                    placeholder={t.components.address_postal_code_placeholder}
                    onChange={async function (event) {
                      const newForm = { ...form };
                      const postalCodeRaw = event.currentTarget?.value || "";
                      const postalCode = postalCodeRaw.replace(/\D/g, "");
                      newForm.addressPostalCode = postalCode;
                      if (postalCode.length === 8) {
                        setLoading(true);
                        const toastId = toast.loading(t.components.loading);
                        try {
                          const response = await apis.PostalCode(postalCode);
                          newForm.addressStreet =
                            response.data?.street || newForm.addressStreet;
                          newForm.addressCity =
                            response.data?.city || newForm.addressCity;
                          newForm.addressNeighborhood =
                            response.data?.neighborhood ||
                            newForm.addressNeighborhood;
                          newForm.addressState =
                            response.data?.state || newForm.addressState;
                          toast.dismiss(toastId);
                          play("ok");
                          toast.success(t.toast.success, {
                            description: t.toast.success_find,
                          });
                        } catch (err) {
                          console.error(
                            "[src/pages/settings/users/UsersInspect.tsx]",
                            err,
                          );
                          toast.dismiss(toastId);
                          play("alert");
                          toast.warning(t.toast.warning_error, {
                            description: t.toast.warning_find,
                          });
                        } finally {
                          setLoading(false);
                        }
                      }
                      setForm(newForm);
                      return;
                    }}
                  />

                  <Input
                    min={4}
                    max={64}
                    name="addressStreet"
                    id="user_address_street"
                    disabled={loading}
                    value={form?.addressStreet || ""}
                    label={t.components.address_street}
                    placeholder={t.components.address_street_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressStreet = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <Input
                    min={1}
                    max={8}
                    name="addressNumber"
                    id="user_address_number"
                    disabled={loading}
                    value={form?.addressNumber || ""}
                    label={t.components.address_number}
                    placeholder={t.components.address_number_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressNumber = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />

                  <Input
                    max={32}
                    name="addressComplement"
                    id="user_address_complement"
                    disabled={loading}
                    value={form?.addressComplement || ""}
                    label={t.components.address_complement}
                    placeholder={t.components.address_complement_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressComplement =
                        event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />

                  <Input
                    max={64}
                    name="addressNeighborhood"
                    id="user_address_neighborhood"
                    disabled={loading}
                    value={form?.addressNeighborhood || ""}
                    label={t.components.address_neighborhood}
                    placeholder={t.components.address_neighborhood_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressNeighborhood =
                        event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <Input
                    min={2}
                    max={64}
                    name="addressCity"
                    id="user_address_city"
                    value={form?.addressCity || ""}
                    disabled={loading}
                    label={t.components.address_city}
                    placeholder={t.components.address_city_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressCity = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />

                  <InputSelect
                    name="addressState"
                    empty={t.stacks.no_option}
                    id="user_address_state"
                    value={form?.addressState || ""}
                    disabled={loading}
                    label={t.components.address_state}
                    options={SettingsAddressState.map(function (state) {
                      return {
                        id: state.code,
                        value: state.code,
                        text: state.name,
                      };
                    })}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.addressState = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Callout
                  Icon={MapTrifold}
                  IconSize={16}
                  category="Info"
                  text={t.callout.postal_code_search}
                  styles={{ fontSize: "var(--textSmall)" }}
                />
              </Vertical>

              {position && (
                <iframe
                  loading="lazy"
                  width="25%"
                  height={320}
                  src={`https://maps.google.com/maps?q=${position.join(",")}&z=15&output=embed&maptype=satellite`}
                ></iframe>
              )}
            </Horizontal>
          </Wrapper>

          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.callout.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal
              internal={1}
              className="itemsCenter"
              styles={{ justifyContent: "space-between" }}
            >
              <Horizontal className="flex-1" styles={{ gap: "0.4rem" }}>
                <span>{t.components.total}: </span>
                <span>{Currency(total)}</span>
              </Horizontal>
              <Horizontal internal={1}>
                <Button
                  type="button"
                  category="Neutral"
                  disabled={loading}
                  text={t.components.cancel}
                  onClick={function () {
                    navigate("/f/sales");
                    return;
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  category={id ? "Info" : "Success"}
                  text={id ? t.components.edit : t.components.save}
                />
              </Horizontal>
            </Horizontal>
          </Wrapper>

          <div style={{ height: 128 }}></div>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default SalesInspect;
