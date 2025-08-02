import {
  Trash,
  FileDoc,
  ArrowLeft,
  ClockClockwise,
  DotsThreeOutline,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// types
import { TypeDocument } from "../../../types/Documents";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import Card from "../../../components/cards/Card";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/wrapper/Wrapper";
import Dropdown from "../../../components/dropdowns/Dropdown";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 100;

const DocumentsRecycle = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { instanceDate } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { token, instance, workspaces, workspaceId } = useSystem();

  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<TypeDocument[]>([]);

  const documentsDeleted = documents.filter((d) => Boolean(d.deletedAt));

  const [searchDebounced] = useDebounce(search, 500);

  const FetchDocuments = async function () {
    setLoading(true);
    try {
      const response = await apis.DocumentApi.list<
        ApiResponsePaginate<TypeDocument>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: 1,
          searchField: "name",
          search: searchDebounced,
          showDeleted: "true",
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/tool/documents/DocumentsRecycle.tsx]",
          response.data,
        );
        return;
      }
      setDocuments(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/tool/documents/DocumentsRecycle.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch documents
  useAsync(FetchDocuments, [workspaceId, searchDebounced]);

  const RestoreAction = async function (_: React.MouseEvent, data: unknown) {
    if (data && typeof data === "object" && "id" in data && data.id) {
      try {
        const response = await apis.DocumentApi.update(
          token,
          instance.name,
          data.id as string,
          {
            deletedAt: null,
          },
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_restore,
          });
          return;
        }
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_restore,
        });
        await FetchDocuments();
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.toast.error_restore,
        });
        console.error("[src/pages/tool/documents/DocumentsRecycle.tsx]", err);
        return;
      }
    }
    return;
  };

  const DeletePermanentlyAction = async function (
    _: React.MouseEvent,
    data: unknown,
  ) {
    if (!data || typeof data !== "object" || !("id" in data)) return;
    OpenDialog({
      category: "Danger",
      title: t.dialog.title_delete,
      description: t.dialog.description_delete,
      confirmText: t.components.delete,
      onConfirm: async function () {
        try {
          const response = await apis.DocumentApi.deletePermanently(
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
          await FetchDocuments();
          return;
        } catch (err) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.toast.error_delete,
          });
          console.error("[src/pages/tool/documents/DocumentsRecycle.tsx]", err);
          return;
        }
      },
    });
  };

  const getOptions = [
    {
      id: "restore",
      label: t.components.restore,
      Icon: ClockClockwise,
      onClick: RestoreAction,
    },
    {
      id: "delete",
      label: t.components.delete_permanently,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: DeletePermanentlyAction,
    },
  ];

  return (
    <Horizontal internal={1} styles={{ flex: 1 }}>
      <Vertical internal={1} styles={{ flex: 1 }}>
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
                  id: "documents",
                  label: t.document.documents,
                  url: "/f/documents",
                },
                {
                  id: "recycle",
                  label: t.document.recycle_bin,
                  url: "/f/documents/recycle",
                },
              ]}
            />
          </h2>
        </Horizontal>

        <Horizontal internal={1}>
          <Button
            Icon={ArrowLeft}
            category="Info"
            text={t.components.back}
            onClick={() => navigate("/f/documents")}
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
        </Horizontal>

        <Vertical internal={1} className="flex1">
          <Horizontal internal={1} styles={{ flexWrap: "wrap" }}>
            {documentsDeleted.length ? (
              documentsDeleted.map(function (document) {
                return (
                  <Card
                    mode="Large"
                    Icon={FileDoc}
                    key={document.id}
                    photo={document?.preview || ""}
                    photoChildren={
                      <React.Fragment>
                        <Badge
                          category="Danger"
                          key="badge-document-category"
                          value={
                            t.components[
                              document.category as keyof typeof t.components
                            ]
                          }
                        />
                        <Badge
                          category="Danger"
                          key="badge-document-category"
                          value={instanceDate(document?.deletedAt || 0)}
                        />
                      </React.Fragment>
                    }
                  >
                    <Horizontal className="flex items-center">
                      <div className="flex1">{document.name}</div>
                      <Dropdown values={getOptions} data={document}>
                        <div style={{ cursor: "pointer" }}>
                          <DotsThreeOutline weight="fill" />
                        </div>
                      </Dropdown>
                    </Horizontal>
                  </Card>
                );
              })
            ) : (
              <Wrapper>
                <Horizontal className="justify-center">
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
        </Vertical>
      </Vertical>
    </Horizontal>
  );
};

export default DocumentsRecycle;
