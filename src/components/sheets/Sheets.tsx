import React from "react";

// styles
import "./Sheets.css";

// types
import { InputSelectOptions } from "../inputs/Input";
import useTranslate from "../../hooks/useTranslate";

export type SheetsBase = {
  [key: string]: number | string;
};

export type SheetsFormatterType = "number" | "text" | "money" | "select";

export type SheetsFormatter = {
  [key: string]: {
    type: SheetsFormatterType;
    min?: number;
    max?: number;
    placeholder?: string;
    options?: (index: number) => InputSelectOptions[];
    onChange: (row: SheetsBase, index: number) => void;
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
              return (
                <div
                  className="sheetCell"
                  key={`sheet-row-${rowIndex}-cell-${cellIndex}`}
                >
                  {formatter[key].type === "number" && (
                    <input
                      type="number"
                      value={value}
                      min={formatter[key]?.min}
                      max={formatter[key]?.max}
                      placeholder={formatter[key]?.placeholder}
                      id={`${key}-${rowIndex}-${cellIndex}`}
                      name={`${key}-${rowIndex}-${cellIndex}`}
                      onChange={function (event) {
                        const newRow = rows[rowIndex];
                        newRow[key] = event?.currentTarget?.value || "";
                        formatter[key].onChange(row, rowIndex);
                        return;
                      }}
                    />
                  )}
                  {formatter[key].type === "text" && (
                    <input
                      type="text"
                      value={value}
                      minLength={formatter[key]?.min}
                      maxLength={formatter[key]?.max}
                      placeholder={formatter[key]?.placeholder}
                      id={`${key}-${rowIndex}-${cellIndex}`}
                      name={`${key}-${rowIndex}-${cellIndex}`}
                      onChange={function (event) {
                        const newRow = rows[rowIndex];
                        newRow[key] = event?.currentTarget?.value || "";
                        formatter[key].onChange(row, rowIndex);
                        return;
                      }}
                    />
                  )}
                  {formatter[key].type === "select" && (
                    <select
                      value={value}
                      id={`${key}-${rowIndex}-${cellIndex}`}
                      name={`${key}-${rowIndex}-${cellIndex}`}
                      onChange={function (event) {
                        const newRow = rows[rowIndex];
                        newRow[key] = event?.currentTarget?.value || "";
                        formatter[key].onChange(row, rowIndex);
                        return;
                      }}
                    >
                      {formatter[key]?.options ? (
                        formatter[key]
                          .options(rowIndex)
                          ?.map(function (option) {
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
                  {formatter[key].type === "money" && (
                    <input
                      value={value}
                      placeholder={formatter[key]?.placeholder}
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
                          formatter[key].onChange(row, rowIndex);
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
                          formatter[key].onChange(row, rowIndex);
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
              {t.components.remove}
            </button>
          </div>
        );
      })}
      <div className="sheetFooter">
        <div className="sheetFooterContainer">{footer}</div>
        <button type="button" className="add" onClick={add}>
          {t.components.add}
        </button>
      </div>
    </div>
  );
};

// <Sheets
//   rows={form.addresses}
//   onAdd={() => {}}
//   onRemove={(index) => {}}
//   formatter={{
//     street: { type: "text", onChange: (row, index) => {} },
//     number: { type: "number", onChange: (row, index) => {} },
//     city: {
//       type: "text",
//       onChange: (row, index) => {},
//     },
//     state: {
//       type: "select",
//       options: [
//         {
//           id: "ca",
//           value: "ca",
//           text: "California",
//         },
//         {
//           id: "ny",
//           value: "ny",
//           text: "New York",
//         },
//       ],
//       onChange: (row, index) => {},
//     },
//   }}
// />;

export default Sheets;
