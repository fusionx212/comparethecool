"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [heat, setHeat] = useState(false);
  useEffect(() => {
    setHeat(window.location.hostname.toLowerCase().includes("comparetheheat"));
  }, []);
  const name = heat ? "Compare the Heat" : "Compare the Cool";
  return (
    <footer className="mt-20 border-t rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-8 text-center">
        <p className="text-xs text-foreground/50">
          {name} — Expert reviews &amp; price comparison. As an Amazon Associate we earn from
          qualifying purchases. Purchases through eBay links may earn us a commission.
        </p>
      </div>
    </footer>
  );
}
