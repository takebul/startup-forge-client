"use client";

import { useState } from "react";
import {
  Btn,
  Modal,
  Input,
  Label,
} from "@/components/Dashboard/founder-dashboard-shared";

export default function PremiumPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCheckout(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100">
          Premium Subscription
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Unlock priority application placement and verified profile status.
        </p>
      </div>

      <div className="rounded-2xl p-8 bg-[#0D1528] border border-amber-500/20 text-center space-y-4">
        <span className="text-4xl">⚡</span>
        <h3 className="text-2xl font-bold text-slate-100">
          StartupForge Premium
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Get featured directly to founders, receive early access to newly
          posted opportunities, and earn a verified collaborator badge.
        </p>
        <div className="text-3xl font-extrabold text-amber-500">$29/mo</div>

        <div className="pt-2 max-w-xs mx-auto">
          <Btn fullWidth onClick={() => setShowCheckout(true)}>
            Upgrade Now · $29/mo
          </Btn>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <Modal
          title="Checkout — Premium $29/mo"
          onClose={() => setShowCheckout(false)}
        >
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <Label>Cardholder Name</Label>
              <Input placeholder="Alex Collaborator" required />
            </div>
            <div>
              <Label>Card Number</Label>
              <Input placeholder="4242 4242 4242 4242" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expiry</Label>
                <Input placeholder="MM/YY" required />
              </div>
              <div>
                <Label>CVC</Label>
                <Input placeholder="123" required />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Btn type="submit" fullWidth disabled={loading}>
                {loading ? "Processing..." : "Pay $29"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Success Modal */}
      {isSuccess && (
        <Modal title="Welcome to Premium!" onClose={() => setIsSuccess(false)}>
          <div className="text-center py-4 space-y-3">
            <div className="text-4xl text-emerald-400">✓</div>
            <p className="text-sm text-slate-300">
              Your account is now upgraded to Premium. Enjoy priority listings
              and verified features!
            </p>
            <Btn fullWidth onClick={() => setIsSuccess(false)}>
              Got It
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
