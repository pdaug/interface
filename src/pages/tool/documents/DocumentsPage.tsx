import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import { TypeDocument } from "../../../types/Documents";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  RichText,
  RichTextContext,
} from "../../../components/richtext/RichText";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { TypeInstance } from "../../../types/Instance";

const DocumentsPage = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<TypeDocument | null>(null);
  const [instance, setInstance] = useState<Partial<TypeInstance> | null>(null);

  // fetch instance by subdomain
  useAsync(async function () {
    try {
      const host = window.location.hostname;
      const parts = host.split(".");
      const subdomain = parts?.[0];
      if (subdomain && parts.length >= 3) {
        const response = await apis.Instance.search<TypeInstance>(subdomain);
        if (!response.data?.result) return;
        setInstance(response.data.result);
      } else {
        setInstance({
          name: "test",
          companyName: "",
        });
      }
    } catch (err) {
      console.error("[src/pages/tool/documents/DocumentsPage.tsx]", err);
    }
  }, []);

  // change style by instance
  useEffect(
    function () {
      if (!instance) return;
      const favicon: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
      if (!favicon) return;
      favicon.type = "image/x-icon";
      favicon.rel = "shortcut icon";
      favicon.href = instance.favicon as string;
      document.title = instance.companyName as string;
      return;
    },
    [instance],
  );

  // fetch document file
  useAsync(
    async function () {
      if (!id || !instance) return;
      const toastId = toast.loading(t.components.loading);
      setLoading(true);
      try {
        const response = await apis.DocumentApi.getPublic<TypeDocument>(
          instance.name as string,
          id,
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
        setDocumentFile(response.data.result);
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
    },
    [instance],
  );

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
              {t.components.loading}...
            </i>
          </Horizontal>
        </Wrapper>
      ) : documentFile ? (
        documentFile.isPublic ? (
          <RichTextContext
            content={documentFile?.content as Descendant[]}
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
                {t.document.document_private}
              </i>
            </Horizontal>
          </Wrapper>
        )
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
