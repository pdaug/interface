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
    <div className={`table ${border ? "tableBorder" : ""}`}>
      <div className="tableHead">
        <div className="tableHeadRow">
          <div style={{ maxWidth: 32 }} className="tableHeadData">
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
                className="tableHeadData"
                key={`${columnKey}-${index}`}
                style={{ maxWidth: columnValue?.maxWidth }}
              >
                {columnValue.label}
              </div>
            );
          })}
          {options && (
            <div style={{ maxWidth: 32 }} className="tableHeadData"></div>
          )}
        </div>
      </div>
      <div className="tableBody">
        {data?.map(function (row, indexRow) {
          return (
            <div
              key={`${row.id}-${indexRow}`}
              className={`tableBodyRow ${selected?.includes(row.id) ? "tableBodyRowSelected" : ""}`}
            >
              <div style={{ maxWidth: 32 }} className="tableBodyData">
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
                    className="tableBodyData"
                    style={{ maxWidth: columnValue?.maxWidth }}
                    key={`${row.id}-${columnKey}-${indexColumn}`}
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
                <div style={{ maxWidth: 32 }} className="tableBodyData">
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
