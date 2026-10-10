/* ==========================================================================
   CampusLink - Mobile Bottom Navigation Component
   ========================================================================== */

import { appState } from "../state/app-state.js";

export function renderBottomNav(activeRoute = "/feed") {
  const user = appState.get("currentUser");
  if (!user) return "";

  const unreadNotifs = appState.get("unreadNotificationsCount") || 0;

  return `
    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <a href="#/feed" class="bottom-nav-item ${activeRoute === '/feed' ? 'active' : ''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Feed</span>
        </a>

        <a href="#/opportunities" class="bottom-nav-item ${activeRoute === '/opportunities' ? 'active' : ''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span>Opps</span>
        </a>

        <a href="#/circles" class="bottom-nav-item ${activeRoute === '/circles' ? 'active' : ''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span>Circles</span>
        </a>

        <a href="#/network" class="bottom-nav-item ${activeRoute === '/network' ? 'active' : ''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>Network</span>
        </a>

        <a href="#/profile" class="bottom-nav-item ${activeRoute === '/profile' ? 'active' : ''}">
          <div class="avatar avatar-xs" style="margin: 0 auto;">
            <img src="${user.avatar}" alt="${user.name}" />
          </div>
          <span>Profile</span>
          ${unreadNotifs > 0 ? `<span class="nav-badge">${unreadNotifs}</span>` : ""}
        </a>
      </div>
    </nav>
  `;
}
