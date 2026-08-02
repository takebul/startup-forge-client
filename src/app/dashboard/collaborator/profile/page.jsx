"use client";

import { useState } from "react";
import {
  Btn,
  Input,
  Textarea,
  Label,
  ImageUpload,
} from "@/components/Dashboard/founder-dashboard-shared";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Collaborator",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    skills: "React, TypeScript, Node.js",
    bio: "Full-stack engineer with 5 years experience building scalable web products.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Profile Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Update your public collaborator profile and skill set.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800 space-y-5"
      >
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/30"
          />
          <div>
            <h3 className="font-semibold text-slate-100">{profile.name}</h3>
            <p className="text-xs font-mono text-slate-500">
              Collaborator Account
            </p>
          </div>
        </div>

        <div>
          <Label>Full Name</Label>
          <Input
            value={profile.name}
            onChange={(v) => setProfile({ ...profile, name: v })}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <Label>Profile Picture</Label>
          <ImageUpload
            value={profile.image}
            onChange={(url) => setProfile({ ...profile, image: url })}
          />
        </div>

        <div>
          <Label>Skills (comma-separated)</Label>
          <Input
            value={profile.skills}
            onChange={(v) => setProfile({ ...profile, skills: v })}
            placeholder="React, Node.js, Python"
          />
        </div>

        <div>
          <Label>Bio / Summary</Label>
          <Textarea
            value={profile.bio}
            onChange={(v) => setProfile({ ...profile, bio: v })}
            placeholder="Tell startup founders about your experience..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Btn type="submit">Save Profile</Btn>
          {saved && (
            <span className="text-xs font-mono text-emerald-400">
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
