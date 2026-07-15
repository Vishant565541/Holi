import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="font-space text-3xl font-bold text-white">Privacy & Manifest Data Security</h1>
        <p className="font-luxury text-xs text-grey-text mt-1">Last revised: July 2026</p>
      </div>
      <div className="font-luxury text-xs md:text-sm text-grey-text leading-relaxed flex flex-col gap-6">
        <p>
          At AURA Aviation, we prioritize the confidentiality of our VIP client assets. This privacy log outlines how we gather, utilize, and protect details related to passenger manifests, payment tokens, and corporate travel schedules.
        </p>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">1. Manifest Identifiers</h3>
          <p>
            We collect passenger government IDs (Aadhar, Passports, or CPL logs) solely for flight clearance processing with regional air traffic control offices and helipad terminal securities. These details are stored in encrypted databases.
          </p>
        </div>
        <div>
          <h3 className="font-space text-sm font-bold text-white uppercase mb-2">2. Sharing with Air Traffic Controls</h3>
          <p>
            AURA shares flight plans and passenger logs only with regulatory bodies (DGCA, Airport Authority of India, local district magistrates). We do not market passenger lists to advertising broker networks.
          </p>
        </div>
      </div>
    </div>
  );
}
