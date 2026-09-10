"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { BookOpen } from "lucide-react";

export default function EbookContent({ book }) {
  const { data: session } = useSession();
  const [canReadFull, setCanReadFull] = useState(false);
  const description = book?.description || "";
  const preview =
    description.length > 220 ? `${description.slice(0, 220)}...` : description;

  const writerEmail = (book?.writerEmail || "").toLowerCase();
  const userEmail = (session?.user?.email || "").toLowerCase();
  const isOwner = userEmail && writerEmail && userEmail === writerEmail;

  useEffect(() => {
    const checkAccess = async () => {
      if (isOwner) {
        setCanReadFull(true);
        return;
      }
      if (!userEmail) {
        setCanReadFull(false);
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
        setCanReadFull(purchased);
      } catch {
        setCanReadFull(false);
      }
    };

    checkAccess();
  }, [userEmail, isOwner, book]);

  return (
    <div className="space-y-2 pt-2">
      <h3 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#090e14]">
        {canReadFull ? "Full Content" : "Description Preview"}
      </h3>
      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed whitespace-pre-line">
        {canReadFull
          ? description ||
            "Discover an extraordinary literary work available on Fable."
          : preview ||
            "Discover an extraordinary literary work available on Fable. Purchase this ebook to unlock the full content."}
      </p>
      {!canReadFull && (
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#855210]">
          <BookOpen size={12} />
          Full content becomes available after purchase.
        </p>
      )}
    </div>
  );
}
