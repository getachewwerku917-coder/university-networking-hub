/* ==========================================================================
   CampusLink - Sidebar Navigation Component
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderSidebar(activeRoute = "/feed") {
  const user = appState.get("currentUser");
  if (!user) return "";

  const connectionsCount = user.connections?.length || 0;
  const isAdmin = user.role === "admin";

  const navItems = [
    {
      route: "/feed",
      label: "Feed & Discussions",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      route: "/opportunities",
      label: "Opportunities",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
      badge: "10"
    },
    {
      route: "/circles",
      label: "Circles & Groups",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
    },
    {
      route: "/events",
      label: "Campus Events",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
    },
    {
      route: "/research",
      label: "Research Hub",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.89 20.5A2 2 0 0 0 6.64 23h10.72a2 2 0 0 0 1.75-2.5L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line></svg>`,
      badge: "Hub"
    },
    {
      route: "/network",
      label: "My Network",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      badge: `${connectionsCount}`
    },
    {
      route: "/messaging",
      label: "Messages",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
    }
  ];

  if (isAdmin) {
    navItems.push({
      route: "/admin",
      label: "Admin Dashboard",
      icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
      badge: "Admin"
    });
  }

  return `
    <aside class="sidebar">
      <!-- Mini Profile Card -->
      <div class="sidebar-card">
        <div class="sidebar-profile-mini">
          <div class="sidebar-cover"></div>
          <div class="sidebar-avatar-wrapper">
            <a href="#/profile" class="avatar avatar-md" title="View profile">
              <img src="${user.avatar}" alt="${escapeHtml(user.name)}" />
            </a>
          </div>
          <a href="#/profile" style="text-decoration: none; color: inherit;">
            <div class="sidebar-user-name">${escapeHtml(user.name)}</div>
          </a>
          <div class="sidebar-user-headline">${escapeHtml(user.headline || user.department)}</div>
          <div style="font-size: 11px; color: var(--brand-primary); font-weight: 700; margin-top: 4px;">
            ${escapeHtml(user.university)}
          </div>
        </div>

        <div style="padding: var(--space-3) var(--space-4); border-top: 1px solid var(--border-light); font-size: var(--font-size-xs); display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Connections</span>
          <a href="#/network" style="font-weight: 700;">${connectionsCount}</a>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="sidebar-card">
        <nav class="sidebar-nav-list">
          ${navItems.map(item => `
            <a href="#${item.route}" class="sidebar-nav-item ${activeRoute === item.route ? 'active' : ''}">
              ${item.icon}
              <span>${item.label}</span>
              ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ""}
            </a>
          `).join("")}
        </nav>
      </div>

      <!-- Quick University Switch / Demo Banner -->
      <div class="sidebar-card" style="padding: var(--space-4); background: linear-gradient(135deg, rgba(29,78,216,0.06), rgba(14,165,233,0.08)); border-color: rgba(29,78,216,0.2);">
        <div style="font-size: var(--font-size-xs); font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>🇪🇹 Pan-African Campus</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 8px;">
          Explore opportunities, circles, and peer research across 8 leading universities.
        </p>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button class="btn btn-outline btn-sm w-full" id="sidebar-switch-persona-btn" style="font-size: 11px; padding: 4px 8px;">
            Switch Student Persona
          </button>
          <a href="download.html" target="_blank" class="btn btn-secondary btn-sm w-full" style="font-size: 11px; padding: 4px 8px; text-decoration: none;">
            📦 Download Project (.ZIP)
          </a>
        </div>
      </div>
    </aside>
  `;
}
