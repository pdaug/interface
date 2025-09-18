import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { format, startOfDay } from "date-fns";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// utils
import Calculate from "../../../utils/Calculate";
import { GenerateNumbers } from "../../../utils/GenerateId";

// assets
import {
  PurchaseDetailsMode,
  PurchaseDetailsType,
  PurchaseStagesOptions,
} from "../../../assets/Purchase";

// types
import {
  TypePurchase,
  TypePurchaseDetails,
  TypePurchaseItem,
  TypePurchaseStage,
} from "../../../types/Purchases";
import { TypeProduct } from "../../../types/Product";
import { TypeAccount } from "../../../types/Account";
import { TypeSupplier } from "../../../types/Supplier";
import { TypeSchedule } from "../../../types/Schedules";
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
  InputMoney,
  InputSelect,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Sheets from "../../../components/sheets/Sheets";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const PurchasesInspect = function () {
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
  const [suppliers, setSuppliers] = useState<TypeCustomer[]>([]);

  const [form, setForm] = useState<Partial<TypePurchase>>({
    purchaseId: GenerateNumbers(6),
    stage: "draft" as TypePurchaseStage,
    description: "",

    supplierId: "",
    supplierName: "",
    supplierMobile: "",
    supplierDocument: "",

    items: [
      {
        itemId: "",
        itemName: "",
        variantId: "",
        variantName: "",
        quantity: 1,
        price: "0.00",
      },
    ],

    details: new Array<TypePurchaseDetails>(),

    shippingCost: "0.00",
    shippingDescription: "",

    userId: user.id,
    purchaserId: user.id,
    accountId: "",

    createdAt: format(new Date(), "yyyy-MM-dd"),
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const PurchaseFind = form.purchaseId
    ? users?.find(function (userLocal) {
        return form.purchaseId === userLocal.id;
      })
    : null;

  const { subtotalItems, subtotalDeductions, subtotalAdditions, total } =
    Calculate.totalPurchase(form as TypePurchase);

  // fetch purchase
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Purchase.get(
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
        navigate("/f/purchases");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/purchases/PurchasesInspect.tsx]", err);
      navigate("/f/purchases");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch suppliers
  useAsync(async function () {
    try {
      const response = await apis.Supplier.list<
        ApiResponsePaginate<TypeSupplier>
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
      const supplierFindedValid = response.data.result.items?.find(
        function (supplier) {
          return supplier.status;
        },
      );
      if (supplierFindedValid)
        setForm(function (prevState) {
          const newForm = { ...prevState };
          if (!newForm?.supplierId) {
            newForm.supplierId = supplierFindedValid.id;
            newForm.supplierName = supplierFindedValid.name;
            newForm.supplierMobile = supplierFindedValid.mobile;
            newForm.supplierDocument = supplierFindedValid?.document1;
          }
          return newForm;
        });
      setSuppliers(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/purchases/PurchasesInspect.tsx]", err);
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
      // if (response.data.result.items?.[0])
      //   setForm(function (prevState) {
      //     const newForm = { ...prevState };
      //     if (newForm?.items?.length === 0) {
      //       newForm.items = [
      //         {
      //           itemId: response.data.result.items[0].id,
      //           itemName: response.data.result.items[0].name,
      //           variantId: response.data.result.items[0].variants[0].id,
      //           variantName: response.data.result.items[0].variants[0].name,
      //           quantity: 1,
      //           price: response.data.result.items[0].variants[0].price,
      //         },
      //       ];
      //     }
      //     return newForm;
      //   });
      setProducts(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/purchases/PurchasesInspect.tsx]", err);
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
      const accountFindedValid = response.data.result.items?.find(
        function (account) {
          return account.status;
        },
      );
      if (accountFindedValid)
        setForm(function (prevState) {
          const newForm = { ...prevState };
          if (!newForm.accountId) newForm.accountId = accountFindedValid.id;
          return newForm;
        });
      setAccounts(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/purchases/PurchasesInspect.tsx]", err);
      return;
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    // no items
    if (!form.items || form.items?.length === 0) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.purchase.no_items,
      });
      setLoading(false);
      return;
    }
    // check values details
    const hasSomeInvalidValue = form.details?.some(function (detail) {
      return detail.amount === "0.00" || detail.percent === 0;
    });
    if (hasSomeInvalidValue) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.purchase.some_invalid_detail,
      });
      setLoading(false);
      return;
    }
    try {
      // is editing
      if (id) {
        const response = await apis.Purchase.update(
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
        navigate("/f/purchases");
        return;
      }
      // is creating
      const responsePurchase = await apis.Purchase.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!responsePurchase.data?.result || responsePurchase.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      // create schedule
      const bodySchedule: TypeSchedule = {
        title: `${t.purchase.purchase} ${t.components.to} ${form.supplierName} ${t.components.by} ${PurchaseFind?.name || ""}`,
        category: "task",
        priority: "none",
        description: `${t.purchase.id} ${form.purchaseId}`,
        start: startOfDay(new Date()),
        end: new Date(),
        userId: user.id,
      };
      const responseSchedule = await apis.Schedule.create<TypeSchedule>(
        token,
        instance.name,
        bodySchedule,
        workspaceId,
      );
      if (!responseSchedule.data?.result || responseSchedule.status !== 201) {
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
      navigate("/f/purchases");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/products/purchases/PurchasesInspect.tsx]", err);
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
                id: "purchases",
                label: t.purchase.purchases,
                url: "/f/purchases",
              },
              {
                id: "purchase",
                label: loading
                  ? t.components.empty_name
                  : form?.purchaseId || t.components.empty_name,
                url: `/f/purchases/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.purchase.title_edit : t.purchase.title_create}
            description={t.purchase.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="stage"
                  id="purchase_stage"
                  disabled={loading}
                  label={t.purchase.stage}
                  value={form.stage || ""}
                  empty={t.stacks.no_option}
                  options={PurchaseStagesOptions.map(function (stage) {
                    return {
                      id: stage,
                      value: stage,
                      text: t.purchase[stage as keyof typeof t.purchase],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.stage = (event.currentTarget?.value ||
                      "draft") as TypePurchaseStage;
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={12}
                  readOnly
                  name="purchaseId"
                  id="purchase_purchase_id"
                  label={t.purchase.id}
                  disabled={loading}
                  placeholder="123456"
                  value={form?.purchaseId || ""}
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="supplierId"
                  disabled={loading}
                  id="purchase_supplier_id"
                  label={t.purchase.supplier}
                  empty={t.stacks.no_option}
                  value={String(form.supplierId)}
                  options={suppliers.map(function (supplier) {
                    return {
                      id: supplier.id,
                      value: supplier.id,
                      text: supplier.name,
                      disabled: !supplier.status,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    const supplierId = event.currentTarget?.value || "";
                    const supplierFinded = suppliers.find(function (supplier) {
                      return supplier.id === supplierId;
                    });
                    if (supplierFinded) {
                      newForm.supplierId = supplierFinded.id;
                      newForm.supplierName = supplierFinded.name;
                      newForm.supplierDocument = supplierFinded.document1;
                      newForm.supplierMobile = supplierFinded.mobile;
                      setForm(newForm);
                    }
                    return;
                  }}
                />

                <InputSelect
                  required
                  name="purchaserId"
                  disabled={loading}
                  id="purchase_purchaser_id"
                  empty={t.stacks.no_option}
                  label={t.purchase.purchaser}
                  value={String(form.purchaserId)}
                  options={users.map(function (user) {
                    return {
                      id: user.id,
                      value: user.id,
                      text: user.name,
                      disabled: !user.status,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.purchaserId = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <InputSelect
                  required
                  name="accountId"
                  disabled={loading}
                  id="purchase_account_id"
                  label={t.account.account}
                  empty={t.stacks.no_option}
                  value={form.accountId || ""}
                  options={accounts.map(function (account) {
                    return {
                      id: account.id,
                      value: account.id,
                      text: account.name,
                      disabled: !account.status,
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
                  id="purchase_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  placeholder={t.purchase.description_placeholder}
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
                    type="date"
                    name="createdAt"
                    disabled={loading}
                    id="purchase_created_at"
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
                    readOnly
                    placeholder=""
                    name="updatedAt"
                    id="purchase_updated_at"
                    label={t.components.updated_at}
                    value={
                      form?.updatedAt ? instanceDateTime(form.updatedAt) : "-"
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
            title={t.purchase.items}
            empty={t.purchase.no_items}
            rows={form?.items || []}
            footer={
              <Badge
                category="Info"
                value={`${t.purchase.items}: ${Currency(subtotalItems)}`}
              />
            }
            add={function () {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.items?.push({
                  itemId: products[0].id,
                  itemName: products[0].name,
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
                newForm.items?.splice(index, 1);
                return newForm;
              });
              return;
            }}
            formatter={{
              itemId: function (index) {
                return {
                  type: "select",
                  title: t.purchase.item_id,
                  options: [{ id: "", name: "" }, ...products]?.map(
                    function (product) {
                      return {
                        id: product.id,
                        value: product.id,
                        text: product.name || t.purchase.no_product,
                      };
                    },
                  ),
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };

                      if (!newForm?.items || !newForm.items?.[index])
                        return newForm;

                      const ProductFind = products?.find(function (product) {
                        return product.id === (row?.itemId as string);
                      });

                      newForm.items[index].itemId = row.itemId as string;
                      newForm.items[index].itemName = ProductFind?.name || "";
                      newForm.items[index].variantId =
                        ProductFind?.variants?.[0]?.id || "";
                      newForm.items[index].variantName =
                        ProductFind?.variants?.[0]?.name || "";
                      newForm.items[index].price =
                        ProductFind?.variants?.[0]?.price || "";

                      return newForm;
                    });
                    return;
                  },
                };
              },
              itemName: function (index) {
                return {
                  type: "text",
                  disabled: loading,
                  title: t.purchase.item_name,
                  placeholder: t.purchase.item_name_placeholder,
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };

                      if (!newForm?.items || !newForm.items?.[index])
                        return newForm;

                      newForm.items[index].itemId = "";
                      newForm.items[index].itemName = row?.itemName as string;

                      return newForm;
                    });
                    return;
                  },
                };
              },
              variantId: function (index) {
                const ProductFind = products?.find(function (product) {
                  return product.id === form?.items?.[index]?.itemId;
                });

                return {
                  type: "select",
                  title: t.purchase.variant_name,
                  disabled: ProductFind?.category === "single" || !ProductFind,
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

                      if (!newForm?.items || !newForm.items?.[index])
                        return newForm;

                      const VariantFind = ProductFind?.variants?.find(
                        function (variant) {
                          return variant.id === (row?.variantId as string);
                        },
                      );

                      newForm.items[index].variantId = VariantFind?.id || "";
                      newForm.items[index].variantName =
                        VariantFind?.name || "";
                      newForm.items[index].price = VariantFind?.price || "";
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
                  title: t.purchase.quantity,
                  placeholder: t.purchase.quantity_placeholder,
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.items || !newForm.items?.[index])
                        return newForm;
                      row.quantity = Number(row.quantity);
                      newForm.items[index] = row as TypePurchaseItem;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              price: function (index) {
                return {
                  type: "money",
                  title: t.purchase.price,
                  placeholder: "0.00",
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.items || newForm.items?.[index])
                        return newForm;
                      newForm.items[index] = row as TypePurchaseItem;
                      return newForm;
                    });
                    return;
                  },
                };
              },
            }}
          />

          <Sheets
            title={t.purchase.details}
            empty={t.purchase.no_details}
            rows={form?.details || []}
            footer={
              <Horizontal internal={1}>
                <Badge
                  category="Danger"
                  value={`${t.purchase.addition}: +${Currency(subtotalAdditions)}`}
                />
                <Badge
                  category="Success"
                  value={`${t.purchase.deduction}: -${Currency(subtotalDeductions)}`}
                />
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
                  title: t.purchase.details_title,
                  placeholder: t.purchase.details_title_placeholder,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypePurchaseDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              type: function (index) {
                return {
                  type: "select",
                  title: t.purchase.details_type,
                  options: PurchaseDetailsType?.map(function (type) {
                    return {
                      id: type,
                      value: type,
                      text:
                        t.purchase?.[type as keyof typeof t.purchase] ||
                        t.components.unknown,
                    };
                  }),
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypePurchaseDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              mode: function (index) {
                return {
                  type: "select",
                  title: t.purchase.details_mode,
                  options: PurchaseDetailsMode?.map(function (mode) {
                    return {
                      id: mode,
                      value: mode,
                      text:
                        t.purchase?.[mode as keyof typeof t.purchase] ||
                        t.components.unknown,
                    };
                  }),
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypePurchaseDetails;
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
                  title: t.purchase.details_amount,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const percent = Calculate.getPercentByAmount(
                        Number(data.amount),
                        subtotalItems,
                      );
                      newForm.details[index].percent = parseFloat(
                        percent.toFixed(6),
                      );
                      newForm.details[index] = data as TypePurchaseDetails;
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
                  title: t.purchase.details_percent,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const amount = Calculate.getAmountByPercent(
                        Number(data.percent),
                        subtotalItems,
                      );
                      newForm.details[index].amount = amount.toFixed(2);
                      data.percent = Number(data.percent);
                      newForm.details[index] = data as TypePurchaseDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
            }}
          />

          <Wrapper
            title={t.purchase.title_shipping}
            description={t.purchase.subtitle_shipping}
          >
            <Horizontal internal={1}>
              <InputMoney
                disabled={loading}
                placeholder="0.00"
                name="shippingCost"
                id="purchase_shipping_cost"
                label={t.purchase.shipping_cost}
                value={form?.shippingCost || "0.00"}
                onChange={function (value) {
                  const newForm = { ...form };
                  newForm.shippingCost = value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                disabled={loading}
                name="shippingDescription"
                id="purchase_shipping_description"
                label={t.purchase.shipping_description}
                value={form?.shippingDescription || ""}
                placeholder={t.purchase.shipping_description_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.shippingDescription =
                    event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
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
                <Badge
                  category="Info"
                  styles={{ fontSize: "var(--textHighlight)" }}
                  value={`${t.components.total}: ${Currency(total)}`}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Button
                  type="button"
                  category="Neutral"
                  disabled={loading}
                  text={t.components.cancel}
                  onClick={function () {
                    navigate("/f/purchase");
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

export default PurchasesInspect;
