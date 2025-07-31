import { toast } from "sonner";
import { useState } from "react";
import { Descendant } from "slate";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import { TypeDocument } from "../../../types/Documents";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  RichText,
  RichTextContext,
} from "../../../components/richtext/RichText";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const DocumentsPage = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [document, setDocument] = useState<TypeDocument | null>(null);

  // fetch document
  useAsync(async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    setLoading(true);
    try {
      const response = await apis.DocumentApi.get<TypeDocument>(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/documents");
        setLoading(false);
        return;
      }
      setDocument(response.data.result);
      toast.dismiss(toastId);
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/tool/documents/DocumentsPage.tsx]", err);
      setLoading(false);
      return;
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }, []);

  return (
    <Vertical external={1}>
      {loading ? (
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
      ) : document ? (
        <RichTextContext
          content={document?.content as Descendant[]}
          setContent={function () {
            return;
          }}
        >
          <RichText />
        </RichTextContext>
      ) : (
        <Wrapper>
          <Horizontal className="justify-center">
            <i
              style={{
                color: "var(--textLight)",
                fontSize: "var(--textSmall)",
              }}
            >
              {t.stacks.no_items}
            </i>
          </Horizontal>
        </Wrapper>
      )}
    </Vertical>
  );
};

export default DocumentsPage;
