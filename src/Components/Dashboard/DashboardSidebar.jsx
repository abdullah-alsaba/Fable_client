"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  User,
  ShoppingBag,
  BookOpen,
  Bookmark,
  PlusCircle,
  DollarSign,
  LayoutDashboard,
  Users,
  Receipt,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

export default function DashboardSidebar({ user, role, activeTab, setActiveTab, counts = {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedRole = user?.email === "admin@fable.com" ? "admin" : role === "reader" ? "user" : role || "user";

  const userImage =
    user?.image ||
    user?.picture ||
    user?.avatar ||
    user?.profilePicture ||
    user?.photoURL;

  const nameInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const menuConfigs = {
    user: [
      { id: "purchases", label: "Purchase History", icon: ShoppingBag, badge: counts.purchases },
      { id: "purchased-gallery", label: "Purchased Ebooks", icon: BookOpen, badge: counts.purchasedEbooks },
      { id: "profile", label: "Profile Management", icon: User },
      { id: "bookmarks", label: "Bookmark Page", icon: Bookmark, badge: counts.bookmarks },
    ],
    writer: [
      { id: "manage", label: "Manage Ebooks", icon: BookOpen, badge: counts.writerEbooks },
      { id: "add", label: "Add Ebook", icon: PlusCircle },
      { id: "bookmarks", label: "Bookmark Page", icon: Bookmark, badge: counts.bookmarks },
      { id: "sales", label: "Sales History", icon: DollarSign, badge: counts.sales },
    ],
    admin: [
      { id: "overview", label: "Dashboard Home", icon: LayoutDashboard },
      { id: "users", label: "Manage Users", icon: Users, badge: counts.users },
      { id: "ebooks", label: "Manage All Ebooks", icon: BookOpen, badge: counts.allEbooks },
      { id: "transactions", label: "View All Transactions", icon: Receipt, badge: counts.transactions },
    ],
  };

  const navItems = menuConfigs[normalizedRole] || menuConfigs.user;

  return (
    <>
      <div className="lg:hidden flex items-center justify-between border-b border-[#e2d9cb] bg-white px-4 py-3 mb-4 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#090e14] hover:bg-[#f6f4ee] rounded-lg cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-playfair font-bold text-base text-[#090e14] capitalize">
            {normalizedRole} Dashboard
          </span>
        </div>

        <Link
          href="/browse-ebooks"
          className="text-xs font-semibold text-[#855210] hover:underline"
        >
          Storefront
        </Link>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#e2d9cb] p-5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#f0ece3] pb-4 mb-5">
            <Link href="/" className="font-playfair text-2xl font-bold text-[#090e14]">
              Fable
            </Link>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                normalizedRole === "admin"
                  ? "bg-purple-100 text-purple-900 border-purple-200"
                  : normalizedRole === "writer"
                  ? "bg-amber-100 text-amber-900 border-amber-200"
                  : "bg-blue-100 text-blue-900 border-blue-200"
              }`}
            >
              {normalizedRole}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f8f5] border border-[#e5e2dc] mb-6">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-[#dbdad6] bg-[#050d16] flex items-center justify-center text-white font-bold">
              {userImage ? (
                <img
                  src={userImage}
                  alt={user?.name || "User"}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{nameInitial}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="truncate text-xs font-bold text-[#090e14]">
                {user?.name || "Fable User"}
              </p>
              <p className="truncate text-[11px] text-[#77736d]">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#050d16] text-white shadow-xs"
                      : "text-[#555555] hover:bg-[#f6f4ee] hover:text-[#090e14]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active ? "bg-[#855210] text-white" : "bg-[#f0ece3] text-[#090e14]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>


        </div>

        <div className="pt-4 border-t border-[#f0ece3] space-y-2">
          <Link
            href="/browse-ebooks"
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#555555] hover:bg-[#f6f4ee] hover:text-[#090e14] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Store</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span>Log Out</span>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
