import React from "react";

// styles
import "./Sheets.css";

// types
import { InputSelectOptions } from "../inputs/Input";
import useTranslate from "../../hooks/useTranslate";
import { Plus, Trash } from "@phosphor-icons/react";

export type SheetsBase = {
  [key: string]: number | string;
};

export type SheetsFormatterType = "number" | "text" | "money" | "select";

export type SheetsFormatter = {
  [key: string]: (index: number) => {
    type: SheetsFormatterType;
    title: string;
    min?: number;
    max?: number;
    hidden?: boolean;
    disabled?: boolean;
    placeholder?: string;
    options?: InputSelectOptions[];
    onChange: (row: SheetsBase) => void;
  };
};

export type SheetProps = {
  add: () => void;
  remove: (index: number) => void;
  rows: SheetsBase[];
  empty?: string;
  formatter: SheetsFormatter;
  styles?: React.CSSProperties;
  footer?: React.ReactNode;
};

const Sheets = function ({
  add,
  remove,
  rows,
  empty,
  formatter,
  styles,
  footer,
}: SheetProps) {
  const t = useTranslate();
  return (
    <div className="sheet" style={styles}>
      <div className="sheetHeader">
        {Object.values(formatter)?.map(function (value, index) {
          const format = value(0);
          return (
            <div className="sheetCell" key={`sheet-header-${index}`}>
              {format.title}
            </div>
          );
        })}
        <div className="sheetAction"></div>
      </div>
      <div className="sheetBody">
        {rows?.length ? (
          rows?.map(function (row, rowIndex) {
            return (
              <div className="sheetRow" key={`sheet-row-${rowIndex}`}>
                {Object.entries(formatter)?.map(function (
                  [key, value],
                  cellIndex,
                ) {
                  const format = value(rowIndex);
                  if (format.hidden) return;
                  return (
                    <div
                      className="sheetCell"
                      key={`sheet-row-${rowIndex}-cell-${cellIndex}`}
                    >
                      {format.type === "number" && (
                        <input
                          type="number"
                          value={String(row[key])}
                          min={format?.min}
                          max={format?.max}
                          disabled={format.disabled}
                          placeholder={format?.placeholder}
                          id={`${key}-${rowIndex}-${cellIndex}`}
                          name={`${key}-${rowIndex}-${cellIndex}`}
                          onChange={function (event) {
                            const newRow = rows[rowIndex];
                            newRow[key] = event?.currentTarget?.value || "";
                            format.onChange(row);
                            return;
                          }}
                        />
                      )}
                      {format.type === "text" && (
                        <input
                          type="text"
                          value={row[key]}
                          minLength={format?.min}
                          maxLength={format?.max}
                          disabled={format.disabled}
                          placeholder={format?.placeholder}
                          id={`${key}-${rowIndex}-${cellIndex}`}
                          name={`${key}-${rowIndex}-${cellIndex}`}
                          onChange={function (event) {
                            const newRow = rows[rowIndex];
                            newRow[key] = event?.currentTarget?.value || "";
                            format.onChange(row);
                            return;
                          }}
                        />
                      )}
                      {format.type === "select" && (
                        <select
                          value={row[key]}
                          disabled={format.disabled}
                          id={`${key}-${rowIndex}-${cellIndex}`}
                          name={`${key}-${rowIndex}-${cellIndex}`}
                          onChange={function (event) {
                            const newRow = rows[rowIndex];
                            newRow[key] = event?.currentTarget?.value || "";
                            format.onChange(row);
                            return;
                          }}
                        >
                          {format?.options || format?.options?.length ? (
                            format.options?.map(function (option) {
                              return (
                                <option key={option.id} value={option.value}>
                                  {option.text}
                                </option>
                              );
                            })
                          ) : (
                            <option value="">{t.stacks.no_items}</option>
                          )}
                        </select>
                      )}
                      {format.type === "money" && (
                        <input
                          value={row[key]}
                          disabled={format.disabled}
                          placeholder={format?.placeholder}
                          id={`${key}-${rowIndex}-${cellIndex}`}
                          name={`${key}-${rowIndex}-${cellIndex}`}
                          onChange={function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            return;
                          }}
                          onSelect={function (event) {
                            if (typeof row[key] !== "string") return;
                            event.currentTarget.setSelectionRange(
                              row[key].length || 0,
                              row[key].length || 0,
                            );
                            return;
                          }}
                          onFocus={function (event) {
                            if (typeof row[key] !== "string") return;
                            event.currentTarget.setSelectionRange(
                              row[key].length || 0,
                              row[key].length || 0,
                            );
                            return;
                          }}
                          onKeyDown={function (event) {
                            if (typeof row[key] !== "string") return;
                            event.currentTarget.setSelectionRange(
                              row[key].length || 0,
                              row[key].length || 0,
                            );
                            if (
                              event.key === "ArrowUp" ||
                              event.key === "ArrowLeft" ||
                              event.key === "ArrowRight"
                            ) {
                              event.preventDefault();
                              return;
                            }
                            const valueParsed = Number(row[key]);
                            if (valueParsed === 0 && event.key === "0") return;
                            if (
                              event.key === "Backspace" ||
                              event.key === "Delete"
                            ) {
                              const dotIndex = row[key].indexOf(".") - 1;
                              const str = row[key].replace(/\D/g, "");
                              const newValue = `${str.slice(0, dotIndex)}.${str.slice(dotIndex, str.length - 1)}`;
                              const newRow = rows[rowIndex];
                              newRow[key] = newValue.padStart(4, "0");
                              format.onChange(row);
                              return;
                            }
                            if (row[key].length > 9) return;
                            const characterAllowed = "1234567890";
                            if (characterAllowed.includes(event.key)) {
                              const digit = parseInt(event.key);
                              const digitCents = digit / 100;
                              const valueMultiplied = valueParsed * 10;
                              const valueAdded = valueMultiplied + digitCents;
                              const newValue = valueAdded.toFixed(2);
                              const newRow = rows[rowIndex];
                              newRow[key] = newValue;
                              format.onChange(row);
                              return;
                            }
                            return;
                          }}
                        />
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="remove"
                  onClick={() => remove(rowIndex)}
                >
                  <Trash weight="bold" width={24} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="sheetEmpty">
            <i>{empty || t.stacks.no_items}</i>
          </div>
        )}
      </div>
      <div className="sheetFooter">
        <div className="sheetFooterContainer">{footer}</div>
        <button type="button" className="add" onClick={add}>
          <Plus weight="bold" width={24} />
        </button>
      </div>
    </div>
  );
};

export default Sheets;
