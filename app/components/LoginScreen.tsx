"use client";

import { useState } from "react";

export function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="login-page">
      <section className="login-story" aria-label="BuildCore introduction">
        <div className="login-brand"><span>▲</span><strong>BuildCore</strong></div>
        <div className="story-content">
          <p>CONSTRUCTION OPERATIONS, CONNECTED</p>
          <h1>Every site.<br/>Every detail.<br/><em>One clear view.</em></h1>
          <p className="story-copy">Plan projects, coordinate teams and keep complete control of your construction operations.</p>
          <div className="story-metrics"><div><strong>8</strong><span>Active projects</span></div><div><strong>594</strong><span>People on site</span></div><div><strong>62%</strong><span>Average progress</span></div></div>
        </div>
        <p className="login-quote">“Clarity at the office. Confidence at the site.”</p>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={(event) => { event.preventDefault(); onSignIn(); }}>
          <div className="mobile-login-brand"><span>▲</span><strong>BuildCore</strong></div>
          <p className="welcome-label">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p>Enter your account details to continue to BuildCore.</p>
          <label><span>Work email</span><input type="email" defaultValue="ajit@buildcore.in" autoComplete="email" required /></label>
          <label><span>Password</span><div className="password-field"><input type={showPassword ? "text" : "password"} defaultValue="buildcore" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div></label>
          <div className="login-options"><label><input type="checkbox" defaultChecked /> Keep me signed in</label><button type="button">Forgot password?</button></div>
          <button className="login-submit" type="submit">Sign in to BuildCore <span>→</span></button>
          <div className="secure-note"><span>✓</span>Your connection is secure and encrypted.</div>
        </form>
        <p className="login-help">Need help? <button>Contact your administrator</button></p>
      </section>
    </main>
  );
}
