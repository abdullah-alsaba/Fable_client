"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { User, PenTool, ShieldCheck, ArrowRight } from "lucide-react";

export default function DashboardRootPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user?.role) {
      const role = session.user.role;
      if (role === "writer") {
        router.replace("/dashboard/writer");
      } else if (role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/user");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 rounded-full bg-[#855210]/10 px-4 py-1.5 text-xs font-bold text-[#855210] border border-[#855210]/20">
        Fable Portal Overview
      </div>

      <h1 className="font-playfair text-3xl font-bold text-[#090e14] sm:text-4xl">
        Select Your Dashboard
      </h1>
      <p className="mt-2 max-w-lg text-sm text-[#666666]">
        Choose your active workspace view below to manage titles, view history, or oversee platform statistics.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/dashboard/user"
          className="group flex flex-col justify-between rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs hover:border-[#050d16] hover:shadow-md transition-all text-left"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
              <User size={24} />
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#090e14] group-hover:text-[#855210] transition-colors">
              User Dashboard
            </h2>
            <p className="mt-2 text-xs text-[#666666] leading-relaxed">
              Purchase history, gallery of purchased ebooks, profile management, and bookmarks.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#090e14]">
            <span>Open User View</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/writer"
          className="group flex flex-col justify-between rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs hover:border-[#050d16] hover:shadow-md transition-all text-left"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-4">
              <PenTool size={24} />
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#090e14] group-hover:text-[#855210] transition-colors">
              Writer Dashboard
            </h2>
            <p className="mt-2 text-xs text-[#666666] leading-relaxed">
              Manage ebooks, publish new titles (ImgBB upload), edit books, bookmarks, and sales history.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#090e14]">
            <span>Open Writer View</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin"
          className="group flex flex-col justify-between rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs hover:border-[#050d16] hover:shadow-md transition-all text-left"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#090e14] group-hover:text-[#855210] transition-colors">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-xs text-[#666666] leading-relaxed">
              Analytics overview, Recharts sales and genre charts, user management, ebook management, transactions.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#090e14]">
            <span>Open Admin View</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
