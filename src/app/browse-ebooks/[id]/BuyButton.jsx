"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { myToast } from "@/utils/customToast";

export default function BuyButton({ book }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  const writerEmail = (book?.writerEmail || "").toLowerCase();
  const userEmail = (session?.user?.email || "").toLowerCase();
  const isOwner = Boolean(userEmail && writerEmail && userEmail === writerEmail);

  const isSold =
    book?.isSold ||
    book?.sold ||
    (typeof book?.status === "string" && book.status.toLowerCase() === "sold");

  useEffect(() => {
    const checkPurchase = async () => {
      if (!userEmail) {
        setAlreadyPurchased(false);
        return;
      }
      try {
        const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
        const res = await fetch(
          `${serverUri}/api/purchases?userEmail=${encodeURIComponent(userEmail)}`
        );
        const data = await res.json();
        const bookId = String(book?._id || book?.id || "");
        const purchased =
          data.success &&
          Array.isArray(data.purchases) &&
          data.purchases.some(
            (p) =>
              (p.type || "purchase") === "purchase" &&
              String(p.ebookId || "") === bookId
          );
        setAlreadyPurchased(purchased);
      } catch {
        setAlreadyPurchased(false);
      }
    };

    checkPurchase();
  }, [userEmail, book]);

  const handleBuy = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (isOwner) {
      myToast.error("You cannot purchase your own ebook.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          bookId: String(book._id || book.id),
          title: book.title,
          price: book.price || 0,
          cover: book.coverImage || book.cover || "",
          writerName: book.writerName || book.author || "Fable Writer",
          writerEmail: book.writerEmail || "",
          genre: book.genre || "Fiction",
          userEmail: session.user.email,
          userName: session.user.name || "",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        myToast.error(data.error || "Payment session failed");
      }
    } catch (err) {
      myToast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (alreadyPurchased) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs cursor-not-allowed"
      >
        <CheckCircle2 size={16} />
        Already Purchased
      </button>
    );
  }

  if (isOwner) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-300 cursor-not-allowed"
      >
        Your Own Ebook
      </button>
    );
  }

  if (isSold) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-300 cursor-not-allowed"
      >
        Item Sold Out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={loading}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <ShoppingCart size={16} />
          {session?.user ? "Get This Ebook" : "Login to Purchase"}
        </>
      )}
    </button>
  );
}
