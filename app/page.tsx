"use client";

import { useEffect, useMemo, useState } from "react";
import { moduleData, navGroups, type ModuleKey } from "./lib/data";
import { AppIcon } from "./components/Icon";
import { Dashboard } from "./components/Dashboard";
import { ModuleView } from "./components/ModuleView";
import { LoginScreen } from "./components/LoginScreen";

export default function Home() {
  const [active, setActive] = useState<ModuleKey>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const current = useMemo(() => moduleData[active], [active]);

  useEffect(() => {
    function handleKeys(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setProfileOpen(false); }
    }
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  function navigate(key: ModuleKey) {
    setActive(key);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  if (!signedIn) return <LoginScreen onSignIn={() => { setSignedIn(true); notify("Welcome back, Ajit"); }} />;

  const searchResults = navGroups.flatMap((group) => group.items).filter((item) => item.label.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 7);

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
          <div><strong>BuildCore Infra</strong><small>Enterprise workspace</small></div>
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
        <div className="version">BuildCore v1.0 · Phase 1</div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <section className="main-panel">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div className="project-switcher"><span>Viewing</span><button>All projects <b>⌄</b></button></div>
          <div className="top-actions">
            <button className="search-pill" onClick={() => setSearchOpen(true)} aria-expanded={searchOpen}>⌕ <span>Search anything...</span><kbd>⌘ K</kbd></button>
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? "☀" : "◐"}</button>
            <button className="icon-btn notification" onClick={() => notify("You have 3 new notifications")} aria-label="Notifications">♢<i>3</i></button>
            <div className="profile-wrap">
              <button className="profile" onClick={() => setProfileOpen(!profileOpen)}><span>AJ</span><div><strong>Ajit</strong><small>Administrator</small></div><b>⌄</b></button>
              {profileOpen && <div className="profile-menu"><button onClick={() => notify("Profile details are ready for backend connection")}>My profile</button><button onClick={() => { navigate("roles"); setProfileOpen(false); }}>Workspace settings</button><button onClick={() => { setSignedIn(false); setProfileOpen(false); }}>Sign out</button></div>}
            </div>
          </div>
        </header>

        <div className="content">
          {active === "dashboard" ? <Dashboard navigate={navigate} notify={notify} /> : <ModuleView module={current} notify={notify} />}
        </div>
      </section>
      <nav className="mobile-nav" aria-label="Quick navigation">
        {(["dashboard", "projects", "tasks", "attendance"] as ModuleKey[]).map((key) => (
          <button key={key} className={active === key ? "active" : ""} onClick={() => navigate(key)}><AppIcon name={moduleData[key].icon} /><span>{moduleData[key].shortTitle || moduleData[key].title}</span></button>
        ))}
        <button onClick={() => setMenuOpen(true)}><AppIcon name="grid" /><span>More</span></button>
      </nav>
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
      {searchOpen && <div className="command-backdrop"><button className="command-dismiss" onClick={() => setSearchOpen(false)} aria-label="Close search"/><section className="command-palette" role="dialog" aria-modal="true" aria-label="Search BuildCore">
        <div className="command-input"><span>⌕</span><input value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} placeholder="Search modules, projects or tasks..." /><button onClick={() => setSearchOpen(false)}>ESC</button></div>
        <p>QUICK NAVIGATION</p>
        <div className="command-results">{searchResults.map((item) => <button key={item.key} onClick={() => { navigate(item.key); setSearchOpen(false); setGlobalQuery(""); }}><span className="command-icon"><AppIcon name={item.icon} /></span><div><strong>{item.label}</strong><small>Open {item.label.toLowerCase()} workspace</small></div><kbd>↵</kbd></button>)}{searchResults.length === 0 && <div className="empty-search"><strong>No matching workspace found</strong><span>Try projects, attendance, inventory or reports.</span></div>}</div>
        <footer><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to open</span></footer>
      </section></div>}
    </main>
  );
}
