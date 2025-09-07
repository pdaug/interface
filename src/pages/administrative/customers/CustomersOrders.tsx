import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CopySimple,
  ArrowSquareIn,
  Receipt,
  MoneyWavy,
} from "@phosphor-icons/react";

//apis
import apis from "../../../apis";

import { OrderStagesCategory } from "../../../assets/Order";

// utils
import Clipboard from "../../../utils/Clipboard";
import Calculate from "../../../utils/Calculate";

// types
import {
  TypeOrder,
  TypeOrderStage,
  TypeOrderService,
} from "../../../types/Order";
import { TypeCustomer } from "../../../types/Customers";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Stats from "../../../components/stats/Stats";
import Badge from "../../../components/badges/Badge";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { ChartData, ChartLine } from "../../../components/charts/Chart";

const pageSize = 999;

const CustomersOrders = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [orders, setOrders] = useState<TypeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customer, setCustomer] = useState<TypeCustomer | null>(null);

  // fetch orders
  useAsync(
    async function () {
      setLoading(true);
      try {
        const response = await apis.Order.list<ApiResponsePaginate<TypeOrder>>(
          token,
          instance.name,
          {
            pageSize,
            pageCurrent: 1,
            filter: JSON.stringify({ customerId: id }),
          },
          workspaceId,
        );
        if (!response.data?.result?.items) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn(
            "[src/pages/products/order/OrdersList.tsx]",
            response.data,
          );
          return;
        }
        setOrders(response.data.result.items);
        return;
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/products/order/OrdersList.tsx]", err);
        return;
      } finally {
        setLoading(false);
      }
    },
    [workspaceId],
  );

  // fetch customer
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Customer.get<TypeCustomer>(
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
        navigate("/f/customers");
        return;
      }
      setCustomer(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/administrative/customers/CustomersSales.tsx]",
        err,
      );
      navigate("/f/customers");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOptions = [
    {
      id: "copy",
      label: t.components.copy_id,
      Icon: CopySimple,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          const result = await Clipboard.copy(data.id as string);
          if (result) {
            play("ok");
            toast.success(t.toast.success, {
              description: t.toast.success_copy,
            });
            return;
          }
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_copy,
        });
        return;
      },
    },
    {
      id: "open",
      label: t.components.open,
      Icon: ArrowSquareIn,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data)
          navigate(`/f/orders/inspect/${data.id}`);
        return;
      },
    },
  ];

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
                id: "customers",
                label: t.customer.customers,
                url: "/f/customers",
              },
              {
                id: "customer",
                label: customer?.name || t.components.empty_name,
                url: `/f/customers/inspect${id ? `/${id}` : ""}`,
              },
              {
                id: "orders",
                label: t.order.orders,
                url: "/f/orders",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          title={t.customer.stats_order_title_quantity}
          value={orders?.length || 0}
          Icon={Receipt}
          valueUnit={t.components.total}
          footer={t.customer.stats_order_description_quantity}
          styles={{ display: "flex" }}
          stylesContainer={{ flex: 1 }}
        />
        <Stats
          title={t.customer.stats_order_title_total}
          value={orders?.reduce(function (acc, item) {
            const { total } = Calculate.totalOrder(item);
            return acc + total;
          }, 0)}
          Icon={MoneyWavy}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.customer.stats_order_description_total}
          styles={{ display: "flex" }}
          stylesContainer={{ flex: 1 }}
        />
        <Wrapper>
          <ChartLine
            height={96}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true,
            }}
            lines={[
              {
                type: "monotone",
                dataKey: "value",
                stroke: "#22c55e",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
              },
            ]}
            axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
              tick: { fontSize: 10, fill: "#222" },
              interval: 0,
              padding: { left: 15, right: 15 },
            }}
            axisYProps={{
              tick: { fontSize: 10, fill: "#222" },
              stroke: "",
              strokeWidth: 0,
              width: 24,
            }}
            data={
              orders?.map(function (order) {
                const { total } = Calculate.totalOrder(order);
                return {
                  date: order.createdAt.slice(0, 10),
                  value: total,
                };
              }) as unknown as ChartData[]
            }
          />
        </Wrapper>
      </Horizontal>

      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          loading={loading}
          data={orders as TableData[]}
          columns={{
            orderId: {
              label: t.order.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.orderId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.order.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.order?.[data.stage as keyof typeof t.order] ||
                      t.components.unknown
                    }
                    category={
                      OrderStagesCategory?.[data.stage as TypeOrderStage] ||
                      "Neutral"
                    }
                  />
                );
              },
            },
            customerName: {
              label: t.order.customer,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/orders/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.customerName as string}
                  </div>
                );
              },
            },
            services: {
              label: t.order.service_name,
              handler: function (data) {
                const serviceNamesFrequency = (
                  data?.services as TypeOrderService[]
                ).reduce(
                  function (acc, item) {
                    acc[item.serviceName] =
                      (acc[item.serviceName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(serviceNamesFrequency)?.map(function (
                      [serviceName, value],
                      index,
                    ) {
                      return (
                        <div key={`service-name-${index}`}>
                          {String(value)}x {serviceName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.order.details,
              handler: function (data) {
                const subtotalServices = Calculate.productsOrServices(
                  (data?.services as Record<string, unknown>[]) || [],
                );

                const subtotalAdditions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "tax" ||
                        detail?.type === "fee" ||
                        detail?.type === "shipping"
                      );
                    },
                  ) || [],
                  subtotalServices,
                );

                const subtotalDeductions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "discount" ||
                        detail?.type === "promo" ||
                        detail?.type === "coupon" ||
                        detail?.type === "voucher"
                      );
                    },
                  ) || [],
                  subtotalServices,
                );

                return (
                  <Vertical
                    internal={0.4}
                    styles={{ alignItems: "flex-start" }}
                  >
                    {!subtotalAdditions && !subtotalDeductions && (
                      <i style={{ opacity: 0.6 }}>{t.order.empty_details}</i>
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.order.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.order.deduction}: +${Currency(subtotalDeductions)}`}
                      />
                    )}
                  </Vertical>
                );
              },
            },
            total: {
              label: t.components.total,
              maxWidth: 128,
              handler: function (data) {
                const subtotalServices = Calculate.productsOrServices(
                  (data?.services as Record<string, unknown>[]) || [],
                );

                const subtotalAdditions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "tax" ||
                        detail?.type === "fee" ||
                        detail?.type === "shipping"
                      );
                    },
                  ) || [],
                  subtotalServices,
                );

                const subtotalDeductions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "discount" ||
                        detail?.type === "promo" ||
                        detail?.type === "coupon" ||
                        detail?.type === "voucher"
                      );
                    },
                  ) || [],
                  subtotalServices,
                );

                const total =
                  subtotalServices + subtotalAdditions - subtotalDeductions;

                return <div>{Currency(total || 0)}</div>;
              },
            },
            providerId: {
              label: t.order.provider,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.providerId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
            createdAt: {
              label: t.components.created_at,
              handler: function (data) {
                const datetime = instanceDateTime(data.createdAt as string);
                return datetime;
              },
            },
          }}
          options={getOptions}
        />

        <Pagination
          display
          pageCurrent={1}
          setPage={() => {}}
          itemsTotal={orders.length}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default CustomersOrders;
