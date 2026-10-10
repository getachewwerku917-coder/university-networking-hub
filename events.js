/* ==========================================================================
   CampusLink - Events Section View
   ========================================================================== */

import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderEventCard, attachEventListeners } from "../components/event-card.js";
import { modal } from "../components/modal.js";
import { showToast } from "../utils/helpers.js";

export function renderEventsPage() {
  const events = dbService.getEvents();

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      <!-- Sidebar -->
      ${renderSidebar("/events")}

      <!-- Main Column -->
      <main class="main-content">
        <!-- Header -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap;">
            <div>
              <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">Academic & Campus Events</h1>
              <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 4px;">
                Discover hackathons, webinars, guest lectures, and student meetups happening across universities.
              </p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-create-event-trigger">
              + Post an Event
            </button>
          </div>
        </div>

        <!-- Events Grid -->
        <div class="events-grid" id="events-grid-container">
          ${events.map(e => renderEventCard(e)).join("")}
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/events")}
  `;
}

export function attachEventsPageListeners() {
  attachNavbarEvents();
  attachEventListeners();

  const createBtn = document.getElementById("btn-create-event-trigger");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      openCreateEventModal();
    });
  }
}

function openCreateEventModal() {
  const html = `
    <div class="modal-header">
      <h3 class="modal-title">Host / Announce an Event</h3>
      <button class="modal-close modal-close-trigger" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="form-label" for="evt-name">Event Title *</label>
        <input class="form-input" type="text" id="evt-name" placeholder="e.g. AAU Flutter Bootcamp 2026" required />
      </div>

      <div class="form-group">
        <label class="form-label" for="evt-organizer">Organizer / Society *</label>
        <input class="form-input" type="text" id="evt-organizer" placeholder="e.g. Google Developer Student Club AAU" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="form-group">
          <label class="form-label" for="evt-cat">Category</label>
          <select class="form-select" id="evt-cat">
            <option value="Workshops">Workshop / Bootcamp</option>
            <option value="Conferences">Conference / Symposium</option>
            <option value="Competitions">Hackathon / Challenge</option>
            <option value="Webinars">Virtual Webinar</option>
            <option value="Student meetups">Student Meetup</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="evt-date">Date</label>
          <input class="form-input" type="date" id="evt-date" value="2026-11-20" required />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="form-group">
          <label class="form-label" for="evt-time">Time</label>
          <input class="form-input" type="text" id="evt-time" placeholder="02:00 PM - 05:00 PM" />
        </div>
        <div class="form-group">
          <label class="form-label" for="evt-loc">Location</label>
          <input class="form-input" type="text" id="evt-loc" placeholder="AAiT Hall / Virtual" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="evt-desc">Event Overview</label>
        <textarea class="form-textarea" id="evt-desc" placeholder="Agenda, speaker bio, prerequisites..." rows="3"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost modal-close-trigger">Cancel</button>
      <button class="btn btn-primary" id="btn-submit-create-event">Publish Event</button>
    </div>
  `;

  modal.open(html, {
    maxWidth: "520px",
    onAttach: (container) => {
      container.querySelector("#btn-submit-create-event").addEventListener("click", () => {
        const name = container.querySelector("#evt-name").value.trim();
        const organizer = container.querySelector("#evt-organizer").value.trim();
        const category = container.querySelector("#evt-cat").value;
        const date = container.querySelector("#evt-date").value;
        const time = container.querySelector("#evt-time").value.trim() || "TBA";
        const location = container.querySelector("#evt-loc").value.trim() || "Virtual Stream";
        const description = container.querySelector("#evt-desc").value.trim();

        if (!name || !organizer) {
          showToast("Please fill in event title and organizer.", "warning");
          return;
        }

        dbService.createEvent({ name, organizer, category, date, time, location, description });
        showToast("Event published to campus calendar!", "success");
        modal.close();
        window.location.reload();
      });
    }
  });
}
