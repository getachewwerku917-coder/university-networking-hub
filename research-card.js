/* ==========================================================================
   CampusLink - Research Hub Card Component
   ========================================================================== */

import { escapeHtml, showToast } from "../utils/helpers.js";
import { dbService } from "../services/db-service.js";

export function renderResearchCard(res) {
  const slotsRemaining = (res.teamSizeRequired || 2) - (res.teamSizeCurrent || 1);
  const isFull = slotsRemaining <= 0;

  return `
    <div class="research-card" id="research-card-${res.id}">
      <div>
        <span class="research-field-tag">${escapeHtml(res.field)}</span>
        <h3 class="research-title">${escapeHtml(res.title)}</h3>

        <div class="research-author">
          <div class="avatar avatar-sm">
            <div class="avatar-placeholder">${res.authorName ? res.authorName[0] : 'R'}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-xs); font-weight: 700;">${escapeHtml(res.authorName)}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(res.authorUniversity)}</div>
          </div>
        </div>

        <p class="research-desc line-clamp-3">${escapeHtml(res.description)}</p>

        <div class="research-meta-box">
          <div class="research-meta-row">
            <span style="font-weight: 600; color: var(--text-secondary);">Team Slots:</span>
            <span class="badge ${isFull ? 'badge-neutral' : 'badge-success'}">
              ${isFull ? 'Team Filled' : `${slotsRemaining} open spot${slotsRemaining > 1 ? 's' : ''}`}
            </span>
          </div>

          ${Array.isArray(res.requiredSkills) && res.requiredSkills.length > 0 ? `
            <div>
              <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 2px;">Required Skills:</div>
              <div class="research-skills-chips">
                ${res.requiredSkills.map(s => `<span class="tag-chip" style="font-size: 11px; padding: 2px 7px;">${escapeHtml(s)}</span>`).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </div>

      <div class="research-footer">
        <span style="font-size: 11px; color: var(--text-muted);">
          Current: ${res.teamSizeCurrent || 1}/${res.teamSizeRequired || 2} members
        </span>

        <button class="btn btn-sm ${isFull ? 'btn-outline disabled' : 'btn-primary'} btn-join-research" data-res-id="${res.id}" ${isFull ? 'disabled' : ''}>
          ${isFull ? 'Team Full' : 'Join Research Team'}
        </button>
      </div>
    </div>
  `;
}

export function attachResearchListeners(container = document) {
  container.querySelectorAll(".btn-join-research").forEach(btn => {
    btn.addEventListener("click", () => {
      const resId = btn.getAttribute("data-res-id");
      const success = dbService.joinResearchTeam(resId);
      if (success) {
        showToast("You joined the research team! The project lead has been notified.", "success");
        btn.textContent = "Joined ✓";
        btn.classList.add("btn-outline");
        btn.classList.remove("btn-primary");
      } else {
        showToast("Team slots are full.", "warning");
      }
    });
  });
}
