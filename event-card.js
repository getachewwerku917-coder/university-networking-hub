/* ==========================================================================
   CampusLink - Event Card Component
   ========================================================================== */

import { escapeHtml, showToast } from "../utils/helpers.js";
import { dbService } from "../services/db-service.js";

export function renderEventCard(evt) {
  const d = new Date(evt.date);
  const monthStr = isNaN(d.getTime()) ? "NOV" : d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayStr = isNaN(d.getTime()) ? "15" : d.getDate();

  return `
    <div class="event-card" id="event-card-${evt.id}">
      <div class="event-banner">
        <span class="badge badge-neutral" style="background: rgba(255,255,255,0.9); color: var(--brand-primary); font-weight:700;">
          ${escapeHtml(evt.category)}
        </span>
        <div class="event-date-badge">
          <div class="event-date-month">${monthStr}</div>
          <div class="event-date-day">${dayStr}</div>
        </div>
      </div>

      <div class="event-body">
        <h3 class="event-title">${escapeHtml(evt.name)}</h3>
        <div class="event-organizer">${escapeHtml(evt.organizer)}</div>

        <div class="event-meta-list">
          <div class="event-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${escapeHtml(evt.time)}</span>
          </div>
          <div class="event-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${escapeHtml(evt.location)}</span>
          </div>
        </div>

        <p class="event-desc line-clamp-3">${escapeHtml(evt.description)}</p>

        <div class="event-footer">
          <button class="btn btn-sm ${evt.rsvp ? 'btn-outline' : 'btn-primary'} btn-toggle-rsvp" data-event-id="${evt.id}">
            ${evt.rsvp ? 'Registered ✓' : 'RSVP / Register'}
          </button>
          <button class="btn btn-ghost btn-sm btn-save-event" title="Add to calendar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function attachEventListeners(container = document) {
  container.querySelectorAll(".btn-toggle-rsvp").forEach(btn => {
    btn.addEventListener("click", () => {
      const eventId = btn.getAttribute("data-event-id");
      const isRsvp = dbService.toggleRsvpEvent(eventId);
      btn.className = `btn btn-sm ${isRsvp ? 'btn-outline' : 'btn-primary'} btn-toggle-rsvp`;
      btn.textContent = isRsvp ? "Registered ✓" : "RSVP / Register";
      showToast(isRsvp ? "Registration confirmed! Added to your schedule." : "Registration canceled.", "info");
    });
  });

  container.querySelectorAll(".btn-save-event").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast("Saved to your calendar bookmarks.", "success");
    });
  });
}
