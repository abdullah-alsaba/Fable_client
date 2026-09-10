import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const body = await req.json();
    const { bookId, title, price, cover, writerName, writerEmail, userEmail, userName, genre } = body;

    if (!bookId || !title || price === undefined) {
      return NextResponse.json({ error: "Missing required book fields" }, { status: 400 });
    }

    const priceInCents = Math.round(parseFloat(price) * 100);

    // Create Stripe Checkout Session dynamically for this book
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: `By ${writerName || "Fable Writer"} · ${genre || "Ebook"}`,
              images: cover ? [cover] : [],
            },
            unit_amount: priceInCents || 100, // fallback $1.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/browse-ebooks/${bookId}`,
      metadata: {
        bookId,
        title,
        price: String(price),
        cover: cover || "",
        writerName: writerName || "Fable Writer",
        writerEmail: writerEmail || "",
        userEmail: userEmail || "",
        userName: userName || "",
        genre: genre || "Fiction",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
