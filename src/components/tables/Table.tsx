import { DotsThreeOutline } from "@phosphor-icons/react";

// styles
import "./Table.css";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import Tooltip from "../tooltips/Tooltip";
import { Horizontal } from "../aligns/Align";
import { InputCheck } from "../inputs/Input";
import Dropdown, { DropdownValue } from "../dropdowns/Dropdown";
import { forwardRef } from "react";

export type TableColumn = {
  [key: string]: {
    label: string;
    tooltip?: string;
    maxWidth?: number | string;
    handler?: (
      data: TableData,
      index: number,
    ) => React.ReactElement | number | string;
  };
};

export type TableData = {
  id: string;
  [key: string]: string | number | boolean | object | unknown[];
};

export type TableProps = {
  data: TableData[];
  columns: TableColumn;
  border?: boolean;
  headless?: boolean;
  selected?: string[];
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
  options?: DropdownValue[];
  styles?: React.CSSProperties;
  loading?: boolean;
  noSelect?: boolean;
};

const Table = forwardRef<HTMLDivElement, TableProps>(function (
  {
    columns,
    data,
    border,
    selected,
    setSelected,
    options,
    styles,
    loading,
    headless,
    noSelect,
  },
  ref,
) {
  const t = useTranslate();

  const rowsId = data.map((item) => item.id);
  const isSelectedRowsId =
    selected && !loading && data.length
      ? rowsId.every((id) => selected.includes(id))
      : false;

  return (
    <div
      ref={ref}
      style={styles}
      className={`table ${border ? "tableBorder" : ""}`}
    >
      {!headless && (
        <div className="tableHead">
          <div className="tableHeadRow">
            {!noSelect && (
              <div
                style={{ maxWidth: "min-content" }}
                className="tableHeadData"
              >
                <InputCheck
                  value={isSelectedRowsId}
                  onChange={function () {
                    if (isSelectedRowsId) setSelected?.([]);
                    else setSelected?.(rowsId);
                    return;
                  }}
                  options={[
                    {
                      id: "all",
                      value: "all",
                      label: "",
                    },
                  ]}
                />
              </div>
            )}
            {Object.entries(columns)?.map(function (
              [columnKey, columnValue],
              index,
            ) {
              return (
                <div
                  className="tableHeadData"
                  key={`${columnKey}-${index}`}
                  style={{ maxWidth: columnValue?.maxWidth }}
                >
                  {columnValue.label}
                </div>
              );
            })}
            {options && (
              <div
                className="tableHeadData"
                style={{ maxWidth: "min-content" }}
              >
                <div style={{ opacity: 0 }}>
                  <DotsThreeOutline weight="fill" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {loading ? (
        <Horizontal external={1} className="justifyCenter">
          <i
            style={{ color: "var(--textLight)", fontSize: "var(--textSmall)" }}
          >
            {t.components.loading}...
          </i>
        </Horizontal>
      ) : data.length === 0 ? (
        <Horizontal external={1} className="justifyCenter">
          <i
            style={{ color: "var(--textLight)", fontSize: "var(--textSmall)" }}
          >
            {t.stacks.no_items}
          </i>
        </Horizontal>
      ) : (
        <div className="tableBody">
          {data?.map(function (row, indexRow) {
            return (
              <div
                key={`${row.id}-${indexRow}`}
                className={`tableBodyRow ${selected?.includes(row.id) ? "tableBodyRowSelected" : ""}`}
              >
                {!noSelect && (
                  <div
                    className="tableBodyData"
                    style={{ maxWidth: "min-content" }}
                  >
                    <InputCheck
                      value={selected || []}
                      onChange={setSelected}
                      options={[
                        {
                          id: row.id,
                          value: row.id,
                          label: "",
                        },
                      ]}
                    />
                  </div>
                )}
                {Object.entries(columns)?.map(function (
                  [columnKey, columnValue],
                  indexColumn,
                ) {
                  const rowData = row?.[columnKey];
                  const rowDataValue = columnValue.handler
                    ? columnValue.handler(row, indexRow)
                    : rowData;
                  return (
                    <div
                      className="tableBodyData"
                      style={{ maxWidth: columnValue?.maxWidth }}
                      key={`${row.id}-${columnKey}-${indexColumn}`}
                    >
                      {columnValue.tooltip &&
                      typeof rowDataValue !== "object" ? (
                        <Tooltip content={columnValue.tooltip}>
                          <div>{rowDataValue}</div>
                        </Tooltip>
                      ) : (
                        (rowDataValue as React.ReactNode)
                      )}
                    </div>
                  );
                })}
                {options && (
                  <div
                    style={{ maxWidth: "min-content" }}
                    className="tableBodyData"
                  >
                    <Dropdown values={options} data={row}>
                      <div style={{ cursor: "pointer" }}>
                        <DotsThreeOutline weight="fill" />
                      </div>
                    </Dropdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

Table.displayName = "Table";

export default Table;
