/* ==========================================================================
   CampusLink - Study Groups & Circles View
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { dbService } from "../services/db-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { renderCircleCard, attachCircleListeners } from "../components/circle-card.js";
import { modal } from "../components/modal.js";
import { escapeHtml, showToast } from "../utils/helpers.js";

export function renderCirclesPage(circleId = null) {
  if (circleId) {
    return renderCircleRoom(circleId);
  }

  const circles = dbService.getCircles();

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      <!-- Sidebar -->
      ${renderSidebar("/circles")}

      <!-- Main Column -->
      <main class="main-content">
        <!-- Header -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap;">
            <div>
              <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">Academic Circles & Communities</h1>
              <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 4px;">
                Connect with peers in your faculty, collaborate on hackathons, and exchange coursework resources.
              </p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-create-circle-trigger">
              + Create Circle
            </button>
          </div>

          <!-- Search Bar -->
          <div class="input-with-icon" style="margin-top: var(--space-4); max-width: 400px;">
            <svg class="input-icon-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="form-input" id="circles-search-input" placeholder="Search circles by name or topic..." />
          </div>
        </div>

        <!-- Circles Grid -->
        <div class="circles-grid" id="circles-grid-container">
          ${circles.map(c => renderCircleCard(c)).join("")}
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav("/circles")}
  `;
}

function renderCircleRoom(circleId) {
  const circle = dbService.getCircleById(circleId);
  if (!circle) {
    return `
      ${renderNavbar()}
      <div class="app-container full-width">
        <div class="card empty-state">
          <div class="empty-state-title">Circle not found</div>
          <a href="#/circles" class="btn btn-primary btn-sm">Browse Circles</a>
        </div>
      </div>
    `;
  }

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/circles")}

      <main class="main-content">
        <div class="circle-room-header">
          <div class="circle-room-banner" style="background-image: url('${circle.cover}'); background-size: cover; background-position: center;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);">
              <span class="badge badge-primary">${escapeHtml(circle.category)}</span>
              <h1 style="color: #ffffff; font-size: var(--font-size-xl); margin-top: 4px;">${escapeHtml(circle.name)}</h1>
            </div>
          </div>

          <div class="circle-room-info">
            <div>
              <p style="font-size: var(--font-size-sm); color: var(--text-secondary); max-width: 600px;">
                ${escapeHtml(circle.description)}
              </p>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
                Created by <strong>${escapeHtml(circle.creatorName)}</strong> • ${circle.membersCount} active members
              </div>
            </div>

            <button class="btn btn-sm ${circle.isJoined ? 'btn-outline' : 'btn-primary'} btn-toggle-circle" data-circle-id="${circle.id}">
              ${circle.isJoined ? 'Joined ✓' : 'Join Circle'}
            </button>
          </div>
        </div>

        <div class="card" style="padding: var(--space-5);">
          <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--space-3);">Circle Discussion</h3>
          <p style="font-size: var(--font-size-xs); color: var(--text-muted);">
            Share notes, study links, or ask a question directly to members of ${escapeHtml(circle.name)}.
          </p>
          <div style="display: flex; gap: var(--space-3); margin-top: var(--space-3);">
            <input type="text" class="form-input" placeholder="Start a discussion inside ${escapeHtml(circle.name)}..." id="circle-post-input" />
            <button class="btn btn-primary btn-sm" id="btn-circle-post">Post</button>
          </div>
        </div>
      </main>
    </div>

    ${renderBottomNav("/circles")}
  `;
}

export function attachCirclesEvents(circleId = null) {
  attachNavbarEvents();
  attachCircleListeners();

  // Search input
  const searchInput = document.getElementById("circles-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      const results = dbService.getCircles(q);
      const grid = document.getElementById("circles-grid-container");
      if (grid) {
        grid.innerHTML = results.length > 0
          ? results.map(c => renderCircleCard(c)).join("")
          : `<div class="card empty-state"><div class="empty-state-title">No circles match "${escapeHtml(q)}"</div></div>`;
        attachCircleListeners(grid);
      }
    });
  }

  // Create circle button
  const createBtn = document.getElementById("btn-create-circle-trigger");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      openCreateCircleModal();
    });
  }

  // Inside circle room post button
  const circlePostBtn = document.getElementById("btn-circle-post");
  if (circlePostBtn) {
    circlePostBtn.addEventListener("click", () => {
      const input = document.getElementById("circle-post-input");
      if (input && input.value.trim()) {
        showToast("Discussion thread posted to Circle!", "success");
        input.value = "";
      }
    });
  }
}

function openCreateCircleModal() {
  const html = `
    <div class="modal-header">
      <h3 class="modal-title">Create a New Circle</h3>
      <button class="modal-close modal-close-trigger" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="form-label" for="circle-name">Circle Name *</label>
        <input class="form-input" type="text" id="circle-name" placeholder="e.g. AAU Web3 Developers" required />
      </div>

      <div class="form-group">
        <label class="form-label" for="circle-cat">Category *</label>
        <select class="form-select" id="circle-cat">
          <option value="Programming">Programming</option>
          <option value="AI & Technology">AI & Technology</option>
          <option value="Entrepreneurship">Entrepreneurship & FinTech</option>
          <option value="Research Club">Research Club</option>
          <option value="Mathematics">Mathematics & Algorithms</option>
          <option value="English Practice">Language & Communication</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="circle-desc">Description</label>
        <textarea class="form-textarea" id="circle-desc" placeholder="Describe the purpose, meeting schedule, or goals of this circle..." rows="3"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost modal-close-trigger">Cancel</button>
      <button class="btn btn-primary" id="btn-submit-create-circle">Create Community Circle</button>
    </div>
  `;

  modal.open(html, {
    maxWidth: "500px",
    onAttach: (container) => {
      container.querySelector("#btn-submit-create-circle").addEventListener("click", () => {
        const name = container.querySelector("#circle-name").value.trim();
        const category = container.querySelector("#circle-cat").value;
        const description = container.querySelector("#circle-desc").value.trim();

        if (!name) {
          showToast("Please provide a name for your circle.", "warning");
          return;
        }

        dbService.createCircle({ name, category, description });
        showToast(`Circle "${name}" created successfully!`, "success");
        modal.close();
        window.location.hash = "#/circles";
        window.location.reload();
      });
    }
  });
}
