"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Sparkles,
  Building2,
  Rocket,
  Briefcase,
  Users,
  ExternalLink,
  Edit,
  ShieldCheck,
  Layers,
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
    } catch (err) {
      console.error("Failed to save founder profile:", err);
      setError(err?.message || "Failed to update profile. Please try again.");
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
    <div className="p-8 space-y-6 max-w-4xl font-sans">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Founder Profile</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Rocket className="w-3 h-3 text-amber-400" /> Founder
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
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
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-sm">
          <span>✓ Founder profile updated and saved successfully!</span>
        </div>
      )}

      {/* Profile Completion Indicator */}
      <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Founder Profile Readiness
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {completionPercentage === 100
                ? "🎉 Your profile is 100% complete and verified to attract top collaborator applications."
                : "Complete all sections to boost candidate conversion rates and trust on StartupForge."}
            </p>
          </div>
          <span
            className={`text-lg font-mono font-extrabold ${
              completionPercentage === 100
                ? "text-emerald-400"
                : completionPercentage >= 50
                  ? "text-amber-500"
                  : "text-red-400"
            }`}
          >
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              completionPercentage === 100
                ? "bg-emerald-400"
                : completionPercentage >= 50
                  ? "bg-amber-500"
                  : "bg-red-400"
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {missingFields.length > 0 && (
          <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="text-slate-500">Missing:</span>
            {missingFields.map((field) => (
              <button
                key={field}
                type="button"
                onClick={handleOpenModal}
                className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                + Add {field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Founder Card */}
      <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.image}
                alt={profile.name || "Founder Avatar"}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-500/30 bg-[#060C1A] shadow-inner"
              />
              {isUpgraded && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1 rounded-xl ring-2 ring-[#0D1528] shadow-md"
                  title="Verified Founder"
                >
                  <BadgeCheck className="w-3.5 h-3.5 fill-amber-500 text-slate-950" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100">
                  {profile.name || "Founder"}
                </h3>

                {isUpgraded ? (
                  <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5 text-amber-400 fill-amber-500/20" />
                    <span>VERIFIED FOUNDER</span>
                  </span>
                ) : (
                  <Link href="/pricing">
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 hover:bg-white/10 border border-slate-800 px-2.5 py-0.5 rounded-full transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span>Upgrade to Verified</span>
                    </span>
                  </Link>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-1 font-medium">
                {profile.headline}
              </p>

              {user?.email && (
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-center">
              Plan: <strong>{planDisplayName}</strong>
            </span>
            <Link
              href="/pricing"
              className="text-[11px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-800 px-3 py-1.5 rounded-xl text-center transition-colors"
            >
              {isUpgraded ? "Manage Plan" : "Upgrade Plan"}
            </Link>
          </div>
        </div>

        {/* Domain Expertise & Focus */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Founder Domain Expertise &amp; Industry Focus
          </p>
          {skillsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-lg font-mono bg-white/5 text-slate-300 border border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No industry focus or skills added yet. Click &quot;Edit
              Profile&quot; to add domain expertise (+25%).
            </p>
          )}
        </div>

        {/* Mission & Background Statement */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Mission Statement &amp; Founder Bio
          </p>
          {profile.bio ? (
            <div className="text-sm text-slate-300 leading-relaxed bg-[#060C1A] p-4 rounded-xl border border-slate-800/80">
              {profile.bio}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No bio added yet. Click &quot;Edit Profile&quot; to share your
              vision and startup mission (+25%).
            </p>
          )}
        </div>
      </div>

      {/* Founder Workspace Shortcuts */}
      <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Founder Workspace
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick access to startup management workflows
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/dashboard/founder/my-startup"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>My Startup</span>
          </Link>

          <Link
            href="/dashboard/founder/add-opportunity"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Post Opportunity</span>
          </Link>

          <Link
            href="/dashboard/founder/applications"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Review Applications</span>
          </Link>
        </div>
      </div>

      {/* Edit Founder Profile Modal */}
      {isModalOpen && (
        <Modal title="Update Founder Profile" onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4 font-sans">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
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

            <div className="flex gap-3 pt-3 border-t border-slate-800">
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
