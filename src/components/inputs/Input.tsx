import React from "react";
import { withMask } from "use-mask-input";

// styles
import "./Input.css";

// hooks
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
  value: [string, string];
  styles?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (value: [string, string]) => void;
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
  return (
    <div className="input" style={styles}>
      {(label || helper) && (
        <div className="inputHeader" data-required={String(Boolean(required))}>
          <label htmlFor={id}>{label}</label>
          {helper && <span>{helper}</span>}
        </div>
      )}
      <div className="inputInterval">
        <input
          id={id}
          required
          type="date"
          name={name}
          value={value[0]}
          disabled={disabled}
          readOnly={readOnly}
          onChange={function (event) {
            onChange?.([event.currentTarget?.value || "", value[1]]);
            return;
          }}
        />
        <input
          required
          type="date"
          id={`${id}-1`}
          value={value[1]}
          name={`${name}-1`}
          disabled={disabled}
          readOnly={readOnly}
          onChange={function (event) {
            onChange?.([value[0], event.currentTarget?.value || ""]);
            return;
          }}
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
  const inputRef = withMask(mask);
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
      <div className="inputHeader" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
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
          onKeyDown={function (event) {
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
                    key={`${option.id}${index}`}
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
                      key={`${option.id}${index}`}
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
  InputMoney,
  InputRadio,
  InputSelect,
  InputText,
};
