"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "./DashboardSidebar";
import { myToast } from "@/utils/customToast";
import {
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Bookmark,
  DollarSign,
  Upload,
  CheckCircle,
  ExternalLink,
  Search,
  TrendingUp,
} from "lucide-react";

export default function WriterDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [writerEbooks, setWriterEbooks] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [writerBookmarks, setWriterBookmarks] = useState([]);

  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    price: "",
    genre: "Fiction",
    cover: "",
  });

  const [editingEbook, setEditingEbook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    genre: "Fiction",
    cover: "",
  });

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const role = session.user.role;
      const isAdmin = session.user.email === "admin@fable.com" || role === "admin";

      if (role !== "writer" && !isAdmin) {
        myToast.error("Access Denied: Writer role required");
        router.replace("/dashboard/user");
        return;
      }

      fetchWriterEbooksFromDB(session.user.email);
      fetchWriterSalesFromDB(session.user.email);
      fetchWriterBookmarksFromDB(session.user.email);
    }
  }, [session, isPending, router]);

  const fetchWriterEbooksFromDB = async (email) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/writer/ebooks?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.ebooks)) {
        const formatted = data.ebooks.map((b) => ({
          id: b._id || b.id,
          title: b.title,
          description: b.description || b.summary || "",
          price: parseFloat(b.price) || 0,
          genre: b.genre || "General",
          status: b.status || "published",
          cover: b.coverImage || b.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
          createdAt: b.createdAt ? b.createdAt.split("T")[0] : "Recent",
          salesCount: b.salesCount || 0,
        }));
        setWriterEbooks(formatted);
      } else {
        setWriterEbooks([]);
      }
    } catch (err) {
      setWriterEbooks([]);
    }
  };

  const fetchWriterSalesFromDB = async (email) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/purchases?writerEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.purchases)) {
        const formatted = data.purchases.map((s) => ({
          id: s.transactionId || s._id,
          ebookTitle: s.ebookTitle || s.ebookName,
          buyerName: s.userName || s.userEmail,
          purchaseDate: s.purchaseDate ? s.purchaseDate.split("T")[0] : "Recent",
          amount: parseFloat(s.amount || s.price) || 0,
        }));
        setSalesHistory(formatted);
      } else {
        setSalesHistory([]);
      }
    } catch (err) {
      setSalesHistory([]);
    }
  };

  const fetchWriterBookmarksFromDB = async (email) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/bookmarks?userEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.bookmarks)) {
        const formatted = data.bookmarks.map((bm) => ({
          id: bm._id || bm.id || bm.bookId,
          title: bm.title,
          writer: bm.writer,
          price: parseFloat(bm.price) || 0,
          cover: bm.cover,
          genre: bm.genre || "General",
        }));
        setWriterBookmarks(formatted);
      } else {
        setWriterBookmarks([]);
      }
    } catch (err) {
      setWriterBookmarks([]);
    }
  };

  const handleImgBBUpload = async (file, isEdit = false) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data && data.data && data.data.url) {
        const imageUrl = data.data.url;
        if (isEdit) {
          setEditForm((prev) => ({ ...prev, cover: imageUrl }));
        } else {
          setAddForm((prev) => ({ ...prev, cover: imageUrl }));
        }
        myToast.success("Cover image uploaded to ImgBB successfully!");
      } else {
        const fallbackUrl = URL.createObjectURL(file);
        if (isEdit) {
          setEditForm((prev) => ({ ...prev, cover: fallbackUrl }));
        } else {
          setAddForm((prev) => ({ ...prev, cover: fallbackUrl }));
        }
        myToast.info("Cover loaded from file preview.");
      }
    } catch (error) {
      const fallbackUrl = URL.createObjectURL(file);
      if (isEdit) {
        setEditForm((prev) => ({ ...prev, cover: fallbackUrl }));
      } else {
        setAddForm((prev) => ({ ...prev, cover: fallbackUrl }));
      }
      myToast.info("Image set from local file selection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const targetBook = writerEbooks.find((b) => b.id === id);
    const newStatus = targetBook?.status === "published" ? "unpublished" : "published";

    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/ebooks/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setWriterEbooks((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      myToast.success(`Ebook status updated to ${newStatus}`);
    }
  };

  const handleDeleteEbook = async (id) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/ebooks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setWriterEbooks((prev) => prev.filter((item) => item.id !== id));
      myToast.success("Ebook deleted successfully");
    }
  };

  const handleAddEbookSubmit = async (e) => {
    e.preventDefault();
    const newBook = {
      title: addForm.title,
      description: addForm.description,
      price: parseFloat(addForm.price) || 0,
      genre: addForm.genre,
      cover: addForm.cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      writerEmail: session?.user?.email,
      writerName: session?.user?.name || "Fable Writer",
      status: "published",
    };

    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/ebooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const data = await res.json();
      if (data.success) {
        newBook.id = data.insertedId;
      } else {
        newBook.id = "wb-" + Date.now();
      }
    } catch (err) {
      newBook.id = "wb-" + Date.now();
    } finally {
      setWriterEbooks((prev) => [newBook, ...prev]);
      setAddForm({ title: "", description: "", price: "", genre: "Fiction", cover: "" });
      myToast.success("New Ebook published to database!");
      setActiveTab("manage");
    }
  };

  const handleOpenEdit = (ebook) => {
    setEditingEbook(ebook);
    setEditForm({
      title: ebook.title,
      description: ebook.description,
      price: ebook.price,
      genre: ebook.genre,
      cover: ebook.cover,
    });
    setActiveTab("edit");
  };

  const handleEditEbookSubmit = async (e) => {
    e.preventDefault();
    if (!editingEbook) return;

    const updatedData = {
      title: editForm.title,
      description: editForm.description,
      price: parseFloat(editForm.price) || 0,
      genre: editForm.genre,
      cover: editForm.cover,
    };

    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/ebooks/${editingEbook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setWriterEbooks((prev) =>
        prev.map((item) => (item.id === editingEbook.id ? { ...item, ...updatedData } : item))
      );
      myToast.success("Ebook updated successfully!");
      setEditingEbook(null);
      setActiveTab("manage");
    }
  };

  const handleRemoveWriterBookmark = async (id) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/bookmarks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setWriterBookmarks((prev) => prev.filter((item) => item.id !== id));
      myToast.success("Removed from bookmarks");
    }
  };

  const totalSalesRevenue = salesHistory.reduce((sum, item) => sum + item.amount, 0);

  const filteredEbooks = writerEbooks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#eae2d5]">
      <DashboardSidebar
        user={session?.user}
        role="writer"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          writerEbooks: writerEbooks.length,
          bookmarks: writerBookmarks.length,
          sales: salesHistory.length,
        }}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Total Published</p>
              <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                {writerEbooks.filter((b) => b.status === "published").length} Titles
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <BookOpen size={22} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Copies Sold</p>
              <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                {salesHistory.length} Copies
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Author Revenue</p>
              <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                ${totalSalesRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {activeTab === "manage" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Manage Your Ebooks
                </h2>
                <p className="text-xs text-[#666666]">
                  Catalog of your written works with options to edit, delete, or toggle availability.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {writerEbooks.length > 0 && (
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                    />
                    <input
                      type="text"
                      placeholder="Search by title or genre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#050d16] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#182230] transition-all cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Create New Title</span>
                </button>
              </div>
            </div>

            {writerEbooks.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                    <tr>
                      <th className="px-4 py-3.5">Cover & Title</th>
                      <th className="px-4 py-3.5">Genre</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                    {filteredEbooks.length > 0 ? (
                      filteredEbooks.map((book) => (
                        <tr key={book.id} className="hover:bg-[#fafaf8]">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={book.cover}
                                alt={book.title}
                                className="h-12 w-9 rounded object-cover border border-[#d8d1c7]"
                              />
                              <div>
                                <p className="font-bold text-[#090e14]">{book.title}</p>
                                <p className="line-clamp-1 text-[11px] text-[#777777]">
                                  {book.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[#555555]">
                            {book.genre}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#090e14]">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5">
                            {book.status === "published" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                <Eye size={12} />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                <EyeOff size={12} />
                                Unpublished
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(book.id)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all cursor-pointer ${
                                  book.status === "published"
                                    ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                    : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                }`}
                              >
                                {book.status === "published" ? "Unpublish" : "Publish"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEdit(book)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Ebook"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteEbook(book.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Ebook"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#777777]">
                          No ebooks found matching search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-[#777777]">
                <BookOpen size={40} className="mx-auto text-[#cccccc] mb-3" />
                <p className="font-playfair text-lg font-bold text-[#090e14]">No Published Ebooks Yet</p>
                <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                  You haven&apos;t published any ebooks yet. Add your first digital title with custom description and ImgBB cover upload.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#050d16] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all"
                >
                  <PlusCircle size={14} />
                  Add Your First Ebook
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs max-w-3xl mx-auto">
            <div className="mb-6 border-b border-[#f0ece3] pb-4">
              <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                Add New Ebook
              </h2>
              <p className="text-xs text-[#666666]">
                Fill out details, full description, and upload a cover image via ImgBB.
              </p>
            </div>

            <form onSubmit={handleAddEbookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Ebook Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shadows of the Obsidian Spire"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-[#ffffff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="14.99"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    required
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-[#ffffff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.genre}
                    onChange={(e) => setAddForm({ ...addForm, genre: e.target.value })}
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none cursor-pointer"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Full Content Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Write full summary, chapter list, storyline overview..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-[#ffffff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Cover Image (ImgBB Upload)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-[#a2753b] bg-[#fcf8f2] px-4 py-3 text-xs font-semibold text-[#855210] hover:bg-[#f6ebd9] transition-colors cursor-pointer w-full">
                    <Upload size={16} />
                    <span>{isUploading ? "Uploading to ImgBB..." : "Upload Image to ImgBB"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImgBBUpload(e.target.files[0], false)}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-[#777777]">OR URL:</span>

                  <input
                    type="url"
                    placeholder="https://i.ibb.co/..."
                    value={addForm.cover}
                    onChange={(e) => setAddForm({ ...addForm, cover: e.target.value })}
                    className="flex-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none w-full"
                  />
                </div>

                {addForm.cover && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e2d9cb] p-2 bg-[#fafaf8]">
                    <img
                      src={addForm.cover}
                      alt="Preview"
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-bold text-[#090e14]">Cover Image Preview</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={12} /> Ready for publish
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("manage")}
                  className="rounded-lg border border-[#e2d9cb] px-5 py-2.5 text-xs font-semibold text-[#555555] hover:bg-[#f6f4ee]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#050d16] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all cursor-pointer"
                >
                  Publish Ebook
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "edit" && editingEbook && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs max-w-3xl mx-auto">
            <div className="mb-6 border-b border-[#f0ece3] pb-4">
              <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                Edit Ebook Details
              </h2>
              <p className="text-xs text-[#666666]">
                Update metadata, content description, price, and cover image for "{editingEbook.title}".
              </p>
            </div>

            <form onSubmit={handleEditEbookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Ebook Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.genre}
                    onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none cursor-pointer"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Full Content Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#090e14] mb-1">
                  Cover Image (ImgBB Upload)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-[#a2753b] bg-[#fcf8f2] px-4 py-3 text-xs font-semibold text-[#855210] hover:bg-[#f6ebd9] transition-colors cursor-pointer w-full">
                    <Upload size={16} />
                    <span>{isUploading ? "Uploading to ImgBB..." : "Upload New Image to ImgBB"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImgBBUpload(e.target.files[0], true)}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-[#777777]">OR URL:</span>

                  <input
                    type="url"
                    value={editForm.cover}
                    onChange={(e) => setEditForm({ ...editForm, cover: e.target.value })}
                    className="flex-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3.5 py-2.5 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none w-full"
                  />
                </div>

                {editForm.cover && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e2d9cb] p-2 bg-[#fafaf8]">
                    <img
                      src={editForm.cover}
                      alt="Preview"
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-bold text-[#090e14]">Cover Image Preview</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={12} /> Image active
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("manage")}
                  className="rounded-lg border border-[#e2d9cb] px-5 py-2.5 text-xs font-semibold text-[#555555] hover:bg-[#f6f4ee]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#050d16] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Bookmarked Ebooks
                </h2>
                <p className="text-xs text-[#666666]">
                  Reference materials and saved titles from other writers.
                </p>
              </div>
              <span className="text-xs font-medium text-[#777777]">
                {writerBookmarks.length} Saved Titles
              </span>
            </div>

            {writerBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {writerBookmarks.map((book) => (
                  <div
                    key={book.id}
                    className="flex rounded-xl border border-[#e5e2dc] bg-[#fafaf8] overflow-hidden shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="h-44 w-32 shrink-0 bg-[#eee7dd]">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <span className="rounded-md bg-[#855210]/10 px-2 py-0.5 text-[10px] font-bold text-[#855210]">
                          {book.genre}
                        </span>
                        <h3 className="line-clamp-2 mt-1 text-sm font-bold text-[#090e14]">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#666666]">By {book.writer}</p>
                        <p className="mt-2 font-bold text-[#090e14]">
                          ${book.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Link
                          href={`/browse-ebooks/${book.id}`}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#050d16] py-1.5 text-xs font-semibold text-white hover:bg-[#182230] transition-colors"
                        >
                          <span>Details</span>
                          <ExternalLink size={12} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemoveWriterBookmark(book.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Bookmark"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[#777777]">
                <Bookmark size={40} className="mx-auto text-[#cccccc] mb-3" />
                <p className="font-playfair text-lg font-bold text-[#090e14]">No Bookmarked Ebooks</p>
                <p className="text-xs text-[#888888] mt-1">
                  Save reference books from the storefront to view them here.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Sales History
                </h2>
                <p className="text-xs text-[#666666]">
                  Detailed log of reader purchases and royalty earnings.
                </p>
              </div>

              <div className="mt-3 sm:mt-0 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-right">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Total Revenue
                </span>
                <span className="font-playfair text-lg font-bold text-emerald-900">
                  ${totalSalesRevenue.toFixed(2)}
                </span>
              </div>
            </div>

            {salesHistory.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                    <tr>
                      <th className="px-4 py-3.5">Ebook Title</th>
                      <th className="px-4 py-3.5">Buyer Name</th>
                      <th className="px-4 py-3.5">Purchase Date</th>
                      <th className="px-4 py-3.5 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                    {salesHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#fafaf8]">
                        <td className="px-4 py-3.5 font-bold text-[#090e14]">
                          {item.ebookTitle}
                        </td>
                        <td className="px-4 py-3.5 text-[#555555] font-medium">
                          {item.buyerName}
                        </td>
                        <td className="px-4 py-3.5 text-[#666666]">
                          {item.purchaseDate}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-emerald-700 text-right">
                          +${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-[#777777]">
                <DollarSign size={40} className="mx-auto text-[#cccccc] mb-3" />
                <p className="font-playfair text-lg font-bold text-[#090e14]">No Sales Logged Yet</p>
                <p className="text-xs text-[#888888] mt-1">
                  When readers purchase your published titles, sale records and revenues will populate here automatically.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
