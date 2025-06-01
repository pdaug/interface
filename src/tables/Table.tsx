import { DotsThreeOutline } from "@phosphor-icons/react";

// styles
import "./Table.css";

// components
import Tooltip from "../tooltips/Tooltip";
import { InputCheck } from "../inputs/Input";
import Dropdown, { DropdownValues } from "../dropdowns/Dropdown";

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
  [key: string]: string | number | boolean;
};

export type TableProps = {
  data: TableData[];
  columns: TableColumn;
  border?: boolean;
  selected?: string[];
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
  options?: DropdownValues;
};

const Table = function ({
  columns,
  data,
  border,
  selected,
  setSelected,
  options,
}: TableProps) {
  const rowsId = data.map((item) => item.id);
  const isSelectedRowsId = selected
    ? rowsId.every((id) => selected.includes(id))
    : false;
  return (
    <div className={`fz-table ${border ? "fz-table-border" : ""}`}>
      <div className="fz-table-head">
        <div className="fz-table-head-row">
          <div style={{ maxWidth: 32 }} className="fz-table-head-data">
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
          {Object.entries(columns)?.map(function (
            [columnKey, columnValue],
            index,
          ) {
            return (
              <div
                className="fz-table-head-data"
                style={{ maxWidth: columnValue?.maxWidth }}
                key={`table-head-data-${columnKey}-${index}`}
              >
                {columnValue.label}
              </div>
            );
          })}
          {options && (
            <div style={{ maxWidth: 32 }} className="fz-table-head-data"></div>
          )}
        </div>
      </div>
      <div className="fz-table-body">
        {data?.map(function (row, indexRow) {
          return (
            <div
              className={`fz-table-body-row ${selected?.includes(row.id) ? "fz-table-body-row-selected" : ""}`}
              key={`table-body-row-${row.id}-${indexRow}`}
            >
              <div style={{ maxWidth: 32 }} className="fz-table-body-data">
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
                    className={"fz-table-body-data"}
                    style={{ maxWidth: columnValue?.maxWidth }}
                    key={`table-body-row-data-${row.id}-${columnKey}-${indexColumn}`}
                  >
                    {columnValue.tooltip ? (
                      <Tooltip content={columnValue.tooltip}>
                        {rowDataValue}
                      </Tooltip>
                    ) : (
                      rowDataValue
                    )}
                  </div>
                );
              })}
              {options && (
                <div style={{ maxWidth: 32 }} className="fz-table-body-data">
                  <Dropdown values={options}>
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
    </div>
  );
};

export default Table;
