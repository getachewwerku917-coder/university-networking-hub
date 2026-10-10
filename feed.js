/* ==========================================================================
   CampusLink - Home Feed View
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderPostCard, attachPostCardListeners } from "../components/post-card.js";
import { modal } from "../components/modal.js";
import { escapeHtml, getSmartRecommendations, calculateDeadlineStatus, showToast } from "../utils/helpers.js";

export function renderFeedPage() {
  const user = appState.get("currentUser");
  const activeFilter = appState.get("feedFilter") || "all";
  const posts = dbService.getPosts(activeFilter);
  const recs = getSmartRecommendations(user);

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "My University", label: user ? user.university : "My University" },
    { id: "My Faculty", label: user?.faculty ? user.faculty : "My Faculty" },
    { id: "My Department", label: user?.department ? user.department : "My Department" },
    { id: "Research", label: "Research" },
    { id: "Opportunities", label: "Opportunities" },
    { id: "Events", label: "Events" }
  ];

  return `
    ${renderNavbar()}

    <div class="app-container">
      <!-- Left Rail Sidebar -->
      ${renderSidebar("/feed")}

      <!-- Center Feed -->
      <main class="main-content">
        <!-- Post Composer Box -->
        <div class="composer-card">
          <div class="composer-top">
            <div class="avatar avatar-sm">
              <img src="${user ? user.avatar : 'https://api.dicebear.com/7.x/initials/svg?seed=Student'}" alt="${escapeHtml(user?.name || 'User')}" />
            </div>
            <button class="composer-input-trigger" id="btn-open-composer">
              Share an achievement, ask a question, or post research...
            </button>
          </div>

          <div class="composer-actions">
            <div class="composer-types">
              <button class="composer-btn" data-type="Achievement">
                <span>🏆 Achievement</span>
              </button>
              <button class="composer-btn" data-type="Research">
                <span>🔬 Research</span>
              </button>
              <button class="composer-btn" data-type="Opportunity">
                <span>📢 Opportunity</span>
              </button>
              <button class="composer-btn" data-type="Question">
                <span>❓ Question</span>
              </button>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-post-now">Post</button>
          </div>
        </div>

        <!-- Filter Chips Bar -->
        <div class="filter-chips-bar" id="feed-filters-bar">
          ${filters.map(f => `
            <button class="filter-chip ${activeFilter === f.id ? 'active' : ''}" data-filter="${f.id}">
              ${escapeHtml(f.label)}
            </button>
          `).join("")}
        </div>

        <!-- Feed Stream -->
        <div id="posts-stream" style="display: flex; flex-direction: column; gap: var(--space-4);">
          ${posts.length > 0 ? (
            posts.map(p => renderPostCard(p)).join("")
          ) : `
            <div class="card empty-state">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">No posts in this filter yet</div>
              <div class="empty-state-desc">Be the first to share an academic achievement or discussion with your peers!</div>
              <button class="btn btn-primary btn-sm" id="btn-empty-create-post" style="margin-top: var(--space-3);">Create a Post</button>
            </div>
          `}
        </div>
      </main>

      <!-- Right Rail Widgets -->
      <aside class="right-rail">
        <!-- Smart Feature: People You May Know -->
        <div class="card">
          <div class="card-header">
            <span style="font-size: var(--font-size-sm); font-weight: 700;">People You May Know</span>
            <a href="#/network" style="font-size: var(--font-size-xs);">See all</a>
          </div>
          <div class="card-body" style="padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
            ${recs.students.length > 0 ? recs.students.map(rec => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);">
                <div style="display: flex; align-items: center; gap: var(--space-2); min-width: 0;">
                  <a href="#/profile/${rec.student.id}" class="avatar avatar-sm">
                    <img src="${rec.student.avatar}" alt="${escapeHtml(rec.student.name)}" />
                  </a>
                  <div style="min-width: 0;">
                    <a href="#/profile/${rec.student.id}" class="text-truncate" style="display: block; font-size: var(--font-size-xs); font-weight: 700; color: var(--text-primary);">
                      ${escapeHtml(rec.student.name)}
                    </a>
                    <div class="text-truncate" style="font-size: 11px; color: var(--text-muted);">
                      ${escapeHtml(rec.reason)}
                    </div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm btn-quick-connect" data-user-id="${rec.student.id}" style="padding: 2px 8px; font-size: 11px;">
                  Connect
                </button>
              </div>
            `).join("") : `
              <div style="font-size: var(--font-size-xs); color: var(--text-muted); text-align: center;">No new recommendations</div>
            `}
          </div>
        </div>

        <!-- Trending Opportunities -->
        <div class="card">
          <div class="card-header">
            <span style="font-size: var(--font-size-sm); font-weight: 700;">Trending Opportunities</span>
            <a href="#/opportunities" style="font-size: var(--font-size-xs);">View all</a>
          </div>
          <div class="card-body" style="padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
            ${recs.opportunities.map(opp => {
              const status = calculateDeadlineStatus(opp.deadline);
              return `
                <div style="padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-light);">
                  <a href="#/opportunities" style="font-size: var(--font-size-xs); font-weight: 700; color: var(--text-primary); display: block; line-height: 1.3;">
                    ${escapeHtml(opp.title)}
                  </a>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                    ${escapeHtml(opp.organization)}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                    <span class="badge badge-primary" style="font-size: 10px; padding: 1px 6px;">${opp.opportunityType}</span>
                    <span class="deadline-indicator ${status.statusClass}" style="font-size: 10px;">${status.text}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Upcoming Campus Events -->
        <div class="card">
          <div class="card-header">
            <span style="font-size: var(--font-size-sm); font-weight: 700;">Upcoming Events</span>
            <a href="#/events" style="font-size: var(--font-size-xs);">Calendar</a>
          </div>
          <div class="card-body" style="padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
            ${recs.events.map(e => `
              <div style="display: flex; align-items: flex-start; gap: var(--space-2);">
                <div style="background: var(--bg-surface-hover); border-radius: var(--radius-sm); padding: 4px 6px; text-align: center; flex-shrink: 0; min-width: 38px;">
                  <div style="font-size: 9px; font-weight: 800; color: var(--danger);">${e.date.split("-")[1] || "NOV"}</div>
                  <div style="font-size: 12px; font-weight: 800;">${e.date.split("-")[2] || "15"}</div>
                </div>
                <div style="min-width: 0;">
                  <a href="#/events" class="text-truncate" style="display: block; font-size: var(--font-size-xs); font-weight: 700; color: var(--text-primary);">
                    ${escapeHtml(e.name)}
                  </a>
                  <div style="font-size: 10px; color: var(--text-muted);">${escapeHtml(e.organizer)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </aside>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/feed")}
  `;
}

export function attachFeedEvents() {
  attachNavbarEvents();
  attachPostCardListeners();

  // Switch persona trigger in sidebar
  const sideSwitchBtn = document.getElementById("sidebar-switch-persona-btn");
  if (sideSwitchBtn) {
    sideSwitchBtn.addEventListener("click", () => modal.openSwitchUserModal());
  }

  // Open Composer
  const composerTrigger = document.getElementById("btn-open-composer");
  const postNowBtn = document.getElementById("btn-post-now");
  const emptyPostBtn = document.getElementById("btn-empty-create-post");
  [composerTrigger, postNowBtn, emptyPostBtn].filter(Boolean).forEach(btn => {
    btn.addEventListener("click", () => modal.openPostComposerModal());
  });

  // Post category buttons in composer bar
  document.querySelectorAll(".composer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modal.openPostComposerModal();
    });
  });

  // Feed Filter Chips
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter");
      appState.set("feedFilter", filter);
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.innerHTML = renderFeedPage();
        attachFeedEvents();
      }
    });
  });

  // Quick Connect button in right rail
  document.querySelectorAll(".btn-quick-connect").forEach(btn => {
    btn.addEventListener("click", () => {
      const uid = btn.getAttribute("data-user-id");
      dbService.sendConnectionRequest(uid);
      btn.textContent = "Connected ✓";
      btn.classList.add("disabled");
      showToast("Connection request sent!", "success");
    });
  });
}
