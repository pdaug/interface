import {
  Trash,
  Plus,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
  DotsThreeOutline,
  FileDoc,
  ShareNetwork,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// utils
import Bytes from "../../../utils/Bytes";
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
import usePermission from "../../../hooks/usePermission";

// components
import Card from "../../../components/cards/Card";
import Stats from "../../../components/stats/Stats";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/wrapper/Wrapper";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import Dropdown from "../../../components/dropdowns/Dropdown";
import { useDialog } from "../../../components/dialogs/Dialog";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const DocumentsFolder = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const { renderByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<TypeDocument[]>([]);

  const [searchDebounced] = useDebounce(search, 500);

  const DocumentSelected = selected
    ? documents.find(function (document) {
        return document.id === selected;
      })
    : null;

  const UserDocumentSelected = DocumentSelected?.userId
    ? users?.find(function (user) {
        return user.id === DocumentSelected.userId;
      })
    : null;

  const filter = {
    document: documents.filter((d) => d.category == "document"),
    email: documents.filter((d) => d.category == "email"),
    message: documents.filter((d) => d.category == "message"),
    sms: documents.filter((d) => d.category == "sms"),
    public: documents.filter((d) => Boolean(d.isPublic)),
    private: documents.filter((d) => !d.isPublic),
  };

  const statistics = {
    documentQuantity: filter.document.length,
    emailQuantity: filter.email.length,
    messageQuantity: filter.message.length,
    smsQuantity: filter.sms.length,

    documentSize: Bytes.getBytesObject(filter.document),
    emailSize: Bytes.getBytesObject(filter.email),
    messageSize: Bytes.getBytesObject(filter.message),
    smsSize: Bytes.getBytesObject(filter.sms),

    publicQuantity: filter.public.length,
    privateQuantity: filter.private.length,
  };

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

  const DownloadAction = function (_: React.MouseEvent, data: unknown) {
    if (data && typeof data === "object" && "id" in data) {
      Download.JSON(data, `document-${data.id}.json`);
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_download,
      });
    }
    return;
  };

  const EditAction = function (_: React.MouseEvent, data: unknown) {
    if (data && typeof data === "object" && "id" in data)
      navigate(`/f/documents/editor/${data.id}`);
    return;
  };

  const DeleteAction = async function (_: React.MouseEvent, data: unknown) {
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
          setSelected("");
          return;
        } catch (err) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.toast.error_delete,
          });
          console.error("[src/pages/tool/documents/DocumentsFolder.tsx]", err);
          return;
        }
      },
    });
    return;
  };

  const ShareAction = function (_: React.MouseEvent, data: unknown) {
    if (!data || typeof data !== "object") return;
    setSelected((data as TypeDocument).id as string);
    if (!("isPublic" in data) || !data.isPublic) {
      toast.warning(t.toast.warning_error, {
        description: t.document.not_public,
      });
      return;
    }
    const urlShare = `https://${location.host}/share/document/${(data as TypeDocument).id}`;
    OpenDialog({
      category: "Success",
      title: t.dialog.title_share,
      description: (
        <Vertical internal={1}>
          <div>{t.dialog.description_share}</div>
          <a
            href={urlShare}
            target="_blank"
            rel="noreferrer"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {urlShare}
          </a>
        </Vertical>
      ),
      confirmText: t.components.copy,
      onConfirm: async function () {
        const result = await Clipboard.copy(urlShare);
        if (result) {
          play("ok");
          toast.success(t.toast.success, {
            description: t.toast.success_copy,
          });
          CloseDialog();
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_copy,
        });
        CloseDialog();
        return;
      },
    });
    return;
  };

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
      id: "share",
      label: t.components.share,
      Icon: ShareNetwork,
      onClick: ShareAction,
    },
    {
      id: "download",
      label: t.components.download,
      Icon: DownloadSimple,
      onClick: DownloadAction,
    },
    {
      id: "edit",
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: EditAction,
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: DeleteAction,
    },
  ];

  return renderByPlan(
    "advanced",
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

        <Vertical internal={1} className="flex1">
          <Horizontal internal={1} styles={{ flexWrap: "wrap" }}>
            {documents.length ? (
              documents.map(function (document) {
                return (
                  <Card
                    mode="Large"
                    Icon={FileDoc}
                    key={document.id}
                    photo={document?.preview || ""}
                    selected={document.id === selected}
                    onClick={function () {
                      if (document.id === selected) {
                        setSelected("");
                        return;
                      }
                      setSelected(document.id);
                      return;
                    }}
                    onDoubleClick={function (event) {
                      EditAction(event, document);
                      return;
                    }}
                    photoChildren={
                      <React.Fragment>
                        <Badge
                          category="Info"
                          key="badge-document-category"
                          value={
                            t.components[
                              document.category as keyof typeof t.components
                            ]
                          }
                        />
                        <Badge
                          category={document?.isPublic ? "Success" : "Warning"}
                          value={
                            document?.isPublic
                              ? t.document.public
                              : t.document.private
                          }
                        />
                      </React.Fragment>
                    }
                  >
                    <Horizontal className="flex itemsCenter">
                      <div
                        className="flex1"
                        onClick={function () {
                          if (document.id === selected) {
                            setSelected("");
                            return;
                          }
                          setSelected(document.id);
                          return;
                        }}
                      >
                        {document.name}
                      </div>
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

          <Pagination
            display
            pageCurrent={page}
            setPage={setPage}
            itemsTotal={total}
            pageSize={pageSize}
          />
        </Vertical>
      </Vertical>

      <div>
        {selected ? (
          <Vertical internal={1} styles={{ position: "sticky", top: 0 }}>
            <Card
              mode="Large"
              Icon={FileDoc}
              styles={{
                flex: "none",
                minWidth: 280,
              }}
              photo={DocumentSelected?.preview || ""}
            >
              <Vertical internal={1}>
                <Horizontal
                  internal={1}
                  styles={{ justifyContent: "flex-end" }}
                >
                  <Badge
                    category="Info"
                    value={
                      t.components[
                        DocumentSelected?.category as keyof typeof t.components
                      ]
                    }
                  />
                  <Badge
                    category={
                      DocumentSelected?.isPublic ? "Success" : "Warning"
                    }
                    value={
                      DocumentSelected?.isPublic
                        ? t.document.public
                        : t.document.private
                    }
                  />
                </Horizontal>

                <b className="flex1">{DocumentSelected?.name || ""}</b>

                <Vertical
                  internal={0.4}
                  styles={{ fontSize: "var(--textSmall)" }}
                >
                  <div className="flex flex1">
                    <span className="flex1">{t.document.documents_size}</span>
                    <span>
                      {Bytes.getMegabytes(
                        Bytes.getBytesObject(DocumentSelected || {}) || 0,
                      )}
                    </span>
                  </div>
                  <div className="flex flex1">
                    <span className="flex1">{t.components.created_at}</span>
                    <span>
                      {instanceDateTime(DocumentSelected?.createdAt || "")}
                    </span>
                  </div>
                  <div className="flex flex1">
                    <span className="flex1">{t.components.updated_at}</span>
                    <span>
                      {instanceDateTime(DocumentSelected?.updatedAt || "")}
                    </span>
                  </div>
                  <div className="flex flex1">
                    <span className="flex1">Id</span>
                    <span>{DocumentSelected?.id || ""}</span>
                  </div>
                </Vertical>

                <Profile
                  photoCircle
                  padding={false}
                  name={UserDocumentSelected?.name || ""}
                  photo={UserDocumentSelected?.photo || ""}
                  description={UserDocumentSelected?.email || ""}
                />

                <Horizontal internal={1}>
                  <Button
                    category="Neutral"
                    style={{ flex: 1 }}
                    Icon={PencilSimple}
                    text={t.components.edit}
                    onClick={(event) => EditAction(event, DocumentSelected)}
                  />
                  <Button
                    text=""
                    onlyIcon
                    category="Neutral"
                    Icon={DownloadSimple}
                    onClick={(event) => DownloadAction(event, DocumentSelected)}
                  />
                  <Button
                    text=""
                    onlyIcon
                    Icon={Trash}
                    category="Danger"
                    onClick={(event) => DeleteAction(event, DocumentSelected)}
                  />
                </Horizontal>

                <Button
                  onlyIcon
                  category="Neutral"
                  Icon={ShareNetwork}
                  text={t.components.share}
                  onClick={(event) => ShareAction(event, DocumentSelected)}
                />
              </Vertical>
            </Card>

            <Stats
              styles={{ flex: "none", width: 280 }}
              title={t.document.documents_relation_title}
              footer={t.document.documents_relation_description}
              value={0}
              valueUnit={t.document.relations}
              valueLocale={instance.language}
            />
          </Vertical>
        ) : (
          <Vertical internal={1} styles={{ position: "sticky", top: 0 }}>
            <Wrapper
              styles={{
                flex: "none",
                height: "fit-content",
                position: "sticky",
                width: 280,
              }}
            >
              <Vertical internal={1}>
                <b>{t.document.quantity}</b>
                <Vertical
                  internal={0.2}
                  styles={{ fontSize: "var(--textSmall)" }}
                >
                  <div className="flex">
                    <span className="flex1">{t.components.document}(s)</span>
                    <span>{statistics.documentQuantity}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.email}(s)</span>
                    <span>{statistics.emailQuantity}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.message}(s)</span>
                    <span>{statistics.messageQuantity}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.sms}(s)</span>
                    <span>{statistics.smsQuantity}</span>
                  </div>
                </Vertical>
                <b>{t.document.documents_size}</b>
                <Vertical
                  internal={0.2}
                  styles={{ fontSize: "var(--textSmall)" }}
                >
                  <div className="flex">
                    <span className="flex1">{t.components.document}</span>
                    <span>{Bytes.getMegabytes(statistics.documentSize)}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.email}</span>
                    <span>{Bytes.getMegabytes(statistics.emailSize)}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.message}</span>
                    <span>{Bytes.getMegabytes(statistics.messageSize)}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.components.sms}</span>
                    <span>{Bytes.getMegabytes(statistics.smsSize)}</span>
                  </div>
                </Vertical>
                <b>{t.document.documents_type}</b>
                <Vertical
                  internal={0.2}
                  styles={{ fontSize: "var(--textSmall)" }}
                >
                  <div className="flex">
                    <span className="flex1">{t.document.public}(s)</span>
                    <span>{statistics.publicQuantity}</span>
                  </div>
                  <div className="flex">
                    <span className="flex1">{t.document.private}(s)</span>
                    <span>{statistics.privateQuantity}</span>
                  </div>
                </Vertical>

                <Button
                  Icon={Trash}
                  IconSize={20}
                  category="Danger"
                  text={t.document.open_recycle_bin}
                  onClick={function () {
                    navigate("/f/documents/recycle");
                    return;
                  }}
                />
              </Vertical>
            </Wrapper>

            <Stats
              animation
              loading={loading}
              styles={{ flex: "none", width: 280 }}
              title={t.document.documents_total_title}
              footer={t.document.documents_total_description}
              value={documents.length}
              valueUnit={t.document.documents}
              valueLocale={instance.language}
            />

            <Stats
              animation
              loading={loading}
              styles={{ flex: "none", width: 280 }}
              title={t.document.documents_relation_title}
              footer={t.document.documents_relation_description}
              value={0}
              valueUnit={t.document.relations}
              valueLocale={instance.language}
            />
          </Vertical>
        )}
      </div>
    </Horizontal>,
  );
};

export default DocumentsFolder;
