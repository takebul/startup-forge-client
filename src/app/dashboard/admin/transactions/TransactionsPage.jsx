"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, Search, Receipt } from "lucide-react";
import {
  StatusBadge,
  Badge,
} from "@/components/Dashboard/founder-dashboard-shared";

// Friendly plan display name lookup
const PLAN_NAME_MAP = {
  founder_free: "Founder Free",
  founder_premium: "Founder Premium",
  founder_enterprise: "Founder Enterprise",
  collaborator_free: "Collaborator Free",
  collaborator_premium: "Collaborator Premium",
  collaborator_enterprise: "Collaborator Enterprise",
};

// Helper function to format ISO date strings (e.g. 2026-08-09T16:37:58.078Z -> 2026-08-09)
function formatDate(dateStr) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
}

// Helper to format planId into readable plan title
function formatPlanTitle(planId) {
  if (!planId) return "Subscription Plan";
  const key = String(planId).toLowerCase();
  if (PLAN_NAME_MAP[key]) return PLAN_NAME_MAP[key];

  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Helper to normalize payment status for StatusBadge
function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "paid" || s === "completed") return "Completed";
  if (s === "pending" || s === "unpaid") return "Pending";
  if (s === "failed") return "Failed";
  return status || "Completed";
}

export default function TransactionsPage({ subscriptions = [] }) {
  // Helper to safely extract subscriptions array from props or server payloads
  const parseSubscriptions = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.subscriptions)) return data.subscriptions;
    return [];
  };

  const [transactions, setTransactions] = useState(() =>
    parseSubscriptions(subscriptions),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sync state when Server Component re-fetches props
  useEffect(() => {
    setTransactions(parseSubscriptions(subscriptions));
  }, [subscriptions]);

  // Total Revenue calculation (amount is stored in cents e.g., 2900 -> 29.00)
  const totalRevenue = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.payment_status === "paid" ||
          t.payment_status === "Completed" ||
          t.paymentStatus === "Completed",
      )
      .reduce((sum, t) => sum + (t.amount || 0) / 100, 0);
  }, [transactions]);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const email = String(t.email || t.user || "").toLowerCase();
      const plan = String(t.planId || t.plan || "").toLowerCase();
      const planTitle = formatPlanTitle(t.planId || t.plan).toLowerCase();
      const sessionId = String(t.session_id || t.id || "").toLowerCase();
      const mongoId = String(t._id || "").toLowerCase();
      const status = normalizeStatus(
        t.payment_status || t.paymentStatus,
      ).toLowerCase();

      const searchLower = search.toLowerCase();
      const matchesSearch =
        email.includes(searchLower) ||
        plan.includes(searchLower) ||
        planTitle.includes(searchLower) ||
        sessionId.includes(searchLower) ||
        mongoId.includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase() ||
        (statusFilter === "completed" && status === "completed");

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review billing receipts, subscription renewals, and financial logs.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3 w-fit shadow-xs dark:bg-slate-900/80 dark:border-slate-800/90">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
              Total Revenue
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              $
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, plan, or session ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-violet-500 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-violet-500 [color-scheme:light] dark:[color-scheme:dark] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "completed", "pending", "failed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Transactions Table */}
      <div className="rounded-2xl overflow-x-auto border border-slate-200/90 bg-white text-xs shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 text-slate-700 text-[11px] font-mono uppercase tracking-wider border-b border-slate-200/90 dark:bg-slate-950/60 dark:text-slate-400 dark:border-slate-800 font-bold">
            <tr>
              <th className="px-6 py-3.5">User &amp; Session ID</th>
              <th className="px-6 py-3.5">Plan Package</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Subscription Date</th>
              <th className="px-6 py-3.5 text-right">Payment Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-xs text-slate-500 italic dark:text-slate-400"
                >
                  No transaction records found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, idx) => {
                const txId = String(tx._id || tx.id || idx);
                const email = tx.email || tx.user || "N/A";
                const sessionId = tx.session_id || "N/A";
                const planTitle = formatPlanTitle(tx.planId || tx.plan);
                const isEnterprise = String(tx.planId || "").includes(
                  "enterprise",
                );

                // Amount in DB is in cents (2900 -> 29.00)
                const amountFormatted = tx.amount
                  ? `$${(tx.amount / 100).toFixed(2)}`
                  : "$0.00";

                const dateFormatted = formatDate(
                  tx.subscriptionAt || tx.createdAt || tx.date,
                );
                const statusFormatted = normalizeStatus(
                  tx.payment_status || tx.paymentStatus,
                );

                return (
                  <tr
                    key={txId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Email & Session ID */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {email}
                        </p>
                        <p
                          className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[220px]"
                          title={sessionId}
                        >
                          {sessionId}
                        </p>
                      </div>
                    </td>

                    {/* Plan Package */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {planTitle}
                        </span>
                        {isEnterprise && (
                          <Badge label="Enterprise" variant="indigo" />
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {amountFormatted}
                    </td>

                    {/* Subscription Date */}
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {dateFormatted}
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={statusFormatted} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
