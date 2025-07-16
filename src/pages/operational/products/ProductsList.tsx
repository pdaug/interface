import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { Plus, QuestionMark } from "@phosphor-icons/react";
import { endOfDay, format, startOfDay, subMonths } from "date-fns";

//apis
import apis from "../../../apis";

// types
import { TypeProduct } from "../../../types/Product";

import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputSelect,
  InputInterval,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const ProductsList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();
  const { token, instance, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [interval, setInterval] = useState({
    start: subMonths(startOfDay(new Date()), 1),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchProducts = async function () {
    setLoading(true);
    try {
      const response = await apis.Product.list<
        ApiResponsePaginate<TypeProduct>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: page,
          searchField: "name",
          search: searchDebounced,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) return;
      setProducts(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      console.error("[src/pages/products/ProductsList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch products
  useAsync(FetchProducts, [page, searchDebounced]);

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.product.products}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.product.new}
          onClick={() => navigate("/f/products/inspect")}
        />
        <div>
          <InputSelect
            label=""
            empty=""
            value="all"
            options={[
              {
                id: "all",
                value: "all",
                text: t.components.all,
              },
              {
                id: "physical",
                value: "physical",
                text: t.product.physical,
              },
              {
                id: "digital",
                value: "digital",
                text: t.product.digital,
              },
            ]}
          />
        </div>
        <InputInterval
          label=""
          value={[
            interval.start.toISOString().slice(0, 10),
            interval.end.toISOString().slice(0, 10),
          ]}
          onChange={function (interval) {
            const [start, end] = interval;
            setInterval({
              start: new Date(start),
              end: new Date(end),
            });
            return;
          }}
        />
        <Input
          label=""
          value={search}
          placeholder={t.components.search}
          onChange={function (event) {
            setSearch(event.currentTarget?.value || "");
            return;
          }}
        />
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text={t.components.import} />
        <Button category="Neutral" text={t.components.export} />
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
          data={products as TableData[]}
          columns={{
            status: {
              label: t.components.status,
              maxWidth: "96px",
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
            name: { label: t.product.name },
            description: { label: t.components.description },
            type: {
              label: t.product.type,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      data.type === "physical"
                        ? t.product.physical
                        : t.product.digital
                    }
                  />
                );
              },
            },
            category: {
              label: t.product.category,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      data.category === "single"
                        ? t.product.single
                        : t.product.variants
                    }
                  />
                );
              },
            },
            price: {
              label: t.product.price,
              handler: function (data) {
                if (!Array.isArray(data.variants)) return "";
                return <div>{data?.variants?.[0].price || 0}</div>;
              },
            },
            createdAt: {
              label: t.components.created_at,
              handler: function (data) {
                const dateFormatted = format(
                  new Date(data.createdAt as string),
                  "dd/MM/yyyy HH:mm:ss",
                );
                return dateFormatted;
              },
            },
          }}
          selected={selected}
          setSelected={setSelected}
          options={[
            {
              id: "edit",
              label: t.components.edit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/products/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              label: t.components.delete,
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (!data || typeof data !== "object" || !("id" in data))
                  return;
                OpenDialog({
                  category: "Success",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.confirm,
                  onConfirm: async function () {
                    return;
                  },
                });
              },
            },
          ]}
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

export default ProductsList;
