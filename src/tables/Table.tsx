// styles
import "./Table.css";

// components
import Tooltip from "../tooltips/Tooltip";

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
        value: React.ReactNode;
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
    <div className={`baseui-table ${border ? "baseui-table-border" : ""}`}>
      <div className="baseui-table-head">
        <div className="baseui-table-head-row">
          {checkbox && (
            <div
              className="baseui-table-head-data"
              style={{ maxWidth: 32, textAlign: "center" }}
            >
              #
            </div>
          )}
          {columns?.map(function (column) {
            return (
              <div
                key={column.id}
                className="baseui-table-head-data"
                style={{ maxWidth: column?.width }}
              >
                {column.tooltip ? (
                  <Tooltip content={column.tooltip} position="top">
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
      <div className="baseui-table-body">
        {rows?.map(function (row) {
          return (
            <div
              key={row.id}
              className={`baseui-table-body-row ${striped ? "baseui-table-body-row-striped" : ""}`}
            >
              {checkbox && (
                <div
                  className="baseui-table-body-data"
                  style={{ maxWidth: 32, textAlign: "center" }}
                >
                  <input type="checkbox" />
                </div>
              )}
              {columns?.map(function (column) {
                const rowData = row.datas?.[column.id];
                return typeof rowData === "string" ? (
                  <div
                    key={`${row.id}-${column.id}`}
                    className="baseui-table-body-data"
                    style={{ maxWidth: column?.width }}
                  >
                    {rowData}
                  </div>
                ) : (
                  <div
                    key={rowData.id}
                    className="baseui-table-body-data"
                    style={{ maxWidth: column?.width }}
                  >
                    {rowData.tooltip ? (
                      <Tooltip content={rowData.tooltip} position="top">
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
