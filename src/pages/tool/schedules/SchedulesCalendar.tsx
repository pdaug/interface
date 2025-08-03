import React from "react";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import Agenda from "../../../components/Agendas/Agenda";
import Wrapper from "../../../components/wrapper/Wrapper";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const SchedulesCalendar = function () {
  const t = useTranslate();
  const { workspaceId, workspaces } = useSystem();

  return (
    <React.Fragment>
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
                id: "schedules",
                label: t.schedule.schedules,
                url: "/f/schedules",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1} className="flex flex1">
        <Agenda
          selectable
          views={["month", "week"]}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          events={[
            {
              title: "Teste",
              start: new Date("2025-08-01T12:00:00Z"),
              end: new Date("2025-08-01T13:00:00Z"),
            },
          ]}
          onSelectEvent={function (event) {
            console.log(event);
            return;
          }}
          onSelectSlot={function (event) {
            console.log(event);
            return;
          }}
        />
        <Vertical internal={1} styles={{ width: 280 }}>
          <Wrapper>eae</Wrapper>
        </Vertical>
      </Horizontal>
    </React.Fragment>
  );
};

export default SchedulesCalendar;
