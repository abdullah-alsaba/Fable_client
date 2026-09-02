import { getDataAllEBooks } from "@/utils/data";
import BrowseBooksClient from "./BrowseBooksClient";
import BrowseEbooksLoading from "./loading";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

async function BrowseBooksServer() {
  let eBooks = [];
  let error = false;

  try {
    const data = await getDataAllEBooks();
    if (Array.isArray(data)) {
      eBooks = data;
    } else {
      error = true;
    }
  } catch (err) {
    console.error("Error fetching ebooks in Server Component:", err);
    error = true;
  }

  return <BrowseBooksClient initialEBooks={eBooks} initialError={error} />;
}

export default function BrowseBooksPage() {
  return (
    <Suspense fallback={<BrowseEbooksLoading />}>
      <BrowseBooksServer />
    </Suspense>
  );
}