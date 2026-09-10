"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "./DashboardSidebar";
import { myToast } from "@/utils/customToast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Receipt,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Search,
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [ebookSearch, setEbookSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");

  const [usersList, setUsersList] = useState([
    {
      id: "usr-1",
      name: "Eleanor Vance",
      email: "eleanor.vance@example.com",
      role: "user",
      joinedDate: "2025-11-12",
    },
    {
      id: "usr-2",
      name: "Arthur Pendelton",
      email: "arthur.pendelton@example.com",
      role: "writer",
      joinedDate: "2025-08-04",
    },
    {
      id: "usr-3",
      name: "Dr. Sarah Lin",
      email: "sarah.lin@example.com",
      role: "writer",
      joinedDate: "2025-09-19",
    },
    {
      id: "usr-4",
      name: "System Administrator",
      email: "admin@fable.com",
      role: "admin",
      joinedDate: "2025-01-01",
    },
  ]);

  const [allEbooksList, setAllEbooksList] = useState([
    {
      id: "eb-1",
      title: "The Midnight Library of Alexandria",
      writerName: "Arthur Pendelton",
      price: 14.99,
      status: "published",
      genre: "Fantasy",
    },
    {
      id: "eb-2",
      title: "Chronicles of Neon City",
      writerName: "Elena Rostova",
      price: 9.99,
      status: "published",
      genre: "Sci-Fi",
    },
    {
      id: "eb-3",
      title: "Whispers in the Mist",
      writerName: "Marcus Vance",
      price: 12.50,
      status: "published",
      genre: "Thriller",
    },
  ]);

  const [transactionsList, setTransactionsList] = useState([]);

  const monthlySalesData = [
    { month: "Jan", sales: 14, revenue: 280 },
    { month: "Feb", sales: 22, revenue: 440 },
    { month: "Mar", sales: 35, revenue: 710 },
    { month: "Apr", sales: 28, revenue: 560 },
    { month: "May", sales: 42, revenue: 890 },
    { month: "Jun", sales: 38, revenue: 790 },
    { month: "Jul", sales: 50, revenue: 1100 },
    { month: "Aug", sales: 62, revenue: 1350 },
    { month: "Sep", sales: 75, revenue: 1680 },
  ];

  const genrePieData = [
    { name: "Fiction", value: 38 },
    { name: "Fantasy", value: 26 },
    { name: "Sci-Fi", value: 18 },
    { name: "Non-Fiction", value: 10 },
    { name: "History", value: 8 },
  ];

  const PIE_COLORS = ["#050d16", "#855210", "#2563eb", "#16a34a", "#9333ea"];

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const isAdmin = session.user.email === "admin@fable.com" || session.user.role === "admin";

      if (!isAdmin) {
        myToast.error("Access Denied: Admin privileges required (admin@fable.com)");
        router.replace(session.user.role === "writer" ? "/dashboard/writer" : "/dashboard/user");
        return;
      }

      fetchAdminDataFromDB();
    }
  }, [session, isPending, router]);

  const fetchAdminDataFromDB = async () => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";

      const usersRes = await fetch(`${serverUri}/api/users`);
      const usersData = await usersRes.json();
      if (usersData.success && Array.isArray(usersData.users) && usersData.users.length > 0) {
        setUsersList(
          usersData.users.map((u) => ({
            id: u._id || u.id,
            name: u.name || "User",
            email: u.email,
            role: u.role || "user",
            joinedDate: u.createdAt ? u.createdAt.split("T")[0] : "Recent",
          }))
        );
      }

      const booksRes = await fetch(`${serverUri}/browse-ebooks`);
      const booksData = await booksRes.json();
      const list = Array.isArray(booksData) ? booksData : booksData.ebooks || [];
      if (list.length > 0) {
        setAllEbooksList(
          list.map((b) => ({
            id: b._id || b.id,
            title: b.title,
            writerName: b.writerName || b.author || "Fable Writer",
            price: parseFloat(b.price) || 0,
            status: b.status || "published",
            genre: b.genre || "Fiction",
          }))
        );
      }

      const purchasesRes = await fetch(`${serverUri}/api/purchases`);
      const purchasesData = await purchasesRes.json();
      if (purchasesData.success && Array.isArray(purchasesData.purchases)) {
        setTransactionsList(
          purchasesData.purchases.map((p) => ({
            id: p.transactionId || p._id,
            type: p.type || "purchase",
            userEmail: p.userEmail,
            amount: parseFloat(p.amount || p.price) || 0,
            date: p.purchaseDate ? p.purchaseDate.split("T")[0] : "Recent",
          }))
        );
      } else {
        setTransactionsList([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUsersList((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      myToast.success(`User role updated to ${newRole}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/users/${userId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setUsersList((prev) => prev.filter((user) => user.id !== userId));
      myToast.success("User deleted successfully");
    }
  };

  const handleToggleEbookStatus = async (ebookId) => {
    const target = allEbooksList.find((b) => b.id === ebookId);
    const newStatus = target?.status === "published" ? "unpublished" : "published";

    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/ebooks/${ebookId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAllEbooksList((prev) =>
        prev.map((book) => (book.id === ebookId ? { ...book, status: newStatus } : book))
      );
      myToast.success(`Ebook status updated to ${newStatus}`);
    }
  };

  const handleDeleteEbook = async (ebookId) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/ebooks/${ebookId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setAllEbooksList((prev) => prev.filter((book) => book.id !== ebookId));
      myToast.success("Ebook removed from platform");
    }
  };

  const totalUsersCount = usersList.filter((u) => u.role === "user" || u.role === "reader").length;
  const totalWritersCount = usersList.filter((u) => u.role === "writer").length;
  const totalEbooksSoldCount = transactionsList.filter((t) => t.type === "purchase").length;
  const totalRevenueAmount = transactionsList.reduce((sum, t) => sum + t.amount, 0);

  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredEbooks = allEbooksList.filter(
    (book) =>
      book.title.toLowerCase().includes(ebookSearch.toLowerCase()) ||
      book.writerName.toLowerCase().includes(ebookSearch.toLowerCase())
  );

  const filteredTransactions = transactionsList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesType =
      transactionTypeFilter === "all" || item.type.toLowerCase() === transactionTypeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#eae2d5]">
      <DashboardSidebar
        user={session?.user}
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          users: usersList.length,
          allEbooks: allEbooksList.length,
          transactions: transactionsList.length,
        }}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Total Users</p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                    {totalUsersCount}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                    +12% growth
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Users size={22} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Total Writers</p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                    {totalWritersCount}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                    +5 active
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Award size={22} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Ebooks Sold</p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                    {totalEbooksSoldCount}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                    +18% growth
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Total Revenue</p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                    ${totalRevenueAmount.toFixed(2)}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                    Platform net
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <DollarSign size={22} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                      Monthly Sales & Revenue Growth
                    </h3>
                    <p className="text-xs text-[#666666]">
                      Performance trajectory across recent months.
                    </p>
                  </div>
                  <span className="rounded-md bg-[#f6f4ee] px-2.5 py-1 text-[11px] font-bold text-[#855210]">
                    Recharts Analytics
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                      <YAxis stroke="#666666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050d16",
                          color: "#ffffff",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Sales Count" fill="#855210" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#050d16" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                    Ebooks by Genre
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Market distribution across popular literary categories.
                  </p>
                </div>

                <div className="h-60 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genrePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {genrePieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050d16",
                          color: "#ffffff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {genrePieData.map((g, idx) => (
                    <div key={g.name} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="font-medium text-[#222222]">
                        {g.name}: <strong className="text-[#090e14]">{g.value}%</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Manage Users
                </h2>
                <p className="text-xs text-[#666666]">
                  View accounts, update roles (user, writer, admin), or delete accounts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                  />
                  <input
                    type="text"
                    placeholder="Search user name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="h-9 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 text-xs text-[#090e14] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                  <tr>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Current Role</th>
                    <th className="px-4 py-3.5">Change Role</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#fafaf8]">
                        <td className="px-4 py-3.5 font-bold text-[#090e14]">{u.name}</td>
                        <td className="px-4 py-3.5 text-[#555555]">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize border ${
                              u.role === "admin"
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : u.role === "writer"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            <Shield size={12} />
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="rounded-lg border border-[#e2d9cb] bg-white px-2.5 py-1 text-xs text-[#090e14] focus:outline-none cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="reader">Reader</option>
                            <option value="writer">Writer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#777777]">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ebooks" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  Manage All Ebooks
                </h2>
                <p className="text-xs text-[#666666]">
                  Review all writer submissions across the platform.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                />
                <input
                  type="text"
                  placeholder="Search title or writer name..."
                  value={ebookSearch}
                  onChange={(e) => setEbookSearch(e.target.value)}
                  className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                  <tr>
                    <th className="px-4 py-3.5">Title</th>
                    <th className="px-4 py-3.5">Writer Name</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                  {filteredEbooks.length > 0 ? (
                    filteredEbooks.map((book) => (
                      <tr key={book.id} className="hover:bg-[#fafaf8]">
                        <td className="px-4 py-3.5 font-bold text-[#090e14]">
                          {book.title}
                        </td>
                        <td className="px-4 py-3.5 text-[#555555] font-medium">
                          {book.writerName}
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
                              onClick={() => handleToggleEbookStatus(book.id)}
                              className={`rounded-lg px-3 py-1 text-[11px] font-semibold border transition-all cursor-pointer ${
                                book.status === "published"
                                  ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                  : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              }`}
                            >
                              {book.status === "published" ? "Unpublish" : "Publish"}
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
                        No ebooks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#090e14]">
                  View All Transactions
                </h2>
                <p className="text-xs text-[#666666]">
                  Comprehensive audit trail for reader purchases and writer publishing fees.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
                  />
                  <input
                    type="text"
                    placeholder="Search transaction ID or email..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                  />
                </div>

                <select
                  value={transactionTypeFilter}
                  onChange={(e) => setTransactionTypeFilter(e.target.value)}
                  className="h-9 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-3 text-xs text-[#090e14] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="publishing fee">Publishing Fee</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                  <tr>
                    <th className="px-4 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">User / Writer Email</th>
                    <th className="px-4 py-3.5">Amount ($)</th>
                    <th className="px-4 py-3.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-[#fafaf8]">
                        <td className="px-4 py-3.5 font-mono font-semibold text-[#090e14]">
                          {t.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              t.type === "publishing fee"
                                ? "bg-purple-100 text-purple-900 border border-purple-200"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-[#555555]">
                          {t.userEmail}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#090e14]">
                          ${t.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-[#666666]">
                          {t.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#777777]">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
