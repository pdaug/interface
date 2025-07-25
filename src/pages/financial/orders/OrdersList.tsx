import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfYear } from "date-fns";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";

// types
import { TypeOrder } from "../../../types/Order";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputInterval } from "../../../components/inputs/Input";

const pageSize = 10;

const OrdersList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();
  const { instanceDateTime } = useDateTime();
  const { token, instance, users, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [orders, setOrders] = useState<TypeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selected, setSelected] = useState<string[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchOrders = async function () {
    setLoading(true);
    try {
      const response = await apis.Order.list<ApiResponsePaginate<TypeOrder>>(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: page,
          searchField: "name",
          search: searchDebounced,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/financial/orders/OrdersList.tsx]",
          response.data,
        );
        return;
      }
      setOrders(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/financial/orders/OrdersList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch orders
  useAsync(FetchOrders, [interval, workspaceId, page, searchDebounced]);

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
            ]}
          />
        </h2>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.order.new}
          onClick={() => navigate("/f/orders/inspect")}
        />
        <div style={{ minWidth: 200, maxWidth: 256 }}>
          <InputInterval
            label=""
            value={[interval.start, interval.end]}
            onChange={function (interval) {
              const [start, end] = interval;
              setInterval({
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
              });
              return;
            }}
          />
        </div>
        <Input
          label=""
          value={search}
          placeholder={t.components.search}
          onChange={function (event) {
            setSearch(event.currentTarget?.value || "");
            return;
          }}
        />
        {/* <Button category="Neutral" text={t.components.import} /> */}
        <Button
          category="Neutral"
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = orders.filter(function (order) {
              return selected.includes(order.id);
            });
            Download.JSON(data, `orders.json`);
            play("ok");
            toast.success(t.toast.success, {
              description: t.toast.success_download,
            });
            return;
          }}
        />
        <Tooltip content={t.components.help}>
          <Button
            text=""
            onlyIcon
            category="Neutral"
            Icon={QuestionMark}
            onClick={function () {
              OpenDialog({
                width: 700,
                category: "Success",
                title: t.components.help,
                cancelText: t.components.close,
                description: (
                  <iframe
                    height={400}
                    style={{ border: "none", width: "100%" }}
                    src="https://www.youtube.com/embed/L-yA7-puosA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                ),
              });
              return;
            }}
          />
        </Tooltip>
      </Horizontal>
      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          loading={loading}
          data={orders as TableData[]}
          columns={{
            status: {
              label: t.components.status,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={
                      data.status ? t.components.active : t.components.inactive
                    }
                  />
                );
              },
            },
            originName: { label: t.order.origin_name },
            priceMethod: { label: t.order.price_method },
            priceTotal: { label: t.order.price_total },
            dateOverdue: {
              label: t.order.date_overdue,
              handler: function (data) {
                const dateFormatted = new Date(
                  String(data.dateOverdue),
                ).toLocaleString();
                return dateFormatted;
              },
            },
            datePayment: {
              label: t.order.date_payment,
              handler: function (data) {
                const dateFormatted = data.datePayment
                  ? new Date(String(data.datePayment)).toLocaleString()
                  : "no data";
                return dateFormatted;
              },
            },
            destinationName: { label: t.order.destination_name },
            user: {
              label: t.components.user,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
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
          selected={selected}
          setSelected={setSelected}
          options={[]}
        />
        <Pagination
          display
          pageCurrent={page}
          setPage={setPage}
          itemsTotal={total}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default OrdersList;
