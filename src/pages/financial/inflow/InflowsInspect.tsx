import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { addMonths, format } from "date-fns";
import { Asterisk, Receipt } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import {
  TypeFlow,
  TypeFlowStages,
  TypeFlowEntities,
  TypeFlowPaymentMethod,
} from "../../../types/Flow";
import { TypeSale } from "../../../types/Sale";
import { TypeAccount } from "../../../types/Account";
import { ApiResponsePaginate } from "../../../types/Api";

// assets
import {
  FlowStagesOptions,
  FlowEntitiesOptions,
  FlowPaymentMethodsOptions,
} from "../../../assets/Flow";

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
  InputSelectOptions,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Sheets from "../../../components/sheets/Sheets";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Calculate from "../../../utils/Calculate";
import { TypePurchase } from "../../../types/Purchases";
import { TypeOrder } from "../../../types/Order";
import {
  TypeVehicleMaintenance,
  TypeVehicleRefuel,
} from "../../../types/Vehicle";

const InflowsInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);
  const [entities, setEntities] = useState<InputSelectOptions[]>([]);
  const [form, setForm] = useState<Partial<TypeFlow>>({
    id: "",
    name: "",
    description: "",
    type: "inflow",
    stage: "draft",
    entityId: "",
    entityName: "manual",
    paymentValue: "0.00",
    paymentTimes: 0,
    paymentInstallments: 0,
    paymentMethod: "cash",
    paymentDate: "",
    paymentExpires: null,
    recurringId: null,
    userId: user.id,
    workspaceId: "",
    accountId: "",
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const enableDatePayment = form.stage !== "draft" && form.stage !== "pending";

  const enableInstallments =
    form.paymentMethod === "boleto" ||
    form.paymentMethod === "credit_card" ||
    form.paymentMethod === "e_wallet" ||
    form.paymentMethod === "cheque";

  const installments = Array.from(
    { length: form.paymentInstallments || 0 },
    function (_, index) {
      const currentIndex = index + 1;
      const installmentValue =
        parseFloat(form.paymentValue || "0.00") /
        (form.paymentInstallments || 1);
      const paymentDate = format(
        addMonths(new Date(form.paymentDate || Date.now()), currentIndex),
        "yyyy-MM-dd",
      );
      const paymentExpires = format(
        addMonths(new Date(form.paymentExpires || Date.now()), currentIndex),
        "yyyy-MM-dd",
      );
      return {
        value: installmentValue.toFixed(2),
        payed:
          form.paymentTimes && form.paymentTimes > currentIndex
            ? "paid"
            : "pending",
        installment: currentIndex,
        paymentDate: paymentDate,
        paymentExpires: paymentExpires,
      };
    },
  );

  // fetch inflow
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Flow.get<TypeFlow>(
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
        navigate("/f/inflows");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/financial/inflow/InflowsInspect.tsx]", err);
      navigate("/f/inflows");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch accounts
  useAsync(async function () {
    try {
      setLoading(true);
      const response = await apis.Account.list<
        ApiResponsePaginate<TypeAccount>
      >(token, instance.name, {
        pageSize: 999,
        pageCurrent: 1,
        orderField: "createdAt",
        orderSort: "asc",
      });
      if (!response || !response.data) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/financial/inflow/InflowsInspect.tsx]",
          response,
        );
        setLoading(false);
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
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/financial/inflow/InflowsInspect.tsx]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch entities
  useAsync(
    async function () {
      try {
        if (!form.entityName || form.entityName === "manual") {
          setEntities([]);
          return;
        }

        setLoading(true);

        if (form.entityName === "sales") {
          const response = await apis.Sale.list<ApiResponsePaginate<TypeSale>>(
            token,
            instance.name,
            {
              pageSize: 999,
              pageCurrent: 1,
            },
            workspaceId,
          );
          if (!response.data?.result || response.status !== 200) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            console.warn(
              "[src/pages/financial/inflow/InflowsInspect.tsx]",
              response.data,
            );
            return;
          }
          const options = response.data.result.items.map(function (item) {
            const { total } = Calculate.totalSale(item as TypeSale);
            const sellerFinded = users?.find(function (user) {
              return user.id === item.sellerId;
            });
            return {
              id: item.id,
              value: item.id,
              text: `${item.saleId} - ${Currency(total)} - ${t.sale.sale} ${t.components.to} ${item.customerName} ${t.components.by} ${sellerFinded?.name || t.components.unknown}`,
            };
          });
          setEntities(options);
        }

        if (form.entityName === "purchases") {
          const response = await apis.Purchase.list<
            ApiResponsePaginate<TypePurchase>
          >(
            token,
            instance.name,
            {
              pageSize: 999,
              pageCurrent: 1,
            },
            workspaceId,
          );
          if (!response.data?.result || response.status !== 200) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            console.warn(
              "[src/pages/financial/inflow/InflowsInspect.tsx]",
              response.data,
            );
            return;
          }
          const options = response.data.result.items.map(function (item) {
            return {
              id: item.id,
              value: item.id,
              text: item.purchaseId,
            };
          });
          setEntities(options);
        }

        if (form.entityName === "orders") {
          const response = await apis.Order.list<
            ApiResponsePaginate<TypeOrder>
          >(
            token,
            instance.name,
            {
              pageSize: 999,
              pageCurrent: 1,
            },
            workspaceId,
          );
          if (!response.data?.result || response.status !== 200) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            console.warn(
              "[src/pages/financial/inflow/InflowsInspect.tsx]",
              response.data,
            );
            return;
          }
          const options = response.data.result.items.map(function (item) {
            return {
              id: item.id,
              value: item.id,
              text: item.orderId,
            };
          });
          setEntities(options);
        }

        if (form.entityName === "vehicle_maitenances") {
          const response = await apis.VehicleMaintenance.list<
            ApiResponsePaginate<TypeVehicleMaintenance>
          >(
            token,
            instance.name,
            {
              pageSize: 999,
              pageCurrent: 1,
            },
            workspaceId,
          );
          if (!response.data?.result || response.status !== 200) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            console.warn(
              "[src/pages/financial/inflow/InflowsInspect.tsx]",
              response.data,
            );
            return;
          }
          const options = response.data.result.items.map(function (item) {
            return {
              id: item.id,
              value: item.id,
              text: item.name,
            };
          });
          setEntities(options);
        }

        if (form.entityName === "vehicle_refuels") {
          const response = await apis.VehicleRefuel.list<
            ApiResponsePaginate<TypeVehicleRefuel>
          >(
            token,
            instance.name,
            {
              pageSize: 999,
              pageCurrent: 1,
            },
            workspaceId,
          );
          if (!response.data?.result || response.status !== 200) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            console.warn(
              "[src/pages/financial/inflow/InflowsInspect.tsx]",
              response.data,
            );
            return;
          }
          const options = response.data.result.items.map(function (item) {
            return {
              id: item.id,
              value: item.id,
              text: item.gasStation,
            };
          });
          setEntities(options);
        }
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/financial/inflow/InflowsInspect.tsx]", err);
      } finally {
        setLoading(false);
      }
    },
    [form.entityName, workspaceId],
  );

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // check is payment times is greater than payment installments

    // check is paid must be payment date

    // check entity name is different manual and no has entity id

    // check payment method is credit nature and has not installments

    // check has installment but no has payment times

    // check date payment is greater than date expires

    // check date now is greater than date payment and stage is not overdued

    try {
      // is editing
      if (id) {
        const response = await apis.Flow.update<TypeFlow>(
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
        navigate("/f/inflows");
        return;
      }
      // is creating
      const response = await apis.Flow.create<TypeFlow>(
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
      navigate("/f/inflows");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/financial/inflow/InflowsInspect.tsx]", err);
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
                id: "inflows",
                label: t.inflow.inflows,
                url: "/f/inflows",
              },
              {
                id: "inflow",
                label: form?.name || t.components.empty_name,
                url: `/f/inflows/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.inflow.title_edit : t.inflow.title_create}
            description={t.inflow.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="stage"
                  disabled={loading}
                  id="inflow_stage"
                  empty={t.stacks.no_option}
                  value={String(form.stage)}
                  label={t.components.status}
                  options={FlowStagesOptions.map(function (stage) {
                    return {
                      id: stage,
                      value: stage,
                      text: t.inflow[stage as keyof typeof t.inflow],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.stage = event.currentTarget
                      ?.value as TypeFlowStages;
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={64}
                  required
                  name="name"
                  id="inflow_name"
                  disabled={loading}
                  label={t.inflow.name}
                  value={form?.name || ""}
                  placeholder={t.inflow.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputMoney
                  required
                  disabled={loading}
                  placeholder="0.00"
                  name="paymentValue"
                  id="inflow_payment_value"
                  helper={
                    form.paymentValue && parseFloat(form.paymentValue) <= 0
                      ? t.stacks.invalid_value
                      : ""
                  }
                  label={t.inflow.payment_value}
                  value={form?.paymentValue || "0.00"}
                  onChange={function (value) {
                    const newForm = { ...form };
                    newForm.paymentValue = value;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  disabled={loading}
                  name="paymentMethod"
                  id="inflow_payment_method"
                  empty={t.stacks.no_option}
                  label={t.inflow.payment_method}
                  value={form?.paymentMethod || "cash"}
                  options={FlowPaymentMethodsOptions.map(function (method) {
                    return {
                      id: method,
                      value: method,
                      text: t.inflow[method as keyof typeof t.inflow],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    const newPaymentMethod = (event.currentTarget?.value ||
                      "cash") as TypeFlowPaymentMethod;
                    if (
                      newPaymentMethod === "credit_card" ||
                      newPaymentMethod === "boleto" ||
                      newPaymentMethod === "cheque" ||
                      newPaymentMethod === "e_wallet"
                    ) {
                      newForm.paymentTimes = 1;
                      newForm.paymentInstallments = 1;
                    }
                    newForm.paymentMethod = newPaymentMethod;
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  type="date"
                  name="paymentDate"
                  id="inflow_payment_date"
                  placeholder="dd/MM/yyyy"
                  label={t.inflow.payment_date}
                  value={form?.paymentDate || ""}
                  disabled={loading || !enableDatePayment}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.paymentDate = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  type="date"
                  disabled={loading}
                  name="paymentExpires"
                  id="inflow_payment_expires"
                  placeholder="dd/MM/yyyy"
                  label={t.inflow.payment_expires}
                  value={form?.paymentExpires || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.paymentExpires = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="accountId"
                  disabled={loading}
                  id="inflow_account_id"
                  empty={t.stacks.no_option}
                  label={t.account.account}
                  value={form?.accountId || ""}
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
                <Input
                  min={0}
                  max={9999}
                  type="number"
                  placeholder="0"
                  name="paymentTimes"
                  id="inflow_payment_times"
                  label={t.inflow.payment_times}
                  helper={
                    form.paymentTimes &&
                    form.paymentInstallments &&
                    form.paymentTimes > form.paymentInstallments
                      ? t.stacks.invalid_installments_times
                      : ""
                  }
                  value={String(form?.paymentTimes || "")}
                  disabled={loading || !enableInstallments}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.paymentTimes = Number(event.currentTarget?.value);
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={0}
                  max={9999}
                  type="number"
                  placeholder="0"
                  name="paymentInstallments"
                  id="inflow_payment_installments"
                  label={t.inflow.payment_installments}
                  disabled={loading || !enableInstallments}
                  value={String(form?.paymentInstallments || "")}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.paymentInstallments = Number(
                      event.currentTarget?.value,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputText
                  max={256}
                  height={4}
                  name="description"
                  disabled={loading}
                  id="inflow_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  placeholder={t.inflow.description_placeholder}
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
                    id="service_created_at"
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
                    id="service_updated_at"
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
                    id="service_deleted_at"
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

              <Callout
                Icon={Receipt}
                IconSize={16}
                category="Info"
                text={
                  <Vertical internal={0.4}>
                    <div>{t.callout.flow_installments_enable}</div>
                    <div>{t.callout.flow_date_payment_enable}</div>
                  </Vertical>
                }
                styles={{ fontSize: "var(--textSmall)" }}
              />
            </Vertical>
          </Wrapper>
          {installments.length > 0 && (
            <Sheets
              rows={installments || []}
              empty={t.inflow.no_installments}
              title={t.inflow.title_installments}
              footer={
                <Horizontal internal={1}>
                  <Badge
                    category="Info"
                    value={`${t.inflow.installments}: ${installments.length}x ${t.components.of} ${Currency(installments?.[0]?.value || "0.00")}`}
                  />
                </Horizontal>
              }
              formatter={{
                installment: function () {
                  return {
                    type: "number",
                    readOnly: true,
                    placeholder: "0",
                    title: t.inflow.installments,
                    onChange: function () {
                      return;
                    },
                  };
                },
                payed: function () {
                  return {
                    type: "select",
                    disabled: true,
                    title: t.inflow.paid,
                    options: FlowStagesOptions.map(function (stage) {
                      return {
                        id: stage,
                        value: stage,
                        text: t.inflow[stage as keyof typeof t.inflow],
                      };
                    }),
                    onChange: function () {
                      return;
                    },
                  };
                },
                value: function () {
                  return {
                    type: "money",
                    readOnly: true,
                    title: t.inflow.payment_value,
                    placeholder: "0.00",
                    onChange: function () {
                      return;
                    },
                  };
                },
                paymentDate: function () {
                  return {
                    type: "date",
                    readOnly: true,
                    placeholder: "dd/MM/yyyy",
                    title: t.inflow.payment_date,
                    onChange: function () {
                      return;
                    },
                  };
                },
                paymentExpires: function () {
                  return {
                    type: "date",
                    readOnly: true,
                    placeholder: "dd/MM/yyyy",
                    title: t.inflow.payment_expires,
                    onChange: function () {
                      return;
                    },
                  };
                },
              }}
            />
          )}

          <Wrapper
            collapsible
            title={t.inflow.title_advanced}
            description={t.inflow.subtitle_advanced}
            contentStyles={{ padding: 0 }}
          >
            <Vertical internal={1} external={1}>
              <InputSelect
                disabled={loading}
                empty={t.stacks.no_option}
                label={t.inflow.entity_name}
                value={form.entityName || "manual"}
                options={FlowEntitiesOptions.map(function (entity) {
                  return {
                    id: entity,
                    value: entity,
                    text: t.inflow[entity as keyof typeof t.inflow],
                  };
                })}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.entityName = (event.currentTarget?.value ||
                    "manual") as TypeFlowEntities;
                  setForm(newForm);
                  return;
                }}
              />
              <InputSelect
                options={entities}
                empty={t.stacks.no_option}
                label={t.inflow.entity_id}
                value={form.entityId || ""}
                disabled={loading || form.entityName === "manual"}
                helper={
                  form.entityName === "manual"
                    ? t.stacks.no_entity_selected
                    : ""
                }
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.entityId = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Vertical>
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
              styles={{ justifyContent: "flex-end" }}
            >
              <Badge
                category="Success"
                value={`${t.inflow.payment_value}: ${Currency(form.paymentValue || "0.00")}`}
                styles={{ fontSize: "var(--textHighlight)" }}
              />
              <div className="flex1"></div>
              <Button
                type="button"
                category="Neutral"
                disabled={loading}
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/inflows");
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

export default InflowsInspect;
