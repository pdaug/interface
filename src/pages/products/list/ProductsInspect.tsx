import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// assets
import {
  ProductTypeOptions,
  ProductCategoryOptions,
} from "../../../assets/Product";

// utils
import { GenerateId } from "../../../utils/GenerateId";

// types
import {
  TypeProduct,
  TypeProductType,
  TypeProductMethod,
  TypeProductAccess,
  TypeProductLicense,
  TypeProductCategory,
  TypeProductCondition,
} from "../../../types/Product";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useSchema from "../../../hooks/useSchema";
import useDateTime from "../../../hooks/useDateTime";
import useCurrency from "../../../hooks/useCurrency";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import {
  Input,
  InputText,
  InputFile,
  InputMoney,
  InputColor,
  InputSelect,
} from "../../../components/inputs/Input";
import Card from "../../../components/cards/Card";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const ProductsInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const Currency = useCurrency();
  const navigate = useNavigate();
  const { renderByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [productTemp, setProductTemp] = useState<(File | null)[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<TypeProduct>>({
    status: true,
    name: "",
    description: "",
    type: "physical",
    category: "variant",
    variants: [
      {
        id: "",
        photo: "",
        name: "",
        price: "0.00",
      },
    ],
    propertyColor: "#fafafa",
    workspaceId,
    userId: user.id,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // fetch product
  useAsync(async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    setLoading(true);
    try {
      const response = await apis.Product.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/products");
        setLoading(false);
        return;
      }
      setForm(response.data.result);
      toast.dismiss(toastId);
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/list/ProductsInspect.tsx]", err);
      navigate("/f/products");
      setLoading(false);
      return;
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      const hash = GenerateId();
      // is editing
      if (id && form.id) {
        // upload product temp
        for (const [index, file] of productTemp.entries()) {
          if (!file) continue;
          if (!form.variants?.[index]) continue;
          const responseUploadImage = await apis.Storage.image<string>(
            instance.name,
            token,
            {
              file,
              path: `image/product/${id}-${index}`,
              name: `${id}-${index}`,
              height: 1024,
              width: 1024,
              quality: 80,
            },
          );
          const variantPhoto = responseUploadImage.data?.result;
          form.variants[index].photo = variantPhoto
            ? `${variantPhoto}&hash=${hash}`
            : null;
        }
        const response = await apis.Product.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.dismiss(toastId);
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.dismiss(toastId);
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/products");
        return;
      }
      // is creating
      const response = await apis.Product.create<TypeProduct>(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      // upload product temp
      for (const [index, file] of productTemp.entries()) {
        if (!file) continue;
        if (!form.variants?.[index]) continue;
        const responseUploadImage = await apis.Storage.image<string>(
          instance.name,
          token,
          {
            file,
            path: `image/product/${response.data.result.id}-${index}`,
            name: `${response.data.result.id}-${index}`,
            height: 1024,
            width: 1024,
            quality: 80,
          },
        );
        const variantPhoto = responseUploadImage.data?.result;
        form.variants[index].photo = variantPhoto
          ? `${variantPhoto}&hash=${hash}`
          : null;
      }
      await apis.Product.update(
        token,
        instance.name,
        response.data.result.id,
        { variants: form.variants },
        workspaceId,
      );
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/products");
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      console.error("[src/pages/products/list/ProductsInspect.tsx]", err);
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

  return renderByPlan(
    "advanced",
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
                id: "products",
                label: t.product.products,
                url: "/f/products",
              },
              {
                id: "product",
                label: form?.name || t.components.empty_name,
                url: `/f/products/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.product.title_edit : t.product.title_create}
            description={t.product.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  id="product_status"
                  empty={t.stacks.no_option}
                  value={String(form.status)}
                  label={t.components.status}
                  disabled={loading}
                  options={[
                    {
                      id: "true",
                      value: "true",
                      text: t.components.active,
                    },
                    {
                      id: "false",
                      value: "false",
                      text: t.components.inactive,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.status = event.currentTarget?.value === "true";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={1}
                  max={32}
                  required
                  name="name"
                  id="product_name"
                  value={form?.name || ""}
                  label={t.product.name}
                  disabled={loading}
                  placeholder={t.product.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="type"
                  id="product_type"
                  label={t.product.type}
                  empty={t.stacks.no_option}
                  disabled={loading}
                  value={form?.type || "physical"}
                  options={ProductTypeOptions.map(function (option) {
                    return {
                      id: option,
                      value: option,
                      text: t.product[option as keyof typeof t.product],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.type = (event.currentTarget?.value ||
                      "physical") as TypeProductType;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="category"
                  id="product_category"
                  label={t.product.category}
                  empty={t.stacks.no_option}
                  disabled={loading}
                  value={form?.category || "single"}
                  options={ProductCategoryOptions.map(function (option) {
                    return {
                      id: option,
                      value: option,
                      text: t.product[option as keyof typeof t.product],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.category = (event.currentTarget?.value ||
                      "single") as TypeProductCategory;
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
                  id="product_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  disabled={loading}
                  placeholder={t.product.description_placeholder}
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
                    id="product_created_at"
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
                    id="product_updated_at"
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
                    id="product_deleted_at"
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

          <Wrapper
            title={t.product.title_variants}
            description={t.product.subtitle_variants}
          >
            <Vertical internal={1}>
              <Horizontal
                internal={1}
                styles={{ paddingBottom: "1rem", overflowX: "scroll" }}
              >
                {form.variants?.map(function (variant, index) {
                  if (form.category === "single" && index > 0) return;
                  return (
                    <Card
                      mode="Large"
                      key={`product-variant-${index}`}
                      photo={
                        productTemp?.[index]
                          ? URL.createObjectURL(productTemp[index])
                          : form?.variants?.[index]?.photo || ""
                      }
                      photoChildren={
                        <React.Fragment>
                          {form.category === "variant" && (
                            <Button
                              type="button"
                              category="Danger"
                              disabled={loading}
                              text={t.components.remove}
                              onClick={function () {
                                if (form.variants?.length === 1) {
                                  play("alert");
                                  toast.warning(t.toast.warning_error, {
                                    description:
                                      t.product.no_delete_all_variants,
                                  });
                                  return;
                                }
                                OpenDialog({
                                  category: "Danger",
                                  title: t.dialog.title_delete,
                                  description: t.dialog.description_delete,
                                  confirmText: t.components.remove,
                                  onConfirm: function () {
                                    const newForm = { ...form };
                                    if (!newForm?.variants) return;
                                    newForm.variants.splice(index, 1);
                                    setForm(newForm);
                                    play("ok");
                                    toast.success(t.toast.success, {
                                      description: t.toast.success_delete,
                                    });
                                    CloseDialog();
                                    return;
                                  },
                                });
                              }}
                            />
                          )}
                        </React.Fragment>
                      }
                    >
                      <div>{variant?.name || "\u200B"}</div>
                      <div
                        style={{
                          color: "var(--textLight)",
                          fontSize: "var(--textSmall)",
                        }}
                      >
                        {form.name || "\u200B"}
                      </div>
                      <div style={{ fontSize: "var(--textHighlight)" }}>
                        {Currency(variant?.price || 0)}
                      </div>
                    </Card>
                  );
                })}
                {form.category === "variant" && (
                  <Vertical
                    className="itemsCenter justifyCenter"
                    styles={{
                      minWidth: 200,
                    }}
                  >
                    <Button
                      type="button"
                      category="Success"
                      disabled={loading}
                      text={t.components.add}
                      onClick={function () {
                        const newForm = { ...form };
                        if (!newForm?.variants) return;
                        newForm.variants.push({
                          id: "",
                          photo: "",
                          name: "",
                          price: "0.00",
                        });
                        setForm(newForm);
                        return;
                      }}
                    />
                  </Vertical>
                )}
              </Horizontal>

              {form.variants?.map(function (variant, index) {
                if (form.category === "single" && index > 0) return;
                return (
                  <Horizontal
                    internal={1}
                    key={variant.id}
                    styles={{ alignItems: "flex-end" }}
                  >
                    <InputFile
                      label={t.product.photo}
                      value={productTemp[index]}
                      name={`variant.${index}.photo`}
                      id={`product_variant_${index}_photo`}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                      onChange={function (event) {
                        const file = event.currentTarget.files?.[0] || null;
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          play("alert");
                          toast.error(t.toast.warning_error, {
                            description: t.stacks.limit_image_5mb,
                          });
                          return;
                        }
                        setProductTemp(function (prevState) {
                          const cloneState = [...prevState];
                          cloneState[index] = file;
                          return cloneState;
                        });
                        return;
                      }}
                    />
                    <Input
                      min={1}
                      max={32}
                      required
                      label={t.product.variant_name}
                      name={`variant.${index}.name`}
                      disabled={loading}
                      id={`product_variant_${index}_name`}
                      placeholder={t.product.variant_name_placeholder}
                      value={form?.variants?.[index].name || ""}
                      onChange={function (event) {
                        const newForm = { ...form };
                        if (!newForm?.variants?.[index]) return;
                        newForm.variants[index].name =
                          event.currentTarget?.value || "";
                        setForm(newForm);
                        return;
                      }}
                    />
                    <InputMoney
                      required
                      placeholder="0.00"
                      label={t.product.price}
                      name={`variant.${index}.price`}
                      disabled={loading}
                      id={`product_variant_${index}_price`}
                      value={form?.variants?.[index].price || "0.00"}
                      onChange={function (value) {
                        const newForm = { ...form };
                        if (!newForm?.variants?.[index]) return;
                        newForm.variants[index].price = value;
                        setForm(newForm);
                        return;
                      }}
                    />
                  </Horizontal>
                );
              })}
            </Vertical>
          </Wrapper>

          <Wrapper
            collapsible
            contentStyles={{ padding: 0 }}
            title={t.product.title_specifications}
            description={t.product.subtitle_specifications}
          >
            <Vertical internal={1} external={1}>
              <Horizontal internal={1}>
                <Input
                  max={32}
                  placeholder=""
                  name="specificAuthor"
                  id="product_specific_author"
                  label={t.product.specific_author}
                  value={form?.specificAuthor || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificAuthor = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder=""
                  name="specificPublisher"
                  id="product_specific_publisher"
                  value={form?.specificPublisher || ""}
                  label={t.product.specific_publisher}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificPublisher =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder="MP4"
                  name="specificFormat"
                  id="product_specific_format"
                  value={form?.specificFormat || ""}
                  label={t.product.specific_format}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificFormat = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  max={32}
                  placeholder="16MB"
                  name="specificSize"
                  id="product_specific_size"
                  label={t.product.specific_size}
                  value={form?.specificSize || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificSize = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder="https://"
                  name="specificUrl"
                  id="product_specific_url"
                  value={form?.specificUrl || ""}
                  label={t.product.specific_url}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificUrl = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder="1.0.0"
                  name="specificVersion"
                  id="product_specific_version"
                  value={form?.specificVersion || ""}
                  label={t.product.specific_version}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificVersion = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputSelect
                  name="specificLicense"
                  empty={t.stacks.no_option}
                  id="product_specific_license"
                  label={t.product.specific_license}
                  value={form?.specificLicense || "single_use"}
                  options={[
                    {
                      id: "lifetime",
                      value: "lifetime",
                      text: t.product.lifetime,
                    },
                    {
                      id: "subscription",
                      value: "subscription",
                      text: t.product.subscription,
                    },
                    {
                      id: "single_use",
                      value: "single_use",
                      text: t.product.single_use,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificLicense = (event.currentTarget?.value ||
                      "single_use") as TypeProductLicense;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  name="specificAccess"
                  empty={t.stacks.no_option}
                  id="product_specific_access"
                  label={t.product.specific_access}
                  value={form?.specificAccess || "download"}
                  options={[
                    {
                      id: "download",
                      value: "download",
                      text: t.product.download,
                    },
                    {
                      id: "streaming",
                      value: "streaming",
                      text: t.product.streaming,
                    },
                    {
                      id: "cloud",
                      value: "cloud",
                      text: t.product.cloud,
                    },
                    {
                      id: "external",
                      value: "external",
                      text: t.product.external,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificAccess = (event.currentTarget?.value ||
                      "download") as TypeProductAccess;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  name="specificMethod"
                  empty={t.stacks.no_option}
                  id="product_specific_method"
                  label={t.product.specific_method}
                  value={form?.specificMethod || "service"}
                  options={[
                    {
                      id: "website",
                      value: "website",
                      text: t.product.website,
                    },
                    {
                      id: "email",
                      value: "email",
                      text: t.product.email,
                    },
                    {
                      id: "service",
                      value: "service",
                      text: t.product.service,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.specificMethod = (event.currentTarget?.value ||
                      "service") as TypeProductMethod;
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
            title={t.product.title_properties}
            description={t.product.subtitle_properties}
          >
            <Vertical internal={1} external={1}>
              <Horizontal internal={1}>
                <Input
                  max={32}
                  placeholder=""
                  name="propertyBrand"
                  id="product_property_brand"
                  label={t.product.property_brand}
                  value={form?.propertyBrand || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyBrand = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder=""
                  name="propertyModel"
                  id="product_property_model"
                  label={t.product.property_model}
                  value={form?.propertyModel || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyModel = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  max={9999}
                  type="number"
                  name="propertyYear"
                  id="product_property_year"
                  label={t.product.property_year}
                  value={String(form?.propertyYear ?? "")}
                  placeholder={String(new Date().getFullYear())}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyYear = Number(event.currentTarget?.value);
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputColor
                  name="propertyColor"
                  id="product_property_color"
                  label={t.product.property_color}
                  value={form?.propertyColor || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyColor = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder=""
                  name="propertySeries"
                  id="product_property_series"
                  label={t.product.property_series}
                  value={form?.propertySeries || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertySeries = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder=""
                  name="propertyOrigin"
                  id="product_property_origin"
                  label={t.product.property_origin}
                  value={form?.propertyOrigin || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyOrigin = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  min={0}
                  max={9999}
                  type="number"
                  placeholder="12"
                  name="propertyWarranty"
                  id="product_property_warranty"
                  label={t.product.property_warranty}
                  value={String(form?.propertyWarranty ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyWarranty = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  placeholder=""
                  name="propertyMaterial"
                  id="product_property_material"
                  label={t.product.property_material}
                  value={form?.propertyMaterial || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyMaterial = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  name="propertyCondition"
                  empty={t.stacks.no_option}
                  id="product_specific_condition"
                  label={t.product.specific_condition}
                  value={form?.propertyCondition || "new"}
                  options={[
                    {
                      id: "new",
                      value: "new",
                      text: t.product.condition_new,
                    },
                    {
                      id: "used",
                      value: "used",
                      text: t.product.condition_used,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.propertyCondition = (event.currentTarget?.value ||
                      "new") as TypeProductCondition;
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
            title={t.product.title_attributes}
            description={t.product.subtitle_attributes}
          >
            <Vertical internal={1} external={1}>
              <Horizontal internal={1}>
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeLength"
                  id="product_attribute_length"
                  label={t.product.attribute_length}
                  value={String(form?.attributeLength ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeLength = parseFloat(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeHeight"
                  id="product_attribute_height"
                  label={t.product.attribute_height}
                  value={String(form?.attributeHeight ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeHeight = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeDepth"
                  id="product_attribute_depth"
                  label={t.product.attribute_depth}
                  value={String(form?.attributeDepth ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeDepth = Number(event.currentTarget?.value);
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeWeight"
                  id="product_attribute_weight"
                  label={t.product.attribute_weight}
                  value={String(form?.attributeWeight ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeWeight = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeCapacity"
                  id="product_attribute_capacity"
                  label={t.product.attribute_capacity}
                  value={String(form?.attributeCapacity ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeCapacity = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  step={0.01}
                  max={999999999}
                  type="number"
                  placeholder="0"
                  name="attributeVolume"
                  id="product_attribute_volume"
                  label={t.product.attribute_volume}
                  value={String(form?.attributeVolume ?? "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.attributeVolume = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

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
                  navigate("/f/products");
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
    </React.Fragment>,
  );
};

export default ProductsInspect;
