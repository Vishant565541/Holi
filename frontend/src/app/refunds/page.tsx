import React from "react";

export default function RefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="font-space text-3xl font-bold text-white">Refund & Flight Rescheduling Guidelines</h1>
        <p className="font-luxury text-xs text-grey-text mt-1">Last revised: July 2026</p>
      </div>
      <div className="font-luxury text-xs md:text-sm text-grey-text leading-relaxed flex flex-col gap-6">
        <p>
          Private aviation routes require meticulous pre-planning and runway slot assignments. Our cancellation terms protect operational readiness while offering fair options to our guests.
        </p>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">1. Client-Initiated Cancellations</h3>
          <p>
            Cancellations requested:
            <br />
            • More than 7 days prior to flight: 90% refund credit.
            <br />
            • Between 48 hours and 7 days: 50% cancellation fee.
            <br />
            • Less than 48 hours or no-show status: 100% cancellation fee.
          </p>
        </div>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">2. Weather & Airspace Cancellations</h3>
          <p>
            If a flight is cancelled by AURA due to hazardous weather, mountain turbulence, VIP security lockdowns, or air traffic restrictions, clients will receive a 100% refund or priority reschedule credit.
          </p>
        </div>
      </div>
    </div>
  );
}
