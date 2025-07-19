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

// utils
import { GenerateIdWithLength } from "../../../utils/GenerateId";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSchema from "../../../hooks/useSchema";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputMoney,
  InputColor,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const ProductsInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeProduct>>({
    status: true,
    name: "",
    description: "",
    type: "physical",
    category: "single",
    variants: [
      {
        id: GenerateIdWithLength(24),
        name: "",
        price: 0,
      },
    ],
    propertyColor: "#fafafa",
    workspaceId,
  });

  // fetch product
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Product.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result) return;
      setForm(response.data.result);
      return;
    } catch (err) {
      console.error(
        "[src/pages/operational/products/ProductsInspect.tsx]",
        err,
      );
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function () {
    try {
      // is editing
      if (id) {
        const response = await apis.Product.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result) toast.warning(t.toast.warning_edit);
        if (response.data.state === "success") {
          toast.success(t.toast.success_edit);
          navigate("/f/products");
        }
        return;
      }
      // is creating
      const response = await apis.Product.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result) toast.warning(t.toast.warning_create);
      if (response.data.state === "success") {
        toast.success(t.toast.success_create);
        navigate("/f/products");
      }
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.result?.message === "schema_incorrect") {
          Schema(err.response.data.result.err);
          return;
        }
      }
      if (id) toast.error(t.toast.error_edit);
      else toast.error(t.toast.error_create);
      console.error(
        "[src/pages/operational/products/ProductsInspect.tsx]",
        err,
      );
      return;
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.product.product}</h1>
      </Horizontal>
      <div>
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
                  disabled={loading && Boolean(id)}
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
                  disabled={loading && Boolean(id)}
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
                  disabled={loading && Boolean(id)}
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
                  disabled={loading && Boolean(id)}
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
                  name="description"
                  id="product_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  disabled={loading && Boolean(id)}
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
              {form.variants?.map(function (variant, index) {
                return (
                  <Horizontal
                    key={variant.id}
                    internal={1}
                    styles={{ alignItems: "flex-end" }}
                  >
                    <div className="flex1">
                      <Horizontal internal={1}>
                        <Input
                          readOnly
                          placeholder=""
                          label={t.product.id}
                          name={`variant.${index}.id`}
                          id={`product_variant_${index}_id`}
                          value={form?.variants?.[index].id || ""}
                          onChange={function () {
                            return;
                          }}
                        />
                        <Input
                          min={1}
                          max={32}
                          required
                          label={t.product.variant_name}
                          name={`variant.${index}.name`}
                          disabled={loading && Boolean(id)}
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
                          disabled={loading && Boolean(id)}
                          id={`product_variant_${index}_price`}
                          value={String(form?.variants?.[index].price)}
                          onChange={function (value) {
                            const newForm = { ...form };
                            if (!newForm?.variants?.[index]) return;
                            newForm.variants[index].price = Number(value);
                            setForm(newForm);
                            return;
                          }}
                        />
                      </Horizontal>
                    </div>
                    <div>
                      <Button
                        category="Danger"
                        text={t.components.remove}
                        onClick={function () {
                          if (form.variants?.length === 1) {
                            toast.warning(t.product.no_delete_all_variants);
                            return;
                          }
                          const newForm = { ...form };
                          if (!newForm?.variants) return;
                          newForm.variants.splice(index, 1);
                          setForm(newForm);
                          return;
                        }}
                      />
                    </div>
                  </Horizontal>
                );
              })}
              <Horizontal internal={1}>
                <div>
                  <Button
                    category="Success"
                    text={t.components.add}
                    onClick={function () {
                      const newForm = { ...form };
                      if (!newForm?.variants) return;
                      newForm.variants.push({
                        id: GenerateIdWithLength(24),
                        name: "",
                        price: 0,
                      });
                      setForm(newForm);
                      return;
                    }}
                  />
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            collapsible
            title={t.product.title_specifications}
            description={t.product.subtitle_specifications}
          >
            <Vertical internal={1}>
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
            title={t.product.title_properties}
            description={t.product.subtitle_properties}
          >
            <Vertical internal={1}>
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
            title={t.product.title_attributes}
            description={t.product.subtitle_attributes}
          >
            <Vertical internal={1}>
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
            text={t.stacks.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/products");
                  return;
                }}
              />
              <Button
                onClick={onSubmit}
                category="Success"
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </div>
    </React.Fragment>
  );
};

export default ProductsInspect;
