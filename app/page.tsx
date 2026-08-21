"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { moduleData, navGroups, type ModuleKey } from "./lib/data";
import { AppIcon } from "./components/Icon";
import { Dashboard } from "./components/Dashboard";
import { ModuleView } from "./components/ModuleView";
import { LoginScreen } from "./components/LoginScreen";
import { DemoTour } from "./components/DemoTour";

const projectChoices = ["All projects", "Skyline Residences", "Metro Plaza Tower", "Riverside Villas", "Orchid Tech Park"];
const searchIndex = [
  ...navGroups.flatMap((group) => group.items).map((item) => ({ ...item, detail: `Open ${item.label.toLowerCase()} workspace` })),
  ...Object.entries(moduleData).flatMap(([key, config]) => config.rows.slice(0, 3).map((row) => ({ key: key as ModuleKey, label: typeof row[0] === "string" ? row[0] : row[0].label, icon: config.icon, detail: `${config.title} · ${row.slice(1, 3).map((cell) => typeof cell === "string" ? cell : cell.label).join(" · ")}` }))),
];

export default function Home() {
  const [active, setActive] = useState<ModuleKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("All projects");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const current = useMemo(() => moduleData[active], [active]);

  useEffect(() => {
    function handleKeys(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setProfileOpen(false); setProjectMenuOpen(false); setNotificationsOpen(false); }
    }
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchInputRef.current?.focus(), 20);
  }, [searchOpen]);

  const navigate = useCallback((key: ModuleKey) => {
    setActive(key);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  const searchResults = searchIndex.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 7);

  if (!signedIn) return <LoginScreen onSignIn={() => { setSignedIn(true); notify("Welcome back, Ajit"); }} />;

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className={menuOpen ? "sidebar open" : "sidebar"} aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><span>▲</span></div>
          <div><strong>BuildCore</strong><small>Site command center</small></div>
          <button className="icon-btn close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        </div>
        <div className="workspace-card">
          <div className="workspace-icon">BC</div>
          <div><strong>Aarambh Developers</strong><small>Owner demo workspace</small></div>
          <span>⌄</span>
        </div>
        <nav>
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <button key={item.key} className={active === item.key ? "nav-item active" : "nav-item"} onClick={() => navigate(item.key)}>
                  <AppIcon name={item.icon} /><span>{item.label}</span>
                  {item.badge && <em>{item.badge}</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-help">
          <span>?</span><div><strong>Need a hand?</strong><small>Visit the help center</small></div><b>›</b>
        </div>
        <div className="version"><span /> Live demo workspace</div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <section className="main-panel">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div className="project-switcher"><span>Portfolio view</span><button onClick={() => setProjectMenuOpen(!projectMenuOpen)} aria-expanded={projectMenuOpen}>{selectedProject} <b>⌄</b></button>
            {projectMenuOpen && <div className="project-menu">{projectChoices.map((project) => <button key={project} className={selectedProject === project ? "active" : ""} onClick={() => { setSelectedProject(project); setProjectMenuOpen(false); notify(`${project} view selected`); }}>{project}<span>{selectedProject === project ? "✓" : ""}</span></button>)}</div>}
          </div>
          <div className="top-actions">
            <button className="search-pill" onClick={() => setSearchOpen(true)} aria-expanded={searchOpen}>⌕ <span>Search anything...</span><kbd>⌘ K</kbd></button>
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? "☀" : "◐"}</button>
            <button className="owner-tour-trigger" onClick={() => setTourOpen(true)}><span>▶</span> Owner tour</button>
            <div className="notification-wrap">
              <button className="icon-btn notification" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications" aria-expanded={notificationsOpen}>♢<i>3</i></button>
              {notificationsOpen && <section className="notification-menu" aria-label="Owner notifications"><div><strong>Decision centre</strong><button onClick={() => setNotificationsOpen(false)}>×</button></div><button onClick={() => { navigate("expenses"); setNotificationsOpen(false); }}><span className="alert-dot amber"/><p><strong>₹8.6L awaiting approval</strong><small>14 expense claims across 4 sites</small></p><b>›</b></button><button onClick={() => { navigate("tasks"); setNotificationsOpen(false); }}><span className="alert-dot red"/><p><strong>5 tasks are overdue</strong><small>Oldest delay is affecting Tower B</small></p><b>›</b></button><button onClick={() => { navigate("inventory"); setNotificationsOpen(false); }}><span className="alert-dot blue"/><p><strong>3 materials are out of stock</strong><small>One item may block work tomorrow</small></p><b>›</b></button></section>}
            </div>
            <div className="profile-wrap">
              <button className="profile" onClick={() => setProfileOpen(!profileOpen)}><span>AJ</span><div><strong>Ajit</strong><small>Managing Director</small></div><b>⌄</b></button>
              {profileOpen && <div className="profile-menu"><button onClick={() => notify("Owner profile opened")}>My profile</button><button onClick={() => { navigate("roles"); setProfileOpen(false); }}>Workspace settings</button><button onClick={() => { setSignedIn(false); setProfileOpen(false); }}>Sign out</button></div>}
            </div>
          </div>
        </header>

        <div className="content">
          {active === "dashboard" ? <Dashboard navigate={navigate} onStartTour={() => setTourOpen(true)} selectedProject={selectedProject} /> : <ModuleView key={active} module={current} notify={notify} selectedProject={selectedProject} />}
        </div>
      </section>
      <nav className="mobile-nav" aria-label="Quick navigation">
        {(["dashboard", "projects", "expenses", "reports"] as ModuleKey[]).map((key) => (
          <button key={key} className={active === key ? "active" : ""} onClick={() => navigate(key)}><AppIcon name={moduleData[key].icon} /><span>{moduleData[key].shortTitle || moduleData[key].title}</span></button>
        ))}
        <button onClick={() => setMenuOpen(true)}><AppIcon name="grid" /><span>More</span></button>
      </nav>
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
      {tourOpen && <><button className="tour-backdrop" onClick={() => setTourOpen(false)} aria-label="Close owner tour"/><DemoTour navigate={navigate} onClose={() => setTourOpen(false)} /></>}
      {searchOpen && <div className="command-backdrop"><button className="command-dismiss" onClick={() => setSearchOpen(false)} aria-label="Close search"/><section className="command-palette" role="dialog" aria-modal="true" aria-label="Search BuildCore">
        <div className="command-input"><span>⌕</span><input ref={searchInputRef} value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} placeholder="Search modules, projects or tasks..." /><button onClick={() => setSearchOpen(false)}>ESC</button></div>
        <p>QUICK NAVIGATION</p>
        <div className="command-results">{searchResults.map((item, index) => <button key={`${item.key}-${item.label}-${index}`} onClick={() => { navigate(item.key); setSearchOpen(false); setGlobalQuery(""); }}><span className="command-icon"><AppIcon name={item.icon} /></span><div><strong>{item.label}</strong><small>{item.detail}</small></div><kbd>Open</kbd></button>)}{searchResults.length === 0 && <div className="empty-search"><strong>No matching record found</strong><span>Try a project, person, task, material or report name.</span></div>}</div>
        <footer><span>Search across modules and demo records</span><span><kbd>ESC</kbd> to close</span></footer>
      </section></div>}
    </main>
  );
}
