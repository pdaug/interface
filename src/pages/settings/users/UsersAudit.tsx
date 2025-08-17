import { toast } from "sonner";
import React, { useState } from "react";
import { User } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

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
import Table, { TableData } from "../../../components/tables/Table";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Input, InputSelect } from "../../../components/inputs/Input";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";

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
              columns={{
                action: {
                  label: t.user.action,
                  handler: function (data) {
                    return t.components?.[
                      data.action as keyof typeof t.components
                    ] ? (
                      <div>
                        {t.components[data.action as keyof typeof t.components]}
                      </div>
                    ) : (
                      <i style={{ color: "var(--textLight)" }}>
                        {t.stacks.no_action}
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
                      <div>{workspaceFinded.name}</div>
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
              data={audits as unknown as TableData[]}
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
                type="submit"
                category="Info"
                disabled={loading}
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
