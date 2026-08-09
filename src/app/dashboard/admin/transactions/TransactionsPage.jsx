"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, Search, Receipt } from "lucide-react";
import { Table } from "@heroui/react";
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Transactions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review billing receipts, subscription renewals, and financial logs.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#0D1528] border border-slate-800/80 flex items-center gap-3 w-fit shadow-sm">
          <DollarSign className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500">
              Total Revenue
            </p>
            <p className="text-sm font-bold text-emerald-400 font-mono">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1528] p-3 rounded-2xl border border-slate-800/80 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, plan, or session ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#060C1A] border border-slate-800/80 text-slate-200 outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "completed", "pending", "failed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* HeroUI Table Component */}
      <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0D1528] text-xs shadow-sm">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Transactions Log Table"
              className="w-full text-left"
            >
              <Table.Header className="bg-[#060C1A] text-slate-400 text-[11px] font-mono uppercase tracking-wider border-b border-slate-800/80 font-bold">
                <Table.Column isRowHeader className="px-6 py-3.5">
                  User & Session ID
                </Table.Column>
                <Table.Column className="px-6 py-3.5">
                  Plan Package
                </Table.Column>
                <Table.Column className="px-6 py-3.5">Amount</Table.Column>
                <Table.Column className="px-6 py-3.5">
                  Subscription Date
                </Table.Column>
                <Table.Column className="px-6 py-3.5 text-right">
                  Payment Status
                </Table.Column>
              </Table.Header>

              <Table.Body className="divide-y divide-slate-800/60">
                {filteredTransactions.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={5}
                      className="p-8 text-center text-xs text-slate-500 italic"
                    >
                      No transaction records found.
                    </Table.Cell>
                  </Table.Row>
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
                      <Table.Row
                        key={txId}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* User Email & Session ID */}
                        <Table.Cell className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-100 truncate">
                              {email}
                            </p>
                            <p
                              className="text-[10px] font-mono text-slate-500 truncate max-w-[220px]"
                              title={sessionId}
                            >
                              {sessionId}
                            </p>
                          </div>
                        </Table.Cell>

                        {/* Plan Package */}
                        <Table.Cell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-200">
                              {planTitle}
                            </span>
                            {isEnterprise && (
                              <Badge label="Enterprise" variant="indigo" />
                            )}
                          </div>
                        </Table.Cell>

                        {/* Amount */}
                        <Table.Cell className="px-6 py-4 font-mono font-bold text-emerald-400 text-sm">
                          {amountFormatted}
                        </Table.Cell>

                        {/* Subscription Date */}
                        <Table.Cell className="px-6 py-4 font-mono text-slate-400">
                          {dateFormatted}
                        </Table.Cell>

                        {/* Payment Status */}
                        <Table.Cell className="px-6 py-4 text-right">
                          <StatusBadge status={statusFormatted} />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}
