import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the owner command centre", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>BuildCore<\/title>/i);
  assert.match(html, /Your business, under control\./i);
  assert.match(html, /decisions need you today/i);
  assert.match(html, /What needs you now\?/i);
  assert.match(html, /Review approvals/i);
  assert.match(html, /Aarambh Developers/i);
  assert.match(html, /buildcore-whatsapp-preview-v2\.jpg/i);
  assert.doesNotMatch(html, /Phase 1/i);
});

test("keeps the distributed demo credible and owner-ready", async () => {
  const [layout, page, moduleView, serviceWorker, packageJson, nodeVersion, styles, manifest] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ModuleView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.node-version", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /buildcore-whatsapp-preview-v2\.jpg/);
  assert.match(layout, /type: "image\/jpeg"/);
  assert.doesNotMatch(layout, /buildcore-preview-(?:premium\.png|no-phase\.jpg)/);
  assert.match(page, /Owner tour/);
  assert.match(page, /selectedProject=\{selectedProject\}/);
  assert.match(page, /aria-live="polite"/);
  assert.match(moduleView, /Expense approved and added to the audit trail/);
  assert.match(moduleView, /START HERE/);
  assert.match(moduleView, /mobile-primary-action/);
  assert.match(moduleView, /type="file"/);
  assert.match(moduleView, /optionSets/);
  assert.match(serviceWorker, /event\.request\.mode !== "navigate"/);
  assert.doesNotMatch(serviceWorker, /cached \|\| caches\.match\("\/"\)/);
  assert.doesNotMatch(serviceWorker, /cache\.put\(event\.request/);
  assert.match(serviceWorker, /self\.skipWaiting\(\)/);
  assert.match(serviceWorker, /self\.clients\.claim\(\)/);
  assert.equal(JSON.parse(packageJson).engines.node, "22.x");
  assert.equal(nodeVersion.trim(), "22.22.0");
  assert.match(styles, /\.app\{display:flex;min-height:100vh/);
  assert.match(styles, /\.sidebar\{width:252px;position:fixed/);
  assert.match(styles, /\.main-panel\{margin-left:252px/);
  assert.match(styles, /\.topbar\{height:68px;background:var\(--card\)/);
  assert.match(styles, /Premium midnight, sapphire and bronze theme/);
  assert.equal(JSON.parse(manifest).theme_color, "#0b1728");
});