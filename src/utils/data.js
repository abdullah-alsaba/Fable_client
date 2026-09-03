const SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI ||
  process.env.NEXT_SERVER_URI ||
  "http://localhost:8989";

export const getDataFeaturedBooks = async () => {
  const res = await fetch(`${SERVER_URI}/featuredBooks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured books");
  const data = await res.json();
  return data;
};

export const getTopWritersData = async () => {
  const res = await fetch(`${SERVER_URI}/authors/top`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch top writers");
  const data = await res.json();
  return data;
};

export const getDataAllEBooks = async (params = {}) => {
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
  if (!res.ok) throw new Error("Failed to fetch ebooks");
  const data = await res.json();
  return data;
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

  // Fallback: search within all ebooks list if direct endpoint fails or returns non-200
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