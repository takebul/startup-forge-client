"use client";

import {
  Modal,
  Input,
  Textarea,
  Label,
  Btn,
} from "@/components/Dashboard/founder-dashboard-shared";

export default function ApplyModal({
  opportunity,
  onClose,
  form,
  setForm,
  onSubmit,
  isSubmitting,
}) {
  if (!opportunity) return null;

  return (
    <Modal
      title={`Apply — ${opportunity.roleTitle || "Opportunity"}`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Opportunity ID</Label>
          <Input value={opportunity._id || opportunity.id || ""} disabled />
        </div>

        {opportunity.startupId && (
          <div>
            <Label>Startup ID</Label>
            <Input value={opportunity.startupId} disabled />
          </div>
        )}

        <div>
          <Label>Your Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="you@example.com"
            disabled
          />
        </div>

        <div>
          <Label>Portfolio / GitHub Link</Label>
          <Input
            value={form.portfolio}
            onChange={(v) => setForm({ ...form, portfolio: v })}
            placeholder="https://github.com/yourhandle"
          />
        </div>

        <div>
          <Label>Motivation Message</Label>
          <Textarea
            value={form.motivation}
            onChange={(v) => setForm({ ...form, motivation: v })}
            placeholder="Why are you a great fit for this role?"
            rows={4}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Btn type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Btn>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
