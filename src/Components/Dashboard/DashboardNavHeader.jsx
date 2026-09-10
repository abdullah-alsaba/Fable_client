"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, PenTool, ShieldCheck, ArrowLeft } from "lucide-react";

export default function DashboardNavHeader({ activeRole, user }) {
  const pathname = usePathname();

  const normalizedActiveRole = activeRole === "reader" ? "user" : activeRole || "user";

  const roleConfigs = {
    user: {
      title: "User Dashboard",
      subtitle: "Manage your purchases, bookmarks, and account details",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    },
    writer: {
      title: "Writer Dashboard",
      subtitle: "Publish ebooks, manage your catalog, and view sales performance",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Overview platform metrics, users, ebooks, and all transactions",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-200",
    },
  };

  const currentConfig = roleConfigs[normalizedActiveRole] || roleConfigs.user;

  return (
    <div className="mb-8 rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-playfair text-2xl font-bold text-[#090e14] sm:text-3xl">
              {currentConfig.title}
            </h1>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${currentConfig.badgeClass}`}
            >
              {normalizedActiveRole}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#666666] sm:text-sm">
            {currentConfig.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77736d] mr-1">
            Switch View:
          </span>
          <Link
            href="/dashboard/user"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              pathname === "/dashboard/user" || pathname === "/dashboard/reader"
                ? "border-[#050d16] bg-[#050d16] text-white shadow-xs"
                : "border-[#d8d1c7] bg-[#f9f8f5] text-[#2b2b2b] hover:bg-[#ede8df]"
            }`}
          >
            <User size={14} />
            <span>User</span>
          </Link>

          <Link
            href="/dashboard/writer"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              pathname === "/dashboard/writer"
                ? "border-[#050d16] bg-[#050d16] text-white shadow-xs"
                : "border-[#d8d1c7] bg-[#f9f8f5] text-[#2b2b2b] hover:bg-[#ede8df]"
            }`}
          >
            <PenTool size={14} />
            <span>Writer</span>
          </Link>

          <Link
            href="/dashboard/admin"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              pathname === "/dashboard/admin"
                ? "border-[#050d16] bg-[#050d16] text-white shadow-xs"
                : "border-[#d8d1c7] bg-[#f9f8f5] text-[#2b2b2b] hover:bg-[#ede8df]"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Admin</span>
          </Link>

          <Link
            href="/browse-ebooks"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-[#e2d9cb] bg-white px-3 py-1.5 text-xs font-medium text-[#555555] hover:bg-[#f6f4ee] hover:text-[#090e14] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
