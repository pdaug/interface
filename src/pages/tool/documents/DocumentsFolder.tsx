import {
  Trash,
  Plus,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
  DotsThreeOutline,
  FileDoc,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

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
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import Dropdown from "../../../components/dropdowns/Dropdown";
import { useDialog } from "../../../components/dialogs/Dialog";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { GetImageHTML, ObjectToHTML } from "../../../utils/Preview";

const pageSize = 10;

const DocumentsFolder = function () {
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [documents, setDocuments] = useState<TypeDocument[]>([]);

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
          pageCurrent: page,
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
          "[src/pages/tool/documents/DocumentsFolder.tsx]",
          response.data,
        );
        return;
      }
      setDocuments(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/tool/documents/DocumentsFolder.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch documents
  useAsync(FetchDocuments, [workspaceId, page, searchDebounced]);

  // load previews
  useAsync(
    async function () {
      if (!documents || !documents.length) return;
      const newPreviews = new Array<string>();
      for (const document of documents) {
        const previewHtml = ObjectToHTML(document.content);
        const previewImage = await GetImageHTML(previewHtml);
        newPreviews.push(previewImage);
      }
      setPreviews(newPreviews);
    },
    [documents],
  );

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
          Download.JSON(data, `document-${data.id}.json`);
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
          navigate(`/f/documents/editor/${data.id}`);
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
              const response = await apis.DocumentApi.delete(
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
              console.error(
                "[src/pages/tool/documents/DocumentsFolder.tsx]",
                err,
              );
              return;
            }
          },
        });
      },
    },
  ];

  return (
    <React.Fragment>
      <Vertical internal={1}>
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
              ]}
            />
          </h2>
        </Horizontal>

        <Horizontal internal={1}>
          <Button
            Icon={Plus}
            category="Success"
            text={t.document.new}
            onClick={() => navigate("/f/documents/editor")}
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

        <Vertical internal={1} styles={{ flex: 1 }}>
          <Horizontal internal={1} styles={{ flexWrap: "wrap" }}>
            {documents.length ? (
              documents.map(function (document, index) {
                const userFinded = users?.find(function (user) {
                  return user.id === document.userId;
                });
                return (
                  <Card
                    mode="Large"
                    Icon={FileDoc}
                    key={document.id}
                    photo={previews[index]}
                    photoChildren={
                      <React.Fragment>
                        <Badge
                          category="Info"
                          key="badge-document-category"
                          value={
                            t.document[
                              document.category as keyof typeof t.document
                            ]
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
                        <Dropdown values={getOptions} data={document}>
                          <div style={{ cursor: "pointer" }}>
                            <DotsThreeOutline weight="fill" />
                          </div>
                        </Dropdown>
                      </React.Fragment>
                    }
                  >
                    <div>{document.name}</div>
                    <div
                      style={{
                        color: "var(--textLight)",
                        fontSize: "var(--textSmall)",
                      }}
                    >
                      {t.components.created_at}:{" "}
                      {instanceDateTime(document.createdAt)}
                    </div>
                  </Card>
                );
              })
            ) : (
              <Wrapper>
                <Horizontal styles={{ justifyContent: "center" }}>
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

          <Pagination
            display
            pageCurrent={page}
            setPage={setPage}
            itemsTotal={total}
            pageSize={pageSize}
          />
        </Vertical>
      </Vertical>
    </React.Fragment>
  );
};

export default DocumentsFolder;
