import {
  Plus,
  Trash,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
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
import PhoneNumber from "../../../utils/PhoneNumber";

// types
import { TypeCustomer } from "../../../types/Customers";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputInterval } from "../../../components/inputs/Input";

const pageSize = 10;

const CustomersList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchCustomers = async function () {
    setLoading(true);
    try {
      const response = await apis.Customer.list<
        ApiResponsePaginate<TypeCustomer>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          // searchField: "name",
          // search: searchDebounced,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
          showDeleted: "true",
          filter: JSON.stringify({
            $and: [
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
              {
                $or: searchDebounced
                  ? [
                      {
                        mobile: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                      {
                        phone1: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                      {
                        email: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                      {
                        name: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                    ]
                  : undefined,
              },
            ],
          }),
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/administrative/customers/CustomersList.tsx]",
          response.data,
        );
        return;
      }
      setCustomers(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/administrative/customers/CustomersList.tsx]",
        err,
      );
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch customers
  useAsync(FetchCustomers, [interval, page, workspaceId, searchDebounced]);

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
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.customer.new}
          onClick={() => navigate("/f/customers/inspect")}
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
        <Button
          category="Neutral"
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = customers.filter(function (customer) {
              return selected.includes(customer.id);
            });
            Download.JSON(data, `customers.json`);
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
          data={customers as TableData[]}
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
                        const response = await apis.Customer.update(
                          token,
                          instance.name,
                          data.id,
                          {
                            status: event.currentTarget?.value === "true",
                          },
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
                        await FetchCustomers();
                      } catch (err) {
                        play("alert");
                        toast.error(t.toast.warning_error, {
                          description: t.toast.error_edit,
                        });
                        console.error(
                          "[src/pages/administrative/customers/CustomersList.tsx]",
                          err,
                        );
                      }
                      return;
                    }}
                  />
                );
              },
            },
            name: {
              label: t.customer.name,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/customers/inspect/${data.id}`);
                      return;
                    }}
                  >
                    <Profile
                      photoSize={4}
                      padding={false}
                      name={data.name as string}
                      photo={(data.photo as string) ?? undefined}
                      description={(data?.representativeName as string) || ""}
                    />
                  </div>
                );
              },
            },
            mobile: {
              label: t.customer.mobile,
              handler: function (data) {
                return (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`tel:${data.mobile as string}`}
                  >
                    {PhoneNumber.Internacional((data?.mobile as string) || "")}
                  </a>
                );
              },
            },
            phone: {
              label: t.customer.phone_1,
              handler: function (data) {
                return data?.phone1 ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`tel:${data.mobile as string}`}
                  >
                    {PhoneNumber.Internacional((data?.phone1 as string) || "")}
                  </a>
                ) : (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.stacks.no_phone}
                  </i>
                );
              },
            },
            email: {
              label: t.customer.email,
              handler: function (data) {
                return data.email ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`mailto:${data.email as string}`}
                  >
                    {(data?.email as string) || ""}
                  </a>
                ) : (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.stacks.no_email}
                  </i>
                );
              },
            },
            // address: {
            //   label: t.customer.address,
            //   handler: function (data) {
            //     if ("addresses" in data && Array.isArray(data.addresses))
            //       return `${data?.addresses?.[0]?.street}, ${data?.addresses?.[0]?.number}, ${data?.addresses?.[0]?.city} - ${data?.addresses?.[0]?.state}`;
            //     return (
            //       <i
            //         style={{
            //           color: "var(--textLight)",
            //           fontSize: "var(--textSmall)",
            //         }}
            //       >
            //         {t.stacks.no_address}
            //       </i>
            //     );
            //   },
            // },
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
          options={[
            {
              id: "copy",
              Icon: CopySimple,
              label: t.components.copy_id,
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
              Icon: DownloadSimple,
              label: t.components.download,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  Download.JSON(data, `customer-${data.id}.json`);
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
              Icon: PencilSimple,
              label: t.components.edit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/customers/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              Icon: Trash,
              label: t.components.delete,
              IconColor: "var(--dangerColor",
              styles: { color: "var(--dangerColor)" },
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (!data || typeof data !== "object" || !("id" in data))
                  return;
                OpenDialog({
                  category: "Danger",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.delete,
                  onConfirm: async function () {
                    try {
                      const response = await apis.Customer.delete(
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
                      await FetchCustomers();
                      return;
                    } catch (err) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/administrative/customers/CustomersList.tsx]",
                        err,
                      );
                      return;
                    }
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

export default CustomersList;
