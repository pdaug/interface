import { withMask } from "use-mask-input";
import React, { forwardRef } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import { endOfDay, isSameDay, isToday, startOfDay, subDays } from "date-fns";

// locale
import { ptBR, enUS } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
registerLocale("pt", ptBR);
registerLocale("en", enUS);

// styles
import "./Input.css";
import "./InputInterval.css";

// components
import Button from "../buttons/Button";
import { Horizontal, Vertical } from "../aligns/Align";

// hooks
import useSystem from "../../hooks/useSystem";
import useDateTime from "../../hooks/useDateTime";
import useTranslate from "../../hooks/useTranslate";

export type InputProps = {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  step?: number;
  name?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helper?: string;
  list?: string;
  stylesInput?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = function ({
  id,
  label,
  value,
  step,
  list,
  name,
  type = "text",
  onChange,
  placeholder,
  min,
  max,
  stylesInput,
  disabled,
  required,
  readOnly,
  helper,
}: InputProps) {
  return (
    <div className="input">
      {label && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          <span style={{ opacity: helper ? 1 : 0 }}>{helper || ""}</span>
        </div>
      )}
      <div className="inputContent">
        <input
          id={id}
          name={name}
          list={list}
          type={type}
          step={step}
          value={value}
          style={stylesInput}
          disabled={disabled}
          required={required}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          {...(type === "number"
            ? {
                min,
                max,
              }
            : {
                minLength: min,
                maxLength: max,
              })}
        />
      </div>
    </div>
  );
};

export type InputCheckOption = {
  id: string;
  value: string;
  label: string;
};

export type InputCheckProps<T extends string[] | boolean> = {
  id?: string;
  label?: string;
  name?: string;
  options: InputCheckOption[];
  value: T;
  horizontal?: boolean;
  onChange?: (value: T) => void;
};

function InputCheck(props: InputCheckProps<string[]>): React.JSX.Element;
function InputCheck(props: InputCheckProps<boolean>): React.JSX.Element;
function InputCheck<T extends string[] | boolean>({
  id,
  name,
  label,
  options,
  value,
  horizontal = false,
  onChange,
}: InputCheckProps<T>) {
  const option = options?.[0];
  const isMultiple = Array.isArray(value);
  return isMultiple ? (
    <div className="inputCheckContainer">
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`inputCheck ${!horizontal ? "inputCheckVertical" : ""}`}>
        {options.map((option) => (
          <label htmlFor={option.id} key={option.id}>
            <div className="inputCheckOptionContent">
              <div className="inputCheckOption" />
            </div>
            <input
              type="checkbox"
              id={option.id}
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={function () {
                if (!onChange) return;
                const exists = value.includes(option.value);
                const updated = exists
                  ? value.filter((valueState) => valueState !== option.value)
                  : [...value, option.value];

                onChange(updated as T);
              }}
            />
            {label && <span>{option.label}</span>}
          </label>
        ))}
      </div>
    </div>
  ) : (
    <div className="inputCheckContainer">
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`inputCheck ${!horizontal ? "inputCheckVertical" : ""}`}>
        <label htmlFor={option.id}>
          <div className="inputCheckOptionContent">
            <div className="inputCheckOption" />
          </div>
          <input
            type="checkbox"
            id={option.id}
            name={name}
            checked={value}
            onChange={function () {
              if (!onChange) return;
              onChange(!value as T);
            }}
          />
          <span>{option.label}</span>
        </label>
      </div>
    </div>
  );
}

export type InputColorProps = {
  id?: string;
  label: string;
  value: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helper?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputColor = function ({
  id,
  label,
  value,
  name,
  onChange,
  disabled,
  required,
  readOnly,
  helper,
}: InputColorProps) {
  return (
    <div className="input">
      {label && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          <span style={{ opacity: helper ? 1 : 0 }}>{helper || ""}</span>
        </div>
      )}
      <div className="inputColor">
        <input
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          readOnly={readOnly}
        />
        <input
          id={id}
          name={name}
          type="color"
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export type InputFileProps = {
  id?: string;
  label: string;
  value?: File | FileList | null;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  accept?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputFile = function ({
  id,
  label,
  value,
  name,
  accept,
  multiple,
  onChange,
  disabled,
  required,
  helper,
}: InputFileProps) {
  const t = useTranslate();
  return (
    <div className="input">
      <div className="inputHeader" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <label htmlFor={id} className="inputFile">
        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          onChange={onChange}
        />
        <a className={disabled ? "disabled" : ""}>{t.components.choose_file}</a>
        <div
          className={`inputFileInfo ${disabled ? "inputFileInfoDisabled" : ""}`}
        >
          <span>
            {value instanceof File && value.name
              ? value.name
              : value instanceof FileList && value.length
                ? Array.from(value)
                    ?.map(function (file) {
                      return file.name;
                    })
                    ?.join(", ")
                : t.components.no_file_choosen}
          </span>
        </div>
      </label>
    </div>
  );
};

export type InputIntervalProps = {
  id?: string;
  label: string;
  helper?: string;
  name?: string;
  value: [Date | null, Date | null];
  styles?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (value: [Date | null, Date | null]) => void;
};

const InputInterval = function ({
  id,
  label,
  helper,
  value,
  name,
  styles,
  disabled,
  required,
  readOnly,
  onChange,
}: InputIntervalProps) {
  const t = useTranslate();
  const { instance } = useSystem();
  const { instanceDate } = useDateTime();

  const noFilterDate = !value[0] && !value[1];

  const isIntervalToday =
    value[0] && value[1] && isToday(value[0]) && isToday(value[1]);

  const isIntervalWeek =
    value[0] &&
    value[1] &&
    isSameDay(value[0], subDays(new Date(), 7)) &&
    isToday(value[1]);

  const isIntervalMonth =
    value[0] &&
    value[1] &&
    isSameDay(value[0], subDays(new Date(), 30)) &&
    isToday(value[1]);

  const ButtonInputInterval = forwardRef<
    HTMLDivElement,
    React.DOMAttributes<HTMLDivElement>
  >(function (props, ref) {
    return (
      <div ref={ref} {...props} className="inputIntervalInner">
        {isIntervalToday ||
        isIntervalWeek ||
        isIntervalMonth ||
        noFilterDate ? (
          <span>
            {noFilterDate && t.components.no_filter_date}
            {isIntervalToday && t.components.today}
            {isIntervalWeek && t.components.this_week}
            {isIntervalMonth && t.components.this_month}
          </span>
        ) : (
          <React.Fragment>
            <span>{value[0] && instanceDate(value[0])}</span>
            <span>{value[1] && instanceDate(value[1])}</span>
          </React.Fragment>
        )}
      </div>
    );
  });

  ButtonInputInterval.displayName = "Custom";

  const ContainerInputInterval = function ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) {
    return (
      <CalendarContainer className={className}>
        <Vertical>
          {children}
          <Vertical internal={0.4} external={0.4}>
            <Horizontal internal={0.4}>
              <Button
                type="button"
                style={{ flex: 1 }}
                text={t.components.today}
                category={isIntervalToday ? "Info" : "Neutral"}
                onClick={function () {
                  if (onChange)
                    onChange([startOfDay(new Date()), endOfDay(new Date())]);
                  return;
                }}
              />
              <Button
                type="button"
                style={{ flex: 1 }}
                text={t.components.no_filter_date}
                category={!value[0] && !value[1] ? "Warning" : "Neutral"}
                onClick={function () {
                  if (onChange) onChange([null, null]);
                  return;
                }}
              />
            </Horizontal>
            <Button
              type="button"
              category={isIntervalWeek ? "Info" : "Neutral"}
              text={t.components.this_week}
              onClick={function () {
                if (onChange)
                  onChange([
                    startOfDay(subDays(new Date(), 7)),
                    endOfDay(new Date()),
                  ]);
                return;
              }}
            />
            <Button
              type="button"
              category={isIntervalMonth ? "Info" : "Neutral"}
              text={t.components.this_month}
              onClick={function () {
                if (onChange)
                  onChange([
                    startOfDay(subDays(new Date(), 30)),
                    endOfDay(new Date()),
                  ]);
                return;
              }}
            />
          </Vertical>
        </Vertical>
      </CalendarContainer>
    );
  };

  return (
    <div className="input" style={styles}>
      {(label || helper) && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          {helper && <span>{helper}</span>}
        </div>
      )}
      <div className="inputInterval">
        <DatePicker
          selectsRange
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          selected={value[0]}
          startDate={value[0]}
          endDate={value[1]}
          locale={instance.language}
          onChange={function (date) {
            if (onChange)
              onChange([
                date[0] ? startOfDay(date[0]) : null,
                date[1] ? endOfDay(date[1]) : null,
              ]);
            return;
          }}
          customInput={<ButtonInputInterval />}
          calendarContainer={ContainerInputInterval}
        />
      </div>
    </div>
  );
};

export type InputMaskProps = {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  mask: string | string[];
  name?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helper?: string;
  list?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputMask = function ({
  id,
  label,
  value,
  mask,
  name,
  onChange,
  placeholder,
  minLength,
  maxLength,
  disabled,
  required,
  readOnly,
  helper,
}: InputMaskProps) {
  const inputRef = withMask(mask, {
    autoUnmask: true,
  });
  return (
    <div className="input">
      <div className="inputHeader" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="inputContent">
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          ref={inputRef}
          disabled={disabled}
          required={required}
          onChange={onChange}
          readOnly={readOnly}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export type InputMaskV2Props = {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  mask: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helper?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputMaskV2 = function ({
  id,
  label,
  value,
  mask,
  name,
  onChange,
  placeholder,
  disabled,
  required,
  readOnly,
  helper,
}: InputMaskV2Props) {
  return (
    <div className="input">
      <div className="inputHeader" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="inputContent">
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          onSelect={function (event) {
            event.currentTarget.setSelectionRange(
              value.length || 0,
              value.length || 0,
            );
            return;
          }}
          onChange={function () {
            return;
          }}
          onKeyDown={function (event) {
            event.currentTarget.setSelectionRange(
              value.length || 0,
              value.length || 0,
            );
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              return;
            }
            const currentIndex = value.length;
            const currentMaskChar = mask[currentIndex];
            const nextMaskChart = mask[currentIndex + 1];
            // cloning value
            let newValue = `${value}`;
            // if backspace
            if (
              event.key === "Del" ||
              event.key === "Delete" ||
              event.key === "Backspace"
            ) {
              newValue = newValue.slice(0, -1);
              onChange?.({
                currentTarget: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>);
              return;
            }
            // add letter
            if (
              event.key.length === 1 &&
              currentMaskChar === "A" &&
              /[a-zA-Z]{1}/.test(event.key)
            ) {
              newValue += event.key;
              onChange?.({
                currentTarget: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>);
            }
            // add number
            if (
              event.key.length === 1 &&
              currentMaskChar === "9" &&
              /[0-9]{1}/.test(event.key)
            ) {
              newValue += event.key;
              onChange?.({
                currentTarget: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>);
            }
            // add letter or number
            if (
              event.key.length === 1 &&
              currentMaskChar === "#" &&
              /[a-zA-Z0-9]{1}/.test(event.key)
            ) {
              newValue += event.key;
              onChange?.({
                currentTarget: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>);
            }
            // if next is mask other character
            if (
              nextMaskChart !== "A" &&
              nextMaskChart !== "9" &&
              ["-", "_", "."].includes(nextMaskChart)
            ) {
              newValue += nextMaskChart;
              onChange?.({
                currentTarget: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>);
            }
            return;
          }}
        />
      </div>
    </div>
  );
};

export type InputMoneyProps = {
  id?: string;
  label: string;
  value: string;
  currency?: string;
  setCurrency?: (currency: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  readOnly?: boolean;
  helper?: string;
  onChange?: (digit: string, currency: string) => void;
};

const InputMoney = function ({
  id,
  label,
  value,
  name,
  currency,
  setCurrency,
  placeholder,
  disabled,
  required,
  helper,
  readOnly,
  onChange,
}: InputMoneyProps) {
  return (
    <div className="input">
      {label && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          {helper && <span>{helper}</span>}
        </div>
      )}
      <div className={`inputMoney ${currency ? "inputMoneyCurrency" : ""}`}>
        <input
          id={id}
          type="text"
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={function (event) {
            event.stopPropagation();
            event.preventDefault();
            return;
          }}
          onSelect={function (event) {
            event.currentTarget.setSelectionRange(
              value.length || 0,
              value.length || 0,
            );
            return;
          }}
          onFocus={function (event) {
            event.currentTarget.setSelectionRange(
              value.length || 0,
              value.length || 0,
            );
            return;
          }}
          onKeyDown={function (event) {
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
            if (event.key === "Backspace" || event.key === "Delete") {
              const dotIndex = value.indexOf(".") - 1;
              const str = value.replace(/\D/g, "");
              const newValue = `${str.slice(0, dotIndex)}.${str.slice(dotIndex, str.length - 1)}`;
              if (onChange) {
                onChange(newValue.padStart(4, "0"), currency || "USD");
              }
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
              if (onChange) {
                onChange(newValue, currency || "USD");
              }
              return;
            }
            return;
          }}
        />
        {currency && (
          <select
            value={currency}
            disabled={disabled || readOnly}
            onChange={(event) => setCurrency?.(event.currentTarget.value)}
          >
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
            <option value="EUR">EUR</option>
          </select>
        )}
      </div>
    </div>
  );
};

export type InputRadioOptions = {
  id: string;
  value: string;
  label: string;
}[];

export type InputRadioProps = {
  id?: string;
  label?: string;
  options: InputRadioOptions;
  value: string;
  name?: string;
  horizontal?: boolean;
  onChange?: (value: string) => void;
};

const InputRadio = function ({
  id,
  label,
  name,
  options,
  value,
  horizontal,
  onChange,
}: InputRadioProps) {
  return (
    <div className="inputRadioContainer">
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`inputRadio ${horizontal ? "" : "inputRadioVertical"}`}>
        {options?.map(function (option, index) {
          return (
            <label htmlFor={option.id} key={`${option.id}${index}`}>
              <div className="inputRadioOptionContent">
                <div className="inputRadioOption"></div>
              </div>
              <input
                name={name}
                type="radio"
                id={option.id}
                value={option.value}
                checked={value === option.value}
                onChange={function () {
                  if (onChange) {
                    onChange(option.value);
                  }
                  return;
                }}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export type InputSelectOptions = {
  id: string;
  value: string;
  text: string;
  disabled?: boolean;
  group?: string;
};

export type InputSelectProps = {
  id?: string;
  label: string;
  empty: string;
  value: string;
  options: InputSelectOptions[];
  disabled?: boolean;
  name?: string;
  required?: boolean;
  helper?: string;
  styles?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

const InputSelect = function ({
  id,
  empty,
  label,
  name,
  value,
  options,
  disabled,
  required,
  helper,
  styles,
  onChange,
}: InputSelectProps) {
  const optionsGroupped: { [groupName: string]: InputSelectOptions[] } = {
    default: [],
  };
  options.forEach(function (option) {
    if (option?.group) {
      if (Array.isArray(optionsGroupped?.[option.group])) {
        optionsGroupped[option.group].push(option);
        return;
      }
      optionsGroupped[option.group] = [option];
      return;
    }
    optionsGroupped.default.push(option);
    return;
  });
  return (
    <div className="input" style={styles}>
      {label && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          {helper && <span>{helper}</span>}
        </div>
      )}
      <div className="inputContent">
        <select
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
        >
          {!value && (
            <option value="" disabled>
              {empty}
            </option>
          )}
          {Object.entries(optionsGroupped)?.map(function (
            [groupName, groupOptions],
            index,
          ) {
            if (groupName === "default") {
              return groupOptions?.map(function (option) {
                return (
                  <option
                    value={option.value}
                    key={`${option.id}-${index}`}
                    disabled={option.disabled}
                  >
                    {option.text}
                  </option>
                );
              });
            }
            return (
              <optgroup key={`${groupName}${index}`} label={groupName}>
                {groupOptions?.map(function (option) {
                  return (
                    <option
                      value={option.value}
                      key={`${option.id}-${index}`}
                      disabled={option.disabled}
                    >
                      {option.text}
                    </option>
                  );
                })}
              </optgroup>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export type InputTextProps = {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  name?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helper?: string;
  height?: number;
  resize?: React.CSSProperties["resize"];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const InputText = function ({
  id,
  label,
  value,
  name,
  onChange,
  placeholder,
  min,
  max,
  disabled,
  required,
  readOnly,
  helper,
  height,
  resize,
}: InputTextProps) {
  return (
    <div className="input">
      <div className="inputHeader" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="inputContent">
        <textarea
          id={id}
          name={name}
          value={value}
          rows={height}
          disabled={disabled}
          required={required}
          onChange={onChange}
          style={{ resize }}
          readOnly={readOnly}
          minLength={min}
          maxLength={max}
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
};

export {
  Input,
  InputCheck,
  InputColor,
  InputFile,
  InputInterval,
  InputMask,
  InputMaskV2,
  InputMoney,
  InputRadio,
  InputSelect,
  InputText,
};
