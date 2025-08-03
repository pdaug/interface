import React from "react";
import { toast } from "sonner";
import { GearSix, QuestionMark } from "@phosphor-icons/react";

// hooks
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Wrapper from "../../../components/wrapper/Wrapper";
import { useDialog } from "../../../components/dialogs/Dialog";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const integrationLogoSize = 42;

const IntegrationsHome = function () {
  const t = useTranslate();
  const { OpenDialog } = useDialog();

  return (
    <React.Fragment>
      <Horizontal>
        <h2>{t.integration.integrations}</h2>
      </Horizontal>

      <Vertical internal={1}>
        <Horizontal>{t.integration.sales}</Horizontal>

        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "mercadolibre_settings",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_mercadolibre"
                  src="/integrations/mercadolibre.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.mercadolibre}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.mercadolibre_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <div className="flex1"></div>
        </Horizontal>

        <Horizontal>{t.integration.comunications}</Horizontal>

        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "mailsend",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_mailersend"
                  src="/integrations/mailersend.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.mailersend}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.mailersend_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            actions={[
              {
                id: "twilio",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_twilio"
                  src="/integrations/twilio.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.twilio}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.twilio_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>
        </Horizontal>

        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "mailsend",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_mailchimp"
                  src="/integrations/mailchimp.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.mailchimp}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.mailchimp_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <div className="flex1"></div>
        </Horizontal>

        <Horizontal>{t.integration.payments}</Horizontal>

        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "stripe",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_stripe"
                  src="/integrations/stripe.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.stripe}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.stripe_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            actions={[
              {
                id: "paypal",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_paypal"
                  src="/integrations/paypal.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.paypal}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.paypal_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>
        </Horizontal>

        <Horizontal>{t.integration.ai}</Horizontal>

        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "gemini",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                disabled: true,
              },
              {
                text: "",
                disabled: true,
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_gemini"
                  src="/integrations/gemini.webp"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.gemini}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Warning" value={t.integration.wip} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.gemini_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            actions={[
              {
                id: "openai",
                category: "Neutral",
                text: t.integration.setup,
                Icon: GearSix,
                onClick: function () {
                  toast.warning(t.toast.warning_error, {
                    description: t.stacks.no_integration,
                  });
                  return;
                },
              },
              {
                text: "",
                onlyIcon: true,
                id: "mercadolibre_help",
                category: "Neutral",
                Icon: QuestionMark,
                onClick: function () {
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
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} className="items-center">
                <img
                  width={integrationLogoSize}
                  alt="integration_openai"
                  src="/integrations/openai.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integration.openai}
                </div>
              </Horizontal>
              <Horizontal internal={0.4} className="items-center">
                <Badge category="Info" value={t.integration.beta} />
                <div
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.integration.openai_description}
                </div>
              </Horizontal>
            </Vertical>
          </Wrapper>
        </Horizontal>

        <div style={{ height: 128 }}></div>
      </Vertical>
    </React.Fragment>
  );
};

export default IntegrationsHome;
