/* ==========================================================================
   CampusLink - Circle Card Component
   ========================================================================== */

import { escapeHtml, showToast } from "../utils/helpers.js";
import { dbService } from "../services/db-service.js";

export function renderCircleCard(circle) {
  return `
    <div class="circle-card" id="circle-card-${circle.id}">
      <div class="circle-cover" style="background-image: url('${circle.cover}')">
        <span class="circle-badge">${escapeHtml(circle.category)}</span>
      </div>

      <div class="circle-content">
        <h3 class="circle-title">${escapeHtml(circle.name)}</h3>
        <p class="circle-desc line-clamp-3">${escapeHtml(circle.description)}</p>

        <div class="circle-footer">
          <div class="circle-members-count">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>${circle.membersCount} members</span>
          </div>

          <button class="btn btn-sm ${circle.isJoined ? 'btn-outline' : 'btn-primary'} btn-toggle-circle" data-circle-id="${circle.id}">
            ${circle.isJoined ? 'Joined ✓' : 'Join Circle'}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function attachCircleListeners(container = document) {
  container.querySelectorAll(".btn-toggle-circle").forEach(btn => {
    btn.addEventListener("click", () => {
      const circleId = btn.getAttribute("data-circle-id");
      const isJoined = dbService.toggleJoinCircle(circleId);
      btn.className = `btn btn-sm ${isJoined ? 'btn-outline' : 'btn-primary'} btn-toggle-circle`;
      btn.textContent = isJoined ? "Joined ✓" : "Join Circle";
      showToast(isJoined ? "You joined this Circle!" : "You left this Circle.", "info");

      // Update member count text in DOM
      const card = document.getElementById(`circle-card-${circleId}`);
      if (card) {
        const countSpan = card.querySelector(".circle-members-count span");
        const circle = dbService.getCircleById(circleId);
        if (countSpan && circle) {
          countSpan.textContent = `${circle.membersCount} members`;
        }
      }
    });
  });
}
