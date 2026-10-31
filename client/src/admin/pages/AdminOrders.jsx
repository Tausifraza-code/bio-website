import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Clock3,
  Wallet,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  UserRound,
  XCircle,
  RotateCcw,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import api from "../../redux/api";
import { fetchAdminOrders } from "../../redux/slice/adminSlice";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  cancelled:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  refunded:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getDuration = (order) =>
  `${order.durationValue} ${
    order.durationUnit === "days"
      ? "day(s)"
      : order.durationUnit === "months"
        ? "month(s)"
        : "year(s)"
  }`;

const StatCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs leading-4 text-slate-500 sm:text-sm dark:text-slate-400">
          {title}
        </p>
        <p className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          {value}
        </p>
        <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className={`shrink-0 rounded-lg p-2 sm:rounded-xl sm:p-3 ${color}`}>
        <Icon size={18} className="sm:size-5" />
      </div>
    </div>
  </div>
);

export default function AdminOrders() {
  const dispatch = useDispatch();

  const { orders, ordersStats, ordersLoading, ordersError, ordersPagination } =
    useSelector((state) => state.admin);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);

      dispatch(
        fetchAdminOrders({
          page: 1,
          limit,
          search: searchInput.trim(),
          ...filters,
        }),
      );
    }, 350);

    return () => clearTimeout(timeout);
  }, [dispatch, searchInput, filters]);

  useEffect(() => {
    dispatch(
      fetchAdminOrders({
        page,
        limit,
        search: searchInput.trim(),
        ...filters,
      }),
    );
  }, [dispatch, page, limit]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchAdminOrders({
        page,
        limit,
        search: searchInput.trim(),
        ...filters,
      }),
    );
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({ status: "", from: "", to: "" });
    setPage(1);
  };

  const handleExportOrders = async (format) => {
    try {
      setExportLoading(true);

      const response = await api.get("/plan-purchases/admin/export", {
        params: {
          search: searchInput.trim(),
          status: filters.status,
          from: filters.from,
          to: filters.to,
        },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Export failed.");
      }

      const ordersToExport = response.data.data || [];

      if (ordersToExport.length === 0) {
        alert("No orders found for the selected filters.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(ordersToExport);

      const headers = [
        "Order ID",
        "Customer Name",
        "Customer Email",
        "Customer Phone",
        "Plan Name",
        "Amount",
        "Duration",
        "Payment Status",
        "Purchase Date",
        "Expiry Date",
        "Created At",
        "Razorpay Order ID",
        "Razorpay Payment ID",
      ];

      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      worksheet["!cols"] = [
        { wch: 26 },
        { wch: 24 },
        { wch: 30 },
        { wch: 18 },
        { wch: 24 },
        { wch: 14 },
        { wch: 16 },
        { wch: 18 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 30 },
        { wch: 30 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      const date = new Date().toISOString().slice(0, 10);

      if (format === "csv") {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob(["\uFEFF", csv], {
          type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `admin-orders-${date}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        XLSX.writeFile(workbook, `admin-orders-${date}.xlsx`);
      }
    } catch (error) {
      console.error("Order export failed:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to export orders.",
      );
    } finally {
      setExportLoading(false);
    }
  };

  const totalPages = ordersPagination?.totalPages || 0;
  const total = ordersPagination?.total || 0;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            ADMINISTRATION / ORDERS
          </p>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Order Management
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor purchases, payment statuses and plan expiry dates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={ordersLoading}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:w-fit dark:border-slate-800 dark:bg-[#0b1728] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={ordersLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={(ordersStats?.totalOrders || 0).toLocaleString("en-IN")}
          description="All recorded purchases"
          icon={ShoppingBag}
          color="bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
        />

        <StatCard
          title="Paid Orders"
          value={(ordersStats?.paidOrders || 0).toLocaleString("en-IN")}
          description="Successfully paid purchases"
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />

        <StatCard
          title="Pending Orders"
          value={(ordersStats?.pendingOrders || 0).toLocaleString("en-IN")}
          description="Awaiting payment completion"
          icon={Clock3}
          color="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        />

        <StatCard
          title="Paid Revenue"
          value={formatMoney(ordersStats?.paidRevenue)}
          description="Revenue from paid orders"
          icon={Wallet}
          color="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
        />
      </section>

      {/* Search and filters */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          <div className="relative col-span-2 min-w-0 xl:col-span-2">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search user, email, plan or order ID..."
              aria-label="Search orders by user, email, plan, or order ID"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-[#071222] dark:text-white"
            />
          </div>

          <select
            value={filters.status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
            aria-label="Filter by payment status"
            className="min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-700 outline-none focus:border-cyan-500 sm:px-3 sm:text-sm dark:border-slate-700 dark:bg-[#071222] dark:text-white"
          >
            <option value="">All payment statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:gap-2 sm:px-3 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw size={15} />
            Clear filters
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <CalendarDays size={17} className="shrink-0 text-slate-400" />
            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
              From
            </span>
            <input
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(event) =>
                handleFilterChange("from", event.target.value)
              }
              className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <CalendarDays size={17} className="shrink-0 text-slate-400" />
            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
              To
            </span>
            <input
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(event) => handleFilterChange("to", event.target.value)}
              className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
            />
          </label>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => handleExportOrders("csv")}
            disabled={exportLoading}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-slate-300 px-2 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-sm dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => handleExportOrders("xlsx")}
            disabled={exportLoading}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl bg-cyan-400 px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <FileSpreadsheet size={17} />
            Export Excel
          </button>
        </div>
      </section>

      {/* Error */}
      {ordersError && (
        <div
          role="alert"
          className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <span className="min-w-0 break-words">{ordersError}</span>
          <button
            type="button"
            onClick={handleRefresh}
            className="min-h-11 shrink-0 font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Orders table */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-5 dark:border-slate-800">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              All Orders
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {total.toLocaleString("en-IN")} matching orders
            </p>
          </div>

          {ordersLoading && (
            <span className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
              <RefreshCw size={14} className="animate-spin" />
              Loading orders...
            </span>
          )}
        </div>

        {ordersLoading && orders.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500 2xl:hidden dark:text-slate-400">
            <RefreshCw size={18} className="animate-spin text-cyan-500" />
            Loading orders...
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-slate-100 2xl:hidden dark:divide-slate-800">
            {orders.map((order) => (
              <article
                key={order._id}
                className="min-w-0 space-y-4 p-4 transition hover:bg-slate-50/60 dark:hover:bg-slate-800/20"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-cyan-50 p-2 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-slate-900 dark:text-white">
                        {order.userId?.fullName || "Unknown user"}
                      </h3>
                      <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                        {order.userId?.email || "No email"}
                      </p>
                      <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">
                        {order.userId?.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium capitalize ${
                      statusStyles[order.status] || statusStyles.cancelled
                    }`}
                  >
                    {order.status === "paid" ? (
                      <CheckCircle2 size={12} />
                    ) : order.status === "pending" ? (
                      <Clock3 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {order.status || "unknown"}
                  </span>
                </div>

                <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-slate-900 dark:text-white">
                        {order.planName || order.planId?.name || "Plan"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Duration: {getDuration(order)}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-sm font-bold text-slate-900 dark:text-white">
                      {formatMoney(order.amount)}
                    </p>
                  </div>
                </div>

                <dl className="grid min-w-0 grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                      Purchase date
                    </dt>
                    <dd className="mt-1 flex min-w-0 items-start gap-1.5 break-words text-slate-700 dark:text-slate-200">
                      <CalendarDays
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />
                      <span>{formatDate(order.purchaseDate)}</span>
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                      Expiry date
                    </dt>
                    <dd className="mt-1 flex min-w-0 items-start gap-1.5 break-words text-slate-700 dark:text-slate-200">
                      <CalendarDays
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />
                      <span>{formatDate(order.expiryDate)}</span>
                    </dd>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                      Order ID
                    </dt>
                    <dd className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                      {order.razorpayOrderId || order._id}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="min-h-11 w-full rounded-lg border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                >
                  View order details
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center 2xl:hidden">
            <ShoppingBag
              size={28}
              className="text-slate-300 dark:text-slate-600"
            />
            <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
              No orders found
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}

        <div className="relative hidden w-full min-w-0 overflow-x-auto overscroll-x-contain 2xl:block">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#071222] dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Plan details</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Payment status</th>
                <th className="w-[190px] whitespace-nowrap px-5 py-4 font-semibold">
                  Purchase date
                </th>
                <th className="w-[190px] whitespace-nowrap px-5 py-4 font-semibold">
                  Expiry date
                </th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ordersLoading && orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <RefreshCw
                      size={22}
                      className="mx-auto animate-spin text-cyan-500"
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading orders...
                    </p>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                  >
                    <td className="max-w-[240px] px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                          <UserRound size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {order.userId?.fullName || "Unknown user"}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                            {order.userId?.email || "No email"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {order.userId?.phone || "No phone"}
                          </p>
                          <p
                            title={order.razorpayOrderId || order._id}
                            className="mt-2 max-w-[190px] truncate text-[11px] text-slate-400"
                          >
                            ID: {order.razorpayOrderId || order._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {order.planName || order.planId?.name || "Plan"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Duration: {getDuration(order)}
                      </p>
                      {order.razorpayPaymentId && (
                        <p
                          title={order.razorpayPaymentId}
                          className="mt-1 max-w-[180px] truncate text-xs text-slate-400"
                        >
                          Payment: {order.razorpayPaymentId}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {formatMoney(order.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          statusStyles[order.status] || statusStyles.cancelled
                        }`}
                      >
                        {order.status === "paid" ? (
                          <CheckCircle2 size={13} />
                        ) : order.status === "pending" ? (
                          <Clock3 size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        {order.status || "unknown"}
                      </span>
                    </td>

                    <td className="w-[190px] whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDate(order.purchaseDate)}
                    </td>

                    <td className="w-[190px] whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDate(order.expiryDate)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="whitespace-nowrap rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <ShoppingBag
                      size={28}
                      className="mx-auto text-slate-300 dark:text-slate-600"
                    />
                    <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
                      No orders found
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {total === 0
              ? "Showing 0 orders"
              : `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total}`}
          </p>

          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || ordersLoading}
              className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="shrink-0 px-1 text-sm text-slate-600 dark:text-slate-300">
              {totalPages ? page : 0} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages || ordersLoading}
              className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6 dark:border-slate-700 dark:bg-[#0b1728]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Order information
                </p>
                <h2
                  id="order-detail-title"
                  className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl dark:text-white"
                >
                  {selectedOrder.planName || "Plan purchase"}
                </h2>
                <p className="mt-1 break-all text-xs text-slate-500">
                  {selectedOrder.razorpayOrderId || selectedOrder._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:bg-slate-800"
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 sm:mt-5 sm:p-4 dark:bg-slate-900/60">
              <div>
                <p className="text-xs text-slate-500">Order amount</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatMoney(selectedOrder.amount)}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                  statusStyles[selectedOrder.status] || statusStyles.cancelled
                }`}
              >
                {selectedOrder.status || "unknown"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
              {[
                ["Customer", selectedOrder.userId?.fullName || "Unknown user"],
                ["Email", selectedOrder.userId?.email || "—"],
                ["Phone", selectedOrder.userId?.phone || "—"],
                [
                  "Plan",
                  selectedOrder.planName || selectedOrder.planId?.name || "—",
                ],
                ["Duration", getDuration(selectedOrder)],
                ["Purchase date", formatDate(selectedOrder.purchaseDate)],
                ["Expiry date", formatDate(selectedOrder.expiryDate)],
                ["Created at", formatDate(selectedOrder.createdAt)],
                ["Razorpay Order ID", selectedOrder.razorpayOrderId || "—"],
                ["Razorpay Payment ID", selectedOrder.razorpayPaymentId || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800 dark:text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end sm:mt-6">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="min-h-11 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
