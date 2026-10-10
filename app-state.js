/* ==========================================================================
   CampusLink - Reactive Application State
   ========================================================================== */

import { DEMO_USERS } from "../models/demo-data.js";

const STATE_SESSION_KEY = "campuslink_active_user";
const STATE_THEME_KEY = "campuslink_theme";

class AppState {
  constructor() {
    this.subscribers = new Map();
    
    // Load theme
    const savedTheme = localStorage.getItem(STATE_THEME_KEY) || 
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    // Load active session (default to Nahom Tadesse if first launch for instant seamless preview)
    let sessionUser = null;
    const savedUserId = localStorage.getItem(STATE_SESSION_KEY);
    if (savedUserId) {
      sessionUser = DEMO_USERS.find(u => u.id === savedUserId) || null;
    }
    if (!sessionUser) {
      // Default to Nahom for instant exploration, can logout at any time
      sessionUser = DEMO_USERS[0];
      localStorage.setItem(STATE_SESSION_KEY, sessionUser.id);
    }

    this.state = {
      currentUser: sessionUser,
      isAuthenticated: Boolean(sessionUser),
      isAdmin: sessionUser?.role === "admin",
      theme: savedTheme,
      activeRoute: "feed",
      routeParams: {},
      searchQuery: "",
      feedFilter: "all",
      oppCategoryFilter: "all",
      unreadNotificationsCount: 2,
      unreadMessagesCount: 1
    };

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", this.state.theme);
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const prev = this.state[key];
    this.state[key] = value;
    if (prev !== value) {
      this.notify(key, value, prev);
    }
  }

  setCurrentUser(user) {
    this.state.currentUser = user;
    this.state.isAuthenticated = Boolean(user);
    this.state.isAdmin = user?.role === "admin";
    if (user) {
      localStorage.setItem(STATE_SESSION_KEY, user.id);
    } else {
      localStorage.removeItem(STATE_SESSION_KEY);
    }
    this.notify("currentUser", user);
    this.notify("isAuthenticated", this.state.isAuthenticated);
    this.notify("isAdmin", this.state.isAdmin);
  }

  setTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem(STATE_THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    this.notify("theme", theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === "dark" ? "light" : "dark";
    this.setTheme(nextTheme);
    return nextTheme;
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    return () => this.subscribers.get(key).delete(callback);
  }

  notify(key, val, prev) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(cb => {
        try {
          cb(val, prev);
        } catch (e) {
          console.error(`Error in state subscriber for ${key}:`, e);
        }
      });
    }
  }
}

export const appState = new AppState();
