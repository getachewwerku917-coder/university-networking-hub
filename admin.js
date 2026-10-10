/* ==========================================================================
   CampusLink - Admin Dashboard & Moderation View
   ========================================================================== */

import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { escapeHtml, showToast } from "../utils/helpers.js";

export function renderAdminPage() {
  const stats = dbService.getPlatformStats();
  const allUsers = authService.getAllUsers();
  const reports = dbService.getReports();

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/admin")}

      <main class="main-content">
        <div class="admin-header">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
            <div>
              <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">Platform Administration</h1>
              <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 2px;">
                Platform health metrics, user governance, content safety, and opportunity verification.
              </p>
            </div>
            <span class="badge badge-warning" style="padding: 6px 12px; font-size: 12px; font-weight: 700;">
              🛡️ Super Administrator Privileges
            </span>
          </div>
        </div>

        <!-- Metric Cards Grid -->
        <div class="admin-stats-grid">
          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Total Users</span>
              <div class="stat-card-icon">👥</div>
            </div>
            <div class="stat-card-value">${stats.totalUsers}</div>
            <div class="stat-card-sub">↑ +14% this month</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Active Now</span>
              <div class="stat-card-icon">⚡</div>
            </div>
            <div class="stat-card-value">${stats.activeUsers}</div>
            <div class="stat-card-sub">Real-time sessions</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Total Posts</span>
              <div class="stat-card-icon">💬</div>
            </div>
            <div class="stat-card-value">${stats.totalPosts}</div>
            <div class="stat-card-sub">Peer discussions</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Opportunities</span>
              <div class="stat-card-icon">💼</div>
            </div>
            <div class="stat-card-value">${stats.totalOpportunities}</div>
            <div class="stat-card-sub">100% verified</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Study Circles</span>
              <div class="stat-card-icon">🌐</div>
            </div>
            <div class="stat-card-value">${stats.totalCircles}</div>
            <div class="stat-card-sub">Campus clubs</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-top">
              <span class="stat-card-title">Pending Reports</span>
              <div class="stat-card-icon" style="background: var(--danger-bg); color: var(--danger);">🚨</div>
            </div>
            <div class="stat-card-value" style="color: ${stats.pendingReports > 0 ? 'var(--danger)' : 'var(--text-primary)'}">
              ${stats.pendingReports}
            </div>
            <div class="stat-card-sub" style="color: var(--text-muted);">Awaiting action</div>
          </div>
        </div>

        <!-- Charts Grid (SVG Based, High-Performance) -->
        <div class="charts-grid">
          <div class="chart-card">
            <div class="chart-title">Student Registration by University</div>
            <div style="padding: var(--space-2) 0;">
              <!-- Responsive SVG Bar Chart -->
              <svg width="100%" height="160" viewBox="0 0 450 160">
                <line x1="40" y1="130" x2="430" y2="130" stroke="var(--border-medium)" stroke-width="1"/>
                <!-- Bars -->
                <rect x="60" y="30" width="35" height="100" rx="4" fill="var(--brand-primary)"/>
                <text x="77" y="145" font-size="11" text-anchor="middle" fill="var(--text-muted)">AAU</text>
                <text x="77" y="24" font-size="11" font-weight="700" text-anchor="middle" fill="var(--text-primary)">42%</text>

                <rect x="135" y="55" width="35" height="75" rx="4" fill="#0ea5e9"/>
                <text x="152" y="145" font-size="11" text-anchor="middle" fill="var(--text-muted)">AASTU</text>
                <text x="152" y="49" font-size="11" font-weight="700" text-anchor="middle" fill="var(--text-primary)">24%</text>

                <rect x="210" y="70" width="35" height="60" rx="4" fill="#10b981"/>
                <text x="227" y="145" font-size="11" text-anchor="middle" fill="var(--text-muted)">Hawassa</text>
                <text x="227" y="64" font-size="11" font-weight="700" text-anchor="middle" fill="var(--text-primary)">16%</text>

                <rect x="285" y="85" width="35" height="45" rx="4" fill="#8b5cf6"/>
                <text x="302" y="145" font-size="11" text-anchor="middle" fill="var(--text-muted)">Jimma</text>
                <text x="302" y="79" font-size="11" font-weight="700" text-anchor="middle" fill="var(--text-primary)">11%</text>

                <rect x="360" y="100" width="35" height="30" rx="4" fill="#f59e0b"/>
                <text x="377" y="145" font-size="11" text-anchor="middle" fill="var(--text-muted)">Others</text>
                <text x="377" y="94" font-size="11" font-weight="700" text-anchor="middle" fill="var(--text-primary)">7%</text>
              </svg>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-title">Opportunity Category Breakdown</div>
            <div style="display: flex; align-items: center; justify-content: space-around; height: 160px;">
              <!-- Donut Chart SVG -->
              <svg width="130" height="130" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-light)" stroke-width="6"/>
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1d4ed8" stroke-width="6" stroke-dasharray="35 65" stroke-dashoffset="25"/>
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0ea5e9" stroke-width="6" stroke-dasharray="25 75" stroke-dashoffset="90"/>
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" stroke-width="6" stroke-dasharray="20 80" stroke-dashoffset="65"/>
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" stroke-width="6" stroke-dasharray="20 80" stroke-dashoffset="45"/>
              </svg>
              <!-- Legend -->
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:#1d4ed8;"></span> Internships (35%)</div>
                <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:#0ea5e9;"></span> Jobs & Trainee (25%)</div>
                <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:#10b981;"></span> Scholarships (20%)</div>
                <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:#f59e0b;"></span> Fellowships (20%)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Content Moderation & Reports Queue -->
        <div class="admin-table-container">
          <div class="admin-table-header">
            <h3 style="font-size: var(--font-size-md); font-weight: 700;">Safety & Moderation Queue</h3>
            <span class="badge ${reports.some(r => r.status === 'pending') ? 'badge-danger' : 'badge-success'}">
              ${reports.filter(r => r.status === 'pending').length} Actions Required
            </span>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Category</th>
                <th>Report Details</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${reports.map(rep => `
                <tr>
                  <td><span class="badge badge-neutral">${escapeHtml(rep.targetType)}</span></td>
                  <td><span class="badge badge-warning">${escapeHtml(rep.category)}</span></td>
                  <td style="max-width: 260px;">
                    <div style="font-weight: 600; font-size: 12px;">${escapeHtml(rep.targetPreview)}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(rep.reason)}</div>
                  </td>
                  <td>${escapeHtml(rep.reporterName)}</td>
                  <td>
                    <span class="badge ${rep.status === 'pending' ? 'badge-danger' : 'badge-success'}">
                      ${rep.status}
                    </span>
                  </td>
                  <td>
                    ${rep.status === 'pending' ? `
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-danger btn-sm btn-action-report" data-rep-id="${rep.id}" data-action="takedown" style="padding: 2px 8px; font-size: 11px;">
                          Take Down
                        </button>
                        <button class="btn btn-outline btn-sm btn-action-report" data-rep-id="${rep.id}" data-action="dismiss" style="padding: 2px 8px; font-size: 11px;">
                          Dismiss
                        </button>
                      </div>
                    ` : `
                      <span style="font-size: 11px; color: var(--text-muted);">Resolved</span>
                    `}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Section: User Directory & Access Management -->
        <div class="admin-table-container">
          <div class="admin-table-header">
            <h3 style="font-size: var(--font-size-md); font-weight: 700;">Student & User Management</h3>
            <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${allUsers.length} total registered accounts</div>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>University</th>
                <th>Department</th>
                <th>Year</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${allUsers.slice(0, 8).map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div class="avatar avatar-xs"><img src="${u.avatar}" alt="${escapeHtml(u.name)}" /></div>
                      <div>
                        <strong>${escapeHtml(u.name)}</strong>
                        <div style="font-size: 10px; color: var(--text-muted);">${escapeHtml(u.email)}</div>
                      </div>
                    </div>
                  </td>
                  <td>${escapeHtml(u.university)}</td>
                  <td>${escapeHtml(u.department)}</td>
                  <td>${escapeHtml(u.year || 'Year 3')}</td>
                  <td>
                    <span class="badge ${u.role === 'admin' ? 'badge-warning' : 'badge-neutral'}">
                      ${u.role}
                    </span>
                  </td>
                  <td>
                    <span class="badge ${u.online ? 'badge-success' : 'badge-neutral'}">
                      ${u.online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </main>
    </div>

    ${renderBottomNav("/admin")}
  `;
}

export function attachAdminEvents() {
  attachNavbarEvents();

  document.querySelectorAll(".btn-action-report").forEach(btn => {
    btn.addEventListener("click", () => {
      const repId = btn.getAttribute("data-rep-id");
      const action = btn.getAttribute("data-action");
      dbService.resolveReport(repId, action);
      showToast(action === "takedown" ? "Content taken down and removed." : "Report dismissed.", "info");
      window.location.reload();
    });
  });
}
