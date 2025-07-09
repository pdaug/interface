import React from "react";
import { toast } from "sonner";
import { GearSix, QuestionMark } from "@phosphor-icons/react";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import Badge from "../../components/badges/Badge";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import { useDialog } from "../../components/dialogs/Dialog";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const integrationLogoSize = 42;

const IntegrationsHome = function () {
  const t = useTranslate();
  const { OpenDialog } = useDialog();

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.integrations.integrations}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
        <Horizontal internal={1}>
          <Button
            text={t.components.help}
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
        </Horizontal>
      </Horizontal>
      <Vertical internal={1}>
        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "mailsend",
                category: "Neutral",
                text: t.integrations.setup,
                Icon: GearSix,
                disabled: true,
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} styles={{ alignItems: "center" }}>
                <img
                  width={integrationLogoSize}
                  alt="integration_mailersend"
                  src="/integrations/mailersend.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integrations.mailersend}
                </div>
              </Horizontal>

              <div
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {t.integrations.mailersend_description}
              </div>
              <Horizontal>
                <Badge category="Warning" value={t.integrations.wip} />
              </Horizontal>
            </Vertical>
          </Wrapper>
          <Wrapper
            actions={[
              {
                id: "twilio",
                category: "Neutral",
                text: t.integrations.setup,
                Icon: GearSix,
                disabled: true,
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} styles={{ alignItems: "center" }}>
                <img
                  width={integrationLogoSize}
                  alt="integration_twilio"
                  src="/integrations/twilio.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integrations.twilio}
                </div>
              </Horizontal>
              <div
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {t.integrations.twilio_description}
              </div>
              <Horizontal>
                <Badge category="Warning" value={t.integrations.wip} />
              </Horizontal>
            </Vertical>
          </Wrapper>
        </Horizontal>
        <Horizontal internal={1}>
          <Wrapper
            actions={[
              {
                id: "stripe",
                category: "Neutral",
                text: t.integrations.setup,
                Icon: GearSix,
                disabled: true,
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} styles={{ alignItems: "center" }}>
                <img
                  width={integrationLogoSize}
                  alt="integration_stripe"
                  src="/integrations/stripe.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integrations.stripe}
                </div>
              </Horizontal>
              <div
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {t.integrations.stripe_description}
              </div>
              <Horizontal>
                <Badge category="Warning" value={t.integrations.wip} />
              </Horizontal>
            </Vertical>
          </Wrapper>
          <Wrapper
            actions={[
              {
                id: "openai",
                category: "Neutral",
                text: t.integrations.setup,
                Icon: GearSix,
                onClick: function () {
                  toast.warning(t.stacks.no_integration);
                  return;
                },
              },
            ]}
          >
            <Vertical internal={1}>
              <Horizontal internal={1} styles={{ alignItems: "center" }}>
                <img
                  width={integrationLogoSize}
                  alt="integration_openai"
                  src="/integrations/openai.png"
                  style={{ borderRadius: "var(--borderRadius)" }}
                />
                <div style={{ fontSize: "var(--textHighlight)" }}>
                  {t.integrations.openai}
                </div>
              </Horizontal>
              <div
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {t.integrations.openai_description}
              </div>
            </Vertical>
          </Wrapper>
        </Horizontal>
      </Vertical>
    </React.Fragment>
  );
};

export default IntegrationsHome;
