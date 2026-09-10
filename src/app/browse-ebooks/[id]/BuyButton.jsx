"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function BuyButton({ book }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    // If not logged in, redirect to login
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        alert("Payment session failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
