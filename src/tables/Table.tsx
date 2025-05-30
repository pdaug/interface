// styles
import "./Table.css";

// components
import Tooltip from "../tooltips/Tooltip";
import { FormCheck } from "../inputs/Input";

export type TableColumn = {
  id: string;
  label: string;
  tooltip?: string;
  width?: number | string;
};

export type TableData = {
  [columnId: string]:
    | {
        id: string;
        value: React.ReactElement | string;
        tooltip?: string;
      }
    | string;
};

export type TableRow = {
  id: string;
  datas: TableData;
};

export type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  border?: boolean;
  checkbox?: boolean;
  striped?: boolean;
};

const Table = function ({
  columns,
  rows,
  border,
  checkbox,
  striped,
}: TableProps) {
  return (
    <div className={`fadeui-table ${border ? "fadeui-table-border" : ""}`}>
      <div className="fadeui-table-head">
        <div className="fadeui-table-head-row">
          {checkbox && (
            <div style={{ maxWidth: 32 }} className="fadeui-table-head-data">
              #
            </div>
          )}
          {columns?.map(function (column) {
            return (
              <div
                key={column.id}
                className="fadeui-table-head-data"
                style={{ maxWidth: column?.width }}
              >
                {column.tooltip ? (
                  <Tooltip content={column.tooltip} placement="top">
                    {column.label}
                  </Tooltip>
                ) : (
                  column.label
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="fadeui-table-body">
        {rows?.map(function (row) {
          return (
            <div
              key={row.id}
              className={`fadeui-table-body-row ${striped ? "fadeui-table-body-row-striped" : ""}`}
            >
              {checkbox && (
                <div
                  style={{ maxWidth: 32 }}
                  className="fadeui-table-body-data"
                >
                  <FormCheck id={row.id} value={false} options={[]} />
                </div>
              )}
              {columns?.map(function (column) {
                const rowData = row.datas?.[column.id];
                return typeof rowData === "string" ? (
                  <div
                    key={`${row.id}-${column.id}`}
                    className="fadeui-table-body-data"
                    style={{ maxWidth: column?.width }}
                  >
                    {rowData}
                  </div>
                ) : (
                  <div
                    key={rowData.id}
                    className="fadeui-table-body-data"
                    style={{ maxWidth: column?.width }}
                  >
                    {rowData.tooltip ? (
                      <Tooltip content={rowData.tooltip} placement="top">
                        {rowData.value}
                      </Tooltip>
                    ) : (
                      rowData.value
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
