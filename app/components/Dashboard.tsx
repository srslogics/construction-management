"use client";
import { AppIcon } from "./Icon";
import type { ModuleKey } from "../lib/data";
const projects = [
  {name:"Skyline Residences",place:"Bengaluru, Karnataka",progress:68,phase:"Structure",tone:"green"},
  {name:"Metro Plaza Tower",place:"Hyderabad, Telangana",progress:42,phase:"Foundation",tone:"blue"},
  {name:"Riverside Villas",place:"Kochi, Kerala",progress:81,phase:"Finishing",tone:"purple"},
  {name:"Orchid Tech Park",place:"Noida, Uttar Pradesh",progress:26,phase:"Foundation",tone:"amber"},
];
export function Dashboard({navigate,notify}:{navigate:(key:ModuleKey)=>void;notify:(m:string)=>void}) {
  return <>
    <div className="page-head">
      <div><p className="eyebrow">SATURDAY, 15 AUGUST</p><h1>Good afternoon, Ajit <span>👋</span></h1><p>Here’s what’s happening across your sites today.</p></div>
      <div className="head-actions"><button className="btn secondary" onClick={()=>notify("Latest site data synced")}>↻ Refresh data</button><button className="btn primary" onClick={()=>navigate("projects")}>＋ New project</button></div>
    </div>
    <section className="stats-grid">
      <article className="stat-card"><div className="stat-icon blue"><AppIcon name="projects"/></div><div className="stat-label">Active projects <span>↗ 12%</span></div><strong>8</strong><small>of 12 total projects</small></article>
      <article className="stat-card"><div className="stat-icon green"><AppIcon name="people"/></div><div className="stat-label">Workforce on site <span>↗ 6.2%</span></div><strong>594</strong><small>across all sites today</small></article>
      <article className="stat-card"><div className="stat-icon amber"><AppIcon name="tasks"/></div><div className="stat-label">Open tasks <em>8 due today</em></div><strong>47</strong><small>5 tasks are overdue</small></article>
      <article className="stat-card"><div className="stat-icon purple"><AppIcon name="expenses"/></div><div className="stat-label">Monthly spend <span>72% budget</span></div><strong>₹1.24Cr</strong><small>of ₹1.72Cr allocated</small></article>
    </section>
    <section className="dashboard-grid">
      <article className="card project-overview">
        <div className="card-head"><div><h2>Project overview</h2><p>Progress across active projects</p></div><button onClick={()=>navigate("projects")}>View all projects →</button></div>
        <div className="project-list">{projects.map((p,i)=><button className="project-row" key={p.name} onClick={()=>navigate("projects")}><div className={`project-thumb thumb-${i+1}`}><span>{p.name.slice(0,1)}</span></div><div className="project-info"><strong>{p.name}</strong><small>⌖ {p.place}</small></div><div className="phase"><span className={`status ${p.tone}`}>{p.phase}</span></div><div className="progress-wrap"><div><span>Progress</span><b>{p.progress}%</b></div><div className="progress"><i style={{width:`${p.progress}%`}} /></div></div><div className="row-more">•••</div></button>)}</div>
      </article>
      <article className="card activity-card"><div className="card-head"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><button onClick={()=>notify("Activity marked as reviewed")}>•••</button></div>
        <div className="timeline">
          <div><span className="avatar blue">RK</span><p><strong>Rohit completed a task</strong><br/>Slab reinforcement inspection · Skyline<br/><small>12 min ago</small></p></div>
          <div><span className="avatar green">MN</span><p><strong>Meera submitted a DPR</strong><br/>Metro Plaza Tower · 98 workforce<br/><small>38 min ago</small></p></div>
          <div><span className="avatar amber">AV</span><p><strong>Material inward recorded</strong><br/>400 bags of OPC Cement · Skyline<br/><small>1 hr ago</small></p></div>
          <div><span className="avatar purple">LI</span><p><strong>24 site photos added</strong><br/>Villa 08 waterproofing · Riverside<br/><small>2 hrs ago</small></p></div>
        </div><button className="text-btn" onClick={()=>notify("All activity loaded")}>View all activity</button>
      </article>
      <article className="card attention-card"><div className="card-head"><div><h2>Needs attention</h2><p>Issues requiring action</p></div><span className="count">5</span></div>
        <button onClick={()=>navigate("tasks")}><span className="attention-icon red">!</span><div><strong>5 overdue tasks</strong><small>Oldest is 3 days overdue</small></div><b>›</b></button>
        <button onClick={()=>navigate("inventory")}><span className="attention-icon amber">◇</span><div><strong>12 low-stock materials</strong><small>3 items are out of stock</small></div><b>›</b></button>
        <button onClick={()=>navigate("dpr")}><span className="attention-icon blue">▤</span><div><strong>2 DPRs pending today</strong><small>Riverside & Orchid Tech Park</small></div><b>›</b></button>
      </article>
      <article className="card chart-card"><div className="card-head"><div><h2>Monthly progress</h2><p>Planned vs actual completion</p></div><select aria-label="Chart period"><option>Last 6 months</option></select></div>
        <div className="chart-legend"><span><i className="planned"/>Planned</span><span><i className="actual"/>Actual</span></div>
        <div className="chart"><div className="ylabels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-bars">{[[42,38],[50,46],[58,55],[67,61],[75,68],[83,72]].map((b,i)=><div className="bar-set" key={i}><div><i style={{height:`${b[0]}%`}}/><i style={{height:`${b[1]}%`}}/></div><span>{["Mar","Apr","May","Jun","Jul","Aug"][i]}</span></div>)}</div></div>
      </article>
    </section>
  </>
}
