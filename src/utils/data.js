const SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI ||
  process.env.NEXT_SERVER_URI ||
  "https://fable-server-lilac.vercel.app";

export const getDataFeaturedBooks = async () => {
  try {
    const res = await fetch(`${SERVER_URI}/featuredBooks`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error("Failed to fetch featured books:", err);
  }
  return [];
};

export const getTopWritersData = async () => {
  try {
    const res = await fetch(`${SERVER_URI}/authors/top`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error("Failed to fetch top writers:", err);
  }
  return [];
};

export const getDataAllEBooks = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    if (params.genre) query.append("genre", params.genre);
    if (params.minPrice) query.append("minPrice", params.minPrice);
    if (params.maxPrice) query.append("maxPrice", params.maxPrice);
    if (params.availability) query.append("availability", params.availability);
    if (params.sortBy) query.append("sortBy", params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${SERVER_URI}/browse-ebooks${queryString}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("Failed to fetch ebooks:", err);
  }
  return { ebooks: [], totalBooks: 0, totalPages: 1, currentPage: 1, limit: 8 };
};

export const getEBookById = async (id) => {
  if (!id) return null;
  try {
    const res = await fetch(`${SERVER_URI}/browse-ebooks/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && (data._id || data.id)) return data;
    }
  } catch (error) {
    console.error("Error fetching ebook by direct ID endpoint:", error);
  }

  try {
    const allBooks = await getDataAllEBooks();
    if (Array.isArray(allBooks)) {
      const found = allBooks.find(
        (b) => String(b._id) === String(id) || String(b.id) === String(id)
      );
      return found || null;
    }
  } catch (err) {
    console.error("Fallback search in all ebooks failed:", err);
  }
  return null;
};