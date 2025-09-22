import React from "react";
import { Check } from "@phosphor-icons/react";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import Badge from "../../../components/badges/Badge";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Button, { ButtonCategories } from "../../../components/buttons/Button";

const plansHierarchy = {
  personal: 0,
  advanced: 1,
  professional: 2,
};

type TypePlan = {
  isActive: boolean;
  title: string;
  description: string;
  currency: string;
  price: number;
  items: string[];
  buttonLabel: string;
  buttonCategory: ButtonCategories;
  buttonDisabled: boolean;
};

const Plan = function ({
  isActive,
  title,
  description,
  currency,
  price,
  items,
  buttonLabel,
  buttonCategory,
  buttonDisabled,
}: TypePlan) {
  const t = useTranslate();

  return (
    <Wrapper
      contentStyles={{
        display: "flex",
        padding: "2rem 1rem",
        position: "relative",
      }}
      styles={
        isActive
          ? { border: "2px solid var(--successColor)", overflow: "visible" }
          : {}
      }
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            height: "100%",
            transform: "translateX(-50%)",
          }}
        >
          <Badge
            value={t.plans.active}
            category="Success"
            styles={{ width: "min-content" }}
          />
        </div>
      )}
      <Vertical internal={2} className="itemsCenter flex1">
        <Vertical internal={0.4} className="itemsCenter">
          <h2 style={{ margin: 0, padding: 0 }}>{title}</h2>
          <p
            style={{
              margin: 0,
              padding: 0,
              opacity: 0.6,
              fontSize: "var(--textSmall)",
              textAlign: "center",
            }}
          >
            {description}
          </p>
        </Vertical>

        <Horizontal className="itemsCenter" internal={0.2}>
          <span>{currency}</span>
          <b style={{ fontSize: "2.4rem" }}>{price}</b>
          <span>/{t.components.month}</span>
        </Horizontal>

        <Vertical internal={0.2} className="flex1 wFull">
          {items.map(function (item) {
            return (
              <Horizontal internal={0.2} className="itemsCenter" key={item}>
                <Check weight="bold" size={20} color="var(--successColor)" />
                <span>{item}</span>
              </Horizontal>
            );
          })}
        </Vertical>

        <Vertical internal={0.2} className="wFull">
          <Button
            text={buttonLabel}
            category={buttonCategory}
            disabled={buttonDisabled}
            onClick={function () {
              return;
            }}
          />
        </Vertical>
      </Vertical>
    </Wrapper>
  );
};

const PlansPanel = function () {
  const t = useTranslate();
  const { instance } = useSystem();

  return (
    <React.Fragment>
      <Horizontal>
        <h2>{t.plans.plans}</h2>
      </Horizontal>

      <Vertical
        internal={0.4}
        styles={{ justifyContent: "center", textAlign: "center" }}
      >
        <h2 style={{ margin: 0, padding: 0 }}>{t.plans.plan}</h2>
        <p style={{ margin: 0, padding: 0 }}>{t.plans.subtitle}</p>
      </Vertical>

      <Horizontal
        internal={1}
        styles={{ margin: "1rem 0" }}
        className="justifyCenter"
      >
        <Plan
          isActive={instance.paymentPlan === "personal"}
          title={t.plans.plan_personal}
          description={t.plans.plan_personal_description}
          currency={instance.currency}
          price={28}
          items={[
            t.plans.item_suport,
            t.plans.item_app_mobile,
            t.plans.item_only_1_user,
            t.plans.item_only_1_workspace,
            t.plans.item_financial_module,
          ]}
          buttonLabel={t.plans.upgrade}
          buttonDisabled={
            plansHierarchy.personal <= plansHierarchy[instance.paymentPlan]
          }
          buttonCategory={
            plansHierarchy.personal <= plansHierarchy[instance.paymentPlan]
              ? "Neutral"
              : "Success"
          }
        />

        <Plan
          isActive={instance.paymentPlan === "advanced"}
          title={t.plans.plan_advanced}
          description={t.plans.plan_advanced_description}
          currency={instance.currency}
          price={120}
          items={[
            t.plans.item_suport,
            t.plans.item_app_mobile,
            t.plans.item_until_5_users,
            t.plans.item_until_2_workspaces,
            t.plans.item_until_5_automations,
            t.plans.item_all_modules,
            t.plans.item_artificial_intelligence,
          ]}
          buttonLabel={t.plans.upgrade}
          buttonDisabled={
            plansHierarchy.advanced <= plansHierarchy[instance.paymentPlan]
          }
          buttonCategory={
            plansHierarchy.advanced <= plansHierarchy[instance.paymentPlan]
              ? "Neutral"
              : "Success"
          }
        />

        <Plan
          isActive={instance.paymentPlan === "professional"}
          title={t.plans.plan_professional}
          description={t.plans.plan_professional_description}
          currency={instance.currency}
          price={360}
          items={[
            t.plans.item_suport,
            t.plans.item_app_mobile,
            t.plans.item_user_unlimited,
            t.plans.item_workspace_unlimited,
            t.plans.item_automations_unlimited,
            t.plans.item_all_modules,
            t.plans.item_artificial_intelligence,
            t.plans.item_team_training,
            t.plans.item_domain_customization,
          ]}
          buttonLabel={t.plans.upgrade}
          buttonDisabled={
            plansHierarchy.professional <= plansHierarchy[instance.paymentPlan]
          }
          buttonCategory={
            plansHierarchy.professional <= plansHierarchy[instance.paymentPlan]
              ? "Neutral"
              : "Success"
          }
        />
      </Horizontal>
    </React.Fragment>
  );
};

export default PlansPanel;
