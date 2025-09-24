import { toast } from "sonner";
import { User } from "@phosphor-icons/react";
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// styles
import tableStyle from "../../../components/tables/Table.css?raw";

// apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";

// assets
import { UserRoles } from "../../../assets/User";
import { MaskPhone } from "../../../assets/Mask";

// types
import { TypeUserAudit } from "../../../types/User";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputMask,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Table, { TableData } from "../../../components/tables/Table";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const UsersAudit = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const pageRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [audits, setAudits] = useState<TypeUserAudit[]>([]);

  // fetch users
  const userFinded = users.find(function (user) {
    return user.id === id;
  });

  // fetch audit
  useAsync(
    async function () {
      if (!id) return;
      setLoading(true);
      try {
        const response = await apis.Audit.get<TypeUserAudit>(
          token,
          instance.name,
          workspaceId,
          id,
        );
        if (!response?.data || !response?.data?.result?.items) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_find,
          });
          console.error(
            "[src/pages/settings/users/UsersAudit.tsx]",
            response?.data?.result?.items,
          );
          return;
        }
        setAudits(response.data.result.items || []);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.toast.warning_find,
        });
        console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [id],
  );

  const DowloadAction = async function () {
    if (!audits || !audits.length) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_items,
      });
      return;
    }
    try {
      Download.JSON(audits, `audits.json`);
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_download,
      });
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_items,
      });
      console.error("[src/pages/settings/users/UsersAudit.tsx]", err);
    }
    return;
  };

  const PrintAction = async function () {
    if (!pageRef.current) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    document.body.appendChild(iframe);

    const pagePrint = iframe.contentWindow;

    if (!pagePrint) return;

    pagePrint.document.open();
    pagePrint.document.write(
      `<style>*{font-size: 9pt !important;} ${tableStyle}</style>${pageRef.current.innerHTML}`,
    );
    pagePrint.document.close();
    pagePrint.focus();
    pagePrint.print();
    pagePrint.onafterprint = () => {
      document.body.removeChild(iframe);
    };

    return;
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "users",
                label: t.user.users,
                url: "/f/users",
              },
              {
                id: "user",
                label: userFinded?.name || t.components.empty_name,
                url: `/f/users/inspect/${id || ""}`,
              },
              {
                id: "audit",
                label: t.user.audit,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <div>
        <Wrapper title={t.user.title_audit} description={t.user.subtitle_audit}>
          <Vertical internal={1}>
            <Horizontal internal={1} styles={{ alignItems: "flex-end" }}>
              <Avatar
                label=""
                size={6}
                Icon={User}
                photo={userFinded?.photo || ""}
              />

              <Input
                name="name"
                id="user_name"
                disabled={true}
                label={t.user.name}
                value={userFinded?.name || ""}
                placeholder={t.user.name_placeholder}
                onChange={function () {
                  return;
                }}
              />

              <InputSelect
                name="role"
                id="user_role"
                disabled={true}
                label={t.user.role}
                empty={t.stacks.no_option}
                value={userFinded?.role || "collaborator"}
                options={UserRoles.map(function (option) {
                  return {
                    id: option,
                    value: option,
                    text: t.components[option as keyof typeof t.components],
                    disabled: option === "master",
                  };
                })}
                onChange={function () {
                  return;
                }}
              />

              <Input
                type="email"
                name="email"
                id="user_email"
                disabled={true}
                label={t.user.email}
                value={userFinded?.email || ""}
                placeholder={t.user.email_placeholder}
                onChange={function () {
                  return;
                }}
              />

              <InputMask
                name="mobile"
                mask={MaskPhone}
                id="user_mobile"
                disabled={true}
                label={t.user.mobile}
                value={userFinded?.mobile || ""}
                placeholder={t.user.phone_placeholder}
                onChange={async function () {
                  return;
                }}
              />
            </Horizontal>

            <Table
              noSelect
              ref={pageRef}
              loading={loading}
              data={audits as unknown as TableData[]}
              columns={{
                createdAt: {
                  label: t.components.created_at,
                  maxWidth: 192,
                  handler: function (data) {
                    const datetime = instanceDateTime(data.createdAt as string);
                    return datetime;
                  },
                },
                action: {
                  label: t.user.action,
                  maxWidth: 128,
                  handler: function (data) {
                    const actionTranslated =
                      t.user?.[data.action as keyof typeof t.user];
                    return actionTranslated ? (
                      <span>{actionTranslated}</span>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_action}
                      </i>
                    );
                  },
                },
                name: {
                  label: t.user.snapshot_name,
                  handler: function (data) {
                    const snapshot =
                      data.snapshot && typeof data.snapshot === "object"
                        ? (data.snapshot as Record<string, unknown>)
                        : null;
                    const snapshotName =
                      snapshot?.name ||
                      snapshot?.title ||
                      snapshot?.saleId ||
                      snapshot?.orderId ||
                      snapshot?.purchaseId ||
                      snapshot?.id;
                    return snapshotName ? (
                      <div>{snapshotName as string}</div>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_name}
                      </i>
                    );
                  },
                },
                entity: {
                  label: t.user.entity,
                  maxWidth: 192,
                  handler: function (data) {
                    return t.menu?.[data.entity as keyof typeof t.menu] ? (
                      <div>{t.menu[data.entity as keyof typeof t.menu]}</div>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_entity}
                      </i>
                    );
                  },
                },
                workspaceId: {
                  label: t.user.workspace,
                  maxWidth: 192,
                  handler: function (data) {
                    const workspaceFinded = workspaces?.find(
                      function (workspace) {
                        return workspace.id === data.workspaceId;
                      },
                    );
                    return workspaceFinded ? (
                      <span style={{ lineHeight: 1 }}>
                        {workspaceFinded.name}
                      </span>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_workspace}
                      </i>
                    );
                  },
                },
              }}
            />

            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                disabled={loading}
                text={t.components.back}
                onClick={function () {
                  navigate(`/f/users/inspect/${id || ""}`);
                  return;
                }}
              />

              <Button
                type="button"
                category="Neutral"
                disabled={loading}
                onClick={PrintAction}
                text={t.components.print}
              />

              <Button
                type="button"
                category="Info"
                disabled={loading}
                onClick={DowloadAction}
                text={t.components.download}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>

        <div style={{ height: 128 }}></div>
      </div>
    </React.Fragment>
  );
};

export default UsersAudit;
