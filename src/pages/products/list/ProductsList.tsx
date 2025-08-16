import {
  Plus,
  Trash,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
  DotsThreeOutline,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfYear } from "date-fns";

//apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import {
  TypeInputInterval,
  TypeProductViewMode,
} from "../../../types/Components";
import { TypeProduct } from "../../../types/Product";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputSelect,
  InputInterval,
} from "../../../components/inputs/Input";
import Card from "../../../components/cards/Card";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { ProductViewModes } from "../../../assets/Components";
import Dropdown from "../../../components/dropdowns/Dropdown";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const ProductsList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [viewMode, setViewMode] = useState<TypeProductViewMode>("shelves");

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
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
          "[src/pages/products/list/ProductsList.tsx]",
          response.data,
        );
        return;
      }
      setProducts(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/list/ProductsList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch products
  useAsync(FetchProducts, [interval, workspaceId, page, searchDebounced]);

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
      id: "download",
      label: t.components.download,
      Icon: DownloadSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          Download.JSON(data, `product-${data.id}.json`);
          play("ok");
          toast.success(t.toast.success, {
            description: t.toast.success_download,
          });
        }
        return;
      },
    },
    {
      id: "edit",
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data)
          navigate(`/f/products/inspect/${data.id}`);
        return;
      },
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
        OpenDialog({
          category: "Danger",
          title: t.dialog.title_delete,
          description: t.dialog.description_delete,
          confirmText: t.components.delete,
          onConfirm: async function () {
            try {
              const response = await apis.Product.delete(
                token,
                instance.name,
                data.id as string,
                workspaceId,
              );
              if (!response.data?.result) {
                play("alert");
                toast.warning(t.toast.warning_error, {
                  description: t.toast.error_delete,
                });
                return;
              }
              play("ok");
              toast.success(t.toast.success, {
                description: t.toast.success_delete,
              });
              CloseDialog();
              await FetchProducts();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error("[src/pages/products/list/ProductList.tsx]", err);
              return;
            }
          },
        });
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
                id: "products",
                label: t.product.products,
                url: "/f/products",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.product.new}
          onClick={() => navigate("/f/products/inspect")}
        />
        <div style={{ maxWidth: 128 }}>
          <InputSelect
            label=""
            value={viewMode}
            empty={t.stacks.no_option}
            options={ProductViewModes.map(function (viewMode) {
              return {
                id: viewMode,
                value: viewMode,
                text: t.components[viewMode as keyof typeof t.components],
              };
            })}
            onChange={function (event) {
              const newViewMode = (event.currentTarget?.value ||
                "table") as TypeProductViewMode;
              setViewMode(newViewMode);
              return;
            }}
          />
        </div>
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
        <Button
          category="Neutral"
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = products.filter(function (product) {
              return selected.includes(product.id);
            });
            Download.JSON(data, `products.json`);
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
        {viewMode === "shelves" && (
          <Horizontal internal={1} styles={{ flexWrap: "wrap" }}>
            {products.length ? (
              products.map(function (product) {
                const userFinded = users?.find(function (user) {
                  return user.id === product.userId;
                });
                return (
                  <Card
                    mode="Large"
                    key={product.id}
                    photo={product?.variants?.[0]?.photo || ""}
                    photoChildren={
                      <React.Fragment>
                        <Badge
                          key="badge-product-status"
                          category={product.status ? "Success" : "Danger"}
                          value={
                            product.status
                              ? t.components.active
                              : t.components.inactive
                          }
                        />
                        <Badge
                          category="Info"
                          value={
                            product.type === "physical"
                              ? t.product.physical
                              : t.product.digital
                          }
                        />
                        <Badge
                          category="Info"
                          value={
                            product.category === "single"
                              ? t.product.single
                              : t.product.variants
                          }
                        />
                      </React.Fragment>
                    }
                    footer={
                      <React.Fragment>
                        <Profile
                          photoCircle
                          padding={false}
                          photoSize={3}
                          photo={userFinded?.photo || ""}
                          styles={{ flex: 1, fontSize: "var(--textSmall)" }}
                          name={userFinded?.name || t.components.unknown}
                        />
                        <Dropdown values={getOptions} data={product}>
                          <div style={{ cursor: "pointer" }}>
                            <DotsThreeOutline weight="fill" />
                          </div>
                        </Dropdown>
                      </React.Fragment>
                    }
                    onDoubleClick={function () {
                      navigate(`/f/products/inspect/${product.id}`);
                      return;
                    }}
                  >
                    <div>{product.name}</div>
                    <div
                      style={{
                        color: "var(--textLight)",
                        fontSize: "var(--textSmall)",
                      }}
                    >
                      {product?.variants?.[0].name}
                    </div>
                    <div style={{ fontSize: "var(--textHighlight)" }}>
                      {Currency(product?.variants?.[0].price || 0)}
                    </div>
                  </Card>
                );
              })
            ) : (
              <Wrapper>
                <Horizontal className="justifyCenter">
                  <i
                    style={{
                      color: "var(--textLight)",
                      fontSize: "var(--textSmall)",
                    }}
                  >
                    {loading ? `${t.components.loading}...` : t.stacks.no_items}
                  </i>
                </Horizontal>
              </Wrapper>
            )}
          </Horizontal>
        )}

        {viewMode === "table" && (
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
                      value={String(data.status)}
                      options={[
                        {
                          id: "true",
                          value: "true",
                          label: t.components.active,
                        },
                        {
                          id: "false",
                          value: "false",
                          label: t.components.inactive,
                        },
                      ]}
                      onChange={async function (event) {
                        try {
                          const response = await apis.Product.update(
                            token,
                            instance.name,
                            data.id,
                            {
                              status: event.currentTarget?.value === "true",
                            },
                            workspaceId,
                          );
                          if (
                            !response.data?.result ||
                            response.status !== 200
                          ) {
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
                          await FetchProducts();
                        } catch (err) {
                          play("alert");
                          toast.error(t.toast.warning_error, {
                            description: t.toast.error_edit,
                          });
                          console.error(
                            "[src/pages/products/list/ProductsList.tsx]",
                            err,
                          );
                        }
                        return;
                      }}
                    />
                  );
                },
              },
              type: {
                label: t.product.type,
                maxWidth: "96px",
                handler: function (data) {
                  return (
                    <Badge
                      category="Info"
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
                maxWidth: "96px",
                handler: function (data) {
                  return (
                    <Badge
                      category="Info"
                      value={
                        data.category === "single"
                          ? t.product.single
                          : t.product.variants
                      }
                    />
                  );
                },
              },
              name: {
                label: t.product.name,
                handler: function (data) {
                  return (
                    <div
                      className="cursor"
                      onClick={function () {
                        navigate(`/f/products/inspect/${data.id}`);
                        return;
                      }}
                    >
                      {data?.name as string}
                    </div>
                  );
                },
              },
              description: {
                label: t.components.description,
                handler: function (data) {
                  if (data.description) return data.description as string;
                  return (
                    <i style={{ color: "var(--textLight)" }}>
                      {t.stacks.no_description}
                    </i>
                  );
                },
              },
              price: {
                label: t.product.price,
                maxWidth: "128px",
                handler: function (data) {
                  if (!Array.isArray(data.variants)) return "";
                  return <div>{Currency(data?.variants?.[0].price || 0)}</div>;
                },
              },
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
            selected={selected}
            setSelected={setSelected}
            options={getOptions}
          />
        )}
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
