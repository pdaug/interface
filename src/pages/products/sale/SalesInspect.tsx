import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// utils
import { GenerateNumbers } from "../../../utils/GenerateId";

// assets
import { SaleStages } from "../../../assets/Sale";
import { MaskDocument1, MaskPhone } from "../../../assets/Mask";

// types
import {
  TypeSale,
  TypeSaleStage,
  TypeSaleDetails,
  TypeSaleShippingMethod,
  TypeSaleProduct,
} from "../../../types/Sale";
import { TypeProduct } from "../../../types/Product";
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
  InputMask,
  InputSelect,
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
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);

  const [form, setForm] = useState<Partial<TypeSale>>({
    saleId: `S${GenerateNumbers(5)}`,
    stage: "open" as TypeSaleStage,
    description: "",
    customerId: "",
    customerName: "",
    customerMobile: "",
    customerDocument: "",
    products: [
      {
        productId: "",
        productName: "",
        quantity: 1,
        variantId: "",
        variantName: "",
        price: "0.00",
      },
    ],
    details: new Array<TypeSaleDetails>(),
    shippingMethod: "standard" as TypeSaleShippingMethod,
    shippingAddress: "",
    shippingCost: "0.00",
    userId: user.id,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

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
                label: form?.saleId || t.components.empty_name,
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
                  value={form?.saleId || ""}
                  placeholder="S00001"
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.saleId = event.currentTarget?.value || "";
                    setForm(newForm);
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
                  label={t.customer.name}
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
                <InputMask
                  readOnly
                  mask={MaskPhone}
                  disabled={loading}
                  name="customerMobile"
                  id="sale_customer_mobile"
                  label={t.customer.mobile}
                  value={form?.customerMobile || ""}
                  placeholder={t.customer.mobile_placeholder}
                  onChange={function () {
                    return;
                  }}
                />
                <InputMask
                  readOnly
                  disabled={loading}
                  mask={MaskDocument1}
                  name="customerDocument"
                  id="sale_customer_document"
                  label={t.customer.document_1}
                  value={form?.customerDocument || ""}
                  placeholder={t.customer.document_placeholder}
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal>
                <InputText
                  max={256}
                  height={4}
                  name="description"
                  id="sale_description"
                  disabled={loading}
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
                    name="createdAt"
                    id="sale_created_at"
                    label={t.components.created_at}
                    value={instanceDateTime(form.createdAt)}
                    onChange={function () {
                      return;
                    }}
                  />
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
            rows={form?.products || []}
            footer={
              <div>
                <span>{t.product.products}: </span>
                <span>
                  {Currency(
                    form.products?.reduce((acc, product) => {
                      const price = Number(product.price) || 0;
                      const quantity = product.quantity || 0;
                      return acc + price * quantity;
                    }, 0) || 0,
                  )}
                </span>
              </div>
            }
            add={function () {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.products?.push({
                  productId: products[0].id,
                  productName: products[0].name,
                  quantity: 1,
                  variantId: products[0].variants[0].id,
                  variantName: products[0].variants[0].name,
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
              productId: {
                type: "select",
                options: function () {
                  return products?.map(function (product) {
                    return {
                      id: product.id,
                      value: product.id,
                      text: product.name,
                    };
                  });
                },
                onChange: function (row, index) {
                  setForm(function (prevState) {
                    const newForm = { ...prevState };

                    if (!newForm?.products || !newForm.products?.[index])
                      return newForm;

                    const ProductFind = products?.find(function (product) {
                      return product.id === (row?.productId as string);
                    });

                    newForm.products[index].productId = row.productId as string;
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
              },
              variantId: {
                type: "select",
                options: function (index) {
                  const ProductFind = products?.find(function (product) {
                    return product.id === form?.products?.[index].productId;
                  });
                  return (
                    ProductFind?.variants?.map(function (variant) {
                      return {
                        id: variant.id,
                        value: variant.id,
                        text: variant.name,
                      };
                    }) || []
                  );
                },
                onChange: function (row, index) {
                  setForm(function (prevState) {
                    const newForm = { ...prevState };

                    if (!newForm?.products || !newForm.products?.[index])
                      return newForm;

                    const ProductFind = products?.find(function (product) {
                      return product.id === (row?.productId as string);
                    });

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
              },
              quantity: {
                min: 1,
                max: 9999,
                placeholder: t.sale.quantity_placeholder,
                type: "number",
                onChange: function (row, index) {
                  setForm(function (prevState) {
                    const newForm = { ...prevState };
                    if (!newForm?.products || !newForm.products?.[index])
                      return newForm;
                    newForm.products[index] = row as TypeSaleProduct;
                    return newForm;
                  });
                  return;
                },
              },
              price: {
                type: "money",
                placeholder: "0.00",
                onChange: function (row, index) {
                  setForm(function (prevState) {
                    const newForm = { ...prevState };
                    if (!newForm?.products || newForm.products?.[index])
                      return newForm;
                    newForm.products[index] = row as TypeSaleProduct;
                    return newForm;
                  });
                  return;
                },
              },
            }}
          />

          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.callout.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
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
          </Wrapper>

          <div style={{ height: 128 }}></div>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default SalesInspect;
