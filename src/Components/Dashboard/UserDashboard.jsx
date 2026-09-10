"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import DashboardSidebar from "./DashboardSidebar";
import { myToast } from "@/utils/customToast";
import TableRowSkeleton from "@/Components/Skeleton/TableRowSkeleton";
import {
  ShoppingBag,
  BookOpen,
  User as UserIcon,
  Bookmark,
  ExternalLink,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Mail,
  Shield,
  Calendar,
  DollarSign,
  BookMarked,
  Download,
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("purchases");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const initialImage =
    session?.user?.image ||
    session?.user?.picture ||
    session?.user?.avatar ||
    session?.user?.profilePicture ||
    session?.user?.photoURL ||
    "";

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "Reader Account",
    email: session?.user?.email || "reader@fable.com",
    role: session?.user?.role || "user",
    avatar: initialImage,
    bio: "Passionate reader on Fable. Discovering new independent digital books.",
    joinedDate: "January 2025",
    location: "Seattle, WA",
  });

  const [editForm, setEditForm] = useState({
    name: profileData.name,
    avatar: profileData.avatar,
    bio: profileData.bio,
    location: profileData.location,
  });

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [bookmarkedEbooks, setBookmarkedEbooks] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const role = session.user.role;
      if (role === "writer" && session.user.email !== "admin@fable.com") {
        router.replace("/dashboard/writer");
        return;
      }
      if (role === "admin" || session.user.email === "admin@fable.com") {
        router.replace("/dashboard/admin");
        return;
      }

      const userImg =
        session.user.image ||
        session.user.picture ||
        session.user.avatar ||
        session.user.profilePicture ||
        session.user.photoURL ||
        "";

      setProfileData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        role: session.user.role || prev.role,
        avatar: userImg || prev.avatar,
      }));

      setEditForm((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        avatar: userImg || prev.avatar,
      }));

      Promise.all([
        fetchBookmarksFromDB(session.user.email),
        fetchPurchasesFromDB(session.user.email),
      ]).finally(() => setIsLoadingData(false));
    }
  }, [session, isPending, router]);

  const fetchBookmarksFromDB = async (email) => {
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
        setBookmarkedEbooks(formatted);
      } else {
        setBookmarkedEbooks([]);
      }
    } catch (error) {
      setBookmarkedEbooks([]);
    }
  };

  const fetchPurchasesFromDB = async (email) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/purchases?userEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.purchases)) {
        const formattedPurchases = data.purchases.map((p) => ({
          id: p.transactionId || p._id,
          ebookName: p.ebookTitle || p.ebookName,
          writer: p.writerName || p.writer || "Fable Writer",
          price: parseFloat(p.amount || p.price) || 0,
          purchaseDate: p.purchaseDate ? p.purchaseDate.split("T")[0] : "Recent",
          status: p.status || "Completed",
        }));

        const formattedEbooks = data.purchases.map((p) => ({
          id: p.ebookId || p._id,
          title: p.ebookTitle || p.ebookName,
          writer: p.writerName || p.writer || "Fable Writer",
          price: parseFloat(p.amount || p.price) || 0,
          cover: p.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
          genre: p.genre || "Fiction",
          purchasedDate: p.purchaseDate ? p.purchaseDate.split("T")[0] : "Recent",
        }));

        setPurchaseHistory(formattedPurchases);
        setPurchasedEbooks(formattedEbooks);
      } else {
        setPurchaseHistory([]);
        setPurchasedEbooks([]);
      }
    } catch (error) {
      setPurchaseHistory([]);
      setPurchasedEbooks([]);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/bookmarks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkedEbooks((prev) => prev.filter((item) => item.id !== id));
      myToast.success("Removed from bookmarks");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      let imageUrl = editForm.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadResponse.json();
        if (!uploadData?.data?.url) {
          myToast.error("Image upload failed. Please try again.");
          return;
        }
        imageUrl = uploadData.data.url;
      }

      await authClient.updateUser({
        name: editForm.name,
        image: imageUrl,
      });

      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: editForm.name,
          image: imageUrl,
        }),
      });

      setProfileData((prev) => ({
        ...prev,
        name: editForm.name,
        avatar: imageUrl,
        bio: editForm.bio,
        location: editForm.location,
      }));
      setEditForm((prev) => ({ ...prev, avatar: imageUrl }));
      setAvatarFile(null);
      setIsEditProfileOpen(false);
      myToast.success("Profile updated successfully");
    } catch {
      myToast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const filteredPurchases = purchaseHistory.filter((item) => {
    const matchesSearch =
      item.ebookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.writer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#eae2d5] px-4 sm:px-6 lg:px-10 py-4 lg:py-6 gap-5 lg:gap-6">
      <DashboardSidebar
        user={session?.user || profileData}
        role={profileData.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          purchases: purchaseHistory.length,
          purchasedEbooks: purchasedEbooks.length,
          bookmarks: bookmarkedEbooks.length,
        }}
      />

      <main className="flex-1 min-w-0 max-w-6xl">
        <div className="mb-6 rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#090e14]">
                Welcome back, {profileData.name}!
              </h1>
            </div>
            <p className="mt-1 text-xs text-[#666666]">
              User Dashboard – Manage your ebook collection, transactions, and wishlist.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800 capitalize self-start sm:self-center">
            Role: {profileData.role === "reader" ? "Reader" : profileData.role}
          </span>
        </div>

        {activeTab === "purchases" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Purchase History
                </h2>
                <p className="text-xs text-[#666666]">
                  Track all your purchased digital titles and transaction receipts.
                </p>
              </div>

              {purchaseHistory.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                    />
                    <input
                      type="text"
                      placeholder="Search ebook or writer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 text-xs text-[#090e14] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              )}
            </div>

            {isLoadingData ? (
              <TableRowSkeleton rows={5} cols={5} />
            ) : purchaseHistory.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                    <tr>
                      <th className="px-4 py-3.5">Ebook Name</th>
                      <th className="px-4 py-3.5">Writer</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Purchase Date</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                    {filteredPurchases.length > 0 ? (
                      filteredPurchases.map((item) => (
                        <tr key={item.id} className="hover:bg-[#fafaf8]">
                          <td className="px-4 py-3.5 font-semibold text-[#090e14]">
                            {item.ebookName}
                          </td>
                          <td className="px-4 py-3.5 text-[#555555]">{item.writer}</td>
                          <td className="px-4 py-3.5 font-semibold text-[#090e14]">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5 text-[#666666]">
                            {item.purchaseDate}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                              <CheckCircle size={12} />
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => myToast.info(`Downloading receipt for ${item.ebookName}`)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#855210] hover:underline cursor-pointer"
                            >
                              <Download size={13} />
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#777777]">
                          No purchases found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-[#777777]">
                <ShoppingBag size={40} className="mx-auto text-[#cccccc] mb-3" />
                <p className="font-playfair text-lg font-bold text-[#090e14]">No Purchase History Yet</p>
                <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                  You haven&apos;t purchased any ebooks yet. Once you acquire books, your complete purchase logs and downloadable receipts will appear here.
                </p>
                <Link
                  href="/browse-ebooks"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#050d16] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all"
                >
                  Explore Ebooks Store
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "purchased-gallery" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Purchased Ebooks Gallery
                </h2>
                <p className="text-xs text-[#666666]">
                  Access and read your collected digital titles anytime.
                </p>
              </div>
              <span className="text-xs font-medium text-[#777777]">
                {purchasedEbooks.length} Books Available
              </span>
            </div>

            {purchasedEbooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedEbooks.map((book) => (
                  <div
                    key={book.id}
                    className="group flex flex-col justify-between rounded-xl border border-[#e5e2dc] bg-[#fafaf8] overflow-hidden shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-[#eee7dd]">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 right-2 rounded-md bg-[#050d16]/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                        {book.genre}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold text-[#090e14] group-hover:text-[#855210] transition-colors">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#666666]">
                          By {book.writer}
                        </p>
                        <p className="mt-2 text-[11px] font-medium text-[#77736d]">
                          Purchased on {book.purchasedDate}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          href={`/browse-ebooks/${book.id}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#050d16] py-2 text-xs font-semibold text-white hover:bg-[#182230] transition-colors"
                        >
                          <span>Read Ebook</span>
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[#777777]">
                <BookOpen size={40} className="mx-auto text-[#cccccc] mb-3" />
                <p className="font-playfair text-lg font-bold text-[#090e14]">Your Purchased Library is Empty</p>
                <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                  You haven&apos;t added any digital books to your library yet. Browse our storefront to discover original titles.
                </p>
                <Link
                  href="/browse-ebooks"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#050d16] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all"
                >
                  Browse Ebooks
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs flex flex-col items-center text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[#eae2d5] shadow-md mb-4 bg-[#050d16]">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {profileData.name.charAt(0)}
                  </div>
                )}
              </div>

              <h3 className="font-playfair text-xl font-bold text-[#090e14]">
                {profileData.name}
              </h3>
              <p className="text-xs text-[#666666] flex items-center gap-1 mt-0.5">
                <Mail size={12} />
                {profileData.email}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 capitalize">
                  <Shield size={12} />
                  Role: {profileData.role}
                </span>
              </div>

              <p className="mt-4 text-xs text-[#555555] leading-relaxed italic px-2">
                "{profileData.bio}"
              </p>

              <div className="my-6 w-full h-px bg-[#f0ece3]" />

              <div className="w-full space-y-2 text-left text-xs">
                <div className="flex items-center justify-between text-[#666666]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> Member Since
                  </span>
                  <span className="font-medium text-[#090e14]">
                    {profileData.joinedDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Location</span>
                  <span className="font-medium text-[#090e14]">
                    {profileData.location}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#050d16] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#182230] transition-all cursor-pointer"
              >
                <Edit size={14} />
                Edit Profile
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666]">
                      Total Purchased
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BookOpen size={18} />
                    </div>
                  </div>
                  <p className="mt-3 font-playfair text-2xl font-bold text-[#090e14]">
                    {purchasedEbooks.length}
                  </p>
                  <p className="mt-1 text-[11px] text-[#888888]">Ebooks owned</p>
                </div>

                <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666]">
                      Bookmarked
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <BookMarked size={18} />
                    </div>
                  </div>
                  <p className="mt-3 font-playfair text-2xl font-bold text-[#090e14]">
                    {bookmarkedEbooks.length}
                  </p>
                  <p className="mt-1 text-[11px] text-[#888888]">Saved in library</p>
                </div>

                <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666]">
                      Total Investment
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <p className="mt-3 font-playfair text-2xl font-bold text-[#090e14]">
                    $
                    {purchaseHistory
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#888888]">Spent on stories</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
                <h3 className="font-playfair text-lg font-bold text-[#090e14] mb-4">
                  Account Activity & Security
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f9f8f5] border border-[#e5e2dc]">
                    <div>
                      <p className="font-semibold text-[#090e14]">
                        Email Address Verification
                      </p>
                      <p className="text-[#666666]">{profileData.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f9f8f5] border border-[#e5e2dc]">
                    <div>
                      <p className="font-semibold text-[#090e14]">Account Role</p>
                      <p className="text-[#666666]">
                        Current permissions set to reader/user
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 capitalize">
                      {profileData.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                  Your personal reading wishlist loaded directly from your database bookmarks collection.
                </p>
              </div>
              <span className="text-xs font-medium text-[#777777]">
                {bookmarkedEbooks.length} Items Bookmarked
              </span>
            </div>

            {bookmarkedEbooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedEbooks.map((book) => (
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
                          onClick={() => handleRemoveBookmark(book.id)}
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
                <p className="font-playfair text-lg font-bold text-[#090e14]">No Bookmarked Ebooks Yet</p>
                <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                  Explore our ebook catalog and click the Bookmark button on any title to save it here in your database collection.
                </p>
                <Link
                  href="/browse-ebooks"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#050d16] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        )}

        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#e2d9cb]">
              <h3 className="font-playfair text-xl font-bold text-[#090e14] mb-4">
                Edit Profile
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 py-2 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSavingProfile}
                    onChange={(e) => setAvatarFile(e.target.files[0] || null)}
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 py-2 text-xs text-[#090e14] file:mr-3 file:rounded-md file:border-0 file:bg-[#050d16] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                  />
                  {avatarFile && (
                    <p className="mt-1 text-[11px] text-[#666666]">Selected: {avatarFile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 py-2 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#090e14] mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 py-2 text-xs text-[#090e14] focus:bg-[#ffffff] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="rounded-lg border border-[#e2d9cb] px-4 py-2 text-xs font-semibold text-[#555555] hover:bg-[#f6f4ee]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="rounded-lg bg-[#050d16] px-4 py-2 text-xs font-semibold text-white hover:bg-[#182230] disabled:opacity-60"
                  >
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
