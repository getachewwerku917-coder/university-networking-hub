/* ==========================================================================
   CampusLink - Opportunity Card Component
   ========================================================================== */

import { escapeHtml, calculateDeadlineStatus } from "../utils/helpers.js";
import { dbService } from "../services/db-service.js";
import { modal } from "./modal.js";
import { showToast } from "../utils/helpers.js";

export function renderOpportunityCard(opp) {
  const status = calculateDeadlineStatus(opp.deadline);
  const orgInitials = opp.organization
    ? opp.organization.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase()
    : "OPP";

  return `
    <div class="opportunity-card ${status.isExpired ? 'expired' : ''}" id="opp-card-${opp.id}">
      <div>
        <div class="opportunity-top">
          <div style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <div class="opportunity-org-badge">${orgInitials}</div>
            <div>
              <h3 class="opportunity-title">${escapeHtml(opp.title)}</h3>
              <div class="opportunity-org-name">${escapeHtml(opp.organization)}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon-sm btn-save-opp ${opp.saved ? 'saved' : ''}" data-opp-id="${opp.id}" title="${opp.saved ? 'Unsave' : 'Save opportunity'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${opp.saved ? 'var(--brand-primary)' : 'none'}" stroke="${opp.saved ? 'var(--brand-primary)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>

        <div class="opportunity-details">
          <span class="badge badge-primary">${escapeHtml(opp.opportunityType)}</span>
          <span class="opportunity-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(opp.location)}
          </span>
          <span class="deadline-indicator ${status.statusClass}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${status.text}
          </span>
        </div>

        <p class="opportunity-desc line-clamp-3">
          ${escapeHtml(opp.description)}
        </p>

        ${Array.isArray(opp.requirements) && opp.requirements.length > 0 ? `
          <div class="opportunity-requirements">
            ${opp.requirements.map(req => `<span class="tag-chip">${escapeHtml(req)}</span>`).join("")}
          </div>
        ` : ""}
      </div>

      <div class="opportunity-footer">
        <span style="font-size: 11px; color: var(--text-muted);">
          Posted: ${opp.postedDate || "Recently"}
        </span>

        <div style="display: flex; gap: var(--space-2);">
          ${status.isExpired ? `
            <span class="badge badge-expired">Applications Closed</span>
          ` : `
            <button class="btn btn-primary btn-sm btn-apply-opp" data-opp-id="${opp.id}">
              Apply Now
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

export function attachOpportunityListeners(container = document) {
  // Save button
  container.querySelectorAll(".btn-save-opp").forEach(btn => {
    btn.addEventListener("click", () => {
      const oppId = btn.getAttribute("data-opp-id");
      const isSaved = dbService.toggleSaveOpportunity(oppId);
      showToast(isSaved ? "Saved to your bookmarks." : "Removed from bookmarks.", "info");

      const icon = btn.querySelector("svg");
      if (icon) {
        icon.setAttribute("fill", isSaved ? "var(--brand-primary)" : "none");
        icon.setAttribute("stroke", isSaved ? "var(--brand-primary)" : "currentColor");
      }
    });
  });

  // Apply button
  container.querySelectorAll(".btn-apply-opp").forEach(btn => {
    btn.addEventListener("click", () => {
      const oppId = btn.getAttribute("data-opp-id");
      const opp = dbService.getOpportunities().find(o => o.id === oppId);
      if (opp) {
        modal.openApplyModal(opp);
      }
    });
  });
}
