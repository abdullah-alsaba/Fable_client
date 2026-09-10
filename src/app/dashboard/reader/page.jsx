import { redirect } from "next/navigation";

export const metadata = {
  title: "User Dashboard – Fable Ebook Platform",
  description:
    "View your purchase history, purchased ebooks gallery, profile, and bookmarks.",
};

export default function ReaderDashboardPage() {
  redirect("/dashboard/user");
}
