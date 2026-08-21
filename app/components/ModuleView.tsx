"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ModuleConfig } from "../lib/data";
import { AppIcon } from "./Icon";

type Cell = string | { label: string; tone: string };

const optionSets: Record<string, string[]> = {
  "project": ["Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "assigned site": ["Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "assigned project": ["Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "project / store": ["Skyline · Main store", "Metro Plaza · Yard", "Riverside · Store", "Orchid Tech · Block C"],
  "project access": ["All projects", "Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "project manager": ["Vikram Mehta", "Neha Kapoor", "Aditya Menon", "Priya Sharma"],
  "assignee": ["Rohit Kulkarni", "Meera Nair", "Aman Verma", "Lakshmi Iyer"],
  "employee": ["Rohit Kulkarni", "Meera Nair", "Aman Verma", "Lakshmi Iyer"],
  "role": ["Company Admin", "Project Manager", "Site Engineer", "Supervisor", "Store Manager", "Accountant", "Contractor", "Client / Viewer"],
  "trade": ["Civil & masonry", "Electrical", "Plumbing", "Formwork", "Waterproofing", "Finishing"],
  "priority": ["High", "Medium", "Low"],
  "weather": ["Clear", "Partly cloudy", "Light rain", "Heavy rain", "High wind"],
  "status": ["Present", "Absent", "On leave", "Half day"],
  "category": ["Cement", "Steel", "Aggregates", "Masonry", "Equipment", "Fuel", "Safety", "Utilities"],
  "unit": ["bags", "MT", "kg", "m³", "nos", "litres"],
  "movement type": ["Inward", "Outward", "Site transfer", "Return"],
  "material": ["OPC Cement 53 Grade", "TMT Steel Fe500D · 16mm", "River sand", "AAC Blocks · 600×200×150"],
  "report type": ["Owner portfolio summary", "Cost vs budget", "Project progress", "Workforce attendance", "Inventory valuation"],
  "date range": ["This month", "Last month", "This quarter", "Custom range"],
  "group by": ["Project", "Cost category", "Contractor", "Week"],
  "format": ["PDF", "Excel", "On-screen preview"],
};

const filterChoices: Record<string, string[]> = {
  "All statuses": ["All statuses", "On track", "At risk", "Delayed", "Active", "Pending", "Approved", "Submitted"],
  "All projects": ["All projects", "Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "All managers": ["All managers", "Vikram Mehta", "Neha Kapoor", "Aditya Menon", "Priya Sharma"],
  "All priorities": ["All priorities", "High", "Medium", "Low"],
  "All roles": ["All roles", "Site Engineer", "Safety Officer", "Supervisor", "Quantity Surveyor"],
  "All sites": ["All sites", "Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"],
  "All categories": ["All categories", "Cement", "Steel", "Aggregates", "Masonry", "Progress", "Safety", "Quality"],
  "Stock status": ["Stock status", "In stock", "Low stock", "Out of stock"],
  "All movement types": ["All movement types", "Inward", "Outward", "Site transfer"],
  "All formats": ["All formats", "Financial", "Project progress", "People", "Materials"],
  "All work types": ["All work types", "Civil & masonry", "Electrical", "Plumbing", "Formwork"],
  "Active": ["Active", "On leave"],
};

function textOf(cell: Cell) {
  return typeof cell === "string" ? cell : cell.label;
}

function fieldName(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function selectOptions(moduleTitle: string, label: string) {
  if (label.toLowerCase() === "category" && moduleTitle === "Site Photos") return ["Progress", "Quality", "Safety", "Issue", "Before / after"];
  if (label.toLowerCase() === "category" && moduleTitle === "Expenses") return ["Equipment", "Materials", "Fuel", "Safety", "Labour", "Utilities"];
  if (label.toLowerCase() === "category" && moduleTitle === "Inventory") return ["Cement", "Steel", "Aggregates", "Masonry", "Finishing", "Consumables"];
  return optionSets[label.toLowerCase()] ?? ["Option 1", "Option 2", "Option 3"];
}

function isLongField(label: string) {
  return /description|completed|issues|message|plan/i.test(label);
}

function suggestedStatus(title: string) {
  if (/daily site/i.test(title)) return { label: "Draft", tone: "gray" };
  if (/expense/i.test(title)) return { label: "Pending", tone: "amber" };
  if (/task/i.test(title)) return { label: "Planned", tone: "gray" };
  return { label: "Active", tone: "green" };
}

function buildSubmittedRow(module: ModuleConfig, form: FormData): Cell[] {
  const value = (key: string, fallback = "—") => String(form.get(key) ?? "").trim() || fallback;
  const state = (label: string, tone: string) => ({ label, tone });
  switch (module.title) {
    case "Projects": return [value("project_name"), value("location"), value("project_manager"), `${value("start_date")} — ${value("target_completion")}`, "0%", state("Planning", "blue")];
    case "Employees": return [value("full_name"), "EMP-DEMO", value("role"), value("assigned_site"), value("phone_number"), state("Active", "green")];
    case "Contractors": return [value("company_name"), value("trade"), value("assigned_project"), "0", value("contract_value", "₹0"), state("Active", "green")];
    case "Tasks": return [value("task_title"), `${value("project")} · ${value("area_location")}`, value("assignee"), value("due_date"), state(value("priority", "Medium"), value("priority") === "High" ? "red" : "amber"), state("Planned", "gray")];
    case "Daily Site Reports": return [`Today’s DPR · ${value("project")}`, value("project"), "Ajit", value("total_workforce", "0"), value("weather"), state("Draft", "gray")];
    case "Attendance": return [value("employee"), "Site team", value("project"), value("check_in"), "—", state(value("status", "Present"), value("status") === "Present" ? "green" : "amber")];
    case "Site Photos": return [value("description", `${value("location_area")} photo set`), `${value("project")} · ${value("location_area")}`, "Ajit", "Just now", "1", state(value("category", "Progress"), "blue")];
    case "Inventory": return [value("material_name"), value("category"), value("project_store"), `${value("opening_stock", "0")} ${value("unit", "units")}`, `${value("reorder_level", "0")} ${value("unit", "units")}`, state("In stock", "green")];
    case "Material Movement": return [`DEMO-${Date.now().toString().slice(-6)}`, value("movement_type"), value("material"), value("project"), value("quantity"), state("Draft", "gray")];
    case "Expenses": return [value("expense_title"), value("category"), value("project"), "Ajit", `₹${value("amount", "0")}`, state("Pending", "amber")];
    case "Reports": return [value("report_name", value("report_type")), value("report_type"), value("project"), "Just now", "Ajit", state("View report", "blue")];
    case "Users & Roles": return [value("full_name"), value("work_email"), value("role"), value("project_access"), "Invitation sent", state("Pending", "amber")];
    default: {
      const next = [...module.rows[0]] as Cell[];
      const firstValue = value(fieldName(module.form[0]?.label ?? "name"));
      if (firstValue) next[0] = firstValue;
      const last = next[next.length - 1];
      if (typeof last !== "string") next[next.length - 1] = suggestedStatus(module.title);
      return next;
    }
  }
}

function downloadTextFile(filename: string, contents: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function DetailEvidence({ module, notify }: { module: ModuleConfig; notify: (message: string) => void }) {
  if (module.title === "Daily Site Reports") return <>
    <div className="detail-section-title"><h3>Today’s site evidence</h3><span className="status green">Submitted</span></div>
    <div className="evidence-metrics"><div><span>Work completed</span><strong>Level 12 slab reinforcement — 860 m²</strong></div><div><span>Workforce</span><strong>126 people · 9 trades</strong></div><div><span>Equipment</span><strong>6 active · 1 idle</strong></div><div><span>Tomorrow’s plan</span><strong>Final inspection and slab pour</strong></div></div>
    <div className="blocker-note"><span>!</span><p><strong>Delay recorded</strong><small>Steel delivery arrived 2 hours late. No impact to tomorrow’s pour.</small></p></div>
    <div className="site-photo-grid"><div className="site-photo p1"><span>10:42 AM</span></div><div className="site-photo p2"><span>12:18 PM</span></div><div className="site-photo p3"><span>4:06 PM</span></div></div>
  </>;

  if (module.title === "Inventory") return <>
    <div className="detail-section-title"><h3>Material control</h3><span className="status amber">Reorder review</span></div>
    <div className="stock-position"><div><span>Opening</span><strong>10.8 MT</strong></div><b>−</b><div><span>Issued</span><strong>2.4 MT</strong></div><b>+</b><div><span>Inward</span><strong>0.2 MT</strong></div><b>=</b><div><span>Available</span><strong>8.6 MT</strong></div></div>
    <div className="ledger"><div><span>Today · 11:18 AM</span><strong>2.4 MT issued to Tower A</strong><em>MI-2026-1042</em></div><div><span>Yesterday · 4:32 PM</span><strong>0.2 MT returned from fabrication</strong><em>MR-2026-0184</em></div><div><span>19 Aug · 9:06 AM</span><strong>6.0 MT inward accepted</strong><em>GRN-2026-0798</em></div></div>
  </>;

  if (module.title === "Site Photos") return <>
    <div className="detail-section-title"><h3>Verified visual record</h3><span className="status blue">18 photos</span></div>
    <p className="detail-help">Captured by Rohit Kulkarni at Tower B, Level 12. Time and location are retained with every upload.</p>
    <div className="site-photo-grid large"><div className="site-photo p1"><span>Rebar grid</span></div><div className="site-photo p2"><span>Cover blocks</span></div><div className="site-photo p3"><span>Inspection</span></div><div className="site-photo p4"><span>+15 more</span></div></div>
  </>;

  if (module.title === "Reports") return <>
    <div className="report-preview">
      <div className="report-preview-head"><div><span>OWNER REPORT</span><h3>Portfolio performance · August 2026</h3></div><strong>BUILDCORE</strong></div>
      <div className="report-kpis"><div><span>Progress</span><strong>62%</strong></div><div><span>Cost used</span><strong>77%</strong></div><div><span>At-risk sites</span><strong>2</strong></div><div><span>Forecast saving</span><strong>₹42L</strong></div></div>
      <div className="report-chart">{[64,78,54,86].map((height, index) => <div key={height}><i style={{height:`${height}%`}}/><span>{["Skyline","Metro","Riverside","Orchid"][index]}</span></div>)}</div>
      <p><strong>Management note:</strong> Metro Plaza and Orchid Tech require schedule recovery review. Portfolio forecast remains within the approved cost envelope.</p>
    </div>
    <button className="btn secondary full-width" onClick={() => { downloadTextFile("buildcore-owner-report.csv", "Metric,Value\nPortfolio progress,62%\nCost utilised,77%\nAt-risk sites,2\nForecast saving,₹42L\n"); notify("Owner report downloaded"); }}>↓ Download owner report</button>
  </>;

  if (module.title === "Projects") return <>
    <div className="detail-section-title"><h3>Executive project position</h3><span className="status green">On track</span></div>
    <div className="evidence-metrics"><div><span>Contract value</span><strong>₹14.6Cr</strong></div><div><span>Certified billing</span><strong>₹8.9Cr</strong></div><div><span>Actual progress</span><strong>68% vs 70% plan</strong></div><div><span>Forecast completion</span><strong>26 February 2027</strong></div></div>
    <div className="blocker-note safe"><span>✓</span><p><strong>No critical owner decision pending</strong><small>One technical submittal is under consultant review.</small></p></div>
  </>;

  if (module.title === "Expenses") return <>
    <div className="detail-section-title"><h3>Approval evidence</h3><span className="status amber">Pending approval</span></div>
    <div className="evidence-metrics"><div><span>Budget head</span><strong>Equipment hire</strong></div><div><span>Available budget</span><strong>₹6.2L</strong></div><div><span>Vendor</span><strong>Prime Pumps Pvt. Ltd.</strong></div><div><span>Supporting document</span><strong>Invoice + site confirmation</strong></div></div>
    <div className="blocker-note safe"><span>✓</span><p><strong>Within approved budget</strong><small>Rate matches the work order. Site engineer verified three operating days.</small></p></div>
  </>;

  return <div className="detail-timeline"><h3>Recent activity</h3><div><span>Today, 11:42 AM</span><strong>Record reviewed by project manager</strong></div><div><span>Yesterday, 5:18 PM</span><strong>Supporting information updated</strong></div><div><span>19 Aug, 2:06 PM</span><strong>Record created in BuildCore</strong></div></div>;
}

export function ModuleView({ module, notify, selectedProject = "All projects" }: { module: ModuleConfig; notify: (message: string) => void; selectedProject?: string }) {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"table" | "cards">("cards");
  const [rows, setRows] = useState<Cell[][]>(module.rows);
  const [filterValues, setFilterValues] = useState<string[]>(module.filters);
  const [selected, setSelected] = useState<number[]>([]);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
  const modalRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!modal && detailIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = modalRef.current ?? drawerRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') ?? []);
    const timer = window.setTimeout(() => (firstFieldRef.current ?? focusable()[0])?.focus(), 50);
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setModal(false); setDetailIndex(null); }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = previousOverflow; };
  }, [modal, detailIndex]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const joined = row.map(textOf).join(" ").toLowerCase();
    if (!joined.includes(query.trim().toLowerCase())) return false;
    if (selectedProject !== "All projects" && !joined.includes(selectedProject.toLowerCase())) return false;
    return filterValues.every((value, index) => {
      if (value === module.filters[index] || /^All |^This |^Today|^Last |^Active$|Stock status/i.test(value)) return true;
      return joined.includes(value.toLowerCase());
    });
  }), [filterValues, module.filters, query, rows, selectedProject]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = buildSubmittedRow(module, form);
    setRows((items) => [next, ...items]);
    setModal(false);
    notify(`${module.title.replace(/s$/, "")} saved in the demo view`);
  }

  function updateFilter(index: number, value: string) {
    setFilterValues((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function toggleSelected(index: number) {
    setSelected((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index]);
  }

  function approveSelected() {
    if (detailIndex === null) return;
    setRows((items) => items.map((row, index) => index === detailIndex ? row.map((cell, cellIndex) => cellIndex === row.length - 1 && typeof cell !== "string" ? { label: "Approved", tone: "green" } : cell) : row));
    setDetailIndex(null);
    notify("Expense approved and added to the audit trail");
  }

  function exportCurrentRecord() {
    if (!detailRow) return;
    const csv = module.columns.map((column, index) => `"${column.replaceAll('"', '""')}","${textOf(detailRow[index]).replaceAll('"', '""')}"`).join("\n");
    downloadTextFile(`${module.title.toLowerCase().replaceAll(" ", "-")}-record.csv`, csv);
    notify("Record downloaded");
  }

  function exportSelectedRecords() {
    const chosen = filteredRows.filter((_, index) => selected.includes(index));
    const lines = [module.columns.map((column) => `"${column}"`).join(","), ...chosen.map((row) => row.map((cell) => `"${textOf(cell).replaceAll('"', '""')}"`).join(","))];
    downloadTextFile(`${module.title.toLowerCase().replaceAll(" ", "-")}-selection.csv`, lines.join("\n"));
    notify(`${chosen.length} records downloaded`);
  }

  const detailRow = detailIndex === null ? null : rows[detailIndex];

  return <>
    <div className="module-head"><div><button className="breadcrumb">Workspace</button><span>›</span><span>{module.title}</span><h1>{module.title}</h1><p>{module.subtitle}{selectedProject !== "All projects" ? ` Showing ${selectedProject}.` : ""}</p></div><button className="btn primary module-action" onClick={() => setModal(true)}>＋ <span>{module.action}</span></button></div>
    {selectedProject !== "All projects" && <p className="scope-note"><span>Focused view</span> Records are filtered to {selectedProject}; summary cards retain portfolio totals.</p>}
    <section className="module-stats">{module.stats.map((stat, index) => <article key={stat.label}><div><span className={`mini-icon ${stat.tone || ["blue", "green", "purple", "amber"][index]}`}><AppIcon name={module.icon}/></span><small>{stat.label}</small></div><strong>{stat.value}</strong><p className={stat.tone || ""}>{stat.note}</p></article>)}</section>
    <section className="data-card">
      <div className="data-tools"><div className="table-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${module.title.toLowerCase()}...`} aria-label={`Search ${module.title}`}/></div><div className="filter-row">{module.filters.map((filter, index) => <select key={filter} value={filterValues[index]} onChange={(event) => updateFilter(index, event.target.value)} aria-label={filter}>{(filterChoices[filter] ?? [filter]).map((choice) => <option key={choice}>{choice}</option>)}</select>)}</div><div className="view-toggle" aria-label="Choose view"><button className={view === "table" ? "active" : ""} onClick={() => setView("table")} aria-label="Table view" aria-pressed={view === "table"}>☷</button><button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} aria-label="Card view" aria-pressed={view === "cards"}>▦</button></div></div>
      {selected.length > 0 && <div className="bulk-bar"><strong>{selected.length} selected</strong><button onClick={exportSelectedRecords}>Download</button><button onClick={() => setSelected([])}>Clear selection</button></div>}
      {filteredRows.length === 0 ? <div className="empty-state"><span>⌕</span><strong>No matching records</strong><p>Change the search or filters to see more results.</p><button onClick={() => { setQuery(""); setFilterValues(module.filters); }}>Clear filters</button></div> : view === "table" ? <div className="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all visible records" checked={filteredRows.length > 0 && selected.length === filteredRows.length} onChange={(event) => setSelected(event.target.checked ? filteredRows.map((_, index) => index) : [])}/></th>{module.columns.map((column) => <th key={column}>{column}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredRows.map((row, index) => <tr key={`${textOf(row[0])}-${index}`}><td><input type="checkbox" checked={selected.includes(index)} onChange={() => toggleSelected(index)} aria-label={`Select ${textOf(row[0])}`}/></td>{row.map((cell, cellIndex) => <td key={module.columns[cellIndex] ?? cellIndex}>{cellIndex === 0 ? <button className="primary-cell record-link" onClick={() => setDetailIndex(rows.indexOf(row))}><span className={`record-avatar av-${index % 4}`}>{textOf(cell)[0]}</span><strong>{textOf(cell)}</strong></button> : typeof cell === "string" ? (module.columns[cellIndex] === "Progress" && cell.includes("%") ? <div className="inline-progress"><span>{cell}</span><i><b style={{width:cell}}/></i></div> : cell) : <span className={`status ${cell.tone}`}>{cell.label}</span>}</td>)}<td><button className="more" onClick={() => setDetailIndex(rows.indexOf(row))} aria-label={`Open ${textOf(row[0])}`}>•••</button></td></tr>)}</tbody></table></div> : <div className="record-cards">{filteredRows.map((row, index) => <article key={`${textOf(row[0])}-${index}`}><div className="record-top"><span className={`record-avatar av-${index % 4}`}>{textOf(row[0])[0]}</span><button onClick={() => setDetailIndex(rows.indexOf(row))} aria-label={`Open ${textOf(row[0])}`}>•••</button></div><h3>{textOf(row[0])}</h3>{module.columns.slice(1).map((column, columnIndex) => <p key={column}><span>{column}</span><b>{textOf(row[columnIndex + 1])}</b></p>)}<button className="card-open" onClick={() => setDetailIndex(rows.indexOf(row))}>View details →</button></article>)}</div>}
      <div className="table-foot"><span>Showing {filteredRows.length} realistic demo record{filteredRows.length === 1 ? "" : "s"}</span><strong>Live workspace totals appear in the summary above</strong></div>
    </section>

    {modal && <div className="modal-backdrop"><button className="modal-dismiss" onClick={() => setModal(false)} aria-label="Close form"/><section ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><h2 id="modal-title">{module.action}</h2><p>Add the details below. Required fields are marked.</p></div><button onClick={() => setModal(false)} aria-label="Close">×</button></div><form onSubmit={submit}><div className="form-grid">{module.form.map((field, index) => <label key={field.label} className={index === 0 || isLongField(field.label) || index === module.form.length - 1 ? "wide" : ""}><span>{field.label}{index < 4 ? <em> *</em> : null}</span>{field.type === "select" ? <select ref={index === 0 ? firstFieldRef as React.RefObject<HTMLSelectElement> : undefined} name={fieldName(field.label)} required={index < 4} defaultValue=""><option value="" disabled>Select {field.label.toLowerCase()}</option>{selectOptions(module.title, field.label).map((option) => <option key={option}>{option}</option>)}</select> : field.type === "file" ? <label className="file-drop"><input name={fieldName(field.label)} type="file" accept="image/*" multiple/><b>＋</b><span>Choose site photos</span><small>JPG or PNG · up to 10 MB each</small></label> : isLongField(field.label) ? <textarea ref={index === 0 ? firstFieldRef as React.RefObject<HTMLTextAreaElement> : undefined} name={fieldName(field.label)} required={index < 4} placeholder={field.placeholder} rows={3}/> : <input ref={index === 0 ? firstFieldRef as React.RefObject<HTMLInputElement> : undefined} name={fieldName(field.label)} required={index < 4} type={field.type || "text"} placeholder={field.placeholder}/>}</label>)}</div><div className="form-actions"><button type="button" className="btn secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn primary" type="submit">Save {module.title.toLowerCase().replace(/s$/, "")}</button></div></form></section></div>}

    {detailRow && <div className="drawer-backdrop"><button onClick={() => setDetailIndex(null)} aria-label="Close record details"/><aside ref={drawerRef} className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="drawer-head"><div><span>{module.title.toUpperCase()}</span><h2 id="detail-title">{textOf(detailRow[0])}</h2><p>Complete record and supporting evidence</p></div><button onClick={() => setDetailIndex(null)} aria-label="Close">×</button></div><div className="drawer-body"><div className="detail-grid">{module.columns.slice(1).map((column, index) => <div key={column}><span>{column}</span><strong>{textOf(detailRow[index + 1])}</strong></div>)}</div><DetailEvidence module={module} notify={notify}/></div><div className="drawer-actions">{module.title === "Expenses" ? <><button className="btn secondary" onClick={() => notify("Expense returned for clarification")}>Request clarification</button><button className="btn primary" onClick={approveSelected}>Approve expense</button></> : <><button className="btn secondary" onClick={exportCurrentRecord}>Download record</button><button className="btn primary" onClick={() => notify("Record marked as reviewed")}>Mark reviewed</button></>}</div></aside></div>}
  </>;
}
