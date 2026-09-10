import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, BookOpen, Home, ShoppingBag } from "lucide-react";

async function savePurchaseToDB(session) {
  try {
    const meta = session.metadata || {};
    const serverUri = process.env.NEXT_SERVER_URI || "http://localhost:8989";

    const purchase = {
      ebookId: meta.bookId || "",
      ebookTitle: meta.title || "Unknown Ebook",
      writerName: meta.writerName || "Fable Writer",
      writerEmail: meta.writerEmail || "",
      userEmail: meta.userEmail || session.customer_details?.email || "",
      userName: meta.userName || session.customer_details?.name || "",
      amount: parseFloat(meta.price) || 0,
      price: parseFloat(meta.price) || 0,
      genre: meta.genre || "Fiction",
      cover:
        meta.cover ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      status: "Completed",
    };

    const res = await fetch(`${serverUri}/api/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
      cache: "no-store",
    });

    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("Failed to save purchase:", err.message);
    return false;
  }
}

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return redirect("/");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
  } catch {
    return redirect("/");
  }

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status !== "complete") {
    return redirect("/");
  }

  // Save purchase to MongoDB
  await savePurchaseToDB(session);

  const meta = session.metadata || {};
  const customerEmail =
    session.customer_details?.email || meta.userEmail || "your email";
  const customerName = session.customer_details?.name || meta.userName || "Reader";
  const bookTitle = meta.title || "Your Ebook";
  const bookCover =
    meta.cover ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
  const writerName = meta.writerName || "Fable Writer";
  const price = parseFloat(meta.price) || 0;
  const genre = meta.genre || "Fiction";
  const bookId = meta.bookId || "";

  return (
    <div className="min-h-screen bg-[#eae2d5] py-12 px-4 sm:px-6 lg:px-12 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
            <CheckCircle size={36} />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-emerald-800">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-emerald-700">
            Thank you, <span className="font-semibold">{customerName}</span>! Your purchase is
            confirmed.
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            A confirmation receipt has been sent to{" "}
            <span className="font-semibold underline underline-offset-2">{customerEmail}</span>
          </p>
        </div>

        {/* Book Card */}
        <div className="rounded-2xl border border-[#e5e2dc] bg-white p-6 shadow-xs">
          <h2 className="font-playfair text-lg font-bold text-[#090e14] mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#855210]" />
            Purchase Details
          </h2>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Cover */}
            <div className="h-36 w-24 shrink-0 overflow-hidden rounded-lg border border-[#e5e2dc] shadow-sm mx-auto sm:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookCover}
                alt={bookTitle}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <h3 className="font-playfair text-xl font-bold text-[#090e14] leading-snug">
                {bookTitle}
              </h3>
              <p className="text-xs text-[#77736d]">
                By <span className="font-semibold text-[#855210]">{writerName}</span>
              </p>
              <span className="inline-block rounded-full bg-[#f6f3eb] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#855210]">
                {genre}
              </span>

              <div className="mt-3 flex flex-wrap gap-4 pt-2 border-t border-[#f0ece3] text-xs">
                <div>
                  <p className="text-[#77736d] uppercase tracking-wider text-[10px] font-semibold">
                    Amount Paid
                  </p>
                  <p className="font-playfair text-lg font-bold text-[#090e14]">
                    ${price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[#77736d] uppercase tracking-wider text-[10px] font-semibold">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle size={11} />
                    Completed
                  </span>
                </div>
                <div>
                  <p className="text-[#77736d] uppercase tracking-wider text-[10px] font-semibold">
                    Session
                  </p>
                  <p className="font-mono text-[10px] text-[#555] truncate max-w-45">
                    {session_id?.slice(0, 22)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {bookId && (
            <Link
              href={`/browse-ebooks/${bookId}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#050d16] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230]"
            >
              <BookOpen size={16} />
              Read Ebook
            </Link>
          )}

          <Link
            href="/dashboard/user"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e2dc] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#090e14] shadow-xs transition-all hover:bg-[#f6f4ee]"
          >
            <ShoppingBag size={16} />
            My Dashboard
          </Link>

          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e2dc] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#090e14] shadow-xs transition-all hover:bg-[#f6f4ee]"
          >
            <Home size={16} />
            Home
          </Link>
        </div>

        {/* Note */}
        <p className="text-center text-[11px] text-[#aaa9a5]">
          Your purchased ebook is now available in your{" "}
          <Link
            href="/dashboard/user"
            className="underline underline-offset-2 text-[#855210] font-medium"
          >
            Reader Dashboard
          </Link>
          . Visit the Purchased Ebooks Gallery to access it anytime.
        </p>
      </div>
    </div>
  );
}
