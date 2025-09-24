import { Tag, CopySimple, ArrowSquareIn } from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//apis
import apis from "../../../apis";

// assets
import { SaleStagesCategory } from "../../../assets/Sale";

// utils
import Clipboard from "../../../utils/Clipboard";
import Calculate from "../../../utils/Calculate";

// types
import { TypeCustomer } from "../../../types/Customers";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeSale, TypeSaleProduct, TypeSaleStage } from "../../../types/Sale";

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

const CustomersSales = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [sales, setSales] = useState<TypeSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [customer, setCustomer] = useState<TypeCustomer | null>(null);

  // fetch sales
  useAsync(
    async function () {
      setLoading(true);
      try {
        const response = await apis.Sale.list<ApiResponsePaginate<TypeSale>>(
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
            "[src/pages/administrative/customers/CustomersSales.tsx]",
            response.data,
          );
          return;
        }
        setSales(response.data.result.items);
        return;
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error(
          "[src/pages/administrative/customers/CustomersSales.tsx]",
          err,
        );
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
          navigate(`/f/sales/inspect/${data.id}`);
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
                id: "sales",
                label: t.sale.sales,
                url: "/f/sales",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          title={t.customer.stats_sale_title_quantity}
          value={sales?.length || 0}
          Icon={Tag}
          valueUnit={t.components.total}
          footer={t.customer.stats_sale_description_quantity}
          styles={{ display: "flex" }}
          stylesContainer={{ flex: 1 }}
        />
        <Stats
          title={t.customer.stats_sale_title_total}
          value={sales?.reduce(function (acc, item) {
            const { total } = Calculate.totalSale(item);
            return acc + total;
          }, 0)}
          Icon={Tag}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.customer.stats_sale_description_total}
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
              sales?.map(function (sale) {
                const { total } = Calculate.totalSale(sale);
                return {
                  date: sale.createdAt.slice(0, 10),
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
          data={sales as TableData[]}
          columns={{
            saleId: {
              label: t.sale.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.saleId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.sale.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.sale?.[data.stage as keyof typeof t.sale] ||
                      t.components.unknown
                    }
                    category={
                      SaleStagesCategory?.[data.stage as TypeSaleStage] ||
                      "Neutral"
                    }
                  />
                );
              },
            },
            customerName: {
              label: t.sale.customer,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/sales/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.customerName as string}
                  </div>
                );
              },
            },
            products: {
              label: t.sale.product_name,
              handler: function (data) {
                const productNamesFrequency = (
                  data?.products as TypeSaleProduct[]
                ).reduce(
                  function (acc, item) {
                    acc[item.productName] =
                      (acc[item.productName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(productNamesFrequency)?.map(function (
                      [productName, value],
                      index,
                    ) {
                      return (
                        <div key={`product-name-${index}`}>
                          {String(value)}x {productName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.sale.details,
              handler: function (data) {
                const subtotalProducts = Calculate.productsOrServices(
                  (data?.products as Record<string, unknown>[]) || [],
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
                  subtotalProducts,
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
                  subtotalProducts,
                );

                const subtotalShipping = Number(data?.shippingCost) || 0;

                return (
                  <Vertical
                    internal={0.4}
                    styles={{ alignItems: "flex-start" }}
                  >
                    {!subtotalAdditions &&
                      !subtotalDeductions &&
                      !subtotalShipping && (
                        <i style={{ opacity: 0.6 }}>{t.sale.empty_details}</i>
                      )}
                    {Boolean(subtotalShipping) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.shipping}: +${Currency(subtotalShipping)}`}
                      />
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.deduction}: +${Currency(subtotalDeductions)}`}
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
                const subtotalProducts = Calculate.productsOrServices(
                  (data?.products as Record<string, unknown>[]) || [],
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
                  subtotalProducts,
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
                  subtotalProducts,
                );

                const subtotalShipping = Number(data?.shippingCost) || 0;

                const total =
                  subtotalProducts +
                  subtotalAdditions -
                  subtotalDeductions +
                  subtotalShipping;

                return <div>{Currency(total || 0)}</div>;
              },
            },
            user: {
              label: t.sale.seller,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                const sellerFinded =
                  users?.find(function (user) {
                    return user.id === data.sellerId;
                  }) || userFinded;
                return (
                  <Tooltip
                    content={t.components[sellerFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={sellerFinded?.photo || ""}
                      description={sellerFinded?.email || ""}
                      name={sellerFinded?.name || t.components.unknown}
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
          selected={selected}
          setSelected={setSelected}
          options={getOptions}
        />

        <Pagination
          display
          pageCurrent={1}
          setPage={() => {}}
          itemsTotal={sales.length}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default CustomersSales;
