/* ==========================================================================
   CampusLink - Network & Connections View
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { getSmartRecommendations, escapeHtml, showToast } from "../utils/helpers.js";

export function renderNetworkPage() {
  const currentUser = appState.get("currentUser");
  const myConnections = currentUser ? dbService.getConnections(currentUser.id) : [];
  const recs = getSmartRecommendations(currentUser);

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/network")}

      <main class="main-content">
        <!-- Header -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
          <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">My Professional Network</h1>
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 4px;">
            Grow your university circle across departments, alumni, and cross-campus project partners.
          </p>

          <div style="display: flex; gap: var(--space-6); margin-top: var(--space-4); border-top: 1px solid var(--border-light); padding-top: var(--space-4);">
            <div>
              <div style="font-size: var(--font-size-xl); font-weight: 800; color: var(--brand-primary);">${myConnections.length}</div>
              <div style="font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">Active Connections</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xl); font-weight: 800; color: var(--success);">${recs.students.length}</div>
              <div style="font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">New Recommendations</div>
            </div>
          </div>
        </div>

        <!-- Section: People You May Know (Smart Recommendations) -->
        <div class="card" style="margin-bottom: var(--space-6); padding: var(--space-5);">
          <h2 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-4); display: flex; align-items: center; gap: 8px;">
            <span>✨ People You May Know</span>
            <span class="badge badge-primary" style="font-size: 11px;">Algorithm Matched</span>
          </h2>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4);">
            ${recs.students.map(item => `
              <div class="card card-hover" style="text-align: center; padding: var(--space-5); display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
                <div>
                  <a href="#/profile/${item.student.id}" class="avatar avatar-lg" style="margin-bottom: var(--space-3);">
                    <img src="${item.student.avatar}" alt="${escapeHtml(item.student.name)}" />
                  </a>
                  <a href="#/profile/${item.student.id}" style="color: inherit; text-decoration: none;">
                    <h4 style="font-size: var(--font-size-sm); font-weight: 700;">${escapeHtml(item.student.name)}</h4>
                  </a>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                    ${escapeHtml(item.student.department)}
                  </div>
                  <div style="font-size: 11px; color: var(--brand-primary); font-weight: 600; margin-top: 4px;">
                    ${escapeHtml(item.student.university)}
                  </div>
                  <div class="tag-chip" style="font-size: 10px; margin-top: var(--space-2); max-width: 100%; white-space: normal;">
                    ${escapeHtml(item.reason)}
                  </div>
                </div>

                <button class="btn btn-primary btn-sm btn-connect-user w-full" data-uid="${item.student.id}" style="margin-top: var(--space-4);">
                  + Connect
                </button>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Section: Your Existing Connections -->
        <div class="card" style="padding: var(--space-5);">
          <h2 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-4);">
            Your Connections (${myConnections.length})
          </h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${myConnections.length > 0 ? myConnections.map(conn => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--border-light);">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                  <a href="#/profile/${conn.id}" class="avatar avatar-md">
                    <img src="${conn.avatar}" alt="${escapeHtml(conn.name)}" />
                  </a>
                  <div>
                    <a href="#/profile/${conn.id}" style="font-size: var(--font-size-sm); font-weight: 700; color: var(--text-primary);">
                      ${escapeHtml(conn.name)}
                    </a>
                    <div style="font-size: var(--font-size-xs); color: var(--text-muted);">
                      ${escapeHtml(conn.headline || conn.university)}
                    </div>
                  </div>
                </div>

                <div style="display: flex; gap: var(--space-2);">
                  <a href="#/messaging" class="btn btn-outline btn-sm">Message</a>
                  <button class="btn btn-ghost btn-sm btn-remove-conn" data-uid="${conn.id}" title="Remove connection" style="color: var(--danger);">
                    Remove
                  </button>
                </div>
              </div>
            `).join("") : `
              <div class="empty-state" style="padding: var(--space-6);">
                <div class="empty-state-icon">🤝</div>
                <div class="empty-state-title">No connections yet</div>
                <div class="empty-state-desc">Explore student recommendations above to start expanding your network!</div>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>

    ${renderBottomNav("/network")}
  `;
}

export function attachNetworkEvents() {
  attachNavbarEvents();

  // Connect button
  document.querySelectorAll(".btn-connect-user").forEach(btn => {
    btn.addEventListener("click", () => {
      const uid = btn.getAttribute("data-uid");
      dbService.sendConnectionRequest(uid);
      btn.textContent = "Connected ✓";
      btn.className = "btn btn-outline btn-sm w-full";
      showToast("Connection established!", "success");
    });
  });

  // Remove connection button
  document.querySelectorAll(".btn-remove-conn").forEach(btn => {
    btn.addEventListener("click", () => {
      const uid = btn.getAttribute("data-uid");
      if (confirm("Remove this student from your connections?")) {
        dbService.removeConnection(uid);
        showToast("Connection removed.", "info");
        window.location.reload();
      }
    });
  });
}
