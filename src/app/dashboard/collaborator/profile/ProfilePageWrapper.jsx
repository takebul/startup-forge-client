"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Sparkles, User, ShieldCheck } from "lucide-react";
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

// Helper to resolve user persona / role
function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function ProfilePageWrapper({ initialUser }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const activeUserId = String(user?.id || user?._id || "");

  // Resolve active persona (collaborator, founder, admin)
  const persona = useMemo(() => getUserPersona(user), [user]);

  // Check if user has an upgraded plan (Premium or Enterprise)
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  // Initialize profile state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    image:
      user?.image || "https://i.ibb.co/FkYm90bc/IMG-20251010-WA0001-1-1.png",
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

  // Sync profile when user prop or session updates
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        image:
          user.image || "https://i.ibb.co/FkYm90bc/IMG-20251010-WA0001-1-1.png",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // =========================================================================
  // DYNAMIC PROFILE COMPLETION CALCULATOR (25% per key field)
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
      missingFields.push("Profile Image");
    }

    if (data.skills && data.skills.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Skills");
    }

    if (data.bio && data.bio.trim().length > 0) {
      percentage += 25;
    } else {
      missingFields.push("Bio / Summary");
    }

    return { percentage, missingFields };
  };

  const { percentage: completionPercentage, missingFields } =
    getProfileCompletion(profile);

  // Modal Handlers
  const handleOpenModal = () => {
    setEditForm(profile);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  // Save changes to Database & State
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
      console.error("Failed to save profile:", err);
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

  const upgradeUrl =
    persona === "founder"
      ? "/dashboard/founder/pricing"
      : "/dashboard/collaborator/premium";

  return (
    <div className="p-8 space-y-6 max-w-3xl font-sans">
      {/* Header & Update Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Profile Settings</h2>
          <p className="text-xs text-slate-400 mt-1">
            View and manage your public {persona} profile and account details.
          </p>
        </div>
        <Btn onClick={handleOpenModal} variant="primary">
          Update Profile
        </Btn>
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-sm">
          <span>✓ Profile updated and saved successfully!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROFILE COMPLETION CARD */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Profile Completion
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {completionPercentage === 100
                ? `🎉 Your profile is 100% complete! Ready to stand out on the platform.`
                : `Complete your profile to increase your credibility and platform visibility.`}
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

        {/* Missing Fields Suggestions */}
        {missingFields.length > 0 && (
          <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="text-slate-500">Missing:</span>
            {missingFields.map((field) => (
              <button
                key={field}
                onClick={handleOpenModal}
                className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                + Add {field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Profile View Card */}
      <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800 space-y-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.image}
                alt={profile.name || "User Avatar"}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30 bg-[#060C1A]"
              />
              {isUpgraded && (
                <div
                  className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full ring-2 ring-[#0D1528]"
                  title={`Verified ${persona}`}
                >
                  <BadgeCheck className="w-4 h-4 fill-amber-500 text-slate-950" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100">
                  {profile.name || "User"}
                </h3>

                {/* Verified Badge or Upgrade Link */}
                {isUpgraded ? (
                  <span
                    className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                    title={`Verified ${persona} Account`}
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-amber-400 fill-amber-500/20" />
                    <span>VERIFIED</span>
                  </span>
                ) : (
                  <Link href={upgradeUrl}>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 hover:bg-white/10 border border-slate-800 px-2.5 py-0.5 rounded-full transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span>Upgrade Plan</span>
                    </span>
                  </Link>
                )}
              </div>

              <p className="text-xs font-mono text-slate-400 mt-1 capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>{persona} Account</span>
              </p>

              {user?.email && (
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <Btn onClick={handleOpenModal} variant="outline" size="sm">
            Edit Profile
          </Btn>
        </div>

        {/* Skills Section */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Skills &amp; Expertise
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
              No skills added yet. Click &quot;Update Profile&quot; to add your
              skills (+25%).
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Bio / Summary
          </p>
          {profile.bio ? (
            <p className="text-sm text-slate-300 leading-relaxed bg-[#060C1A] p-4 rounded-xl border border-slate-800/60">
              {profile.bio}
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No bio added yet. Click &quot;Update Profile&quot; to introduce
              yourself (+25%).
            </p>
          )}
        </div>
      </div>

      {/* Update Profile Modal */}
      {isModalOpen && (
        <Modal title="Update Profile" onClose={handleCloseModal}>
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
                placeholder="Your full name"
                required
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
              <Label>Skills (comma-separated)</Label>
              <Input
                value={editForm.skills}
                onChange={(v) => setEditForm({ ...editForm, skills: v })}
                placeholder="React, TypeScript, Node.js, Python, UI/UX"
              />
            </div>

            <div>
              <Label>Bio / Summary</Label>
              <Textarea
                value={editForm.bio}
                onChange={(v) => setEditForm({ ...editForm, bio: v })}
                placeholder={
                  persona === "founder"
                    ? "Share your mission, startup vision, and background..."
                    : "Tell startup founders about your technical background and experience..."
                }
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <Btn type="submit" fullWidth disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
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
