
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Trash2,
  ArrowUpRight,
  Search,
  X,
  AlertTriangle,
  Loader2,
  User,
  RefreshCw,
} from "lucide-react";

import {
  getMyInquiries,
  deleteInquiry,
  selectInquiries,
  selectTotalInquiries,
  selectNewInquiries,
  selectInquiryLoading,
  selectInquiryError,
  selectInquiryDeleting,
  selectInquiryDeleteError,
  clearInquiryDeleteError,
} from "../redux/slice/inquirySlice";

const Leads = () => {
  const dispatch = useDispatch();

  // Redux state
  const leads = useSelector(selectInquiries);
  const totalInquiries = useSelector(selectTotalInquiries);
  const newInquiries = useSelector(selectNewInquiries);
  const loading = useSelector(selectInquiryLoading);
  const error = useSelector(selectInquiryError);
  const deleting = useSelector(selectInquiryDeleting);
  const deleteError = useSelector(selectInquiryDeleteError);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch logged-in user's inquiries from backend
  useEffect(() => {
    dispatch(getMyInquiries({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Find the selected inquiry for confirmation
  const selectedLead = useMemo(
    () =>
      leads.find(
        (lead) =>
          String(lead.id ?? lead._id) === String(deleteConfirmId),
      ),
    [leads, deleteConfirmId],
  );

  // Search inquiries
  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return leads;

    return leads.filter((lead) =>
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.subject,
        lead.message,
        lead.status,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      ),
    );
  }, [leads, searchQuery]);

  // Format the inquiry date
  const formatTimestamp = (lead) => {
    const value = lead.timestamp || lead.createdAt || lead.updatedAt;

    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open delete confirmation
  const triggerDelete = (id) => {
    dispatch(clearInquiryDeleteError());
    setDeleteConfirmId(id);
  };

  // Delete through existing Redux thunk
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId || deleting) return;

    try {
      await dispatch(deleteInquiry(deleteConfirmId)).unwrap();
      setDeleteConfirmId(null);
    } catch {
      // Error is displayed from Redux state
    }
  };

  const handleRefresh = () => {
    dispatch(getMyInquiries({ page: 1, limit: 100 }));
  };

  return (
    <main className="relative min-h-screen bg-transparent text-slate-200">
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={() => {
            if (!deleting) {
              setDeleteConfirmId(null);
              dispatch(clearInquiryDeleteError());
            }
          }}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Delete Inquiry?
            </h3>

            <p className="mt-2 break-words text-sm leading-6 text-slate-400">
              Are you sure you want to delete the inquiry from{" "}
              <span className="font-semibold text-white">
                {selectedLead?.name || "this customer"}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-300">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteConfirmId(null);
                  dispatch(clearInquiryDeleteError());
                }}
                className="flex-1 rounded-xl border border-[#38516e] bg-[#132942] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a3658] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-1 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Page Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] text-cyan-400 shadow-lg shadow-black/10">
              <MessageSquare size={22} />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                  Business workspace
                </span>

                <span className="rounded-full border border-[#29435f] bg-[#132942] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                  {totalInquiries}{" "}
                  {totalInquiries === 1 ? "Lead" : "Leads"}
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                Customer Inquiries
              </h1>

              <p className="mt-1.5 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Manage customer messages and keep track of potential business
                opportunities from your mini website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh inquiries"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>

              <span className="text-xs font-semibold text-slate-300">
                Lead management
              </span>
            </div>
          </div>
        </header>

        {/* Overview */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] shadow-lg shadow-black/10">
          <div className="border-b border-[#29435f] px-5 py-4">
            <h2 className="text-sm font-bold text-white">
              Inquiry Overview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              A quick snapshot of your customer activity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-xl border border-[#29435f] bg-[#132942] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                <MessageSquare size={17} className="text-cyan-400" />
              </div>

              <p className="text-2xl font-bold text-white">
                {totalInquiries}
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                Total inquiries
              </p>
            </div>

            <div className="rounded-xl border border-[#29435f] bg-[#132942] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <User size={17} className="text-blue-400" />
              </div>

              <p className="text-2xl font-bold text-white">
                {newInquiries}
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                New inquiries
              </p>
            </div>
          </div>
        </section>

        {/* Information Card */}
        <section className="mb-8 relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#132942] to-[#0b1b30] p-5 shadow-lg shadow-black/10">
          <h3 className="text-sm font-bold text-white">
            Grow your inquiries
          </h3>
          <p className="mt-2 text-xs leading-6 text-slate-400">
            Share your mini website link or business QR code to make it easier
            for potential customers to contact you.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-cyan-400">
            <span className="h-px w-6 bg-cyan-400/50" />
            Stay connected with customers
          </div>
        </section>

        {/* Received Inquiries */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-bold text-white">
                  Received Inquiries
                </h2>
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.08] px-2.5 py-1 text-[10px] font-bold text-cyan-400">
                  {totalInquiries} TOTAL
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Review and manage messages from your potential customers.
              </p>
            </div>

            {leads.length > 0 && (
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full rounded-xl border border-[#29435f] bg-[#0b1b30] py-3 pl-10 pr-10 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/[0.08]"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-400"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#29435f] bg-[#0b1b30] px-5 py-14 text-center">
              <Loader2 size={30} className="animate-spin text-cyan-400" />
              <h3 className="mt-4 text-sm font-bold text-white">
                Loading inquiries...
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Fetching your customer messages from the server.
              </p>
            </div>
          ) : error ? (
            /* Fetch Error */
            <div className="rounded-2xl border border-red-400/20 bg-[#0b1b30] px-5 py-12 text-center">
              <AlertTriangle size={28} className="mx-auto text-red-400" />
              <h3 className="mt-4 text-base font-bold text-white">
                Unable to load inquiries
              </h3>
              <p className="mx-auto mt-2 max-w-md break-words text-xs leading-6 text-slate-400">
                {error}
              </p>
              <button
                type="button"
                onClick={handleRefresh}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-300"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          ) : leads.length === 0 ? (
            /* Empty State */
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#38516e] bg-[#0b1b30] px-5 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942]">
                <MessageSquare
                  size={26}
                  className="text-cyan-400"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-white">
                No inquiries yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400 sm:text-sm">
                Customer messages will appear here when inquiries are submitted.
                Share your mini website or QR code to encourage customers to get
                in touch.
              </p>

              <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-[11px] font-medium text-slate-300">
                <Clock size={13} className="text-cyan-400" />
                Waiting for your first inquiry
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            /* Search Empty State */
            <div className="rounded-2xl border border-dashed border-[#38516e] bg-[#0b1b30] px-5 py-10 text-center">
              <Search size={24} className="mx-auto text-slate-500" />
              <h3 className="mt-3 text-sm font-semibold text-white">
                No matching inquiries
              </h3>
              <p className="mt-1.5 break-words text-xs text-slate-400">
                No results found for "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#38516e] bg-[#132942] px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:border-cyan-400/40 hover:bg-[#1a3658]"
              >
                <X size={13} />
                Clear Search
              </button>
            </div>
          ) : (
            /* Inquiry Cards */
            <div className="space-y-4">
              {filteredLeads.map((lead) => {
                const leadId = lead.id ?? lead._id;
                const leadName = lead.name || "Unknown customer";
                const status = lead.status || "New";

                return (
                  <article
                    key={leadId}
                    className="group relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] transition duration-200 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/5"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent opacity-80" />

                    <div className="p-4 pl-5 sm:p-5 sm:pl-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Avatar */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942] text-base font-bold text-cyan-400 sm:h-12 sm:w-12">
                          {leadName.charAt(0).toUpperCase()}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-sm font-bold text-white sm:text-base">
                              {leadName}
                            </h3>

                            <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              {status}
                            </span>
                          </div>

                          {lead.subject && (
                            <p className="mt-2 break-words text-xs font-semibold text-cyan-400/90">
                              {lead.subject}
                            </p>
                          )}

                          <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300 sm:text-sm">
                            {lead.message || "No message provided."}
                          </p>

                          {/* Contact Information */}
                          <div className="mt-4 flex flex-col gap-2 border-t border-[#29435f] pt-3 text-[11px] text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex min-w-0 items-center gap-2 transition hover:text-cyan-400"
                              >
                                <Mail size={13} className="shrink-0" />
                                <span className="break-all">{lead.email}</span>
                              </a>
                            )}

                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-2 transition hover:text-cyan-400"
                              >
                                <Phone size={13} className="shrink-0" />
                                <span>{lead.phone}</span>
                              </a>
                            )}

                            <span className="flex items-center gap-2">
                              <Clock size={13} className="shrink-0" />
                              {formatTimestamp(lead)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1.5">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              title="Reply by email"
                              aria-label={`Reply to ${leadName}`}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 transition hover:border-cyan-400/50 hover:bg-[#1a3658] hover:text-cyan-400"
                            >
                              <ArrowUpRight size={16} />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => triggerDelete(leadId)}
                            title="Delete inquiry"
                            aria-label={`Delete inquiry from ${leadName}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-400 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-400 active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Leads;
