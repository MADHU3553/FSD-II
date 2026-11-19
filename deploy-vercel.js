#!/usr/bin/env node

/**
 * Fast Vercel Deploy Automation for DearFSD React Experiments
 * Deploys all 10 React applications in one shot.
 */

import { execSync, spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const projects = [
  {
    name: "react-conditional-rendering",
    dir: "react-conditional-rendering-app/react-conditional-rendering-app-main",
    title: "React Conditional Rendering"
  },
  {
    name: "react-form-events",
    dir: "react-form-events-app/react-form-events-app-main",
    title: "React Form Events"
  },
  {
    name: "react-frontend-crud",
    dir: "react-frontend-crud-app/react-frontend-crud-app-main",
    title: "React Frontend CRUD"
  },
  {
    name: "react-html-render",
    dir: "react_html_render_app/react_html_render_app",
    title: "React HTML Render"
  },
  {
    name: "react-jsx-render",
    dir: "react_jsx_render_app/react_jsx_render_app",
    title: "React JSX Render"
  },
  {
    name: "react-nested-components",
    dir: "react_multiple_components/react_multiple_components",
    title: "React Nested Components"
  },
  {
    name: "react-rendering-lists",
    dir: "react-rendering-lists-app/react-rendering-lists-app-main",
    title: "React Rendering Lists"
  },
  {
    name: "react-state-events",
    dir: "react-state-events-app/react-state-events-app-main",
    title: "React State Events"
  },
  {
    name: "react-router",
    dir: "react-router-app/react-router-app-main",
    title: "React Router"
  },
  {
    name: "mern-crud-frontend",
    dir: "mern-crud-app/mern-crud-app-main/frontend",
    title: "MERN CRUD Frontend"
  }
];

console.log("==================================================");
console.log("🚀 DearFSD - Automated Vercel Deployer");
console.log("==================================================\n");

// 1. Verify Vercel CLI login
console.log("Checking Vercel CLI login status...");
const whoami = spawnSync("npx", ["--yes", "vercel", "whoami"], { encoding: "utf-8" });

if (whoami.status !== 0) {
  console.log("⚠️ You are not logged in to Vercel CLI.");
  console.log("Please authenticate below (press Enter on default prompt):\n");
  spawnSync("npx", ["--yes", "vercel", "login"], { stdio: "inherit" });
} else {
  console.log(`✅ Logged in as: ${whoami.stdout.trim()}`);
  console.log(`💡 Note: If you want to deploy to a different/friend's account, run:`);
  console.log(`   npx vercel logout && npx vercel login\n`);
}

// 2. Deploy each project
const results = [];
const rootDir = process.cwd();

for (let i = 0; i < projects.length; i++) {
  const p = projects[i];
  const targetPath = path.resolve(rootDir, p.dir);

  console.log(`[${i + 1}/${projects.length}] Deploying "${p.title}" (${p.name})...`);

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Directory not found: ${p.dir}`);
    results.push({ name: p.name, title: p.title, url: "FAILED (Folder not found)", status: "❌" });
    continue;
  }

  try {
    // Run vercel deploy directly on the subfolder with modern project flag
    const deployCmd = `npx --yes vercel "${targetPath}" --project "${p.name}" --create-if-missing --prod --yes`;
    const output = execSync(deployCmd, { encoding: "utf-8" });
    
    // Find URL in output
    const lines = output.trim().split("\n");
    const liveUrl = lines.find(l => l.includes("https://") && l.includes(".vercel.app"))?.trim() || lines[lines.length - 1].trim();

    console.log(`   ✅ Deployed: ${liveUrl}\n`);
    results.push({ name: p.name, title: p.title, url: liveUrl, status: "✅ Ready" });
  } catch (err) {
    console.error(`   ❌ Failed to deploy ${p.name}: ${err.message}\n`);
    results.push({ name: p.name, title: p.title, url: "FAILED", status: "❌ Error" });
  }
}

// 3. Print final summary table
console.log("\n==================================================");
console.log("🎉 All Deployments Finished!");
console.log("==================================================\n");
console.table(results);
