import React from "react";

export function Table({ children, className = "", containerClassName = "", ...props }) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] shadow-2xs ${containerClassName}`}
    >
      <table className={`w-full text-left border-collapse text-xs ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "", ...props }) {
  return (
    <thead
      className={`bg-[#faf8f5] dark:bg-[#1a2238] border-b border-[#e5e2dc] dark:border-[#253252] ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }) {
  return (
    <tbody
      className={`divide-y divide-[#f0ece3] dark:divide-[#202940] bg-white dark:bg-[#141b2d] ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={`transition-colors hover:bg-[#faf8f5]/80 dark:hover:bg-[#182035] ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th
      className={`p-3.5 text-[11px] font-bold uppercase tracking-wider text-[#77736d] dark:text-[#a09c95] select-none ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td
      className={`p-3.5 text-xs text-[#252525] dark:text-[#e0e0e0] leading-relaxed align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export default Table;
