import {
  CopySimple,
  ArrowSquareIn,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//apis
import apis from "../../../apis";

// assets
import { PurchaseStagesCategory } from "../../../assets/Purchase";

// utils
import Clipboard from "../../../utils/Clipboard";
import Calculate from "../../../utils/Calculate";

// types
import {
  TypePurchase,
  TypePurchaseItem,
  TypePurchaseStage,
} from "../../../types/Purchases";
import { TypeSupplier } from "../../../types/Supplier";
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

const SuppliersPurchase = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [purchases, setPurchases] = useState<TypePurchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [supplier, setSupplier] = useState<TypeSupplier | null>(null);

  // fetch purchases
  useAsync(
    async function () {
      setLoading(true);
      try {
        const response = await apis.Purchase.list<
          ApiResponsePaginate<TypePurchase>
        >(
          token,
          instance.name,
          {
            pageSize,
            pageCurrent: 1,
            filter: JSON.stringify({ supplierId: id }),
          },
          workspaceId,
        );
        if (!response.data?.result?.items) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn(
            "[src/pages/administrative/suppliers/SuppliersPurchase.tsx]",
            response.data,
          );
          return;
        }
        setPurchases(response.data.result.items);
        return;
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error(
          "[src/pages/administrative/suppliers/SuppliersPurchase.tsx]",
          err,
        );
        return;
      } finally {
        setLoading(false);
      }
    },
    [workspaceId],
  );

  // fetch supplier
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Supplier.get<TypeSupplier>(
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
        navigate("/f/suppliers");
        return;
      }
      setSupplier(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/administrative/suppliers/SuppliersPurchase.tsx]",
        err,
      );
      navigate("/f/suppliers");
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
                id: "suppliers",
                label: t.supplier.suppliers,
                url: "/f/suppliers",
              },
              {
                id: "suppliers",
                label: supplier?.name || t.components.empty_name,
                url: `/f/suppliers/inspect${id ? `/${id}` : ""}`,
              },
              {
                id: "purchase",
                label: t.purchase.purchases,
                url: "/f/purchase",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          title={t.supplier.stats_purchase_title_quantity}
          value={purchases?.length || 0}
          Icon={ShoppingBagOpen}
          valueUnit={t.components.total}
          footer={t.supplier.stats_purchase_description_quantity}
          styles={{ display: "flex" }}
          stylesContainer={{ flex: 1 }}
        />
        <Stats
          title={t.supplier.stats_purchase_title_total}
          value={purchases?.reduce(function (acc, item) {
            const { total } = Calculate.totalPurchase(item);
            return acc + total;
          }, 0)}
          Icon={ShoppingBagOpen}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.supplier.stats_purchase_description_total}
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
              purchases?.map(function (purchase) {
                const { total } = Calculate.totalPurchase(purchase);
                return {
                  date: purchase.createdAt.slice(0, 10),
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
          selected={selected}
          options={getOptions}
          setSelected={setSelected}
          data={purchases as TableData[]}
          columns={{
            purchaseId: {
              label: t.purchase.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.purchaseId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.purchase.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.purchase?.[data.stage as keyof typeof t.purchase] ||
                      t.components.unknown
                    }
                    category={
                      PurchaseStagesCategory?.[
                        data.stage as TypePurchaseStage
                      ] || "Neutral"
                    }
                  />
                );
              },
            },
            supplierName: {
              label: t.purchase.supplier,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/suppliers/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.supplierName as string}
                  </div>
                );
              },
            },
            items: {
              label: t.purchase.items,
              handler: function (data) {
                const itemNamesFrequency = (
                  data?.items as TypePurchaseItem[]
                ).reduce(
                  function (acc, item) {
                    acc[item.itemName] =
                      (acc[item.itemName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(itemNamesFrequency)?.map(function (
                      [itemName, value],
                      index,
                    ) {
                      return (
                        <div key={`item-name-${index}`}>
                          {String(value)}x {itemName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.purchase.details,
              handler: function (data) {
                const subtotalItems = Calculate.productsOrServices(
                  (data?.items as Record<string, unknown>[]) || [],
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
                  subtotalItems,
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
                  subtotalItems,
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
                        <i style={{ opacity: 0.6 }}>
                          {t.purchase.empty_details}
                        </i>
                      )}
                    {Boolean(subtotalShipping) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.shipping}: +${Currency(subtotalShipping)}`}
                      />
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.purchase.deduction}: +${Currency(subtotalDeductions)}`}
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
                const subtotalItems = Calculate.productsOrServices(
                  (data?.items as Record<string, unknown>[]) || [],
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
                  subtotalItems,
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
                  subtotalItems,
                );

                const subtotalShipping = Number(data?.shippingCost) || 0;

                const total =
                  subtotalItems +
                  subtotalAdditions -
                  subtotalDeductions +
                  subtotalShipping;

                return <div>{Currency(total || 0)}</div>;
              },
            },
            user: {
              label: t.purchase.purchaser,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                const purchaserFinded =
                  users?.find(function (user) {
                    return user.id === data.purchaserId;
                  }) || userFinded;
                return (
                  <Tooltip
                    content={
                      t.components[purchaserFinded?.role || "collaborator"]
                    }
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={purchaserFinded?.photo || ""}
                      description={purchaserFinded?.email || ""}
                      name={purchaserFinded?.name || t.components.unknown}
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
        />

        <Pagination
          display
          pageCurrent={1}
          setPage={() => {}}
          itemsTotal={purchases.length}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default SuppliersPurchase;
