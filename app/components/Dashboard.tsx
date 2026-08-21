"use client";

import { AppIcon } from "./Icon";
import type { ModuleKey } from "../lib/data";

const projects = [
  { name: "Skyline Residences", place: "Bengaluru", progress: 68, plan: 70, spend: "₹8.4Cr", variance: "2 days ahead", status: "On track", tone: "green" },
  { name: "Metro Plaza Tower", place: "Hyderabad", progress: 42, plan: 48, spend: "₹5.7Cr", variance: "6 days behind", status: "At risk", tone: "amber" },
  { name: "Riverside Villas", place: "Kochi", progress: 81, plan: 79, spend: "₹3.1Cr", variance: "3 days ahead", status: "On track", tone: "green" },
  { name: "Orchid Tech Park", place: "Noida", progress: 26, plan: 33, spend: "₹2.2Cr", variance: "9 days behind", status: "Delayed", tone: "red" },
];

const ownerActions: Array<{ title: string; detail: string; value: string; tone: string; module: ModuleKey }> = [
  { title: "Approve site expenses", detail: "14 claims from four projects", value: "₹8.6L", tone: "amber", module: "expenses" },
  { title: "Review variation request", detail: "Metro Plaza · electrical scope", value: "₹12.4L", tone: "blue", module: "projects" },
  { title: "Resolve delayed milestone", detail: "Orchid Tech · footing package", value: "9 days", tone: "red", module: "tasks" },
  { title: "Approve priority reorder", detail: "TMT steel · Metro Plaza", value: "₹3.2L", tone: "purple", module: "inventory" },
];

const projectSummaries: Record<string, { value: string; completion: string; plan: string; spent: string; budget: string; approval: string; items: string; workforce: string; dpr: string }> = {
  "All projects": { value: "₹48.2Cr", completion: "62%", plan: "60%", spent: "₹19.4Cr", budget: "₹25.1Cr", approval: "₹8.6L", items: "14 items", workforce: "594", dpr: "6 / 8" },
  "Skyline Residences": { value: "₹14.6Cr", completion: "68%", plan: "70%", spent: "₹8.4Cr", budget: "₹10.2Cr", approval: "₹0", items: "0 items", workforce: "126", dpr: "Received" },
  "Metro Plaza Tower": { value: "₹12.8Cr", completion: "42%", plan: "48%", spent: "₹5.7Cr", budget: "₹7.8Cr", approval: "₹5.6L", items: "4 items", workforce: "98", dpr: "Received" },
  "Riverside Villas": { value: "₹9.2Cr", completion: "81%", plan: "79%", spent: "₹3.1Cr", budget: "₹4.2Cr", approval: "₹0", items: "0 items", workforce: "74", dpr: "Pending" },
  "Orchid Tech Park": { value: "₹11.6Cr", completion: "26%", plan: "33%", spent: "₹2.2Cr", budget: "₹2.9Cr", approval: "₹40K", items: "7 items", workforce: "108", dpr: "Pending" },
};

function currentDate() {
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date()).toUpperCase();
}

export function Dashboard({
  navigate,
  onStartTour,
  selectedProject,
}: {
  navigate: (key: ModuleKey) => void;
  onStartTour: () => void;
  selectedProject: string;
}) {
  const summary = projectSummaries[selectedProject] ?? projectSummaries["All projects"];
  const visibleProjects = selectedProject === "All projects" ? projects : projects.filter((project) => project.name === selectedProject);
  const visibleActions = selectedProject === "All projects" ? ownerActions : ownerActions.filter((action) => action.detail.includes(selectedProject.split(" ")[0]));
  const decisionCount = visibleActions.length;
  const onTrack = visibleProjects.filter((project) => project.status === "On track").length;
  const atRisk = visibleProjects.filter((project) => project.status === "At risk").length;
  const delayed = visibleProjects.filter((project) => project.status === "Delayed").length;
  return <>
    <div className="page-head owner-page-head">
      <div>
        <div className="owner-view-label"><span>●</span> OWNER VIEW <em>Demo data</em></div>
        <p className="eyebrow">{currentDate()}</p>
        <h1>Your business, under control.</h1>
        <p>{selectedProject === "All projects" ? "The decisions and exceptions that need your attention across every active site." : `Executive position for ${selectedProject}.`}</p>
      </div>
      <div className="head-actions">
        <button className="btn secondary tour-button" onClick={onStartTour}>▶ Start 5-minute tour</button>
        <button className="btn primary" onClick={() => navigate("reports")}>View owner report →</button>
      </div>
    </div>

    <section className="owner-start" aria-labelledby="owner-start-title">
      <div className="owner-start-copy">
        <span className="start-label">START HERE</span>
        <h2 id="owner-start-title">{decisionCount ? `${decisionCount} decisions need you today` : "Everything is under control"}</h2>
        <p>{decisionCount ? `${summary.approval} is waiting for your review. Handle the urgent items first, then check today’s site update.` : "No urgent approval is waiting. You can review today’s site update when convenient."}</p>
      </div>
      <div className="owner-start-facts">
        <div><span>Money waiting</span><strong>{summary.approval}</strong></div>
        <div><span>Delayed sites</span><strong className={delayed ? "red-text" : "green-text"}>{selectedProject === "All projects" ? 1 : delayed}</strong></div>
        <div><span>Daily reports</span><strong>{summary.dpr}</strong></div>
      </div>
      <div className="owner-start-actions">
        <button className="btn primary" onClick={() => navigate("expenses")}>Review approvals <span>→</span></button>
        <button className="btn secondary" onClick={() => navigate("tasks")}>See delayed work</button>
        <button className="btn quiet" onClick={() => navigate("dpr")}>Open today’s update</button>
      </div>
    </section>

    <section className="portfolio-pulse" aria-label="Portfolio health summary">
      <div className="pulse-title"><span className="pulse-ring"><i /></span><div><strong>Overall status</strong><small>Updated 8 minutes ago</small></div></div>
      <div className="pulse-metric"><strong className="green-text">{selectedProject === "All projects" ? 6 : onTrack}</strong><span>On track</span></div>
      <div className="pulse-metric"><strong className="amber-text">{selectedProject === "All projects" ? 1 : atRisk}</strong><span>At risk</span></div>
      <div className="pulse-metric"><strong className="red-text">{selectedProject === "All projects" ? 1 : delayed}</strong><span>Delayed</span></div>
      <div className="pulse-note"><span>{decisionCount ? "!" : "✓"}</span><p><strong>{decisionCount ? `${decisionCount} owner decision${decisionCount === 1 ? "" : "s"} due` : "No owner decision pending"}</strong><small>{decisionCount ? `${summary.approval} awaiting review` : "Site team is operating within plan"}</small></p><button onClick={() => navigate(decisionCount ? "expenses" : "projects")}>{decisionCount ? "Review now" : "View site"}</button></div>
    </section>

    <section className="stats-grid owner-stats">
      <article className="stat-card"><div className="stat-icon blue"><AppIcon name="projects"/></div><div className="stat-label">Active project value <span>{selectedProject === "All projects" ? "8 sites" : "Selected site"}</span></div><strong>{summary.value}</strong><small>Contracted construction value</small></article>
      <article className="stat-card"><div className="stat-icon green"><AppIcon name="trend"/></div><div className="stat-label">Overall completion <span>Current</span></div><strong>{summary.completion}</strong><small>{summary.plan} planned as of today</small></article>
      <article className="stat-card"><div className="stat-icon purple"><AppIcon name="expenses"/></div><div className="stat-label">Money used <em>Approved</em></div><strong>{summary.spent}</strong><small>of {summary.budget} approved budget</small></article>
      <article className="stat-card priority-stat"><div className="stat-icon amber"><AppIcon name="warning"/></div><div className="stat-label">Awaiting your approval <em>{summary.items}</em></div><strong>{summary.approval}</strong><button onClick={() => navigate("expenses")}>Open approvals →</button></article>
    </section>

    <section className="owner-grid">
      <article className="card portfolio-card">
        <div className="card-head"><div><h2>Site performance</h2><p>{selectedProject === "All projects" ? "Four priority sites · actual progress against plan" : "Actual progress against plan, with schedule position"}</p></div><button onClick={() => navigate("projects")}>All projects →</button></div>
        <div className="portfolio-table-head"><span>Project</span><span>Progress</span><span>Spend to date</span><span>Schedule</span><span>Status</span></div>
        <div className="portfolio-projects">{visibleProjects.map((project, index) => <button key={project.name} onClick={() => navigate("projects")}>
          <div className="project-name"><span className={`project-thumb thumb-${index + 1}`}>{project.name[0]}</span><p><strong>{project.name}</strong><small>{project.place}</small></p></div>
          <div className="owner-progress"><p><strong>{project.progress}%</strong><span>Plan {project.plan}%</span></p><i><b className={project.progress < project.plan ? "behind" : ""} style={{ width: `${project.progress}%` }} /></i></div>
          <strong className="spend-value">{project.spend}</strong>
          <span className={project.variance.includes("behind") ? "variance behind" : "variance ahead"}>{project.variance}</span>
          <span className={`status ${project.tone}`}>{project.status}</span>
        </button>)}</div>
      </article>

      <article className="card owner-actions-card">
        <div className="card-head"><div><h2>What needs you now?</h2><p>Open an item, review the proof and decide</p></div><span className="count">{decisionCount}</span></div>
        <div className="owner-action-list">{visibleActions.length ? visibleActions.map((action) => <button key={action.title} onClick={() => navigate(action.module)}><span className={`action-mark ${action.tone}`}><AppIcon name={action.module === "expenses" ? "expenses" : action.module === "inventory" ? "inventory" : "warning"}/></span><p><strong>{action.title}</strong><small>{action.detail}</small></p><b>{action.value}</b><em>›</em></button>) : <div className="all-clear"><span>✓</span><p><strong>No decision pending</strong><small>Site operations are within the approved plan.</small></p></div>}</div>
        <button className="text-btn" onClick={() => navigate("reports")}>Prepare decision summary</button>
      </article>

      <article className="card money-card">
        <div className="card-head"><div><h2>Money position</h2><p>Paid, committed and still available</p></div><button onClick={() => navigate("reports")}>Cost report →</button></div>
        <div className="money-summary"><div><span>Approved budget</span><strong>₹25.1Cr</strong></div><div><span>Actual paid</span><strong>₹17.8Cr</strong></div><div><span>Committed</span><strong>₹3.6Cr</strong></div><div><span>Available</span><strong className="green-text">₹3.7Cr</strong></div></div>
        <div className="budget-bar"><i style={{width:"71%"}}/><i className="committed" style={{width:"14%"}}/></div>
        <div className="budget-legend"><span><i className="paid"/>Paid 71%</span><span><i className="committed"/>Committed 14%</span><span><i/>Available 15%</span></div>
        <div className="forecast-note"><span>↗</span><p><strong>Forecast remains within approved budget</strong><small>Projected saving of ₹42L if current trend holds</small></p></div>
      </article>

      <article className="card site-brief-card">
        <div className="card-head"><div><h2>Today across sites</h2><p>Daily accountability at a glance</p></div><button onClick={() => navigate("dpr")}>Open DPRs →</button></div>
        <div className="brief-metrics"><button onClick={() => navigate("attendance")}><AppIcon name="people"/><strong>{summary.workforce}</strong><span>Workforce present</span><small>Verified today</small></button><button onClick={() => navigate("dpr")}><AppIcon name="dpr"/><strong>{summary.dpr}</strong><span>DPR status</span><small>{selectedProject === "All projects" ? "2 pending" : "Latest submission"}</small></button><button onClick={() => navigate("inventory")}><AppIcon name="inventory"/><strong>{selectedProject === "All projects" ? "12" : selectedProject === "Metro Plaza Tower" ? "4" : "2"}</strong><span>Low-stock items</span><small>Reorder monitored</small></button><button onClick={() => navigate("photos")}><AppIcon name="photos"/><strong>{selectedProject === "All projects" ? "42" : "18"}</strong><span>Photos today</span><small>Timestamp verified</small></button></div>
      </article>
    </section>

    <p className="demo-disclaimer"><span>i</span>All figures shown are realistic sample data for demonstration. Your workspace will use your projects, approvals, roles and reporting structure.</p>
  </>;
}
