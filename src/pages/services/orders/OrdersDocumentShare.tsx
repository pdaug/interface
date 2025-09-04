import { toast } from "sonner";
import { Descendant } from "slate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageBroken } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import Renderer from "../../../utils/Renderer";
import PhoneNumber from "../../../utils/PhoneNumber";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useTranslate from "../../../hooks/useTranslate";

// components
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

// types
import { TypeOrder } from "../../../types/Order";
import { TypeInstance } from "../../../types/Instance";
import { TypeDocument } from "../../../types/Documents";
import { TypeCustomer } from "../../../types/Customers";

const OrdersDocumentShare = function () {
  const play = useSounds();
  const { id, type } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [instance, setInstance] = useState<TypeInstance | null>();
  const [customer, setCustomer] = useState<TypeCustomer | null>();
  const [documentFile, setDocumentFile] = useState<{
    contract: TypeDocument | null;
    quotation: TypeDocument | null;
  }>({
    contract: null,
    quotation: null,
  });

  const t = useTranslate(instance ?? undefined);

  const documentData = type
    ? documentFile?.[type as keyof typeof documentFile] || null
    : null;

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

  // fetch order, customer, documents
  useAsync(async function () {
    if (!id) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_items,
      });
      return;
    }

    setLoading(true);
    try {
      // instance
      let instance: TypeInstance | null = null;
      const host = window.location.hostname;
      const parts = host.split(".");
      const subdomain = parts?.[0];
      if (subdomain && parts.length >= 3) {
        const responseInstance =
          await apis.Instance.search<TypeInstance>(subdomain);
        if (responseInstance.data?.result) {
          instance = responseInstance.data.result;
          setInstance(responseInstance.data.result);
        }
      } else {
        const responseInstance =
          await apis.Instance.search<TypeInstance>("test");
        if (responseInstance.data?.result) {
          instance = responseInstance.data.result;
          setInstance(responseInstance.data.result);
        }
      }

      if (!instance) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_instance,
        });
        return;
      }

      // order
      const responseOrder = await apis.Order.get<TypeOrder>(
        "5d83e097-d2d2-4b0e-8686-fb91154876d8",
        instance.name,
        id,
      );
      if (!responseOrder.data?.result || responseOrder.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }

      // customer
      const responseCustomer = await apis.Customer.get<TypeCustomer>(
        "5d83e097-d2d2-4b0e-8686-fb91154876d8",
        instance.name,
        responseOrder.data.result.customerId,
      );
      if (!responseCustomer.data?.result || responseCustomer.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      setCustomer(responseCustomer.data.result);

      let contract: TypeDocument | null = null;
      if (responseOrder.data.result?.documentContract) {
        const responseDocumentContract =
          await apis.DocumentApi.getPublic<TypeDocument>(
            instance.name,
            responseOrder.data.result.documentContract,
          );
        if (
          !responseDocumentContract.data?.result ||
          responseDocumentContract.status !== 200
        ) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        contract = responseDocumentContract.data.result;
      }

      let quotation: TypeDocument | null = null;
      if (responseOrder.data.result.documentQuotation) {
        const responseDocumentQuotation =
          await apis.DocumentApi.getPublic<TypeDocument>(
            instance.name,
            responseOrder.data.result.documentQuotation || "",
          );
        if (
          !responseDocumentQuotation.data?.result ||
          responseDocumentQuotation.status !== 200
        ) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        quotation = responseDocumentQuotation.data.result;
      }

      setDocumentFile({ contract, quotation });
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/order/OrdersDocumentShare.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <Vertical internal={1} external={1}>
      <Wrapper>
        <Horizontal className="justifyCenter">
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
    </Vertical>
  ) : documentData ? (
    <Vertical internal={1} external={1}>
      <Horizontal internal={1} className="itemsCenter">
        <Avatar
          label=""
          size={[12, 24]}
          Icon={ImageBroken}
          photo={instance?.logoLarge ?? undefined}
        />
        <Vertical internal={0.2}>
          <div
            style={{
              color: instance?.colorPrimary,
              fontSize: "var(--textSubtitle)",
            }}
          >
            {instance?.companyName}
          </div>
          <div style={{ fontSize: "var(--textSmall)" }}>
            <a
              href={`tel:${instance?.companyMobile}`}
              style={{ color: instance?.colorSecondary }}
            >
              {PhoneNumber.Internacional(instance?.companyMobile || "")}
            </a>
            <br />
            <a
              href={`tel:${instance?.companyPhone}`}
              style={{ color: instance?.colorSecondary }}
            >
              {PhoneNumber.Internacional(instance?.companyPhone || "")}
            </a>
            <br />
            <a
              href={`mailto:${instance?.companyPhone}`}
              style={{ color: instance?.colorSecondary }}
            >
              {instance?.companyEmail}
            </a>
          </div>
        </Vertical>
      </Horizontal>

      <Wrapper>
        <Vertical internal={0.6}>
          {documentData?.content ? (
            <Renderer
              content={documentData?.content as Descendant[]}
              params={{
                customerName: customer?.name || "",
                customerMobile: customer?.mobile || "",
                customerPhone1: customer?.phone1 || "",
                customerPhone2: customer?.phone2 || "",
                customerEmail: customer?.email || "",
                customerDocument1: customer?.document1 || "",
                customerDocument2: customer?.document2 || "",
                companyName: instance?.companyName || "",
                companyPhone: instance?.companyPhone || "",
                companyMobile: instance?.companyMobile || "",
                companyWebsite: instance?.companyWebsite || "",
                companyEmail: instance?.companyEmail || "",
                companyDocument: instance?.companyDocument || "",
              }}
            />
          ) : (
            <Horizontal className="justifyCenter">
              <i
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {t.document.not_public}
              </i>
            </Horizontal>
          )}
        </Vertical>
      </Wrapper>
    </Vertical>
  ) : (
    <Vertical internal={1} external={1}>
      <Wrapper>
        <Horizontal className="justifyCenter">
          <i
            style={{
              color: "var(--textLight)",
              fontSize: "var(--textSmall)",
            }}
          >
            {t.stacks.no_find_item}
          </i>
        </Horizontal>
      </Wrapper>
    </Vertical>
  );
};

export default OrdersDocumentShare;
