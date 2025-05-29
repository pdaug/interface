import React from "react";
import { withMask } from "use-mask-input";

// styles
import "./Form.css";

export type FormCheckOptions = {
  id: string;
  value: string;
  label: string;
}[];

export type FormCheckProps = {
  options: FormCheckOptions;
  values: string[];
  name?: string;
  horizontal?: boolean;
  onChange?: (value: string[]) => void;
};

const FormCheck = function ({
  name,
  options,
  values,
  horizontal,
  onChange,
}: FormCheckProps) {
  return (
    <div
      className={`fz-form-check ${!horizontal ? "fz-form-check-vertical" : ""}`}
    >
      {options?.map(function (option, index) {
        return (
          <label htmlFor={option.id} key={`${option.id}${index}`}>
            <div className="fz-form-check-option-content">
              <div className="fz-form-check-option"></div>
            </div>
            <input
              name={name}
              type="checkbox"
              id={option.id}
              value={option.value}
              checked={Array.isArray(values) && values.includes(option.value)}
              onChange={function () {
                const valueIndex = values.findIndex(function (currentValue) {
                  return currentValue === option.value;
                });
                const cloneValues = window.structuredClone([...values]);
                if (valueIndex > -1) {
                  cloneValues.splice(valueIndex, 1);
                } else {
                  cloneValues.push(option.value);
                }
                onChange?.(cloneValues);
                return;
              }}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export type FormCheckSimpleProps = {
  id: string;
  name?: string;
  label?: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const FormCheckSimple = function ({
  id,
  name,
  label,
  value,
  onChange,
}: FormCheckSimpleProps) {
  return (
    <div className="fz-form-check">
      <label htmlFor={id}>
        <div className="fz-form-check-option-content">
          <div className="fz-form-check-option"></div>
        </div>
        <input
          id={id}
          name={name}
          type="checkbox"
          onChange={function (event) {
            onChange?.(event);
            return;
          }}
          checked={Boolean(value)}
        />
        {label && <span>{label}</span>}
      </label>
    </div>
  );
};

export type FormFileProps = {
  id: string;
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

const FormFile = function ({
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
}: FormFileProps) {
  return (
    <div className="fz-form">
      <div className="fz-form-header" data-required={String(Boolean(required))}>
        <label htmlFor={id}>{label}</label>
        {helper && <span>{helper}</span>}
      </div>
      <label htmlFor={id} className="fz-form-file">
        <button>Escolher arquivo(s)</button>
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
        <div className="fz-form-file-info">
          <span>
            {value instanceof File && value.name
              ? value.name
              : value instanceof FileList && value.length
                ? Array.from(value)
                    ?.map(function (file) {
                      return file.name;
                    })
                    ?.join(", ")
                : "Nenhum arquivo escolhido"}
          </span>
        </div>
      </label>
    </div>
  );
};

export type FormInputProps = {
  id: string;
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
        {helper && <span>{helper}</span>}
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
  id: string;
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
  id: string;
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  readOnly?: boolean;
  helper?: string;
  onChange?: (digit: string) => void;
};

const FormMoney = function ({
  id,
  label,
  value,
  name,
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
      <div className="fz-form-money">
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
            if (valueParsed === 0 && event.key === "0") {
              return;
            }
            if (event.key === "Backspace" || event.key === "Delete") {
              const dotIndex = value.indexOf(".") - 1;
              const str = value.replace(/\D/g, "");
              const newValue = `${str.slice(0, dotIndex)}.${str.slice(dotIndex, str.length - 1)}`;
              if (onChange) {
                onChange(newValue.padStart(4, "0"));
              }
              return;
            }
            if (value.length > 8) {
              return;
            }
            const characterAllowed = "1234567890";
            if (characterAllowed.includes(event.key)) {
              const digit = parseInt(event.key);
              const digitCents = digit / 100;
              const valueMultiplied = valueParsed * 10;
              const valueAdded = valueMultiplied + digitCents;
              const newValue = valueAdded.toFixed(2);
              if (onChange) {
                onChange(newValue);
              }
              return;
            }
            return;
          }}
        />
        <select disabled={disabled}>
          <option value="usd">USD</option>
          <option value="brl">BRL</option>
          <option value="eur">EUR</option>
        </select>
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
  options: FormRadioOptions;
  value: string;
  name?: string;
  horizontal?: boolean;
  onChange?: (value: string) => void;
};

const FormRadio = function ({
  name,
  options,
  value,
  horizontal,
  onChange,
}: FormRadioProps) {
  return (
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
  );
};

export type FormSelectOptions = {
  id: string;
  value: string;
  text: string;
  disabled?: boolean;
  optionGroup?: string;
};

export type FormSelectProps = {
  id: string;
  label: string;
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
    if (option?.optionGroup) {
      if (Array.isArray(optionsGroupped?.[option.optionGroup])) {
        optionsGroupped[option.optionGroup].push(option);
        return;
      }
      optionsGroupped[option.optionGroup] = [option];
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
              Nenhuma opção selecionada
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
  id: string;
  label: string;
  value: string;
  placeholder: string;
  name?: string;
  minLength?: number;
  maxLength?: number;
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
  minLength,
  maxLength,
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
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
};

export {
  FormCheck,
  FormCheckSimple,
  FormFile,
  FormInput,
  FormMask,
  FormMoney,
  FormRadio,
  FormSelect,
  FormText,
};
