import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GitBranch,
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Mail,
  Phone,
  ArrowLeft,
  UserRound,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  fetchAdminReferrals,
  fetchReferredUsers,
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

export default function AdminReferrals() {
  const dispatch = useDispatch();

  const {
    referrals,
    referralPagination,
    totalReferralSignups,
    referralsLoading,
    referralsError,
    selectedReferrer,
    referredUsers,
    referredUsersPagination,
    referredUsersLoading,
    referredUsersError,
  } = useSelector((state) => state.admin);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailPage, setDetailPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState("");

  const limit = 10;
  const totalPages = referralPagination?.totalPages || 0;
  const detailTotalPages = referredUsersPagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchAdminReferrals({
        page,
        limit,
        search,
        sortBy: "date",
        sortOrder: "desc",
      }),
    );
  }, [dispatch, page, search]);

  useEffect(() => {
    if (!selectedUserId) return;

    dispatch(
      fetchReferredUsers({
        userId: selectedUserId,
        page: detailPage,
        limit,
      }),
    );
  }, [dispatch, selectedUserId, detailPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(1);
    setSearch("");
  };

  const handleSelectReferrer = (userId) => {
    setSelectedUserId(userId);
    setDetailPage(1);
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setDetailPage(1);
  };

  const handleRefresh = () => {
    if (selectedUserId) {
      dispatch(
        fetchReferredUsers({
          userId: selectedUserId,
          page: detailPage,
          limit,
        }),
      );
    } else {
      dispatch(
        fetchAdminReferrals({
          page,
          limit,
          search,
          sortBy: "date",
          sortOrder: "desc",
        }),
      );
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(""), 1500);
    } catch {
      setCopiedCode("");
    }
  };

  const currentReferrer = referrals.find(
    (user) => String(user.userId) === String(selectedUserId),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            REFERRAL MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {selectedUserId ? "Referral Details" : "Referral Overview"}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {selectedUserId
              ? "View users registered through this referral code."
              : "Track referral registrations and referral performance."}
          </p>
        </div>

        <div className="flex gap-2">
          {selectedUserId && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={referralsLoading || referredUsersLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-[#0b1728] dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={
                referralsLoading || referredUsersLoading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>
      </section>

      {/* Overview cards */}
      {!selectedUserId && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Referral Registrations
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {totalReferralSignups.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <GitBranch size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Referrers on This Page
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {referrals.length}
                </p>
              </div>
              <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Users size={24} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      {!selectedUserId && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1728] sm:p-5">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, email or referral code..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </form>
        </section>
      )}

      {/* Overview error */}
      {!selectedUserId && referralsError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={18} />
            {referralsError}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            className="font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Overview table */}
      {!selectedUserId && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Referrer Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select a referrer to inspect their referral registrations.
            </p>
          </div>

          {referralsLoading && referrals.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <RefreshCw size={18} className="animate-spin" />
              Loading referrals...
            </div>
          ) : referrals.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Referrer</th>
                      <th className="px-5 py-4 font-semibold">Referral Code</th>
                      <th className="px-5 py-4 font-semibold">
                        Total Referrals
                      </th>
                      <th className="px-5 py-4 font-semibold">Registered</th>
                      <th className="px-5 py-4 font-semibold">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {referrals.map((user) => (
                      <tr
                        key={user.userId}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user.fullName || "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {user.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                              {user.referralCode || "—"}
                            </span>
                            {user.referralCode && (
                              <button
                                type="button"
                                onClick={() => handleCopy(user.referralCode)}
                                title="Copy referral code"
                                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                {copiedCode === user.referralCode ? (
                                  <Check size={15} />
                                ) : (
                                  <Copy size={15} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {user.totalReferrals ?? 0}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-2">
                            <CalendarDays
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            {formatDate(user.registeredAt)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleSelectReferrer(user.userId)}
                            className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20"
                          >
                            View users
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {referralPagination.currentPage || 1} of {totalPages}
                  {" · "}
                  {referralPagination.totalUsers || 0} referrers
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => current - 1)}
                    disabled={page <= 1 || referralsLoading}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={page >= totalPages || referralsLoading}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
              <GitBranch size={30} className="text-slate-400" />
              <p className="mt-3 font-medium text-slate-800 dark:text-white">
                {search ? "No matching referrers found" : "No referrers found"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try another search or check referral registrations.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Selected referrer details */}
      {selectedUserId && (
        <section className="space-y-5">
          {currentReferrer && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <UserRound size={26} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {currentReferrer.fullName}
                  </h2>
                  <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                    {currentReferrer.email}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Referral code: {currentReferrer.referralCode || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Total Referrals
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {currentReferrer.totalReferrals ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {referredUsersError && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <span>{referredUsersError}</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Referred Users
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Registrations attributed to this referrer.
              </p>
            </div>

            {referredUsersLoading && referredUsers.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <RefreshCw size={18} className="animate-spin" />
                Loading referred users...
              </div>
            ) : referredUsers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-semibold">User</th>
                        <th className="px-5 py-4 font-semibold">Phone</th>
                        <th className="px-5 py-4 font-semibold">Code Used</th>
                        <th className="px-5 py-4 font-semibold">Registered</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {referredUsers.map((user) => (
                        <tr key={user.userId}>
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {user.fullName || "—"}
                            </p>
                            <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                              {user.email || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <Phone size={14} className="text-slate-400" />
                              {user.phone || "—"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                              {user.referralCodeUsed || "—"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <CalendarDays
                                size={15}
                                className="shrink-0 text-slate-400"
                              />
                              {formatDate(user.registeredAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Page {referredUsersPagination.currentPage || 1} of{" "}
                    {detailTotalPages}
                    {" · "}
                    {referredUsersPagination.totalUsers || 0} referred users
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailPage((current) => current - 1)}
                      disabled={detailPage <= 1 || referredUsersLoading}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => setDetailPage((current) => current + 1)}
                      disabled={
                        detailPage >= detailTotalPages || referredUsersLoading
                      }
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
                <Users size={30} className="text-slate-400" />
                <p className="mt-3 font-medium text-slate-800 dark:text-white">
                  No referred users found
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This referrer has no referral registrations yet.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
