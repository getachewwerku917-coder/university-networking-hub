/* ==========================================================================
   CampusLink - Research Hub View
   ========================================================================== */

import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderResearchCard, attachResearchListeners } from "../components/research-card.js";
import { modal } from "../components/modal.js";
import { showToast } from "../utils/helpers.js";

export function renderResearchPage() {
  const projects = dbService.getResearchProjects();

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      <!-- Sidebar -->
      ${renderSidebar("/research")}

      <!-- Main Column -->
      <main class="main-content">
        <!-- Header -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-4); background: radial-gradient(circle at 100% 0%, rgba(126, 34, 206, 0.08) 0%, transparent 60%);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge" style="background:#f3e8ff; color:#7e22ce; font-weight:700;">🔬 Academic Collaboration</span>
              </div>
              <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">Campus Research Hub</h1>
              <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 4px; max-width: 600px;">
                Form cross-campus thesis teams, recruit students with specialized skills (NLP, IoT, Bioinformatics), and share pre-prints.
              </p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-publish-research-trigger">
              + Post Research Idea
            </button>
          </div>

          <!-- Research Search -->
          <div class="input-with-icon" style="margin-top: var(--space-4); max-width: 420px;">
            <svg class="input-icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="form-input" id="research-search-input" placeholder="Search research topics, fields, or skills..." />
          </div>
        </div>

        <!-- Research Grid -->
        <div class="research-grid" id="research-grid-container">
          ${projects.map(p => renderResearchCard(p)).join("")}
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/research")}
  `;
}

export function attachResearchPageListeners() {
  attachNavbarEvents();
  attachResearchListeners();

  // Search input
  const searchInput = document.getElementById("research-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      const results = dbService.getResearchProjects(q);
      const grid = document.getElementById("research-grid-container");
      if (grid) {
        grid.innerHTML = results.length > 0
          ? results.map(p => renderResearchCard(p)).join("")
          : `<div class="card empty-state"><div class="empty-state-title">No research projects match "${q}"</div></div>`;
        attachResearchListeners(grid);
      }
    });
  }

  // Publish research trigger
  const publishBtn = document.getElementById("btn-publish-research-trigger");
  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      openCreateResearchModal();
    });
  }
}

function openCreateResearchModal() {
  const html = `
    <div class="modal-header">
      <h3 class="modal-title">Publish Research Project & Recruit Team</h3>
      <button class="modal-close modal-close-trigger" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="form-label" for="res-title">Research Title *</label>
        <input class="form-input" type="text" id="res-title" placeholder="e.g. Low-Compute Transformer for Amharic Speech" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="form-group">
          <label class="form-label" for="res-field">Field / Domain *</label>
          <input class="form-input" type="text" id="res-field" placeholder="Natural Language Processing" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="res-team-size">Target Team Size *</label>
          <input class="form-input" type="number" id="res-team-size" min="2" max="6" value="3" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="res-desc">Abstract & Objectives *</label>
        <textarea class="form-textarea" id="res-desc" placeholder="Describe the research problem, methodology, and target milestones..." rows="4" required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="res-skills">Required Collaborator Skills (comma-separated)</label>
        <input class="form-input" type="text" id="res-skills" placeholder="Python, PyTorch, Data Scraper, Latex" />
      </div>

      <div class="form-group">
        <label class="form-label" for="res-contact">Contact Email</label>
        <input class="form-input" type="email" id="res-contact" placeholder="your.name@university.edu.et" />
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost modal-close-trigger">Cancel</button>
      <button class="btn btn-primary" id="btn-submit-create-research">Publish to Research Hub</button>
    </div>
  `;

  modal.open(html, {
    maxWidth: "540px",
    onAttach: (container) => {
      container.querySelector("#btn-submit-create-research").addEventListener("click", () => {
        const title = container.querySelector("#res-title").value.trim();
        const field = container.querySelector("#res-field").value.trim();
        const teamSizeRequired = parseInt(container.querySelector("#res-team-size").value, 10) || 2;
        const description = container.querySelector("#res-desc").value.trim();
        const skillsRaw = container.querySelector("#res-skills").value;
        const requiredSkills = skillsRaw.split(",").map(s => s.trim()).filter(Boolean);
        const contactEmail = container.querySelector("#res-contact").value.trim();

        if (!title || !field || !description) {
          showToast("Please complete required fields (Title, Field, Abstract).", "warning");
          return;
        }

        dbService.publishResearch({
          title,
          field,
          teamSizeRequired,
          description,
          requiredSkills,
          contactEmail
        });

        showToast("Research project published! Collaborators can now discover it.", "success");
        modal.close();
        window.location.reload();
      });
    }
  });
}
