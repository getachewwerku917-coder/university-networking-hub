/* ==========================================================================
   CampusLink - Global Search Results View
   Categorized search across Students, Universities, Opportunities, Circles, Events, Research
   ========================================================================== */

import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderOpportunityCard, attachOpportunityListeners } from "../components/opportunity-card.js";
import { renderCircleCard, attachCircleListeners } from "../components/circle-card.js";
import { renderEventCard, attachEventListeners } from "../components/event-card.js";
import { renderResearchCard, attachResearchListeners } from "../components/research-card.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderSearchPage(query = "") {
  const q = (query || "").toLowerCase().trim();

  // 1. Students search
  const students = authService.getAllUsers().filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.university.toLowerCase().includes(q) ||
    u.department.toLowerCase().includes(q) ||
    (u.skills || []).some(s => s.toLowerCase().includes(q))
  );

  // 2. Opportunities search
  const opportunities = dbService.getOpportunities({ search: q });

  // 3. Circles search
  const circles = dbService.getCircles(q);

  // 4. Events search
  const events = dbService.getEvents().filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.organizer.toLowerCase().includes(q) ||
    e.location.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );

  // 5. Research search
  const research = dbService.getResearchProjects(q);

  const totalResults = students.length + opportunities.length + circles.length + events.length + research.length;

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/search")}

      <main class="main-content">
        <!-- Search Header -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-5);">
          <h1 style="font-size: var(--font-size-xl); font-weight: 800;">
            Search Results for "${escapeHtml(query)}"
          </h1>
          <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: 4px;">
            Found ${totalResults} categorized matches across universities, opportunities, and circles.
          </p>

          <!-- Category Filter Tabs -->
          <div class="tabs-nav" style="margin-top: var(--space-4);">
            <button class="tab-btn active search-tab" data-tab="all">All (${totalResults})</button>
            <button class="tab-btn search-tab" data-tab="students">Students (${students.length})</button>
            <button class="tab-btn search-tab" data-tab="opps">Opportunities (${opportunities.length})</button>
            <button class="tab-btn search-tab" data-tab="circles">Circles (${circles.length})</button>
            <button class="tab-btn search-tab" data-tab="events">Events (${events.length})</button>
            <button class="tab-btn search-tab" data-tab="research">Research (${research.length})</button>
          </div>
        </div>

        <!-- Section: Students -->
        <div class="search-section-block" id="block-students" style="margin-bottom: var(--space-6);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Students (${students.length})</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4);">
            ${students.length > 0 ? students.map(s => `
              <div class="card" style="padding: var(--space-4); display: flex; align-items: center; gap: var(--space-3);">
                <a href="#/profile/${s.id}" class="avatar avatar-md">
                  <img src="${s.avatar}" alt="${escapeHtml(s.name)}" />
                </a>
                <div style="min-width: 0;">
                  <a href="#/profile/${s.id}" class="text-truncate" style="font-size: var(--font-size-sm); font-weight: 700; color: var(--text-primary); display: block;">
                    ${escapeHtml(s.name)}
                  </a>
                  <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(s.department)}</div>
                  <div style="font-size: 11px; color: var(--brand-primary); font-weight: 600;">${escapeHtml(s.university)}</div>
                </div>
              </div>
            `).join("") : '<div style="font-size: var(--font-size-xs); color: var(--text-muted);">No student matches found.</div>'}
          </div>
        </div>

        <!-- Section: Opportunities -->
        <div class="search-section-block" id="block-opps" style="margin-bottom: var(--space-6);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Opportunities (${opportunities.length})</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${opportunities.length > 0 ? opportunities.map(o => renderOpportunityCard(o)).join("") : '<div style="font-size: var(--font-size-xs); color: var(--text-muted);">No opportunity matches found.</div>'}
          </div>
        </div>

        <!-- Section: Circles -->
        <div class="search-section-block" id="block-circles" style="margin-bottom: var(--space-6);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Study Circles (${circles.length})</h3>
          <div class="circles-grid">
            ${circles.length > 0 ? circles.map(c => renderCircleCard(c)).join("") : '<div style="font-size: var(--font-size-xs); color: var(--text-muted);">No circle matches found.</div>'}
          </div>
        </div>

        <!-- Section: Events -->
        <div class="search-section-block" id="block-events" style="margin-bottom: var(--space-6);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Events (${events.length})</h3>
          <div class="events-grid">
            ${events.length > 0 ? events.map(e => renderEventCard(e)).join("") : '<div style="font-size: var(--font-size-xs); color: var(--text-muted);">No event matches found.</div>'}
          </div>
        </div>

        <!-- Section: Research -->
        <div class="search-section-block" id="block-research" style="margin-bottom: var(--space-6);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Research Projects (${research.length})</h3>
          <div class="research-grid">
            ${research.length > 0 ? research.map(r => renderResearchCard(r)).join("") : '<div style="font-size: var(--font-size-xs); color: var(--text-muted);">No research matches found.</div>'}
          </div>
        </div>
      </main>
    </div>

    ${renderBottomNav("/search")}
  `;
}

export function attachSearchPageEvents() {
  attachNavbarEvents();
  attachOpportunityListeners();
  attachCircleListeners();
  attachEventListeners();
  attachResearchListeners();

  // Tab filtering
  document.querySelectorAll(".search-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".search-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      const blocks = document.querySelectorAll(".search-section-block");

      if (target === "all") {
        blocks.forEach(b => (b.style.display = "block"));
      } else {
        blocks.forEach(b => (b.style.display = "none"));
        const activeBlock = document.getElementById(`block-${target}`);
        if (activeBlock) activeBlock.style.display = "block";
      }
    });
  });
}
