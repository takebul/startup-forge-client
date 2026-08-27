"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  KeyRound,
  CheckCircle2,
  Edit,
  Lock,
} from "lucide-react";
import {
  Btn,
  Input,
  Textarea,
  Label,
  ImageUpload,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";
import { authClient } from "@/lib/auth-client";
import { updateUserProfile } from "@/lib/actions/users";
import { toast } from "@/components/Toast/Toast";

export default function AdminProfileWrapper({ initialUser }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const activeUserId = String(user?.id || user?._id || "");

  // Form & view states
  const [profile, setProfile] = useState({
    name: user?.name || "System Administrator",
    image:
      user?.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Platform Lead & Super Admin",
    email: user?.email || "admin@startupforge.com",
    bio:
      user?.bio ||
      "Full administrative privileges over user accounts, platform moderation, venture reviews, and billing reconciliation.",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Sync profile if user updates
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        image: user.image || prev.image,
        email: user.email || prev.email,
        bio: user.bio || prev.bio,
      }));
    }
  }, [user]);

  const handleOpenModal = () => {
    setEditForm(profile);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (activeUserId) {
        const result = await updateUserProfile(activeUserId, editForm);
        if (result?.error) throw new Error(result.error);
      }

      setProfile(editForm);
      setIsModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);

      router.refresh();
      toast.update(
        "Admin Profile Saved",
        "Administrator credentials and profile updated successfully.",
      );
    } catch (err) {
      console.error("Failed to save admin profile:", err);
      setError(err?.message || "Failed to update profile. Please try again.");
      toast.error("Save Failed", err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Administrator Profile</span>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />{" "}
              Super Admin
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your credentials, platform permissions, and administrator
            identity.
          </p>
        </div>

        <Btn onClick={handleOpenModal} variant="primary">
          <Edit className="w-4 h-4 mr-1.5" />
          <span>Edit Profile</span>
        </Btn>
      </div>

      {/* Success Notification */}
      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs font-mono flex items-center justify-between shadow-xs">
          <span>✓ Admin profile updated and persisted successfully!</span>
        </div>
      )}

      {/* Admin Identity Card */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/90 space-y-6 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/30 bg-slate-100 dark:bg-slate-950/60 shadow-inner"
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 bg-purple-600 text-white p-1 rounded-xl ring-2 ring-white dark:ring-slate-900 shadow-md"
                title="Super Administrator"
              >
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {profile.name}
                </h3>
                <span className="flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>ALL-ACCESS PRIVILEGES</span>
                </span>
              </div>

              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Administrator Session</span>
              </p>

              {user?.email && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 border border-purple-200 dark:text-purple-300 dark:bg-purple-500/10 dark:border-purple-500/20 px-3 py-1.5 rounded-xl text-center font-semibold">
              Tier: <strong>Full Admin Bypass</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 px-3 py-1.5 rounded-xl text-center">
              Role ID:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                admin_root
              </strong>
            </span>
          </div>
        </div>

        {/* Bio / Administrative Notes */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-semibold">
            Admin Statement / System Bio
          </p>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 p-4 rounded-xl">
            {profile.bio}
          </div>
        </div>
      </div>

      {/* Platform Permissions & Governance Summary */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/90 space-y-4 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Assigned Platform Capabilities</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your role grants direct control over platform data, moderation
            queues, and user permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 flex items-start gap-3">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                Startup Moderation
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Approve, reject, and verify newly submitted and resubmitted
                founder startups.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 flex items-start gap-3">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                User Account Governance
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect, modify account statuses, and manage founders and
                collaborators.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 flex items-start gap-3">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                Subscription &amp; Transaction Auditing
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time review of Stripe transactions, upgrade events, and
                billing history.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                Subscription Gate Bypass
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Unlimited platform access without requiring active founder or
                collaborator tiers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Governance Links */}
      <div className="rounded-2xl p-5 bg-white border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            Administrative Tools
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct shortcuts to admin dashboards
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/dashboard/admin/users"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60 transition-colors inline-flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Manage Users</span>
          </Link>

          <Link
            href="/dashboard/admin/startups"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60 transition-colors inline-flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Manage Startups</span>
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60 transition-colors inline-flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Transactions</span>
          </Link>
        </div>
      </div>

      {/* Edit Admin Profile Modal */}
      {isModalOpen && (
        <Modal title="Update Admin Profile" onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4 font-sans">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            <div>
              <Label>Administrator Name</Label>
              <Input
                value={editForm.name}
                onChange={(v) => setEditForm({ ...editForm, name: v })}
                placeholder="e.g. System Administrator"
                required
              />
            </div>

            <div>
              <Label>Avatar Photo</Label>
              <ImageUpload
                value={editForm.image}
                onChange={(url) => setEditForm({ ...editForm, image: url })}
              />
            </div>

            <div>
              <Label>Admin Statement / System Notes</Label>
              <Textarea
                value={editForm.bio}
                onChange={(v) => setEditForm({ ...editForm, bio: v })}
                placeholder="Describe your role responsibilities or admin notes..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Btn type="submit" fullWidth disabled={saving}>
                {saving ? "Saving Changes..." : "Save Admin Profile"}
              </Btn>
              <Btn variant="ghost" onClick={handleCloseModal} fullWidth>
                Cancel
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
