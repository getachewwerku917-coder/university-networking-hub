/* ==========================================================================
   CampusLink - Application Bootstrap & Route Dispatcher
   ========================================================================== */

import { initFirebase } from "./config/firebase-config.js";
import { appState } from "./state/app-state.js";
import { router } from "./utils/router.js";

// Pages
import { renderLandingPage, attachLandingEvents } from "./pages/landing.js";
import { renderFeedPage, attachFeedEvents } from "./pages/feed.js";
import { renderProfilePage, attachProfileEvents } from "./pages/profile.js";
import { renderOpportunitiesPage, attachOpportunitiesEvents } from "./pages/opportunities.js";
import { renderCirclesPage, attachCirclesEvents } from "./pages/circles.js";
import { renderEventsPage, attachEventsPageListeners } from "./pages/events.js";
import { renderResearchPage, attachResearchPageListeners } from "./pages/research.js";
import { renderMessagingPage, attachMessagingEvents } from "./pages/messaging.js";
import { renderNetworkPage, attachNetworkEvents } from "./pages/network.js";
import { renderNotificationsPage, attachNotificationsEvents } from "./pages/notifications-page.js";
import { renderAdminPage, attachAdminEvents } from "./pages/admin.js";
import { renderSearchPage, attachSearchPageEvents } from "./pages/search-page.js";

class CampusLinkApp {
  constructor() {
    this.appContainer = document.getElementById("app");
  }

  init() {
    // 1. Initialize Firebase / Offline store
    initFirebase();

    // 2. Register Routes
    this._setupRoutes();

    // 3. Subscribe to reactive state updates (e.g. user switch, theme change)
    appState.subscribe("currentUser", () => {
      // Re-trigger current route
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    appState.subscribe("unreadNotificationsCount", () => {
      // Update badge in navbar
      const badge = document.querySelector(".navbar-actions .nav-badge");
      if (badge) {
        const count = appState.get("unreadNotificationsCount");
        badge.style.display = count > 0 ? "flex" : "none";
        badge.textContent = count;
      }
    });

    // 4. Start Router
    router.init();

    console.log("🚀 CampusLink initialized successfully.");
  }

  _mount(html, attachFn = null) {
    if (!this.appContainer) return;
    this.appContainer.innerHTML = html;
    window.scrollTo(0, 0);
    if (attachFn) {
      requestAnimationFrame(() => attachFn());
    }
  }

  _setupRoutes() {
    // Landing
    router.register("/", () => {
      const user = appState.get("currentUser");
      if (user) {
        router.navigate("/feed");
      } else {
        this._mount(renderLandingPage(), attachLandingEvents);
      }
    });

    router.register("/landing", () => {
      this._mount(renderLandingPage(), attachLandingEvents);
    });

    // Feed (Home)
    router.register("/feed", () => {
      this._mount(renderFeedPage(), attachFeedEvents);
    });

    // Opportunities
    router.register("/opportunities", () => {
      this._mount(renderOpportunitiesPage(), attachOpportunitiesEvents);
    });

    // Circles
    router.register("/circles", () => {
      this._mount(renderCirclesPage(), attachCirclesEvents);
    });

    router.register("/circles/:id", (params) => {
      this._mount(renderCirclesPage(params.id), () => attachCirclesEvents(params.id));
    });

    // Events
    router.register("/events", () => {
      this._mount(renderEventsPage(), attachEventsPageListeners);
    });

    // Research Hub
    router.register("/research", () => {
      this._mount(renderResearchPage(), attachResearchPageListeners);
    });

    // Messaging
    router.register("/messaging", () => {
      this._mount(renderMessagingPage(), attachMessagingEvents);
    });

    router.register("/messaging/:id", (params) => {
      this._mount(renderMessagingPage(params.id), () => attachMessagingEvents(params.id));
    });

    // Profile
    router.register("/profile", () => {
      this._mount(renderProfilePage(), attachProfileEvents);
    });

    router.register("/profile/:id", (params) => {
      this._mount(renderProfilePage(params.id), () => attachProfileEvents(params.id));
    });

    // Network
    router.register("/network", () => {
      this._mount(renderNetworkPage(), attachNetworkEvents);
    });

    // Notifications
    router.register("/notifications", () => {
      this._mount(renderNotificationsPage(), attachNotificationsEvents);
    });

    // Admin Dashboard
    router.register("/admin", () => {
      this._mount(renderAdminPage(), attachAdminEvents);
    });

    // Global Search
    router.register("/search", (params, query) => {
      const q = query.get("q") || "";
      this._mount(renderSearchPage(q), attachSearchPageEvents);
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new CampusLinkApp();
  app.init();
});
