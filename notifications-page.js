/* ==========================================================================
   CampusLink - Notifications Center View
   ========================================================================== */

import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { showToast } from "../utils/helpers.js";

export function renderNotificationsPage() {
  const notifs = dbService.getNotifications();

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/notifications")}

      <main class="main-content">
        <div class="notifications-container">
          <div class="notifications-header">
            <div>
              <h1 style="font-size: var(--font-size-xl); font-weight: 800;">Notifications</h1>
              <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: 2px;">
                Stay updated on peer interactions, research inquiries, and impending opportunity deadlines.
              </p>
            </div>

            <button class="btn btn-outline btn-sm" id="btn-mark-all-read">
              Mark all as read
            </button>
          </div>

          <div class="notifications-list" id="notifs-list-container">
            ${notifs.length > 0 ? notifs.map(n => `
              <div class="notification-item ${n.unread ? 'unread' : ''}">
                <div class="notification-icon-badge" style="background: var(--bg-surface-hover);">
                  ${n.icon || '🔔'}
                </div>
                <div class="notification-content">
                  <div class="notification-text">${n.text}</div>
                  <div class="notification-time">${n.time || 'Recently'}</div>
                </div>
              </div>
            `).join("") : `
              <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <div class="empty-state-title">No notifications yet</div>
                <div class="empty-state-desc">You are all caught up on your campus alerts.</div>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>

    ${renderBottomNav("/notifications")}
  `;
}

export function attachNotificationsEvents() {
  attachNavbarEvents();

  const markAllBtn = document.getElementById("btn-mark-all-read");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      dbService.markAllNotificationsRead();
      showToast("All notifications marked as read.", "success");
      const unreadItems = document.querySelectorAll(".notification-item.unread");
      unreadItems.forEach(el => el.classList.remove("unread"));
    });
  }
}
