"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function BookContent({ book }) {
  const { data: session } = useSession();
  const [canReadFull, setCanReadFull] = useState(false);

  const fullText =
    book.description ||
    "Discover an extraordinary literary work available on Fable. Explores captivating themes with rich narrative depth, perfectly suited for the discerning reader.";
  const preview =
    fullText.length > 220 ? `${fullText.slice(0, 220)}...` : fullText;

  useEffect(() => {
    const email = session?.user?.email;
    const writerEmail = book.writerEmail || book.email || "";
    const bookId = String(book._id || book.id || "");

    if (email && writerEmail && email === writerEmail) {
      setCanReadFull(true);
      return;
    }

    if (!email || !bookId) {
      setCanReadFull(false);
      return;
    }

    const checkPurchase = async () => {
      try {
        const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
        const res = await fetch(
          `${serverUri}/api/purchases?userEmail=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          const bought = data.purchases.some(
            (p) =>
              (p.type || "purchase") === "purchase" &&
              String(p.ebookId || p.bookId || "") === bookId
          );
          setCanReadFull(bought);
        }
      } catch {
        setCanReadFull(false);
      }
    };

    checkPurchase();
  }, [session?.user?.email, book._id, book.id, book.writerEmail, book.email]);

  return (
    <div className="space-y-2 pt-2">
      <h3 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#090e14]">
        {canReadFull ? "Full Content" : "Description & Content Preview"}
      </h3>
      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed whitespace-pre-line">
        {canReadFull ? fullText : preview}
      </p>
      {!canReadFull && (
        <p className="text-[11px] font-medium text-[#855210] flex items-center gap-1.5">
          <BookOpen size={12} />
          Purchase this ebook to unlock the full content.
        </p>
      )}
    </div>
  );
}
