import {
  Trash,
  Plus,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

// apis
import apis from "../../../apis";

// assets
import { Banks } from "../../../assets/Banks";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeAccount } from "../../../types/Account";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const AccountList = function () {
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
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);

  const [searchDebounced] = useDebounce(search, 500);

  const FetchAccounts = async function () {
    setLoading(true);
    try {
      const response = await apis.Account.list<
        ApiResponsePaginate<TypeAccount>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          searchField: "name",
          search: searchDebounced,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/settings/accounts/AccountList.tsx]",
          response.data,
        );
        return;
      }
      setAccounts(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/accounts/AccountList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch accounts
  useAsync(FetchAccounts, [page, searchDebounced, workspaceId]);

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
                id: "accounts",
                label: t.account.accounts,
                url: "/f/accounts",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.account.new}
          onClick={() => navigate("/f/accounts/inspect")}
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

      <Vertical internal={1}>
        <Table
          border
          loading={loading}
          selected={selected}
          setSelected={setSelected}
          data={accounts as TableData[]}
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
                  Download.JSON(data, `account-${data.id}.json`);
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
                  navigate(`/f/accounts/inspect/${data.id}`);
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
                      const response = await apis.Account.delete(
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
                      await FetchAccounts();
                      return;
                    } catch (err) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/settings/accounts/AccountList.tsx]",
                        err,
                      );
                      return;
                    }
                  },
                });
              },
            },
          ]}
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
                        const response = await apis.Account.update(
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
                        await FetchAccounts();
                      } catch (err) {
                        play("alert");
                        toast.error(t.toast.warning_error, {
                          description: t.toast.error_edit,
                        });
                        console.error(
                          "[src/pages/settings/accounts/AccountList.tsx]",
                          err,
                        );
                      }
                      return;
                    }}
                  />
                );
              },
            },
            isEnterprise: {
              label: t.account.is_enterprise,
              maxWidth: "128px",
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      data.isEnterprise
                        ? t.account.enterprise
                        : t.account.personal
                    }
                  />
                );
              },
            },
            name: {
              label: t.account.name,
              handler: function (data) {
                const bankFinded = Banks.find(function (bank) {
                  return bank.code === data.bankCode;
                });
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/accounts/inspect/${data.id}`);
                      return;
                    }}
                  >
                    <Profile
                      photoSize={4}
                      padding={false}
                      name={data.name as string}
                      photo={bankFinded?.image ?? undefined}
                      description={
                        (data.holderName as string) ||
                        (data?.holder as string) ||
                        ""
                      }
                    />
                  </div>
                );
              },
            },
            bankName: { label: t.account.bank_name },
            bankAgency: {
              label: t.account.bank_agency,
              handler: function (data) {
                return data?.bankAgency ? (
                  <span>{data.bankAgency as string}</span>
                ) : (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.account.no_bank_agency}
                  </i>
                );
              },
            },
            bankAccount: {
              label: t.account.bank_account,
              handler: function (data) {
                return data?.bankAccount ? (
                  <span>{data.bankAccount as string}</span>
                ) : (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.account.no_bank_account}
                  </i>
                );
              },
            },
            user: {
              label: t.account.user,
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

export default AccountList;
