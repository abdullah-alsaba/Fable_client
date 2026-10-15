"use client";

import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  {
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    defaultValue,
    onChange,
    error,
    helperText,
    leftIcon = null,
    rightIcon = null,
    required = false,
    disabled = false,
    className = "",
    inputClassName = "",
    ...props
  },
  ref
) {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#171717] dark:text-[#d1d5db] flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative w-full flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-[#77736d] dark:text-[#a09c95]">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`h-10 w-full rounded-lg border bg-[#fcfbfa] dark:bg-[#1d273f] text-xs text-[#090e14] dark:text-[#f0f0f0] placeholder:text-[#999999] dark:placeholder:text-[#6b7280] transition-colors focus:bg-white dark:focus:bg-[#161f36] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? "pl-10" : "px-3.5"
          } ${rightIcon ? "pr-10" : "px-3.5"} ${
            error
              ? "border-red-500 focus:border-red-600 dark:border-red-600"
              : "border-[#e5e2dc] dark:border-[#253252] focus:border-[#855210] dark:focus:border-[#d4af37]"
          } ${inputClassName}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3.5 flex items-center text-[#77736d] dark:text-[#a09c95]">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-red-600 dark:text-red-400 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#77736d] dark:text-[#a09c95] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
