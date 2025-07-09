import React from "react";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import { Horizontal, Vertical } from "../../components/aligns/Align";
import Wrapper from "../../components/wrapper/Wrapper";
import { InputSelect } from "../../components/inputs/Input";

const SettingsPanel = function () {
  const t = useTranslate();

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.settings.settings}</h1>
      </Horizontal>
      <Vertical internal={1}>
        <Wrapper
          title={t.workspace.title_create}
          description={t.workspace.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="workspace_status"
                empty={t.stacks.no_option}
                value={""}
                label={t.components.status}
                options={[
                  {
                    id: "true",
                    value: "true",
                    text: t.components.active,
                  },
                  {
                    id: "false",
                    value: "false",
                    text: t.components.inactive,
                  },
                ]}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
        <Wrapper
          title={t.workspace.title_create}
          description={t.workspace.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="workspace_status"
                empty={t.stacks.no_option}
                value={""}
                label={t.components.status}
                options={[
                  {
                    id: "true",
                    value: "true",
                    text: t.components.active,
                  },
                  {
                    id: "false",
                    value: "false",
                    text: t.components.inactive,
                  },
                ]}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
        <Wrapper
          title={t.workspace.title_create}
          description={t.workspace.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="workspace_status"
                empty={t.stacks.no_option}
                value={""}
                label={t.components.status}
                options={[
                  {
                    id: "true",
                    value: "true",
                    text: t.components.active,
                  },
                  {
                    id: "false",
                    value: "false",
                    text: t.components.inactive,
                  },
                ]}
                onChange={function () {
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
      </Vertical>
    </React.Fragment>
  );
};

export default SettingsPanel;
