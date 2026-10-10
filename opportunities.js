/* ==========================================================================
   CampusLink - Opportunities Board View
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderOpportunityCard, attachOpportunityListeners } from "../components/opportunity-card.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderOpportunitiesPage() {
  const currentCategory = appState.get("oppCategoryFilter") || "all";
  const currentSearch = appState.get("searchQuery") || "";
  const opps = dbService.getOpportunities({
    category: currentCategory,
    search: currentSearch
  });

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "Internships", label: "Internships" },
    { id: "Jobs", label: "Jobs" },
    { id: "Scholarships", label: "Scholarships" },
    { id: "Research", label: "Research" },
    { id: "Fellowships", label: "Fellowships" },
    { id: "Competitions", label: "Competitions" },
    { id: "Volunteering", label: "Volunteering" },
    { id: "Training", label: "Training" }
  ];

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      <!-- Sidebar -->
      ${renderSidebar("/opportunities")}

      <!-- Main Content Column -->
      <main class="main-content">
        <!-- Header Banner & Filter Box -->
        <div class="opportunities-header">
          <div>
            <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">Career & Opportunity Board</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 4px;">
              Verified internships, scholarships, fellowships, and graduate roles for university students in Africa.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="opportunities-search-row">
            <div class="input-with-icon opp-search-input">
              <svg class="input-icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                class="form-input" 
                id="opp-filter-search" 
                placeholder="Search by title, organization, or keyword..."
                value="${escapeHtml(currentSearch)}"
              />
            </div>

            <div style="display: flex; gap: var(--space-2); align-items: center;">
              <select class="form-select" id="opp-sort-select" style="min-width: 160px;">
                <option value="deadline">Sort by Deadline</option>
                <option value="recent">Sort by Most Recent</option>
              </select>
            </div>
          </div>

          <!-- Category Chips -->
          <div class="filter-chips-bar" id="opp-category-chips">
            ${categories.map(c => `
              <button class="filter-chip ${currentCategory.toLowerCase() === c.id.toLowerCase() ? 'active' : ''}" data-cat="${c.id}">
                ${escapeHtml(c.label)}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Opportunities Grid -->
        <div class="opportunities-grid" style="display: flex; flex-direction: column; gap: var(--space-4);" id="opps-container">
          ${opps.length > 0 ? (
            opps.map(opp => renderOpportunityCard(opp)).join("")
          ) : `
            <div class="card empty-state">
              <div class="empty-state-icon">💼</div>
              <div class="empty-state-title">No opportunities found</div>
              <div class="empty-state-desc">Try clearing your search query or switching categories.</div>
            </div>
          `}
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/opportunities")}
  `;
}

export function attachOpportunitiesEvents() {
  attachNavbarEvents();
  attachOpportunityListeners();

  const searchInput = document.getElementById("opp-filter-search");
  const sortSelect = document.getElementById("opp-sort-select");

  const refreshList = () => {
    const appEl = document.getElementById("app");
    if (appEl) {
      appEl.innerHTML = renderOpportunitiesPage();
      attachOpportunitiesEvents();
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.set("searchQuery", e.target.value.trim());
      // Debounced or direct refresh
      const oppsContainer = document.getElementById("opps-container");
      if (oppsContainer) {
        const results = dbService.getOpportunities({
          category: appState.get("oppCategoryFilter"),
          search: e.target.value.trim(),
          sortBy: sortSelect ? sortSelect.value : "deadline"
        });
        oppsContainer.innerHTML = results.length > 0
          ? results.map(opp => renderOpportunityCard(opp)).join("")
          : `<div class="card empty-state"><div class="empty-state-icon">💼</div><div class="empty-state-title">No opportunities found</div></div>`;
        attachOpportunityListeners(oppsContainer);
      }
    });
  }

  // Category chips
  document.querySelectorAll("#opp-category-chips .filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const cat = chip.getAttribute("data-cat");
      appState.set("oppCategoryFilter", cat);
      refreshList();
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const oppsContainer = document.getElementById("opps-container");
      if (oppsContainer) {
        const results = dbService.getOpportunities({
          category: appState.get("oppCategoryFilter"),
          search: searchInput ? searchInput.value.trim() : "",
          sortBy: sortSelect.value
        });
        oppsContainer.innerHTML = results.map(opp => renderOpportunityCard(opp)).join("");
        attachOpportunityListeners(oppsContainer);
      }
    });
  }
}
