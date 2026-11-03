import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import {
  Users,
  GitBranch,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  Clock3,
  RefreshCw,
} from "lucide-react";

import AdminStatCard from "../components/AdminStatCard";
import { fetchAdminDashboard } from "../../redux/slice/adminSlice";

const statConfig = [
  {
    key: "totalUsers",
    title: "Total Users",
    description: "Registered platform users",
    icon: Users,
    accent: "cyan",
  },
  {
    key: "totalReferrals",
    title: "Total Referrals",
    description: "Successful referral registrations",
    icon: GitBranch,
    accent: "emerald",
  },
  {
    key: "activePlans",
    title: "Active Plans",
    description: "Currently active plans",
    icon: CreditCard,
    accent: "violet",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    description: "Orders across the platform",
    icon: ShoppingBag,
    accent: "amber",
  },
];

const quickLinks = [
  {
    label: "User Management",
    description: "Manage registered users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Referral Management",
    description: "View referral activity",
    icon: GitBranch,
    path: "/admin/referrals",
  },
  {
    label: "Plan Management",
    description: "Manage available plans",
    icon: CreditCard,
    path: "/admin/plans",
  },
  {
    label: "Order Management",
    description: "View and manage orders",
    icon: ShoppingBag,
    path: "/admin/orders",
  },
];

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { stats, recentActivity, dailyReport, loading, error } = useSelector(
    (state) => state.admin,
  );

  const today = new Date();
  const formatInputDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState(formatInputDate(today));
  const [toDate, setToDate] = useState(formatInputDate(today));
  const [appliedDates, setAppliedDates] = useState({
    from: formatInputDate(today),
    to: formatInputDate(today),
  });

  useEffect(() => {
    dispatch(fetchAdminDashboard(appliedDates));
  }, [dispatch, appliedDates]);

  const handleRefresh = () => {
    if (!loading) {
      dispatch(fetchAdminDashboard(appliedDates));
    }
  };

  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      return;
    }

    if (fromDate > toDate) {
      alert("From Date cannot be after To Date.");
      return;
    }

    setAppliedDates({
      from: fromDate,
      to: toDate,
    });
  };

  const handleQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();

    if (days === 0) {
      // Today
    } else if (days === 1) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else {
      start.setDate(start.getDate() - (days - 1));
    }

    const from = formatInputDate(start);
    const to = formatInputDate(end);

    setFromDate(from);
    setToDate(to);
    setAppliedDates({ from, to });
  };

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor your platform and manage your business from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-[#0b1728] dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </section>

      {/* DATE FILTER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Date-wise Report
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select a date range to view dashboard statistics.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { label: "Today", days: 0 },
            { label: "Yesterday", days: 1 },
            { label: "Last 7 Days", days: 7 },
            { label: "Last 30 Days", days: 30 },
          ].map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => handleQuickFilter(filter.days)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={loading || !fromDate || !toDate}
            className="rounded-lg bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Report period: {appliedDates.from} to {appliedDates.to}
        </p>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Platform Statistics
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Key metrics at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statConfig.map((item) => {
            const value = stats?.[item.key];

            return (
              <AdminStatCard
                key={item.key}
                title={item.title}
                description={item.description}
                icon={item.icon}
                accent={item.accent}
                value={
                  value == null ? "—" : Number(value).toLocaleString("en-IN")
                }
              />
            );
          })}
        </div>
      </section>

      {/* DAILY REPORT */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Daily Report Breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Day-wise users, referrals and successful orders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">New Users</th>
                <th className="px-5 py-4">Referrals</th>
                <th className="px-5 py-4">Paid Orders</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dailyReport?.length > 0 ? (
                dailyReport.map((item) => (
                  <tr
                    key={item.date}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800 dark:text-white">
                      {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-cyan-600 dark:text-cyan-400">
                      {Number(item.newUsers || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {Number(item.referrals || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 font-semibold text-violet-600 dark:text-violet-400">
                      {Number(item.paidOrders || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No daily report data available for this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Showing {dailyReport?.length || 0} days in the selected date range.
        </div>
      </section>

      {/* Management Overview */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728] xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest user registrations from your platform.
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <Clock3 size={19} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {loading && recentActivity.length === 0 ? (
              <div className="flex min-h-44 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <RefreshCw size={17} className="animate-spin" />
                Loading recent activity...
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div className="mt-0.5 rounded-lg bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <Users size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {activity.name || "New user"}
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        {" "}
                        registered on the platform
                      </span>
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                      {activity.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    Registered
                  </span>
                </div>
              ))
            ) : (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center dark:border-slate-700">
                <ArrowUpRight
                  size={24}
                  className="text-slate-500 dark:text-slate-400"
                />
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {error
                    ? "Activity could not be loaded"
                    : "No recent activity"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Quick Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quickly access your management sections.
          </p>

          <div className="mt-5 space-y-3">
            {quickLinks.map(({ label, description, icon: Icon, path }) => (
              <Link
                key={label}
                to={path}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-cyan-200 hover:bg-cyan-50/50 dark:border-slate-800 dark:hover:border-cyan-900 dark:hover:bg-cyan-500/5"
              >
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 transition group-hover:bg-cyan-100 group-hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-400">
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-600"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
