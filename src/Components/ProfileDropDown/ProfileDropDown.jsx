"use client";

import { signOut } from "@/lib/auth-client";
import {
  ArrowRightFromSquare,
  House,
  BookOpen,
  LayoutHeader,
} from "@gravity-ui/icons";
import { Avatar, Dropdown } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export function ProfileDropdown({ user }) {
   
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const userImage = user?.image || user?.avatar || user?.profilePicture;
  const nameInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";
  const userRole = user?.role || "user";
  const dashboardPath = userRole ? `/dashboard/${userRole}` : "/dashboard";

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full cursor-pointer outline-none transition-transform active:scale-95">
        {userImage ? (
          <Avatar size="sm" className="border border-[#dbdad6] shadow-xs">
            <Avatar.Image alt={user?.name || "User Avatar"} src={userImage} />
            <Avatar.Fallback>{nameInitial}</Avatar.Fallback>
          </Avatar>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#050d16] font-sans text-sm font-bold text-white shadow-xs border border-[#050d16]">
            {nameInitial}
          </div>
        )}
      </Dropdown.Trigger>

      <Dropdown.Popover className="w-56 rounded-xl border border-[#e5e2dc] bg-white p-2 shadow-md">
        {/* User Info Header */}
        <div className="flex items-center gap-2.5 px-2 py-2 border-b border-[#f0ece3] mb-1">
          {userImage ? (
            <Avatar size="sm">
              <Avatar.Image alt={user?.name || "User"} src={userImage} />
              <Avatar.Fallback>{nameInitial}</Avatar.Fallback>
            </Avatar>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#855210] font-sans text-xs font-bold text-white shadow-xs">
              {nameInitial}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <p className="truncate text-xs font-bold text-[#090e14]">
              {user?.name || "User"}
            </p>
            <p className="truncate text-[11px] text-[#77736d]">
              {user?.email || ""}
            </p>
          </div>
        </div>

      
        <div className="py-1 space-y-0.5 text-xs font-medium text-[#252525]">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[#f6f4ee] transition-colors"
          >
            <House className="size-4 text-[#77736d]" />
            <span>Home</span>
          </Link>

          <Link
            href="/browse-ebooks"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[#f6f4ee] transition-colors"
          >
            <BookOpen className="size-4 text-[#77736d]" />
            <span>Browse Ebooks</span>
          </Link>

          <Link
            href={dashboardPath}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[#f6f4ee] transition-colors"
          >
            <LayoutHeader className="size-4 text-[#77736d]" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="my-1.5 h-px bg-[#f0ece3]" />

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <span>Log Out</span>
          <ArrowRightFromSquare className="size-4 text-red-500" />
        </button>
      </Dropdown.Popover>
    </Dropdown>
  );
}
