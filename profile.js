/* ==========================================================================
   CampusLink - Student Profile View (LinkedIn-style)
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { modal } from "../components/modal.js";
import { router } from "../utils/router.js";
import { escapeHtml, showToast } from "../utils/helpers.js";

export function renderProfilePage(profileUserId = null) {
  const currentUser = appState.get("currentUser");
  const targetId = profileUserId || currentUser?.id;
  const user = authService.getUserById(targetId) || currentUser;

  if (!user) {
    return `
      ${renderNavbar()}
      <div class="app-container full-width">
        <div class="card empty-state">
          <div class="empty-state-title">User not found</div>
          <a href="#/feed" class="btn btn-primary btn-sm">Return to Feed</a>
        </div>
      </div>
    `;
  }

  const isOwnProfile = currentUser && user.id === currentUser.id;
  const isConnected = currentUser && Array.isArray(currentUser.connections) && currentUser.connections.includes(user.id);
  const connectionsCount = user.connections?.length || 0;

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      <!-- Sidebar -->
      ${renderSidebar("/profile")}

      <!-- Main Profile Column -->
      <main class="main-content">
        <div class="profile-container">
          <!-- Profile Header Card -->
          <div class="profile-card">
            <div class="profile-cover" style="background-image: url('${user.cover || ''}'); background-size: cover; background-position: center;"></div>
            
            <div class="profile-header-body">
              <div class="profile-avatar-row">
                <div class="profile-avatar-main">
                  <img src="${user.avatar}" alt="${escapeHtml(user.name)}" />
                  ${user.online ? '<div class="avatar-status online" style="width: 18px; height: 18px; bottom: 4px; right: 4px;"></div>' : ''}
                </div>

                <div class="profile-header-actions">
                  ${isOwnProfile ? `
                    <button class="btn btn-outline btn-sm" id="btn-edit-profile-trigger">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit Profile
                    </button>
                    <button class="btn btn-primary btn-sm" id="btn-share-profile">
                      Share Profile
                    </button>
                  ` : `
                    <button class="btn ${isConnected ? 'btn-outline' : 'btn-primary'} btn-sm" id="btn-profile-connect" data-uid="${user.id}">
                      ${isConnected ? 'Connected ✓' : '+ Connect'}
                    </button>
                    <button class="btn btn-secondary btn-sm" id="btn-profile-message" data-uid="${user.id}">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Message
                    </button>
                  `}
                </div>
              </div>

              <h1 class="profile-name">
                <span>${escapeHtml(user.name)}</span>
                ${user.role === 'admin' ? '<span class="badge badge-warning">Admin</span>' : ''}
              </h1>

              <div class="profile-headline">
                ${escapeHtml(user.headline || `${user.department} Student @ ${user.university}`)}
              </div>

              <div class="profile-university-meta">
                <div class="profile-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  <span><strong>${escapeHtml(user.university)}</strong> • ${escapeHtml(user.faculty || '')}</span>
                </div>
                <div class="profile-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${escapeHtml(user.location || "Ethiopia")}</span>
                </div>
                <div class="profile-meta-item">
                  <span class="badge badge-neutral">${escapeHtml(user.year || "Year 3")}</span>
                </div>
              </div>

              <a href="#/network" class="profile-connections-count">
                ${connectionsCount} connections
              </a>
            </div>
          </div>

          <!-- Section: About / Bio -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">About</h3>
              ${isOwnProfile ? '<button class="btn btn-ghost btn-sm btn-quick-edit-about">Edit</button>' : ''}
            </div>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.7; white-space: pre-line;">
              ${escapeHtml(user.bio || "Student at " + user.university + ". Passionate about academic growth, research collaboration, and technological innovation.")}
            </p>
          </div>

          <!-- Section: Skills -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Skills & Endorsements</h3>
              ${isOwnProfile ? '<button class="btn btn-ghost btn-sm" id="btn-add-skill">+ Add Skill</button>' : ''}
            </div>
            <div class="skills-cloud">
              ${(user.skills || []).map(skill => `
                <div class="skill-badge-lg">
                  <span>${escapeHtml(skill)}</span>
                  <span style="font-size: 10px; color: var(--brand-primary); font-weight: 700;">★ Endorsed</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Section: Research Interests -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Research Interests</h3>
            </div>
            <div class="skills-cloud">
              ${(user.researchInterests || []).map(item => `
                <span class="tag-chip" style="font-size: var(--font-size-xs); background: #f3e8ff; color: #7e22ce; font-weight: 600;">
                  🔬 ${escapeHtml(item)}
                </span>
              `).join("")}
            </div>
          </div>

          <!-- Section: Experience -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Experience & Internships</h3>
              ${isOwnProfile ? '<button class="btn btn-ghost btn-sm" id="btn-add-experience">+ Add Experience</button>' : ''}
            </div>
            <div class="profile-item-list">
              ${(user.experience && user.experience.length > 0) ? user.experience.map(exp => `
                <div class="profile-item">
                  <div class="profile-item-icon">💼</div>
                  <div class="profile-item-details">
                    <div class="profile-item-title">${escapeHtml(exp.title)}</div>
                    <div class="profile-item-subtitle">${escapeHtml(exp.organization)} • ${escapeHtml(exp.location || '')}</div>
                    <div class="profile-item-date">${escapeHtml(exp.period || '')}</div>
                    <div class="profile-item-desc">${escapeHtml(exp.description || '')}</div>
                  </div>
                </div>
              `).join("") : `
                <div style="font-size: var(--font-size-xs); color: var(--text-muted);">No experience entries listed yet.</div>
              `}
            </div>
          </div>

          <!-- Section: Education -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Education</h3>
            </div>
            <div class="profile-item-list">
              ${(user.education && user.education.length > 0) ? user.education.map(edu => `
                <div class="profile-item">
                  <div class="profile-item-icon">🎓</div>
                  <div class="profile-item-details">
                    <div class="profile-item-title">${escapeHtml(edu.institution)}</div>
                    <div class="profile-item-subtitle">${escapeHtml(edu.degree)}</div>
                    <div class="profile-item-date">${escapeHtml(edu.years || '')}</div>
                    <div class="profile-item-desc">${escapeHtml(edu.description || '')}</div>
                  </div>
                </div>
              `).join("") : `
                <div class="profile-item">
                  <div class="profile-item-icon">🎓</div>
                  <div class="profile-item-details">
                    <div class="profile-item-title">${escapeHtml(user.university)}</div>
                    <div class="profile-item-subtitle">Undergraduate in ${escapeHtml(user.department)}</div>
                    <div class="profile-item-date">Enrolled</div>
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Section: Projects -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Projects</h3>
              ${isOwnProfile ? '<button class="btn btn-ghost btn-sm" id="btn-add-project">+ Add Project</button>' : ''}
            </div>
            <div class="projects-grid">
              ${(user.projects && user.projects.length > 0) ? user.projects.map(proj => `
                <div class="project-card-mini">
                  <div>
                    <h4>${escapeHtml(proj.title)}</h4>
                    <p>${escapeHtml(proj.description)}</p>
                  </div>
                  ${proj.link ? `
                    <a href="${proj.link}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="align-self: flex-start; padding: 3px 8px; font-size: 11px;">
                      View Project ↗
                    </a>
                  ` : ""}
                </div>
              `).join("") : `
                <div style="font-size: var(--font-size-xs); color: var(--text-muted);">No student projects uploaded yet.</div>
              `}
            </div>
          </div>

          <!-- Section: Certifications & Achievements -->
          <div class="profile-section-card">
            <div class="profile-section-header">
              <h3 class="profile-section-title">Certifications & Honors</h3>
            </div>
            <div class="profile-item-list">
              ${(user.certifications && user.certifications.length > 0) ? user.certifications.map(cert => `
                <div class="profile-item">
                  <div class="profile-item-icon">📜</div>
                  <div class="profile-item-details">
                    <div class="profile-item-title">${escapeHtml(cert.title)}</div>
                    <div class="profile-item-subtitle">${escapeHtml(cert.issuer)} • Issued ${escapeHtml(cert.date)}</div>
                  </div>
                </div>
              `).join("") : ""}
              ${(user.achievements && user.achievements.length > 0) ? user.achievements.map(ach => `
                <div class="profile-item">
                  <div class="profile-item-icon">🥇</div>
                  <div class="profile-item-details">
                    <div class="profile-item-title">${escapeHtml(ach)}</div>
                  </div>
                </div>
              `).join("") : ""}
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/profile")}
  `;
}

export function attachProfileEvents(profileUserId = null) {
  attachNavbarEvents();

  // Edit Profile Trigger
  const editBtn = document.getElementById("btn-edit-profile-trigger");
  const quickAboutBtn = document.querySelector(".btn-quick-edit-about");
  [editBtn, quickAboutBtn].filter(Boolean).forEach(b => {
    b.addEventListener("click", () => modal.openEditProfileModal());
  });

  // Share profile
  const shareBtn = document.getElementById("btn-share-profile");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      showToast("Profile link copied to clipboard!", "success");
    });
  }

  // Connect button for viewing other profile
  const connectBtn = document.getElementById("btn-profile-connect");
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      const uid = connectBtn.getAttribute("data-uid");
      dbService.sendConnectionRequest(uid);
      connectBtn.textContent = "Connected ✓";
      connectBtn.className = "btn btn-outline btn-sm";
      showToast("Connected!", "success");
    });
  }

  // Message button
  const messageBtn = document.getElementById("btn-profile-message");
  if (messageBtn) {
    messageBtn.addEventListener("click", () => {
      const uid = messageBtn.getAttribute("data-uid");
      const conv = dbService.startConversationWith(uid);
      if (conv) {
        router.navigate(`/messaging/${conv.id}`);
      }
    });
  }

  // Add Skill quick prompt
  const addSkillBtn = document.getElementById("btn-add-skill");
  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      const skillName = prompt("Enter a new skill (e.g. Flutter, Kubernetes, PyTorch):");
      if (skillName && skillName.trim()) {
        const user = appState.get("currentUser");
        const skills = [...(user.skills || []), skillName.trim()];
        authService.updateProfile({ skills });
        showToast(`Added ${skillName} to your profile!`, "success");
        window.location.reload();
      }
    });
  }

  // Add Project quick prompt
  const addProjBtn = document.getElementById("btn-add-project");
  if (addProjBtn) {
    addProjBtn.addEventListener("click", () => {
      const title = prompt("Project Title:");
      if (!title) return;
      const desc = prompt("Short Description:") || "";
      const user = appState.get("currentUser");
      const projects = [...(user.projects || []), { title, description: desc }];
      authService.updateProfile({ projects });
      showToast("Project added!", "success");
      window.location.reload();
    });
  }

  // Add Experience quick prompt
  const addExpBtn = document.getElementById("btn-add-experience");
  if (addExpBtn) {
    addExpBtn.addEventListener("click", () => {
      const title = prompt("Role Title (e.g. Junior Frontend Intern):");
      if (!title) return;
      const org = prompt("Company / Organization:") || "";
      const period = prompt("Period (e.g. Jun 2025 - Aug 2025):") || "";
      const user = appState.get("currentUser");
      const experience = [...(user.experience || []), { title, organization: org, period }];
      authService.updateProfile({ experience });
      showToast("Experience added!", "success");
      window.location.reload();
    });
  }
}
