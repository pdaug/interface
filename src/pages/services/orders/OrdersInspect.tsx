import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { format, startOfDay } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Asterisk, ShareFat } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import Calculate from "../../../utils/Calculate";
import { GenerateNumbers } from "../../../utils/GenerateId";

// assets
import {
  OrderStages,
  OrderDetailsMode,
  OrderDetailsType,
} from "../../../assets/Order";
import { ServiceMethods } from "../../../assets/Services";

// types
import {
  TypeOrder,
  TypeOrderStage,
  TypeOrderDetails,
  TypeOrderService,
} from "../../../types/Order";
import { TypeAccount } from "../../../types/Account";
import { TypeService } from "../../../types/Service";
import { TypeSchedule } from "../../../types/Schedules";
import { TypeCustomer } from "../../../types/Customers";
import { TypeDocument } from "../../../types/Documents";
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
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Sheets from "../../../components/sheets/Sheets";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const OrdersInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const Currency = useCurrency();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<TypeService[]>([]);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [documents, setDocuments] = useState<TypeDocument[]>([]);

  const [form, setForm] = useState<Partial<TypeOrder>>({
    orderId: GenerateNumbers(6),
    stage: "draft" as TypeOrderStage,
    description: "",

    customerId: "",
    customerName: "",
    customerMobile: "",
    customerDocument: "",

    services: new Array<TypeOrderService>(),

    details: new Array<TypeOrderDetails>(),

    userId: user.id,
    accountId: "",

    createdAt: format(new Date(), "yyyy-MM-dd"),
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const subtotalServices = Calculate.productsOrServices(form?.services || []);

  const subtotalAdditions = Calculate.details(
    form?.details?.filter(function (detail) {
      return detail?.type === "tax" || detail?.type === "fee";
    }) || [],
    subtotalServices,
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
    subtotalServices,
  );

  const total = subtotalServices + subtotalAdditions - subtotalDeductions;

  // fetch order
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Order.get(
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
        navigate("/f/orders");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
      navigate("/f/orders");
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
      const customerFindedValid = response.data.result.items?.find(
        function (customer) {
          return customer.status;
        },
      );
      if (customerFindedValid)
        setForm(function (prevState) {
          const newForm = { ...prevState };
          if (!newForm?.customerId) {
            newForm.customerId = customerFindedValid.id;
            newForm.customerName = customerFindedValid.name;
            newForm.customerMobile = customerFindedValid.mobile;
            newForm.customerDocument = customerFindedValid?.document1;
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
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
      return;
    }
  }, []);

  // fetch services
  useAsync(async function () {
    try {
      const response = await apis.Service.list<
        ApiResponsePaginate<TypeService>
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
          if (newForm?.services?.length === 0) {
            newForm.services = [
              {
                serviceId: response.data.result.items[0].id,
                serviceName: response.data.result.items[0].name,
                method: response.data.result.items[0].pricingMethod,
                quantity: 1,
                price: response.data.result.items[0].pricingValue,
              },
            ];
          }
          return newForm;
        });
      setServices(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
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
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
      return;
    }
  }, []);

  // fetch documents
  useAsync(async function () {
    try {
      const response = await apis.DocumentApi.list<
        ApiResponsePaginate<TypeDocument>
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
      setDocuments(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
      return;
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    // no services
    if (!form.services || form.services?.length === 0) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.order.no_services,
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
        description: t.order.some_invalid_detail,
      });
      setLoading(false);
      return;
    }
    try {
      // is editing
      if (id) {
        const response = await apis.Order.update(
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
        navigate("/f/orders");
        return;
      }
      // is creating
      const responseOrder = await apis.Order.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!responseOrder.data?.result || responseOrder.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      // create schedule
      const bodySchedule: TypeSchedule = {
        title: `${t.order.order} ${t.components.to} ${form.customerName} ${t.components.by} ${userFinded?.name || ""}`,
        category: "task",
        priority: "none",
        description: `${t.order.id} ${form.orderId}`,
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
      navigate("/f/orders");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/services/order/OrdersInspect.tsx]", err);
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
                id: "orders",
                label: t.order.orders,
                url: "/f/orders",
              },
              {
                id: "order",
                label: loading
                  ? t.components.empty_name
                  : form?.orderId || t.components.empty_name,
                url: `/f/orders/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.order.title_edit : t.order.title_create}
            description={t.order.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="stage"
                  id="order_stage"
                  disabled={loading}
                  label={t.order.stage}
                  value={form.stage || ""}
                  empty={t.stacks.no_option}
                  options={OrderStages.map(function (stage) {
                    return {
                      id: stage,
                      value: stage,
                      text: t.order[stage as keyof typeof t.order],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.stage = (event.currentTarget?.value ||
                      "open") as TypeOrderStage;
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={12}
                  readOnly
                  name="orderId"
                  id="order_order_id"
                  label={t.order.id}
                  disabled={loading}
                  placeholder="123456"
                  value={form?.orderId || ""}
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <Input
                  type="date"
                  name="dateStart"
                  disabled={loading}
                  id="order_date_start"
                  placeholder="yyyy-MM-dd"
                  label={t.order.date_start}
                  value={form?.dateStart ? form.dateStart.slice(0, 10) : ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateStart = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <Input
                  type="date"
                  name="dateEnd"
                  id="order_date_end"
                  placeholder="yyyy-MM-dd"
                  label={t.order.date_end}
                  disabled={
                    loading ||
                    (form.stage !== "completed" && form.stage !== "canceled")
                  }
                  value={form?.dateEnd ? form.dateEnd.slice(0, 10) : ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateEnd = event.currentTarget?.value || "";
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
                  id="order_customer_id"
                  label={t.order.customer}
                  empty={t.stacks.no_option}
                  value={String(form.customerId)}
                  options={customers.map(function (customer) {
                    return {
                      id: customer.id,
                      value: customer.id,
                      text: customer.name,
                      disabled: !customer.status,
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
                  name="sellerId"
                  disabled={loading}
                  id="order_seller_id"
                  label={t.order.user}
                  empty={t.stacks.no_option}
                  value={String(form.userId)}
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
                    newForm.userId = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />

                <InputSelect
                  required
                  name="accountId"
                  disabled={loading}
                  id="order_account_id"
                  label={t.order.account}
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
                  id="order_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  placeholder={t.order.description_placeholder}
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
                    id="order_created_at"
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
                    id="order_updated_at"
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
                    id="order_deleted_at"
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
            title={t.order.services}
            empty={t.order.no_services}
            rows={form?.services || []}
            footer={
              <Badge
                category="Info"
                value={`${t.order.services}: ${Currency(subtotalServices)}`}
              />
            }
            add={function () {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.services?.push({
                  serviceId: services[0].id,
                  serviceName: services[0].name,
                  method: services[0].pricingMethod,
                  quantity: 1,
                  price: services[0].pricingValue,
                });
                return newForm;
              });
              return;
            }}
            remove={function (index) {
              setForm(function (prevState) {
                const newForm = { ...prevState };
                newForm.services?.splice(index, 1);
                return newForm;
              });
              return;
            }}
            formatter={{
              serviceId: function (index) {
                return {
                  type: "select",
                  title: t.order.service_name,
                  options: services?.map(function (service) {
                    return {
                      id: service.id,
                      value: service.id,
                      text: service.name,
                    };
                  }),
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };

                      if (!newForm?.services || !newForm.services?.[index])
                        return newForm;

                      const ServiceFind = services?.find(function (service) {
                        return service.id === (row?.serviceId as string);
                      });

                      newForm.services[index].serviceId =
                        row.serviceId as string;
                      newForm.services[index].serviceName =
                        ServiceFind?.name || "";
                      newForm.services[index].price =
                        ServiceFind?.pricingValue || "";

                      return newForm;
                    });
                    return;
                  },
                };
              },
              method: function () {
                return {
                  type: "select",
                  disabled: true,
                  title: t.order.service_name,
                  options: ServiceMethods?.map(function (method) {
                    return {
                      id: method,
                      value: method,
                      text:
                        t.service?.[method as keyof typeof t.service] ||
                        t.components.unknown,
                    };
                  }),
                  onChange: function () {
                    return;
                  },
                };
              },
              quantity: function (index) {
                return {
                  min: 1,
                  max: 9999,
                  type: "number",
                  title: t.order.quantity,
                  placeholder: t.order.quantity_placeholder,
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.services || !newForm.services?.[index])
                        return newForm;
                      row.quantity = Number(row.quantity);
                      newForm.services[index] = row as TypeOrderService;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              price: function (index) {
                return {
                  type: "money",
                  title: t.order.price,
                  placeholder: "0.00",
                  onChange: function (row) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm?.services || newForm.services?.[index])
                        return newForm;
                      newForm.services[index] = row as TypeOrderService;
                      return newForm;
                    });
                    return;
                  },
                };
              },
            }}
          />

          <Sheets
            title={t.order.details}
            empty={t.order.no_details}
            rows={form?.details || []}
            footer={
              <Horizontal internal={1}>
                <Badge
                  category="Danger"
                  value={`${t.order.addition}: +${Currency(subtotalAdditions)}`}
                />
                <Badge
                  category="Success"
                  value={`${t.order.deduction}: -${Currency(subtotalDeductions)}`}
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
                  title: t.order.details_title,
                  placeholder: t.order.details_title_placeholder,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeOrderDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              type: function (index) {
                return {
                  type: "select",
                  title: t.order.details_type,
                  options: OrderDetailsType?.map(function (type) {
                    return {
                      id: type,
                      value: type,
                      text:
                        t.order?.[type as keyof typeof t.order] ||
                        t.components.unknown,
                    };
                  }),
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeOrderDetails;
                      return newForm;
                    });
                    return;
                  },
                };
              },
              mode: function (index) {
                return {
                  type: "select",
                  title: t.order.details_mode,
                  options: OrderDetailsMode?.map(function (mode) {
                    return {
                      id: mode,
                      value: mode,
                      text:
                        t.order?.[mode as keyof typeof t.order] ||
                        t.components.unknown,
                    };
                  }),
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      newForm.details[index] = data as TypeOrderDetails;
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
                  title: t.order.details_amount,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const percent = Calculate.getPercentByAmount(
                        Number(data.amount),
                        subtotalServices,
                      );
                      newForm.details[index].percent = parseFloat(
                        percent.toFixed(6),
                      );
                      newForm.details[index] = data as TypeOrderDetails;
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
                  title: t.order.details_percent,
                  onChange: function (data) {
                    setForm(function (prevState) {
                      const newForm = { ...prevState };
                      if (!newForm.details?.[index]) return newForm;
                      const amount = Calculate.getAmountByPercent(
                        Number(data.percent),
                        subtotalServices,
                      );
                      newForm.details[index].amount = amount.toFixed(2);
                      data.percent = Number(data.percent);
                      newForm.details[index] = data as TypeOrderDetails;
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
            contentStyles={{ padding: 0 }}
            title={t.order.title_document}
            description={t.order.subtitle_document}
          >
            <Vertical internal={1} external={1} className="flex1">
              <Horizontal internal={1}>
                <Horizontal
                  internal={1}
                  className=" flex1"
                  styles={{ alignItems: "flex-end" }}
                >
                  <InputSelect
                    disabled={loading}
                    name="documentQuotation"
                    id="order_document_quotation"
                    empty={t.stacks.no_option}
                    label={t.order.document_quotation}
                    value={form?.documentQuotation || ""}
                    options={documents.map(function (documentItem) {
                      return {
                        id: documentItem.id,
                        value: documentItem.id,
                        text: documentItem.name,
                        disabled: documentItem.id === form?.documentContract,
                      };
                    })}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.documentQuotation =
                        event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Button
                    type="button"
                    Icon={ShareFat}
                    category="Neutral"
                    text={t.order.open_quotation}
                    disabled={!form?.documentQuotation || !id}
                    onClick={function () {
                      if (!id) {
                        console.error(
                          "[src/pages/services/order/OrdersInspect.tsx]",
                          "no id",
                        );
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.stacks.no_items,
                        });
                        return;
                      }
                      const url = `${window.location.origin}/share/order/${id}/document/quotation`;
                      window.open(url, "_blank");
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal
                  internal={1}
                  className=" flex1"
                  styles={{ alignItems: "flex-end" }}
                >
                  <InputSelect
                    disabled={loading}
                    name="documentContract"
                    id="order_document_contract"
                    empty={t.stacks.no_option}
                    label={t.order.document_contract}
                    value={form?.documentContract || ""}
                    options={documents.map(function (documentItem) {
                      return {
                        id: documentItem.id,
                        value: documentItem.id,
                        text: documentItem.name,
                        disabled: documentItem.id === form?.documentQuotation,
                      };
                    })}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.documentContract =
                        event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Button
                    type="button"
                    Icon={ShareFat}
                    category="Neutral"
                    text={t.order.open_contract}
                    disabled={!form?.documentContract || !id}
                    onClick={function () {
                      if (!id) {
                        console.error(
                          "[src/pages/services/order/OrdersInspect.tsx]",
                          "no id",
                        );
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.stacks.no_items,
                        });
                        return;
                      }
                      const url = `${window.location.origin}/share/order/${id}/document/contract`;
                      window.open(url, "_blank");
                      return;
                    }}
                  />
                </Horizontal>
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
                    navigate("/f/orders");
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

export default OrdersInspect;
