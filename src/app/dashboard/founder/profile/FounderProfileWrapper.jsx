"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Sparkles,
  Building2,
  Rocket,
  Briefcase,
  Users,
  Edit,
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

function formatPlanDisplayName(planId) {
  if (!planId) return "Free Founder";
  const normalized = String(planId).toLowerCase();
  if (normalized.includes("enterprise")) return "Enterprise Founder";
  if (normalized.includes("premium")) return "Premium Founder";
  return "Free Founder";
}

export default function FounderProfileWrapper({ initialUser }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const activeUserId = String(user?.id || user?._id || "");

  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  const planDisplayName = formatPlanDisplayName(planKey);

  // Profile data state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    image:
      user?.image ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    headline: user?.headline || "Early-Stage Startup Founder & Builder",
    skills: Array.isArray(user?.skills)
      ? user.skills.join(", ")
      : user?.skills || "",
    bio: user?.bio || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Sync profile when session/user updates
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        image:
          user.image ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        headline: user.headline || "Early-Stage Startup Founder & Builder",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // =========================================================================
  // PROFILE COMPLETION CALCULATOR (25% per key field)
  // =========================================================================
  const getProfileCompletion = (data) => {
    let percentage = 0;
    const missingFields = [];

    if (data.name && data.name.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Full Name");
    }

    if (data.image && data.image.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Profile Photo");
    }

    if (data.skills && data.skills.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Domain Expertise");
    }

    if (data.bio && data.bio.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Mission & Bio");
    }

    return { percentage, missingFields };
  };

  const { percentage: completionPercentage, missingFields } =
    getProfileCompletion(profile);

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
      toast.update("Profile Saved", "Your founder profile details have been updated successfully.");
    } catch (err) {
      console.error("Failed to save founder profile:", err);
      setError(err?.message || "Failed to update profile. Please try again.");
      toast.error("Save Failed", err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const skillsList = profile.skills
    ? profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl font-sans">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Founder Profile</span>
            <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-50 border border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Rocket className="w-3 h-3 text-violet-600 dark:text-violet-400" />{" "}
              Founder
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your founder background, venture leadership credentials, and
            public recruitment profile.
          </p>
        </div>

        <Btn onClick={handleOpenModal} variant="primary">
          <Edit className="w-4 h-4 mr-1.5" />
          <span>Edit Profile</span>
        </Btn>
      </div>

      {/* Success Notification */}
      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs font-mono flex items-center justify-between shadow-sm">
          <span>✓ Founder profile updated and saved successfully!</span>
        </div>
      )}

      {/* Profile Completion Indicator */}
      <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Founder Profile Readiness
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {completionPercentage === 100
                ? "🎉 Your profile is 100% complete and verified to attract top collaborator applications."
                : "Complete all sections to boost candidate conversion rates and trust on StartupForge."}
            </p>
          </div>
          <span
            className={`text-lg font-mono font-extrabold ${
              completionPercentage === 100
                ? "text-emerald-600 dark:text-emerald-400"
                : completionPercentage >= 50
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-red-500 dark:text-red-400"
            }`}
          >
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              completionPercentage === 100
                ? "bg-emerald-500"
                : completionPercentage >= 50
                  ? "bg-gradient-to-r from-violet-600 to-indigo-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {missingFields.length > 0 && (
          <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Missing:</span>
            {missingFields.map((field) => (
              <button
                key={field}
                type="button"
                onClick={handleOpenModal}
                className="px-2.5 py-0.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300 text-[11px] font-mono hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors cursor-pointer"
              >
                + Add {field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Founder Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.image}
                alt={profile.name || "Founder Avatar"}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/30 bg-slate-50 dark:bg-[#060C1A] shadow-inner"
              />
              {isUpgraded && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 bg-violet-600 text-white p-1 rounded-xl ring-2 ring-white dark:ring-[#0D1528] shadow-md"
                  title="Verified Founder"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {profile.name || "Founder"}
                </h3>

                {isUpgraded ? (
                  <span className="flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    <span>VERIFIED FOUNDER</span>
                  </span>
                ) : (
                  <Link href="/pricing">
                    <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded-full transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                      <span>Upgrade to Verified</span>
                    </span>
                  </Link>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                {profile.headline}
              </p>

              {user?.email && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-violet-700 bg-violet-50 border border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20 px-3 py-1.5 rounded-xl text-center font-semibold">
              Plan: <strong>{planDisplayName}</strong>
            </span>
            <Link
              href="/pricing"
              className="text-[11px] font-mono text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-center transition-colors"
            >
              {isUpgraded ? "Manage Plan" : "Upgrade Plan"}
            </Link>
          </div>
        </div>

        {/* Domain Expertise & Focus */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-semibold">
            Founder Domain Expertise &amp; Industry Focus
          </p>
          {skillsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-lg font-mono bg-slate-100 text-slate-800 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              No industry focus or skills added yet. Click &quot;Edit
              Profile&quot; to add domain expertise (+25%).
            </p>
          )}
        </div>

        {/* Mission & Background Statement */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-semibold">
            Mission Statement &amp; Founder Bio
          </p>
          {profile.bio ? (
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#060C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              {profile.bio}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              No bio added yet. Click &quot;Edit Profile&quot; to share your
              vision and startup mission (+25%).
            </p>
          )}
        </div>
      </div>

      {/* Founder Workspace Shortcuts */}
      <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Founder Workspace
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quick access to startup management workflows
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/dashboard/founder/my-startup"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>My Startup</span>
          </Link>

          <Link
            href="/dashboard/founder/add-opportunity"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Post Opportunity</span>
          </Link>

          <Link
            href="/dashboard/founder/applications"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Review Applications</span>
          </Link>
        </div>
      </div>

      {/* Edit Founder Profile Modal */}
      {isModalOpen && (
        <Modal title="Update Founder Profile" onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4 font-sans">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            <div>
              <Label>Full Name</Label>
              <Input
                value={editForm.name}
                onChange={(v) => setEditForm({ ...editForm, name: v })}
                placeholder="e.g. Alex Rivera"
                required
              />
            </div>

            <div>
              <Label>Founder Headline</Label>
              <Input
                value={editForm.headline}
                onChange={(v) => setEditForm({ ...editForm, headline: v })}
                placeholder="e.g. Co-Founder & CEO @ NexusAI"
              />
            </div>

            <div>
              <Label>Profile Picture</Label>
              <ImageUpload
                value={editForm.image}
                onChange={(url) => setEditForm({ ...editForm, image: url })}
              />
            </div>

            <div>
              <Label>Domain Expertise &amp; Industry (comma-separated)</Label>
              <Input
                value={editForm.skills}
                onChange={(v) => setEditForm({ ...editForm, skills: v })}
                placeholder="Artificial Intelligence, SaaS, Product Strategy, Seed Fundraising"
              />
            </div>

            <div>
              <Label>Mission Statement &amp; Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(v) => setEditForm({ ...editForm, bio: v })}
                placeholder="Describe your startup's core vision, what problem you are solving, and what kind of collaborators you are looking to bring onto your team..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Btn type="submit" fullWidth disabled={saving}>
                {saving ? "Saving Changes..." : "Save Founder Profile"}
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
