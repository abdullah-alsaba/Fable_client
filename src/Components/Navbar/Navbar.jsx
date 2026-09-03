"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ProfileDropdown } from "../ProfileDropDown/ProfileDropDown";

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ProfileSkeleton = () => (
  <div className="flex items-center gap-2">
    <div className="h-9 w-9 rounded-full bg-[#dcd2c3] animate-pulse border border-[#c8bdae]" />
  </div>
);

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const userRole = session?.user?.role || "user";
  const dashboardHref = session?.user ? `/dashboard/${userRole}` : "/dashboard";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Ebooks", href: "/browse-ebooks" },
    { name: "Dashboard", href: dashboardHref },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#e2d9cb] bg-[#eae2d5]/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8 lg:px-12">
          {/* Mobile Hamburger Button (Left) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 text-[#090e14] hover:text-[#a2753b] focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Brand Logo (Center on Mobile, Left on Desktop) */}
          <Link
            href="/"
            className="font-playfair text-2xl font-bold tracking-tight text-[#090e14] transition-opacity hover:opacity-90 sm:text-3xl"
          >
            Fable
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors ${
                    active
                      ? "font-semibold text-[#090e14] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#090e14]"
                      : "text-[#555555] hover:text-[#090e14]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth / Profile Section */}
          <div className="hidden items-center gap-3.5 md:flex min-h-9">
            {isPending ? (
              <ProfileSkeleton />
            ) : session?.user ? (
              <ProfileDropdown user={session.user} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-[#090e14] transition-colors hover:text-[#a2753b]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="flex h-9 items-center justify-center rounded-lg bg-[#050d16] px-4 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Auth / Profile Section */}
          <div className="flex items-center md:hidden min-h-9">
            {isPending ? (
              <ProfileSkeleton />
            ) : session?.user ? (
              <ProfileDropdown user={session.user} />
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-[#090e14] hover:text-[#a2753b]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#e2d9cb] bg-[#eae2d5] px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-sm font-medium transition-colors ${
                      active
                        ? "font-bold text-[#090e14]"
                        : "text-[#555555] hover:text-[#090e14]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="my-2 h-px w-full bg-[#e2d9cb]" />

              {isPending ? (
                <div className="py-2">
                  <ProfileSkeleton />
                </div>
              ) : session?.user ? (
                <div className="py-1">
                  <ProfileDropdown user={session.user} />
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-lg border border-[#090e14] text-xs font-semibold text-[#090e14] transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-[#050d16] text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;