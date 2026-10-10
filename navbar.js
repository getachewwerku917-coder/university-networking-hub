/* ==========================================================================
   CampusLink - Navbar Component
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { authService } from "../services/auth-service.js";
import { router } from "../utils/router.js";
import { escapeHtml } from "../utils/helpers.js";
import { modal } from "./modal.js";

export function renderNavbar() {
  const user = appState.get("currentUser");
  const unreadNotifs = appState.get("unreadNotificationsCount") || 0;
  const unreadMsgs = appState.get("unreadMessagesCount") || 0;
  const theme = appState.get("theme");

  const navHtml = `
    <nav class="navbar" id="app-navbar">
      <div class="navbar-container">
        <!-- Brand -->
        <a href="#/feed" class="navbar-brand">
          <div class="navbar-logo-icon">CL</div>
          <span>CampusLink</span>
        </a>

        <!-- Global Search Bar -->
        <div class="navbar-search">
          <svg class="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            id="global-search-input" 
            placeholder="Search students, opportunities, circles, research..." 
            aria-label="Global search"
          />
        </div>

        <!-- Actions -->
        <div class="navbar-actions">
          <!-- Theme Toggle -->
          <button class="nav-action-btn" id="btn-theme-toggle" title="Toggle theme (Light / Dark)">
            ${theme === "dark" 
              ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>` 
              : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
            }
          </button>

          <!-- Firebase Config / Status Button -->
          <button class="nav-action-btn" id="btn-open-firebase-cfg" title="Firebase Settings & Project Connection">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </button>

          <!-- Download Project ZIP -->
          <a href="download.html" class="nav-action-btn" title="Download Source Code (.ZIP)" target="_blank">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </a>

          ${user ? `
            <!-- Notifications -->
            <a href="#/notifications" class="nav-action-btn" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              ${unreadNotifs > 0 ? `<span class="nav-badge">${unreadNotifs}</span>` : ""}
            </a>

            <!-- Messages -->
            <a href="#/messaging" class="nav-action-btn" title="Messages">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              ${unreadMsgs > 0 ? `<span class="nav-badge">${unreadMsgs}</span>` : ""}
            </a>

            <!-- User Menu Dropdown -->
            <div class="dropdown" id="user-menu-dropdown">
              <button class="avatar avatar-sm" id="user-menu-trigger" aria-haspopup="true" style="cursor: pointer; border: 2px solid var(--border-medium);">
                <img src="${user.avatar}" alt="${escapeHtml(user.name)}" />
              </button>
              <div class="dropdown-menu" id="user-menu-items">
                <div style="padding: 0.6rem 0.8rem; border-bottom: 1px solid var(--border-light);">
                  <div style="font-weight: 700; font-size: var(--font-size-sm);">${escapeHtml(user.name)}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${escapeHtml(user.headline || user.university)}</div>
                </div>
                <a href="#/profile" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </a>
                <a href="#/network" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  My Network
                </a>
                ${user.role === "admin" ? `
                  <a href="#/admin" class="dropdown-item" style="color: var(--brand-primary); font-weight: 700;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Admin Dashboard
                  </a>
                ` : ""}
                <a href="download.html" class="dropdown-item" target="_blank" style="color: var(--brand-primary); font-weight: 600;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Project (.ZIP)
                </a>
                <button class="dropdown-item" id="btn-switch-account">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
                  Switch Demo Persona
                </button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" id="btn-logout" style="color: var(--danger);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Log Out
                </button>
              </div>
            </div>
          ` : `
            <a href="#/landing" class="btn btn-ghost btn-sm">About</a>
            <button class="btn btn-secondary btn-sm" id="btn-nav-login">Log In</button>
            <button class="btn btn-primary btn-sm" id="btn-nav-signup">Sign Up</button>
          `}
        </div>
      </div>
    </nav>
  `;

  return navHtml;
}

export function attachNavbarEvents() {
  // Theme Toggle
  const themeBtn = document.getElementById("btn-theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      appState.toggleTheme();
    });
  }

  // Firebase Config Button
  const fbBtn = document.getElementById("btn-open-firebase-cfg");
  if (fbBtn) {
    fbBtn.addEventListener("click", () => {
      modal.openFirebaseConfigModal();
    });
  }

  // User Dropdown Trigger
  const userTrigger = document.getElementById("user-menu-trigger");
  const dropdown = document.getElementById("user-menu-dropdown");
  if (userTrigger && dropdown) {
    userTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });
  }

  // Switch Account Modal Trigger
  const switchBtn = document.getElementById("btn-switch-account");
  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      dropdown?.classList.remove("open");
      modal.openSwitchUserModal();
    });
  }

  // Logout Trigger
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await authService.logout();
      router.navigate("/landing");
    });
  }

  // Global Search Input
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        router.navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
      }
    });
  }

  // Nav Login/Signup
  const navLogin = document.getElementById("btn-nav-login");
  const navSignup = document.getElementById("btn-nav-signup");
  if (navLogin) {
    navLogin.addEventListener("click", () => modal.openAuthModal("login"));
  }
  if (navSignup) {
    navSignup.addEventListener("click", () => modal.openAuthModal("signup"));
  }
}
