import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeAccount } from "../../../types/Account";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const AccountList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaceId } = useSystem();

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
          pageCurrent: page,
          searchField: "name",
          search: searchDebounced,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) return;
      setAccounts(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      console.error("[src/pages/settings/accounts/AccountInspect.tsx]", err);
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
        <h1>{t.accounts.accounts}</h1>
      </Horizontal>
      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.accounts.new}
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
              label: t.components.copy_id,
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  const result = await Clipboard.copy(data.id as string);
                  if (result) {
                    toast.success(t.toast.success, {
                      description: t.toast.success_copy,
                    });
                    return;
                  }
                }
                toast.warning(t.toast.warning_error, {
                  description: t.toast.warning_copy,
                });
                return;
              },
            },
            {
              id: "download",
              label: t.components.download,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  Download.JSON(data, `account-${data.id}.json`);
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
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/accounts/inspect/${data.id}`);
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
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.error_delete,
                        });
                        return;
                      }
                      toast.success(t.toast.success, {
                        description: t.toast.success_delete,
                      });
                      CloseDialog();
                      await FetchAccounts();
                      return;
                    } catch (err) {
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/settings/accounts/AccountInspect.tsx]",
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
                    value={
                      data.status ? t.components.active : t.components.inactive
                    }
                  />
                );
              },
            },
            isCoorporate: {
              label: t.accounts.is_coorporate,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      data.isCoorporate
                        ? t.accounts.corporate
                        : t.accounts.personal
                    }
                  />
                );
              },
            },
            name: { label: t.accounts.name },
            holder: { label: t.accounts.holder },
            bankName: { label: t.accounts.bank_name },
            bankAgency: { label: t.accounts.bank_agency },
            bankAccount: { label: t.accounts.bank_account },
            user: {
              label: t.components.user,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Profile
                    photoCircle
                    photoSize={3}
                    padding={false}
                    styles={{ lineHeight: 1 }}
                    description={userFinded?.email || ""}
                    name={userFinded?.name || t.components.unknown}
                  />
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
