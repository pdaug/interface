import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { Descendant } from "slate";
import { ImageBroken } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// components
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

// utils
import Renderer from "../../../utils/Renderer";
import PhoneNumber from "../../../utils/PhoneNumber";
import { GenerateNumbers } from "../../../utils/GenerateId";

// types
import {
  TypeSale,
  TypeSaleStage,
  TypeSaleDetails,
  TypeSaleProduct,
} from "../../../types/Sale";
import { TypeCustomer } from "../../../types/Customers";
import { TypeDocument } from "../../../types/Documents";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useTranslate from "../../../hooks/useTranslate";

const SalesDocumentShare = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { user, token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [documentFile, setDocumentFile] = useState<{
    contract: TypeDocument | null;
    proposal: TypeDocument | null;
  }>({
    contract: null,
    proposal: null,
  });

  const [form, setForm] = useState<Partial<TypeSale>>({
    saleId: GenerateNumbers(6),
    stage: "draft" as TypeSaleStage,
    description: "",

    customerId: "",
    customerName: "",
    customerMobile: "",
    customerDocument: "",

    products: new Array<TypeSaleProduct>(),

    details: new Array<TypeSaleDetails>(),

    shippingMethod: undefined,
    shippingCost: "0.00",
    shippingFromAddress: "",
    shippingFromPostal: "",
    shippingToAddress: "",
    shippingToPostal: "",

    userId: user.id,
    sellerId: user.id,
    accountId: "",

    createdAt: format(new Date(), "yyyy-MM-dd"),
  });

  const documentData = type
    ? documentFile?.[type as keyof typeof documentFile] || null
    : null;

  const customer = customers.find(function (customer) {
    return customer.id === form.customerId;
  });

  // fetch sale and documents
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const responseSale = await apis.Sale.get<TypeSale>(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!responseSale.data?.result || responseSale.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/sales");
        return;
      }
      setForm(responseSale.data.result);

      const responseDocumentContract = await apis.DocumentApi.get<TypeDocument>(
        token,
        instance.name,
        responseSale.data.result.documentContract || "",
        workspaceId,
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

      const responseDocumentProposal = await apis.DocumentApi.get<TypeDocument>(
        token,
        instance.name,
        responseSale.data.result.documentProposal || "",
        workspaceId,
      );
      if (
        !responseDocumentProposal.data?.result ||
        responseDocumentProposal.status !== 200
      ) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }

      setDocumentFile({
        contract: responseDocumentContract.data.result ?? null,
        proposal: responseDocumentProposal.data.result ?? null,
      });

      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/sale/SalesDocumentShare.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch customers
  useAsync(async function () {
    try {
      const response = await apis.Customer.list<
        ApiResponsePaginate<TypeCustomer>
      >(
        token,
        instance.name,
        {
          pageSize: 999,
          pageCurrent: 1,
          orderField: "name",
          orderSort: "asc",
        },
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        return;
      }
      if (response.data.result.items?.[0])
        setForm(function (prevState) {
          const newForm = { ...prevState };
          if (!newForm?.customerId) {
            newForm.customerId = response.data.result.items[0].id;
            newForm.customerName = response.data.result.items[0].name;
            newForm.customerMobile = response.data.result.items[0].mobile;
            newForm.customerDocument = response.data.result.items[0]?.document1;
          }
          return newForm;
        });
      setCustomers(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/sale/SalesDocumentShare.tsx]", err);
      return;
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
          <Renderer
            content={documentData.content as Descendant[]}
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

export default SalesDocumentShare;
