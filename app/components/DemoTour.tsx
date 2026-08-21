"use client";

import { useEffect, useRef, useState } from "react";
import type { ModuleKey } from "../lib/data";

const tourSteps: Array<{
  module: ModuleKey;
  eyebrow: string;
  title: string;
  body: string;
  outcome: string;
}> = [
  {
    module: "dashboard",
    eyebrow: "Owner command center",
    title: "See the whole business in one view",
    body: "Portfolio progress, money deployed, schedule risk, pending approvals and site exceptions are brought together for the owner.",
    outcome: "No waiting for separate Excel sheets or WhatsApp summaries.",
  },
  {
    module: "projects",
    eyebrow: "Project control",
    title: "Know which site is slipping before it becomes costly",
    body: "Compare progress, timelines and current status across projects, then open any site for focused follow-up.",
    outcome: "Management attention goes to the right project first.",
  },
  {
    module: "expenses",
    eyebrow: "Money control",
    title: "Review spend before it leaves the business",
    body: "Track project expenses, pending approvals and over-budget categories with a clear audit trail.",
    outcome: "Fewer unplanned payments and faster approvals.",
  },
  {
    module: "inventory",
    eyebrow: "Material control",
    title: "Prevent shortage, excess buying and leakage",
    body: "See stock by site, reorder levels and every inward, outward or inter-site movement.",
    outcome: "Materials remain available without tying up unnecessary cash.",
  },
  {
    module: "dpr",
    eyebrow: "Site accountability",
    title: "Receive a consistent daily record from every site",
    body: "DPRs capture completed work, workforce, equipment, photos, delays and next-day priorities.",
    outcome: "The office has evidence, not only verbal updates.",
  },
  {
    module: "reports",
    eyebrow: "Decision-ready reporting",
    title: "Turn site activity into owner-ready reports",
    body: "Progress, cost, workforce and inventory reports are prepared from one connected operating record.",
    outcome: "Reviews become faster and decisions are backed by current data.",
  },
];

export function DemoTour({
  navigate,
  onClose,
}: {
  navigate: (key: ModuleKey) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const current = tourSteps[step];
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    navigate(current.module);
  }, [current.module, navigate]);

  useEffect(() => {
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    function handleKeys(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", handleKeys);
    return () => { window.removeEventListener("keydown", handleKeys); document.body.style.overflow = previousOverflow; };
  }, [onClose]);

  function next() {
    if (step === tourSteps.length - 1) {
      onClose();
      navigate("dashboard");
      return;
    }
    setStep((value) => value + 1);
  }

  return (
    <section ref={panelRef} className="demo-tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-progress" aria-label={`Step ${step + 1} of ${tourSteps.length}`}>
        {tourSteps.map((item, index) => (
          <span key={item.title} className={index <= step ? "active" : ""} />
        ))}
      </div>
      <div className="tour-topline">
        <p>{current.eyebrow}</p>
        <button type="button" onClick={onClose} aria-label="Close owner tour">×</button>
      </div>
      <h2 id="tour-title">{current.title}</h2>
      <p className="tour-copy">{current.body}</p>
      <div className="tour-outcome"><span>Owner benefit</span><strong>{current.outcome}</strong></div>
      <div className="tour-actions">
        <button type="button" className="btn secondary" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Back</button>
        <span>{step + 1} / {tourSteps.length}</span>
        <button type="button" className="btn primary" onClick={next}>{step === tourSteps.length - 1 ? "Finish tour" : "Next"}</button>
      </div>
    </section>
  );
}
