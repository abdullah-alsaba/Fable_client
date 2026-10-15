import UserDashboard from "@/Components/Dashboard/UserDashboard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "User Dashboard – Fable Ebook Platform",
  description: "View your purchase history, purchased ebooks gallery, profile, and bookmarks.",
};

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-sm font-semibold text-[#855210]">
          Loading dashboard...
        </div>
      }
    >
      <UserDashboard />
    </Suspense>
  );
}

