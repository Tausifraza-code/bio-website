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
  <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className={`shrink-0 rounded-xl p-3 ${color}`}>
        <Icon size={20} />
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
    <div className="space-y-6 sm:space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            ADMINISTRATION / ORDERS
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
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
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-[#0b1728] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={ordersLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search user, email, plan or order ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-[#071222] dark:text-white"
            />
          </div>

          <select
            value={filters.status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-[#071222] dark:text-white"
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
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportOrders("csv")}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => handleExportOrders("xlsx")}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{ordersError}</span>
          <button
            type="button"
            onClick={handleRefresh}
            className="font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Orders table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
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

        <div className="relative w-full min-w-0 overflow-x-auto overscroll-x-contain">
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
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {total === 0
              ? "Showing 0 orders"
              : `Showing ${(page - 1) * limit + 1}–${Math.min(
                  page * limit,
                  total,
                )} of ${total}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || ordersLoading}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="px-2 text-sm text-slate-600 dark:text-slate-300">
              {totalPages ? page : 0} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages || ordersLoading}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6 dark:border-slate-700 dark:bg-[#0b1728]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Order information
                </p>
                <h2
                  id="order-detail-title"
                  className="mt-2 text-xl font-bold text-slate-900 dark:text-white"
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
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
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

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
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
