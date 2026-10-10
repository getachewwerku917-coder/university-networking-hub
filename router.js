/* ==========================================================================
   CampusLink - Client-side Hash Router
   Handles URL routing, route params, route guards & navigation
   ========================================================================== */

import { appState } from "../state/app-state.js";

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.params = {};

    window.addEventListener("hashchange", () => this._handleRoute());
  }

  register(pattern, handler, isProtected = false) {
    this.routes.set(pattern, { handler, isProtected });
  }

  navigate(hash) {
    if (!hash.startsWith("#")) hash = "#" + hash;
    window.location.hash = hash;
  }

  _parseHash() {
    let hash = window.location.hash.slice(1) || "/";
    if (!hash.startsWith("/")) hash = "/" + hash;
    const [path, queryString] = hash.split("?");
    const query = new URLSearchParams(queryString || "");
    return { path, query };
  }

  _matchRoute(path) {
    for (const [pattern, config] of this.routes.entries()) {
      const regexPattern = "^" + pattern.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)") + "$";
      const regex = new RegExp(regexPattern);
      const match = path.match(regex);

      if (match) {
        const paramNames = (pattern.match(/:([a-zA-Z0-9_]+)/g) || []).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { config, params, pattern };
      }
    }
    return null;
  }

  _handleRoute() {
    const { path, query } = this._parseHash();
    const match = this._matchRoute(path);

    if (!match) {
      // Default fallback
      const user = appState.get("currentUser");
      if (user) {
        this.navigate("/feed");
      } else {
        this.navigate("/landing");
      }
      return;
    }

    const { config, params } = match;

    // Protected route guard
    const isAuthenticated = appState.get("isAuthenticated");
    if (config.isProtected && !isAuthenticated) {
      console.warn("Protected route accessed while unauthenticated. Redirecting to landing.");
      this.navigate("/landing");
      return;
    }

    // Admin route guard
    if (path.startsWith("/admin") && !appState.get("isAdmin")) {
      console.warn("Admin route accessed without admin privilege. Redirecting to feed.");
      this.navigate("/feed");
      return;
    }

    this.currentRoute = path;
    this.params = params;
    appState.set("activeRoute", path);
    appState.set("routeParams", { ...params, query });

    try {
      config.handler(params, query);
    } catch (err) {
      console.error(`Route handler failed for ${path}:`, err);
    }
  }

  init() {
    this._handleRoute();
  }
}

export const router = new Router();
