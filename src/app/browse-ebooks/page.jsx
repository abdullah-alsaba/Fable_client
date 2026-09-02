import { getDataAllEBooks } from "@/utils/data";
import BrowseBooksClient from "./BrowseBooksClient";
import BrowseEbooksLoading from "./loading";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

async function BrowseBooksServer({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page) || 1;
  const limit = parseInt(resolvedParams?.limit) || 8;
  const search = resolvedParams?.search || resolvedParams?.writer || "";
  const sortBy = resolvedParams?.sortBy || "newest";

  let serverData = { ebooks: [], totalBooks: 0, totalPages: 1, currentPage: page, limit };
  let error = false;

  try {
    const data = await getDataAllEBooks({ page, limit, search, sortBy });
    if (data && Array.isArray(data.ebooks)) {
      serverData = data;
    } else if (Array.isArray(data)) {
      serverData = { ebooks: data, totalBooks: data.length, totalPages: 1, currentPage: 1, limit };
    } else {
      error = true;
    }
  } catch (err) {
    console.error("Error fetching ebooks in Server Component:", err);
    error = true;
  }

  return (
    <BrowseBooksClient
      serverData={serverData}
      initialError={error}
      currentParams={{ page, limit, search, sortBy }}
    />
  );
}

export default function BrowseBooksPage(props) {
  return (
    <Suspense fallback={<BrowseEbooksLoading />}>
      <BrowseBooksServer {...props} />
    </Suspense>
  );
}