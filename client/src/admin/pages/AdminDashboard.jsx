import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  { label: "User Management", icon: Users },
  { label: "Referral Management", icon: GitBranch },
  { label: "Plan Management", icon: CreditCard },
  { label: "Order Management", icon: ShoppingBag },
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

  const { stats, recentActivity, loading, error } = useSelector(
    (state) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    if (!loading) {
      dispatch(fetchAdminDashboard());
    }
  };

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            ADMIN OVERVIEW
          </p>

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
            Areas available for administration.
          </p>

          <div className="mt-5 space-y-3">
            {quickLinks.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Icon size={17} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
