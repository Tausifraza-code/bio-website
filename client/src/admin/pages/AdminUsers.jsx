import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminOrders from "./AdminOrders";
import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserRound,
  CalendarDays,
  Link2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

import * as XLSX from "xlsx";
import api from "../../redux/api";
import {
  fetchAdminUsers,
  verifyUserProfile,
  unverifyUserProfile,
  clearAdminError,
  deleteAdminUser,
} from "../../redux/slice/adminSlice";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminUsers() {
  const dispatch = useDispatch();

  const {
    users,
    usersLoading,
    usersError,
    usersPagination,
    verificationLoading,
    verificationError,
    verificationMessage,
  } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPage = page;
  const totalPages = usersPagination.totalPages || 0;
  const totalUsers = usersPagination.totalUsers || 0;
  const limit = usersPagination.limit || 10;

  // Fetch users when page, limit, or search changes.
  useEffect(() => {
    dispatch(fetchAdminUsers({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const handleSearch = (event) => {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    if (nextSearch === search && page === 1) {
      dispatch(fetchAdminUsers({ page: 1, limit, search: nextSearch }));
      return;
    }

    setPage(1);
    setSearch(nextSearch);
  };

  const handleRefresh = () => {
    if (!usersLoading) {
      dispatch(fetchAdminUsers({ page, limit, search }));
    }
  };

  const handleExportUsers = async () => {
    try {
      setIsExporting(true);

      const response = await api.get("/admin/users/export");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to export user records.",
        );
      }

      const { users = [], profiles = [] } = response.data.data || {};

      const workbook = XLSX.utils.book_new();

      // Users Sheet
      const usersSheet = XLSX.utils.json_to_sheet(users);
      usersSheet["!cols"] = Array.from({ length: 24 }, () => ({
        wch: 24,
      }));

      XLSX.utils.book_append_sheet(workbook, usersSheet, "Users");

      // Mini Profiles Sheet
      const profilesSheet = XLSX.utils.json_to_sheet(profiles);
      profilesSheet["!cols"] = Array.from({ length: 40 }, () => ({
        wch: 22,
      }));

      XLSX.utils.book_append_sheet(workbook, profilesSheet, "Mini Profiles");

      const date = new Date().toISOString().slice(0, 10);

      XLSX.writeFile(workbook, `BIO_User_Records_${date}.xlsx`);
    } catch (error) {
      console.error("User export error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to download Excel file.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageChange = (nextPage) => {
    if (
      nextPage >= 1 &&
      nextPage <= totalPages &&
      nextPage !== currentPage &&
      !usersLoading
    ) {
      setPage(nextPage);
    }
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setPage(1);
    setSearch("");
    dispatch(clearAdminError());
  };

  const handleVerification = async (user) => {
    if (verificationLoading[user._id]) return;

    if (user.profile?.isVerified) {
      await dispatch(unverifyUserProfile(user._id));
    } else {
      await dispatch(verifyUserProfile(user._id));
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserToDelete || isDeleting) return;

    try {
      setIsDeleting(true);

      await dispatch(deleteAdminUser(selectedUserToDelete._id)).unwrap();

      setSelectedUserToDelete(null);
      toast.success("User successfully deleted.");

      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        dispatch(fetchAdminUsers({ page, limit, search }));
      }
    } catch (error) {
      window.alert(error || "Unable to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            USER MANAGEMENT
          </p>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {activeTab === "users" ? "Registered Users" : "Order Management"}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {activeTab === "users"
              ? "View, search and manage registered users and profile verification."
              : "View and manage customer orders."}
          </p>
        </div>

        {activeTab === "users" && (
          <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row">
            <button
              type="button"
              onClick={handleExportUsers}
              disabled={isExporting}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            >
              {isExporting ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isExporting ? "Exporting..." : "Export Excel"}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={usersLoading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:w-fit dark:border-slate-800 dark:bg-[#0b1728] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw
                size={16}
                className={usersLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        )}
      </section>

      {/* User and Order Tabs */}
      <div className="flex w-full gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-[#0b1728]">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            activeTab === "users"
              ? "bg-cyan-500 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Users size={17} />
          Users
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            activeTab === "orders"
              ? "bg-cyan-500 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <ShoppingBag size={17} />
          Orders
        </button>
      </div>

      {activeTab === "users" ? (
        <>
          {/* Summary cards */}
          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs leading-4 text-slate-500 sm:text-sm dark:text-slate-400">
                    Total Registered Users
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                    {totalUsers.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="shrink-0 rounded-lg bg-cyan-50 p-2 text-cyan-600 sm:rounded-xl sm:p-3 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Users size={20} className="sm:size-6" />
                </div>
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="shrink-0 rounded-lg bg-emerald-50 p-2 text-emerald-600 sm:rounded-xl sm:p-3 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <UserRound size={19} className="sm:size-[22px]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs leading-4 text-slate-500 sm:text-sm dark:text-slate-400">
                    Users on This Page
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Search */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-2 gap-2 sm:flex sm:gap-3"
            >
              <div className="relative col-span-2 min-w-0 sm:flex-1">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search name, email, phone or referral code..."
                  aria-label="Search users by name, email, phone, or referral code"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="min-h-11 rounded-xl bg-cyan-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:px-5"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleResetSearch}
                className="min-h-11 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:px-5 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </form>
          </section>

          {/* Verification success/error messages */}
          {verificationMessage && (
            <div
              role="status"
              className="flex min-w-0 items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 sm:p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
              <ShieldCheck size={18} className="mt-0.5 shrink-0" />
              <span className="min-w-0 break-words">{verificationMessage}</span>
            </div>
          )}

          {verificationError && (
            <div
              role="alert"
              className="flex min-w-0 items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="min-w-0 break-words">{verificationError}</span>
            </div>
          )}

          {/* User loading/error */}
          {usersError && (
            <div
              role="alert"
              className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <div className="flex min-w-0 items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span className="min-w-0 break-words">{usersError}</span>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={usersLoading}
                className="min-h-11 shrink-0 font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {/* Users table */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
            <div className="border-b border-slate-200 p-4 sm:p-5 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                All Users
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                User details, referral information and verification controls.
              </p>
            </div>

            {usersLoading && users.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <RefreshCw size={18} className="animate-spin" />
                Loading users...
              </div>
            ) : users.length > 0 ? (
              <>
                <div className="divide-y divide-slate-100 2xl:hidden dark:divide-slate-800">
                  {users.map((user) => {
                    const isVerified = Boolean(user.profile?.isVerified);
                    const isUpdating = Boolean(verificationLoading[user._id]);

                    return (
                      <article key={user._id} className="min-w-0 space-y-4 p-4">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words font-semibold text-slate-900 dark:text-white">
                              {user.fullName || "—"}
                            </h3>
                            <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                              {user.email || "—"}
                            </p>
                          </div>
                          {isVerified ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <ShieldCheck size={14} />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                              <ShieldAlert size={14} />
                              Unverified
                            </span>
                          )}
                        </div>

                        <dl className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 text-sm">
                          <div className="min-w-0">
                            <dt className="text-xs text-slate-500 dark:text-slate-400">
                              Phone
                            </dt>
                            <dd className="mt-1 break-words text-slate-700 dark:text-slate-200">
                              {user.phone || "—"}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-xs text-slate-500 dark:text-slate-400">
                              Referral code
                            </dt>
                            <dd className="mt-1 break-all font-medium text-cyan-700 dark:text-cyan-400">
                              {user.referralCode || "—"}
                            </dd>
                          </div>
                          <div className="col-span-2 min-w-0">
                            <dt className="text-xs text-slate-500 dark:text-slate-400">
                              Referred by
                            </dt>
                            <dd className="mt-1 break-words text-slate-700 dark:text-slate-200">
                              {user.referredBy ? (
                                <span className="flex min-w-0 items-start gap-1.5">
                                  <Link2
                                    size={14}
                                    className="mt-0.5 shrink-0 text-emerald-500"
                                  />
                                  <span className="min-w-0">
                                    {user.referredBy.fullName || "—"}
                                    {user.referredBy.email && (
                                      <span className="block break-all text-xs text-slate-500 dark:text-slate-400">
                                        {user.referredBy.email}
                                      </span>
                                    )}
                                  </span>
                                </span>
                              ) : (
                                "Direct signup"
                              )}
                            </dd>
                          </div>
                          <div className="col-span-2 min-w-0">
                            <dt className="text-xs text-slate-500 dark:text-slate-400">
                              Registered
                            </dt>
                            <dd className="mt-1 flex min-w-0 items-start gap-1.5 break-words text-slate-700 dark:text-slate-200">
                              <CalendarDays
                                size={14}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <span>{formatDate(user.createdAt)}</span>
                            </dd>
                          </div>
                          {isVerified && user.profile?.verifiedAt && (
                            <div className="col-span-2 min-w-0">
                              <dt className="text-xs text-slate-500 dark:text-slate-400">
                                Verified on
                              </dt>
                              <dd className="mt-1 break-words text-slate-700 dark:text-slate-200">
                                {formatDate(user.profile.verifiedAt)}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleVerification(user)}
                            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              isVerified
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            {isUpdating ? (
                              <>
                                <RefreshCw
                                  size={14}
                                  className="shrink-0 animate-spin"
                                />
                                Updating...
                              </>
                            ) : isVerified ? (
                              "Unverify"
                            ) : (
                              "Verify"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-slate-700 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                          >
                            <Eye size={14} className="shrink-0" />
                            View Profile
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-rose-600 px-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden w-full min-w-0 overflow-x-auto 2xl:block">
                  <table className="w-full min-w-[1450px] table-fixed text-left text-sm">
                    <colgroup>
                      <col style={{ width: "220px" }} />
                      <col style={{ width: "145px" }} />
                      <col style={{ width: "155px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "210px" }} />
                      <col style={{ width: "190px" }} />
                      <col style={{ width: "380px" }} />
                    </colgroup>
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          User
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          Phone
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          Referral Code
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          Referred By
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          Registered
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 font-semibold">
                          Verification
                        </th>
                        <th className="whitespace-nowrap px-20 py-4 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.map((user) => {
                        const isVerified = Boolean(user.profile?.isVerified);
                        const isUpdating = Boolean(
                          verificationLoading[user._id],
                        );

                        return (
                          <tr
                            key={user._id}
                            className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                          >
                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="font-medium text-slate-900 dark:text-white">
                                {user.fullName || "—"}
                              </div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {user.email || "—"}
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                              {user.phone || "—"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              <span className="inline-block rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                                {user.referralCode || "—"}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              {user.referredBy ? (
                                <div>
                                  <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                                    <Link2
                                      size={14}
                                      className="text-emerald-500"
                                    />
                                    {user.referredBy.fullName || "—"}
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {user.referredBy.email || "—"}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400">
                                  Direct signup
                                </span>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <CalendarDays
                                  size={15}
                                  className="shrink-0 text-slate-400"
                                />
                                <span>{formatDate(user.createdAt)}</span>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              {isVerified ? (
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                  <ShieldCheck size={14} />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                  <ShieldAlert size={14} />
                                  Not Verified
                                </span>
                              )}

                              {isVerified && user.profile?.verifiedAt && (
                                <div className="mt-1 text-xs text-slate-400">
                                  {formatDate(user.profile.verifiedAt)}
                                </div>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center gap-2">
                                {/* Verify / Unverify */}
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleVerification(user)}
                                  className={`inline-flex min-w-[105px] items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    isVerified
                                      ? "bg-rose-600 hover:bg-rose-700"
                                      : "bg-emerald-600 hover:bg-emerald-700"
                                  }`}
                                >
                                  {isUpdating ? (
                                    <>
                                      <RefreshCw
                                        size={13}
                                        className="animate-spin"
                                      />
                                      Updating...
                                    </>
                                  ) : isVerified ? (
                                    "Unverify"
                                  ) : (
                                    "Verify"
                                  )}
                                </button>

                                {/* View Profile */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/admin/users/${user._id}`)
                                  }
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold text-cyan-600 transition hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                                >
                                  <Eye size={15} />
                                  View Profile
                                </button>

                                {/* Delete User */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                >
                                  <Trash2 size={15} />
                                  Delete User
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing{" "}
                    {totalUsers === 0 ? 0 : (currentPage - 1) * limit + 1}
                    {" – "}
                    {Math.min(currentPage * limit, totalUsers)} of {totalUsers}{" "}
                    users
                  </p>

                  <div className="flex items-center justify-between gap-2 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || usersLoading}
                      className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <span className="shrink-0 px-1 text-sm text-slate-600 dark:text-slate-300">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || usersLoading}
                      className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
                <Users size={30} className="text-slate-400" />

                <p className="mt-3 font-medium text-slate-800 dark:text-white">
                  {usersError
                    ? "Users could not be loaded"
                    : search
                      ? "No matching users found"
                      : "No registered users yet"}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {search
                    ? "Try another name, email or phone number."
                    : "Registered users will appear here."}
                </p>
              </div>
            )}
          </section>
        </>
      ) : (
        <AdminOrders />
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {selectedUserToDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isDeleting) setSelectedUserToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0b1728]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <Trash2 size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="delete-user-title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  Delete User?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Are you sure you want to permanently delete this user?
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="mx-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:mx-6 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="font-semibold text-slate-900 dark:text-white">
                {selectedUserToDelete.fullName || "Unnamed User"}
              </p>

              <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                {selectedUserToDelete.email || "No email available"}
              </p>
            </div>

            {/* Warning */}
            <div className="mx-5 mt-4 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:mx-6 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <p className="leading-5">
                This action cannot be undone. The user's account, mini profile
                and plan purchase records will be deleted.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-700">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSelectedUserToDelete(null)}
                className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteUser}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
