import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageBroken } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// assets
import { ServiceMethods } from "../../../assets/Services";
import { OrderDetailsMode, OrderDetailsType } from "../../../assets/Order";

// utils
import Calculate from "../../../utils/Calculate";
import PhoneNumber from "../../../utils/PhoneNumber";

// types
import { TypeOrder } from "../../../types/Order";
import { TypeInstance } from "../../../types/Instance";
import { TypeCustomer } from "../../../types/Customers";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useCurrency from "../../../hooks/useCurrency";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Sheets from "../../../components/sheets/Sheets";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const OrdersShare = function () {
  const play = useSounds();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<TypeOrder | null>(null);
  const [customer, setCustomer] = useState<TypeCustomer | null>(null);
  const [instance, setInstance] = useState<TypeInstance | null>(null);

  const t = useTranslate(instance ?? undefined);
  const Currency = useCurrency(instance ?? undefined);

  const { subtotalServices, subtotalAdditions, subtotalDeductions, total } =
    Calculate.totalOrder(order as unknown as TypeOrder);

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

  // fetch instance, order and customer
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

      // iorder
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
      setOrder(responseOrder.data.result);

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
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("src/pages/services/order/OrdersShare.tsx]", err);
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
  ) : (
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
        <Horizontal
          internal={1}
          className="itemsCenter"
          styles={{ justifyContent: "space-between" }}
        >
          <Profile
            photoSize={8}
            padding={false}
            name={customer?.name}
            photo={customer?.photo || ""}
            description={
              <Vertical>
                <div>{PhoneNumber.Internacional(customer?.mobile || "")}</div>
                <div>{order?.orderId}</div>
              </Vertical>
            }
          />

          <Badge
            category="Info"
            styles={{ fontSize: "var(--textHighlight)" }}
            value={`${t.components.total}: ${Currency(total)}`}
          />
        </Horizontal>
      </Wrapper>

      {/* TODO: display vehicle and driver */}

      <Sheets
        title={t.order.services}
        empty={t.order.no_services}
        rows={order?.services || []}
        footer={
          <Badge
            category="Info"
            value={`${t.order.services}: ${Currency(subtotalServices)}`}
          />
        }
        formatter={{
          serviceName: function () {
            return {
              type: "text",
              readOnly: true,
              title: t.order.service_name,
              placeholder: "",
              onChange: function () {
                return;
              },
            };
          },
          method: function () {
            return {
              type: "select",
              disabled: true,
              title: t.order.service_name,
              options: ServiceMethods?.map(function (method) {
                return {
                  id: method,
                  value: method,
                  text:
                    t.service?.[method as keyof typeof t.service] ||
                    t.components.unknown,
                };
              }),
              onChange: function () {
                return;
              },
            };
          },
          quantity: function () {
            return {
              type: "number",
              readOnly: true,
              title: t.order.quantity,
              placeholder: t.order.quantity_placeholder,
              onChange: function () {
                return;
              },
            };
          },
          price: function () {
            return {
              type: "money",
              readOnly: true,
              title: t.order.price,
              placeholder: "0.00",
              onChange: function () {
                return;
              },
            };
          },
        }}
      />

      {order?.details && order.details?.length > 0 && (
        <Sheets
          title={t.order.details}
          empty={t.order.no_details}
          rows={order?.details || []}
          footer={
            <Horizontal internal={1}>
              <Badge
                category="Danger"
                value={`${t.order.addition}: +${Currency(subtotalAdditions)}`}
              />
              <Badge
                category="Success"
                value={`${t.order.deduction}: -${Currency(subtotalDeductions)}`}
              />
            </Horizontal>
          }
          formatter={{
            title: function () {
              return {
                type: "text",
                readOnly: true,
                title: t.order.details_title,
                placeholder: t.order.details_title_placeholder,
                onChange: function () {
                  return;
                },
              };
            },
            type: function () {
              return {
                type: "select",
                disabled: true,
                title: t.order.details_type,
                options: OrderDetailsType?.map(function (type) {
                  return {
                    id: type,
                    value: type,
                    text:
                      t.order?.[type as keyof typeof t.order] ||
                      t.components.unknown,
                  };
                }),
                onChange: function () {
                  return;
                },
              };
            },
            mode: function () {
              return {
                type: "select",
                disabled: true,
                title: t.order.details_mode,
                options: OrderDetailsMode?.map(function (mode) {
                  return {
                    id: mode,
                    value: mode,
                    text:
                      t.order?.[mode as keyof typeof t.order] ||
                      t.components.unknown,
                  };
                }),
                onChange: function () {
                  return;
                },
              };
            },
            amount: function () {
              return {
                type: "money",
                readOnly: true,
                placeholder: "0.00",
                title: t.order.details_amount,
                onChange: function () {
                  return;
                },
              };
            },
            percent: function () {
              return {
                type: "number",
                readOnly: true,
                placeholder: "10%",
                title: t.order.details_percent,
                onChange: function () {
                  return;
                },
              };
            },
          }}
        />
      )}
    </Vertical>
  );
};

export default OrdersShare;
