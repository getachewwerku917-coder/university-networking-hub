/* ==========================================================================
   CampusLink - Authentication Service
   Handles Sign Up, Login, Logout, Password Reset, and Session Management
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { DEMO_USERS } from "../models/demo-data.js";
import { FirebaseClients, isUsingLiveFirebase } from "../config/firebase-config.js";

const USERS_STORAGE_KEY = "campuslink_users_store";

class AuthService {
  constructor() {
    this.users = this._loadUsers();
  }

  _loadUsers() {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved users, falling back to DEMO_USERS", e);
      }
    }
    // Seed with demo users
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
    return [...DEMO_USERS];
  }

  _saveUsers() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  async signUp(userData) {
    const { email, password, name, university, faculty, department, year, skills, researchInterests, location, avatar } = userData;

    // Check if user already exists
    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    if (isUsingLiveFirebase() && FirebaseClients.auth) {
      try {
        const userCredential = await FirebaseClients.auth.createUserWithEmailAndPassword(email, password);
        const fbUser = userCredential.user;
        const newRecord = {
          id: fbUser.uid,
          email,
          role: "student",
          name,
          headline: `${department} Student @ ${university}`,
          university,
          faculty: faculty || "Engineering & Technology",
          department,
          year: year || "Year 1",
          location: location || "Ethiopia",
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          bio: `Student at ${university}, ${department}. Interested in ${skills?.join(", ") || "technology"}.`,
          skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : ["Software", "Research"]),
          researchInterests: Array.isArray(researchInterests) ? researchInterests : (researchInterests ? researchInterests.split(",").map(s => s.trim()) : ["Artificial Intelligence"]),
          connections: [],
          education: [{ institution: university, degree: `B.Sc. in ${department}`, years: "2024 - Present" }],
          experience: [],
          projects: [],
          certifications: [],
          achievements: [],
          online: true,
          createdAt: new Date().toISOString()
        };

        if (FirebaseClients.firestore) {
          await FirebaseClients.firestore.collection("users").doc(fbUser.uid).set(newRecord);
        }

        this.users.push(newRecord);
        this._saveUsers();
        appState.setCurrentUser(newRecord);
        return newRecord;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    // High performance local fallback
    const newId = "usr-" + Date.now();
    const newRecord = {
      id: newId,
      email,
      role: email.includes("admin") ? "admin" : "student",
      name,
      headline: `${department} Student @ ${university}`,
      university,
      faculty: faculty || "College of Informatics & Technology",
      department,
      year: year || "Year 2",
      location: location || "Addis Ababa, Ethiopia",
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      bio: `Student at ${university}, majoring in ${department}. Motivated to connect, conduct research, and build exciting projects.`,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : ["Problem Solving", "Teamwork"]),
      researchInterests: Array.isArray(researchInterests) ? researchInterests : (researchInterests ? researchInterests.split(",").map(s => s.trim()) : ["Applied Technology"]),
      connections: [],
      education: [{ institution: university, degree: `B.Sc. in ${department}`, years: "2023 - 2027" }],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      online: true,
      createdAt: new Date().toISOString()
    };

    this.users.push(newRecord);
    this._saveUsers();
    appState.setCurrentUser(newRecord);
    return newRecord;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    if (isUsingLiveFirebase() && FirebaseClients.auth) {
      try {
        const userCredential = await FirebaseClients.auth.signInWithEmailAndPassword(email, password);
        const fbUid = userCredential.user.uid;
        let matched = this.users.find(u => u.id === fbUid || u.email.toLowerCase() === email.toLowerCase());
        if (!matched && FirebaseClients.firestore) {
          const doc = await FirebaseClients.firestore.collection("users").doc(fbUid).get();
          if (doc.exists) {
            matched = doc.data();
            this.users.push(matched);
            this._saveUsers();
          }
        }
        if (matched) {
          appState.setCurrentUser(matched);
          return matched;
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }

    // Local authentication check
    const matched = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      throw new Error("No account found with this email. Please check your spelling or sign up.");
    }

    matched.online = true;
    this._saveUsers();
    appState.setCurrentUser(matched);
    return matched;
  }

  async logout() {
    if (isUsingLiveFirebase() && FirebaseClients.auth) {
      try {
        await FirebaseClients.auth.signOut();
      } catch (e) {
        console.warn("Firebase sign out error:", e);
      }
    }
    const current = appState.get("currentUser");
    if (current) {
      const stored = this.users.find(u => u.id === current.id);
      if (stored) {
        stored.online = false;
        this._saveUsers();
      }
    }
    appState.setCurrentUser(null);
  }

  async sendPasswordReset(email) {
    if (!email) {
      throw new Error("Please enter your registered email address.");
    }
    if (isUsingLiveFirebase() && FirebaseClients.auth) {
      await FirebaseClients.auth.sendPasswordResetEmail(email);
      return true;
    }
    // Simulation
    const matched = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      throw new Error("No registered account found with this email address.");
    }
    return true;
  }

  updateProfile(updatedData) {
    const current = appState.get("currentUser");
    if (!current) throw new Error("Not logged in");

    const updated = { ...current, ...updatedData };
    const index = this.users.findIndex(u => u.id === current.id);
    if (index !== -1) {
      this.users[index] = updated;
      this._saveUsers();
    }
    appState.setCurrentUser(updated);

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("users").doc(current.id).update(updatedData).catch(console.error);
    }
    return updated;
  }

  switchDemoUser(userId) {
    const target = this.users.find(u => u.id === userId);
    if (target) {
      appState.setCurrentUser(target);
      return target;
    }
    return null;
  }

  getAllUsers() {
    return [...this.users];
  }

  getUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }
}

export const authService = new AuthService();
