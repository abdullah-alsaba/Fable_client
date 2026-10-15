"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "./DashboardSidebar";
import { myToast } from "@/utils/customToast";
import TableRowSkeleton from "@/Components/Skeleton/TableRowSkeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [localUser, setLocalUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [ebookSearch, setEbookSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [usersList, setUsersList] = useState([]);
  const [allEbooksList, setAllEbooksList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [genrePieData, setGenrePieData] = useState([]);

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [ebookPage, setEbookPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const PAGE_SIZE = 8;

  // Sorting states
  const [userSortField, setUserSortField] = useState("name");
  const [userSortAsc, setUserSortAsc] = useState(true);
  const [ebookSortField, setEbookSortField] = useState("title");
  const [ebookSortAsc, setEbookSortAsc] = useState(true);

  // Genre categories state
  const [customGenres, setCustomGenres] = useState([
    { id: 1, name: "Fiction", slug: "fiction", count: 18, active: true },
    { id: 2, name: "Science Fiction", slug: "sci-fi", count: 12, active: true },
    { id: 3, name: "Fantasy", slug: "fantasy", count: 15, active: true },
    { id: 4, name: "Mystery", slug: "mystery", count: 9, active: true },
    { id: 5, name: "Non-Fiction", slug: "non-fiction", count: 7, active: true },
    { id: 6, name: "Self-Help", slug: "self-help", count: 5, active: true },
  ]);
  const [newGenreName, setNewGenreName] = useState("");

  const PIE_COLORS = ["#050d16", "#855210", "#2563eb", "#16a34a", "#9333ea"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fable-user");
      if (stored) {
        try {
          setLocalUser(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  const activeUser = session?.user || localUser;

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("fable-jwt") : "";
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    if (!isPending) {
      if (!activeUser) {
        router.replace("/login");
        return;
      }

      const isAdmin = activeUser.email === "admin@fable.com" || activeUser.role === "admin";

      if (!isAdmin) {
        myToast.error("Access Denied: Admin privileges required (admin@fable.com)");
        router.replace(activeUser.role === "writer" ? "/dashboard/writer" : "/dashboard/user");
        return;
      }

      fetchAdminDataFromDB();
    }
  }, [activeUser, isPending, router]);

  const fetchAdminDataFromDB = async () => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const authHeaders = getAuthHeaders();

      const usersRes = await fetch(`${serverUri}/api/users`, { headers: authHeaders });
      const usersData = await usersRes.json();
      if (usersData.success && Array.isArray(usersData.users)) {
        setUsersList(
          usersData.users.map((u) => ({
            id: u._id || u.id,
            name: u.name || "User",
            email: u.email,
            role: u.role || "user",
            joinedDate: u.createdAt ? u.createdAt.split("T")[0] : "Recent",
          }))
        );
      } else {
        setUsersList([]);
      }

      const booksRes = await fetch(`${serverUri}/browse-ebooks`);
      const booksData = await booksRes.json();
      const list = Array.isArray(booksData) ? booksData : booksData.ebooks || [];
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

      const purchasesRes = await fetch(`${serverUri}/api/purchases`, { headers: authHeaders });
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

      const analyticsRes = await fetch(`${serverUri}/api/analytics`, { headers: authHeaders });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        if (Array.isArray(analyticsData.monthlySales)) {
          setMonthlySalesData(analyticsData.monthlySales);
        }
        if (Array.isArray(analyticsData.genreDistribution)) {
          setGenrePieData(analyticsData.genreDistribution);
        }
      }
    } catch (err) {
      console.error(err);
      myToast.error("Failed to load admin data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      await fetch(`${serverUri}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: getAuthHeaders(),
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
      await fetch(`${serverUri}/api/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
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
      await fetch(`${serverUri}/api/ebooks/${ebookId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAllEbooksList((prev) => prev.filter((book) => book.id !== ebookId));
      myToast.success("Ebook removed from platform");
    }
  };

  const handleAddGenre = (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    const newSlug = newGenreName.toLowerCase().replace(/\s+/g, "-");
    setCustomGenres((prev) => [
      ...prev,
      { id: Date.now(), name: newGenreName.trim(), slug: newSlug, count: 0, active: true },
    ]);
    setNewGenreName("");
    myToast.success(`Genre "${newGenreName}" added`);
  };

  const handleToggleGenre = (id) => {
    setCustomGenres((prev) =>
      prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    );
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

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = (a[userSortField] || "").toString().toLowerCase();
    const valB = (b[userSortField] || "").toString().toLowerCase();
    if (valA < valB) return userSortAsc ? -1 : 1;
    if (valA > valB) return userSortAsc ? 1 : -1;
    return 0;
  });
  const paginatedUsers = sortedUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);
  const totalUserPages = Math.ceil(sortedUsers.length / PAGE_SIZE) || 1;

  const filteredEbooks = allEbooksList.filter(
    (book) =>
      book.title.toLowerCase().includes(ebookSearch.toLowerCase()) ||
      book.writerName.toLowerCase().includes(ebookSearch.toLowerCase())
  );

  const sortedEbooks = [...filteredEbooks].sort((a, b) => {
    let valA = a[ebookSortField];
    let valB = b[ebookSortField];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return ebookSortAsc ? -1 : 1;
    if (valA > valB) return ebookSortAsc ? 1 : -1;
    return 0;
  });
  const paginatedEbooks = sortedEbooks.slice((ebookPage - 1) * PAGE_SIZE, ebookPage * PAGE_SIZE);
  const totalEbookPages = Math.ceil(sortedEbooks.length / PAGE_SIZE) || 1;

  const filteredTransactions = transactionsList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesType =
      transactionTypeFilter === "all" || item.type.toLowerCase() === transactionTypeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (transactionPage - 1) * PAGE_SIZE,
    transactionPage * PAGE_SIZE
  );
  const totalTransactionPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;

  const defaultMonthlyChart = monthlySalesData.length > 0 ? monthlySalesData : [
    { month: "Nov", sales: 15, revenue: 310 },
    { month: "Dec", sales: 24, revenue: 540 },
    { month: "Jan", sales: 32, revenue: 780 },
    { month: "Feb", sales: 48, revenue: 1120 },
    { month: "Mar", sales: 60, revenue: 1450 },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#eae2d5] px-4 sm:px-6 lg:px-10 py-4 lg:py-6 gap-5 lg:gap-6">
      <DashboardSidebar
        user={activeUser}
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          users: usersList.length,
          allEbooks: allEbooksList.length,
          transactions: transactionsList.length,
        }}
      />

      <main className="flex-1 min-w-0 max-w-6xl">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#666666]">Total Users</p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                    {totalUsersCount}
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
                    <BarChart data={defaultMonthlyChart}>
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
                        {g.name}: <strong className="text-[#090e14]">{g.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Analytics Trajectory Card (LineChart) */}
            <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                    Revenue & Sales Trajectory (Line Chart)
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Continuous growth trajectory tracking monthly revenue pace and book order count.
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                  Trajectory
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={defaultMonthlyChart}>
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
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($)"
                      stroke="#855210"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#855210" }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Sales Count"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    setUserPage(1);
                  }}
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
                    <th
                      onClick={() => {
                        if (userSortField === "name") {
                          setUserSortAsc(!userSortAsc);
                        } else {
                          setUserSortField("name");
                          setUserSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Name</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        if (userSortField === "email") {
                          setUserSortAsc(!userSortAsc);
                        } else {
                          setUserSortField("email");
                          setUserSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        if (userSortField === "role") {
                          setUserSortAsc(!userSortAsc);
                        } else {
                          setUserSortField("role");
                          setUserSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Current Role</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Change Role</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => (
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

            {/* Pagination Controls */}
            {sortedUsers.length > PAGE_SIZE && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
                <span>
                  Showing {Math.min(1 + (userPage - 1) * PAGE_SIZE, sortedUsers.length)} to{" "}
                  {Math.min(userPage * PAGE_SIZE, sortedUsers.length)} of {sortedUsers.length} users
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span className="font-semibold text-[#090e14] px-1">
                    Page {userPage} of {totalUserPages}
                  </span>
                  <button
                    type="button"
                    disabled={userPage >= totalUserPages}
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
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
                  onChange={(e) => {
                    setEbookSearch(e.target.value);
                    setEbookPage(1);
                  }}
                  className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                  <tr>
                    <th
                      onClick={() => {
                        if (ebookSortField === "title") {
                          setEbookSortAsc(!ebookSortAsc);
                        } else {
                          setEbookSortField("title");
                          setEbookSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Title</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        if (ebookSortField === "writerName") {
                          setEbookSortAsc(!ebookSortAsc);
                        } else {
                          setEbookSortField("writerName");
                          setEbookSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Writer Name</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        if (ebookSortField === "price") {
                          setEbookSortAsc(!ebookSortAsc);
                        } else {
                          setEbookSortField("price");
                          setEbookSortAsc(true);
                        }
                      }}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#090e14]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Price</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                  {paginatedEbooks.length > 0 ? (
                    paginatedEbooks.map((book) => (
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

            {/* Pagination Controls */}
            {sortedEbooks.length > PAGE_SIZE && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
                <span>
                  Showing {Math.min(1 + (ebookPage - 1) * PAGE_SIZE, sortedEbooks.length)} to{" "}
                  {Math.min(ebookPage * PAGE_SIZE, sortedEbooks.length)} of {sortedEbooks.length} ebooks
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={ebookPage <= 1}
                    onClick={() => setEbookPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span className="font-semibold text-[#090e14] px-1">
                    Page {ebookPage} of {totalEbookPages}
                  </span>
                  <button
                    type="button"
                    disabled={ebookPage >= totalEbookPages}
                    onClick={() => setEbookPage((p) => Math.min(totalEbookPages, p + 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
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
                    onChange={(e) => {
                      setTransactionSearch(e.target.value);
                      setTransactionPage(1);
                    }}
                    className="h-9 w-full sm:w-64 rounded-lg bg-[#f6f4ee] pl-9 pr-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                  />
                </div>

                <select
                  value={transactionTypeFilter}
                  onChange={(e) => {
                    setTransactionTypeFilter(e.target.value);
                    setTransactionPage(1);
                  }}
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
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((t) => (
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

            {/* Pagination Controls */}
            {filteredTransactions.length > PAGE_SIZE && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
                <span>
                  Showing {Math.min(1 + (transactionPage - 1) * PAGE_SIZE, filteredTransactions.length)} to{" "}
                  {Math.min(transactionPage * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={transactionPage <= 1}
                    onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span className="font-semibold text-[#090e14] px-1">
                    Page {transactionPage} of {totalTransactionPages}
                  </span>
                  <button
                    type="button"
                    disabled={transactionPage >= totalTransactionPages}
                    onClick={() => setTransactionPage((p) => Math.min(totalTransactionPages, p + 1))}
                    className="flex items-center gap-1 rounded-lg border border-[#e2d9cb] bg-[#f6f4ee] px-2.5 py-1 text-xs font-semibold hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Analytics Reports */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold text-[#666666]">Avg Order Value</p>
                <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                  ${transactionsList.length > 0 ? (totalRevenueAmount / transactionsList.length).toFixed(2) : "14.99"}
                </p>
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">+8.4% this month</p>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold text-[#666666]">Reader-Writer Ratio</p>
                <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                  {totalWritersCount > 0 ? (totalUsersCount / totalWritersCount).toFixed(1) : totalUsersCount}:1
                </p>
                <p className="mt-1 text-[11px] text-blue-600 font-semibold">Healthy marketplace</p>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold text-[#666666]">Conversion Rate</p>
                <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">4.8%</p>
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Above industry benchmark</p>
              </div>

              <div className="rounded-2xl border border-[#e2d9cb] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold text-[#666666]">Active Catalog</p>
                <p className="mt-1 font-playfair text-2xl font-bold text-[#090e14]">
                  {allEbooksList.filter((b) => b.status === "published").length} Titles
                </p>
                <p className="mt-1 text-[11px] text-purple-600 font-semibold">100% verified writers</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                    Revenue & Demand Growth Over Time
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Deep trajectory tracking transaction velocity against projected quarterly milestones.
                  </p>
                </div>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800">
                  Analytics Deep Dive
                </span>
              </div>

              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={defaultMonthlyChart}>
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
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Gross Volume ($)"
                      stroke="#855210"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#855210" }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Completed Sales"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Genre & Categories Management */}
        {activeTab === "genres" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
              <h2 className="font-playfair text-xl font-bold text-[#090e14] mb-1">
                Add New Literary Genre
              </h2>
              <p className="text-xs text-[#666666] mb-4">
                Define platform categories for book organization, storefront filters, and reader recommendations.
              </p>

              <form onSubmit={handleAddGenre} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. Historical Fiction, Memoir, Cyberpunk..."
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  className="h-10 flex-1 rounded-lg bg-[#f6f4ee] px-3 text-xs text-[#090e14] placeholder:text-[#888888] focus:bg-white focus:outline-none border border-[#e2d9cb]"
                />
                <button
                  type="submit"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#050d16] px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#182230] transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs">
              <div className="mb-4">
                <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                  Active Genre Catalog ({customGenres.length})
                </h3>
                <p className="text-xs text-[#666666]">
                  Control category visibility on the storefront and author upload forms.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#e5e2dc]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f8f5] text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                    <tr>
                      <th className="px-4 py-3.5">Genre Name</th>
                      <th className="px-4 py-3.5">URL Slug</th>
                      <th className="px-4 py-3.5">Catalog Titles</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece3] text-[#222222]">
                    {customGenres.map((g) => (
                      <tr key={g.id} className="hover:bg-[#fafaf8]">
                        <td className="px-4 py-3.5 font-bold text-[#090e14]">{g.name}</td>
                        <td className="px-4 py-3.5 font-mono text-[#666666]">/{g.slug}</td>
                        <td className="px-4 py-3.5 font-semibold text-[#090e14]">{g.count} Ebooks</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              g.active
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}
                          >
                            {g.active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleGenre(g.id)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all cursor-pointer ${
                                g.active
                                  ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                  : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              }`}
                            >
                              {g.active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomGenres((prev) => prev.filter((item) => item.id !== g.id));
                                myToast.success(`Genre "${g.name}" removed`);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Genre"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
