import React from "react";
import { withMask } from "use-mask-input";

// styles
import "./Form.css";

export type FormCheckOption = {
  id: string;
  value: string;
  label: string;
};

export type FormCheckProps<T extends string[] | boolean> = {
  id?: string;
  label?: string;
  name?: string;
  options: FormCheckOption[];
  value: T;
  horizontal?: boolean;
  onChange?: (value: T) => void;
};

function FormCheck(props: FormCheckProps<string[]>): React.JSX.Element;
function FormCheck(props: FormCheckProps<boolean>): React.JSX.Element;
function FormCheck<T extends string[] | boolean>({
  id,
  name,
  label,
  options,
  value,
  horizontal = false,
  onChange,
}: FormCheckProps<T>) {
  const option = options[0];
  const isMultiple = Array.isArray(value);
  return isMultiple ? (
    <div className="fz-form-check-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`fz-form-check ${!horizontal ? "fz-form-check-vertical" : ""}`}
      >
        {options.map((option) => (
          <label htmlFor={option.id} key={option.id}>
            <div className="fz-form-check-option-content">
              <div className="fz-form-check-option" />
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
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  ) : (
    <div className="fz-form-check-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`fz-form-check ${!horizontal ? "fz-form-check-vertical" : ""}`}
      >
        <label htmlFor={option.id}>
          <div className="fz-form-check-option-content">
            <div className="fz-form-check-option" />
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

export type FormFileProps = {
  id?: string;
  label: string;
  value?: File | FileList | null;
  name?: string;
  mimetype?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  accept?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const FormFile = function ({
  id,
  label,
  value,
  name,
  mimetype,
  accept,
  multiple,
  onChange,
  disabled,
  required,
  helper,
}: FormFileProps) {
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <label htmlFor={id} className="fz-form-file">
        <button disabled={disabled}>{mimetype || "Choose file"}</button>
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
        <div
          className={`fz-form-file-info ${disabled ? "fz-form-file-info-disabled" : ""}`}
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
                : "No file chosen"}
          </span>
        </div>
      </label>
    </div>
  );
};

export type FormInputProps = {
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

const FormInput = function ({
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
}: FormInputProps) {
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        <span style={{ opacity: helper ? 1 : 0 }}>{helper || ""}</span>
      </div>
      <div className="fz-form-content">
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

export type FormMaskProps = {
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

const FormMask = function ({
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
}: FormMaskProps) {
  const inputRef = withMask(mask);
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="fz-form-content">
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

export type FormMoneyProps = {
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

const FormMoney = function ({
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
}: FormMoneyProps) {
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div
        className={`fz-form-money ${currency ? "fz-form-money-currency" : ""}`}
      >
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

export type FormRadioOptions = {
  id: string;
  value: string;
  label: string;
}[];

export type FormRadioProps = {
  id?: string;
  label?: string;
  options: FormRadioOptions;
  value: string;
  name?: string;
  horizontal?: boolean;
  onChange?: (value: string) => void;
};

const FormRadio = function ({
  id,
  label,
  name,
  options,
  value,
  horizontal,
  onChange,
}: FormRadioProps) {
  return (
    <div className="fz-form-radio-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`fz-form-radio ${horizontal ? "" : "fz-form-radio-vertical"}`}
      >
        {options?.map(function (option, index) {
          return (
            <label htmlFor={option.id} key={`${option.id}${index}`}>
              <div className="fz-form-radio-option-content">
                <div className="fz-form-radio-option"></div>
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

export type FormSelectOptions = {
  id: string;
  value: string;
  text: string;
  disabled?: boolean;
  group?: string;
};

export type FormSelectProps = {
  id?: string;
  label: string;
  empty: string;
  value: string;
  options: FormSelectOptions[];
  disabled?: boolean;
  name?: string;
  required?: boolean;
  helper?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

const FormSelect = function ({
  id,
  empty,
  label,
  name,
  value,
  options,
  disabled,
  required,
  helper,
  onChange,
}: FormSelectProps) {
  const optionsGroupped: { [groupName: string]: FormSelectOptions[] } = {
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
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="fz-form-content">
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

export type FormTextProps = {
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

const FormText = function ({
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
}: FormTextProps) {
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <div className="fz-form-content">
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
  FormCheck,
  FormFile,
  FormInput,
  FormMask,
  FormMoney,
  FormRadio,
  FormSelect,
  FormText,
};
