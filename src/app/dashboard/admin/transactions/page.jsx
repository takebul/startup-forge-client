"use client";

import { useState, useMemo } from "react";
import { CreditCard, DollarSign, Search } from "lucide-react";
import {
  StatusBadge,
  Badge,
} from "@/components/Dashboard/founder-dashboard-shared";

// Seed Transactions Data
const SEED_TRANSACTIONS = [
  {
    id: "tx-101",
    user: "Sarah Chen",
    amount: 29,
    plan: "Founder Premium",
    date: "2026-08-01",
    paymentStatus: "Completed",
  },
  {
    id: "tx-102",
    user: "James Okafor",
    amount: 19,
    plan: "Collaborator Premium",
    date: "2026-08-03",
    paymentStatus: "Completed",
  },
  {
    id: "tx-103",
    user: "Elena Rostova",
    amount: 99,
    plan: "Enterprise Studio",
    date: "2026-08-04",
    paymentStatus: "Pending",
  },
  {
    id: "tx-104",
    user: "Marcus Vance",
    amount: 29,
    plan: "Founder Premium",
    date: "2026-08-05",
    paymentStatus: "Completed",
  },
  {
    id: "tx-105",
    user: "Chris Park",
    amount: 19,
    plan: "Collaborator Premium",
    date: "2026-08-06",
    paymentStatus: "Failed",
  },
];

export default function TransactionsPage() {
  const [transactions] = useState(SEED_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.paymentStatus === "Completed")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.plan.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        t.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Transactions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review billing receipts, subscription renewals, and financial logs.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#0D1528] border border-slate-800 flex items-center gap-3 w-fit">
          <DollarSign className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500">
              Total Revenue
            </p>
            <p className="text-sm font-bold text-emerald-400 font-mono">
              ${totalRevenue}.00 USD
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1528] p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, plan, or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#060C1A] border border-slate-800 text-slate-200 outline-none focus:border-amber-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "completed", "pending", "failed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0D1528]">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 text-[11px] font-mono uppercase tracking-wider bg-[#060C1A] text-slate-500 border-b border-slate-800 font-bold">
          <div className="col-span-3">Transaction ID & User</div>
          <div className="col-span-3">Plan Package</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No transaction records found.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-3">
                  <p className="font-semibold text-slate-100">{tx.user}</p>
                  <p className="text-[10px] font-mono text-slate-500">
                    {tx.id}
                  </p>
                </div>

                <div className="col-span-3 text-slate-300 font-medium">
                  {tx.plan}
                </div>

                <div className="col-span-2 font-mono font-bold text-amber-500">
                  ${tx.amount}.00
                </div>

                <div className="col-span-2 font-mono text-slate-400">
                  {tx.date}
                </div>

                <div className="col-span-2 text-right">
                  <StatusBadge status={tx.paymentStatus} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
