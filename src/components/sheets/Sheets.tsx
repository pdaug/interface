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
    min?: number;
    max?: number;
    hidden?: boolean;
    placeholder?: string;
    options?: InputSelectOptions[];
    onChange: (row: SheetsBase) => void;
  };
};

export type SheetProps = {
  add: () => void;
  remove: (index: number) => void;
  rows: SheetsBase[];
  formatter: SheetsFormatter;
  styles?: React.CSSProperties;
  footer?: React.ReactNode;
};

const Sheets = function ({
  add,
  remove,
  rows,
  formatter,
  styles,
  footer,
}: SheetProps) {
  const t = useTranslate();
  return (
    <div className="sheet" style={styles}>
      {rows?.map(function (row, rowIndex) {
        return (
          <div className="sheetRow" key={`sheet-row-${rowIndex}`}>
            {Object.entries(row)?.map(function ([key, value], cellIndex) {
              if (!formatter?.[key]) return;
              const format = formatter?.[key](rowIndex);
              if (format.hidden) return;
              return (
                <div
                  className="sheetCell"
                  key={`sheet-row-${rowIndex}-cell-${cellIndex}`}
                >
                  {format.type === "number" && (
                    <input
                      type="number"
                      value={value}
                      min={format?.min}
                      max={format?.max}
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
                      value={value}
                      minLength={format?.min}
                      maxLength={format?.max}
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
                      value={value}
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
                      value={value}
                      placeholder={format?.placeholder}
                      id={`${key}-${rowIndex}-${cellIndex}`}
                      name={`${key}-${rowIndex}-${cellIndex}`}
                      onChange={function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        return;
                      }}
                      onSelect={function (event) {
                        if (typeof value !== "string") return;
                        event.currentTarget.setSelectionRange(
                          value.length || 0,
                          value.length || 0,
                        );
                        return;
                      }}
                      onFocus={function (event) {
                        if (typeof value !== "string") return;
                        event.currentTarget.setSelectionRange(
                          value.length || 0,
                          value.length || 0,
                        );
                        return;
                      }}
                      onKeyDown={function (event) {
                        if (typeof value !== "string") return;
                        event.currentTarget.setSelectionRange(
                          value.length || 0,
                          value.length || 0,
                        );
                        if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowLeft" ||
                          event.key === "ArrowRight"
                        ) {
                          event.preventDefault();
                          return;
                        }
                        const valueParsed = Number(value);
                        if (valueParsed === 0 && event.key === "0") return;
                        if (
                          event.key === "Backspace" ||
                          event.key === "Delete"
                        ) {
                          const dotIndex = value.indexOf(".") - 1;
                          const str = value.replace(/\D/g, "");
                          const newValue = `${str.slice(0, dotIndex)}.${str.slice(dotIndex, str.length - 1)}`;
                          const newRow = rows[rowIndex];
                          newRow[key] = newValue.padStart(4, "0");
                          format.onChange(row);
                          return;
                        }
                        if (value.length > 9) return;
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
      })}
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
