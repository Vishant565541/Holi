import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="font-space text-3xl font-bold text-white">Terms & Conditions of Carriage</h1>
        <p className="font-luxury text-xs text-grey-text mt-1">Last revised: July 2026</p>
      </div>
      <div className="font-luxury text-xs md:text-sm text-grey-text leading-relaxed flex flex-col gap-6">
        <p>
          All charter contracts, flights, and helicopter transits arranged by AURA Aviation are subject to our standard rules of carriage and aircraft dispatch protocols. By reserving a flight or package, the client accepts these conditions in full.
        </p>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">1. Payload & Passenger Weight Regulations</h3>
          <p>
            Due to strict civil aviation guidelines (DGCA rules), helicopter dispatches are subject to maximum load limits. All guest manifests must specify accurate weights. AURA reserves the right to decline carriage of baggage or passengers exceeding safety thresholds.
          </p>
        </div>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">2. Carriage Liability</h3>
          <p>
            AURA operates as a luxury flight coordinator. Direct air services are carried out by certified aircraft operators holding valid non-scheduled operator permits (NSOP). Operators carry standard passenger insurance guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
