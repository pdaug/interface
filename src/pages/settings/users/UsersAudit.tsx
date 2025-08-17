import { toast } from "sonner";
import React, { useState } from "react";
import { ClockClockwise, DownloadSimple, User } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";

// assets
import { UserRoles } from "../../../assets/User";

// types
import { TypeUser, TypeUserAudit } from "../../../types/User";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Button from "../../../components/buttons/Button";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import Table, { TableData } from "../../../components/tables/Table";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Input, InputSelect } from "../../../components/inputs/Input";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Badge, { BadgeCategories } from "../../../components/badges/Badge";

const UsersAudit = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<Partial<TypeUser>>({});
  const [audits, setAudits] = useState<TypeUserAudit[]>([]);

  const badgeAction = {
    insert: "Success",
    update: "Info",
    delete: "Danger",
  };

  // fetch users
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.User.get(token, instance.name, id);
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/users");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      navigate("/f/users");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch audit
  useAsync(
    async function () {
      if (!id) return;
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
            "[src/pages/settings/users/UsersInspect.tsx]",
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
                id: "users",
                label: t.user.users,
                url: "/f/users",
              },
              {
                id: "audit",
                label: t.user.audit,
                url: `/f/users/audit${id ? `/${id}` : ""}`,
              },
              {
                id: "user",
                label: form?.name || t.components.empty_name,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <div>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.user.title_edit : t.user.title_create}
            description={t.user.subtitle}
          >
            <Horizontal internal={1}>
              <Avatar
                label=""
                size={14}
                Icon={User}
                photo={form?.photo || ""}
              />
              <Vertical internal={1} className="flex1">
                <Horizontal internal={1}>
                  <InputSelect
                    name="status"
                    id="user_status"
                    disabled={true}
                    empty={t.stacks.no_option}
                    value={String(form.status)}
                    label={t.components.status}
                    options={[
                      {
                        id: "true",
                        value: "true",
                        text: t.components.active,
                      },
                      {
                        id: "false",
                        value: "false",
                        text: t.components.inactive,
                      },
                    ]}
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    min={4}
                    max={32}
                    required
                    name="name"
                    id="user_name"
                    value={form?.name || ""}
                    label={t.user.name}
                    disabled={true}
                    placeholder={t.user.name_placeholder}
                    onChange={function () {
                      return;
                    }}
                  />
                  <InputSelect
                    required
                    name="role"
                    id="user_role"
                    label={t.user.role}
                    empty={t.stacks.no_option}
                    disabled={true}
                    value={form?.role || "collaborator"}
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
                </Horizontal>

                {Boolean(id) && (
                  <Horizontal internal={1}>
                    <Input
                      readOnly
                      placeholder=""
                      name="createdAt"
                      id="service_created_at"
                      label={t.components.created_at}
                      value={instanceDateTime(form.createdAt)}
                      onChange={function () {
                        return;
                      }}
                    />
                    <Input
                      readOnly
                      placeholder=""
                      name="updatedAt"
                      id="service_updated_at"
                      label={t.components.updated_at}
                      value={
                        form?.updatedAt ? instanceDateTime(form.updatedAt) : "-"
                      }
                      onChange={function () {
                        return;
                      }}
                    />
                    <Input
                      readOnly
                      placeholder=""
                      name="deletedAt"
                      id="service_deleted_at"
                      label={t.components.deletedAt}
                      value={
                        form?.deletedAt ? instanceDateTime(form.deletedAt) : "-"
                      }
                      onChange={function () {
                        return;
                      }}
                    />
                  </Horizontal>
                )}
              </Vertical>
            </Horizontal>
          </Wrapper>

          <Wrapper>
            <Table
              data={audits as unknown as TableData[]}
              columns={{
                action: {
                  label: t.user.action,
                  maxWidth: 128,
                  handler: function (data) {
                    const actionTranslated =
                      t.user?.[data.action as keyof typeof t.user];
                    return actionTranslated ? (
                      <Badge
                        value={actionTranslated}
                        category={
                          (badgeAction?.[
                            data.action as keyof typeof badgeAction
                          ] as BadgeCategories) || "Info"
                        }
                      />
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
                    const snapshotName = snapshot?.name || snapshot?.title;
                    return snapshotName ? (
                      <div>{JSON.stringify(snapshotName)}</div>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_name}
                      </i>
                    );
                  },
                },
                entity: {
                  label: t.user.entity,
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
                  handler: function (data) {
                    const workspaceFinded = workspaces?.find(
                      function (workspace) {
                        return workspace.id === data.workspaceId;
                      },
                    );
                    return workspaceFinded ? (
                      <Vertical>
                        <span style={{ lineHeight: 1 }}>
                          {workspaceFinded.name}
                        </span>
                        <span
                          style={{
                            lineHeight: 1,
                            color: "var(--textLight)",
                            fontSize: "var(--textSmall)",
                          }}
                        >
                          {workspaceFinded.description || ""}
                        </span>
                      </Vertical>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_workspace}
                      </i>
                    );
                  },
                },
                userId: {
                  label: t.user.userId,
                  handler: function (data) {
                    const userFinded = users?.find(function (user) {
                      return user.id === data.userId;
                    });
                    return (
                      <Tooltip
                        content={
                          t.components[userFinded?.role || "collaborator"]
                        }
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
              options={[
                {
                  id: "download",
                  Icon: DownloadSimple,
                  label: t.components.download,
                  onClick: function (_: React.MouseEvent, data: unknown) {
                    if (data && typeof data === "object" && "id" in data) {
                      Download.JSON(data, `audit-${data.id}.json`);
                      play("ok");
                      toast.success(t.toast.success, {
                        description: t.toast.success_download,
                      });
                    }
                    return;
                  },
                },
                {
                  id: "restore",
                  Icon: ClockClockwise,
                  label: t.components.restore,
                  styles: { color: "var(--dangerColor)" },
                  IconColor: "var(--dangerColor)",
                  onClick: async function () {
                    play("alert");
                    toast.warning(t.toast.warning_error, {
                      description: t.integration.wip,
                    });
                    return;
                  },
                },
              ]}
            />
          </Wrapper>

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                disabled={loading}
                text={t.components.close}
                onClick={function () {
                  navigate("/f/users");
                  return;
                }}
              />
              <Button
                type="button"
                category="Info"
                disabled={loading}
                onClick={DowloadAction}
                text={t.components.download}
              />
            </Horizontal>
          </Wrapper>

          <div style={{ height: 128 }}></div>
        </Vertical>
      </div>
    </React.Fragment>
  );
};

export default UsersAudit;
