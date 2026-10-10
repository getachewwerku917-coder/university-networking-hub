/* ==========================================================================
   CampusLink - Database Service (Firestore Abstraction Layer)
   Handles Posts, Opportunities, Circles, Events, Research, Messages, Reports
   Supports real-time listeners and seamless offline/localStorage fallback
   ========================================================================== */

import {
  DEMO_POSTS,
  DEMO_OPPORTUNITIES,
  DEMO_CIRCLES,
  DEMO_EVENTS,
  DEMO_RESEARCH,
  DEMO_CONVERSATIONS,
  DEMO_NOTIFICATIONS,
  DEMO_REPORTS
} from "../models/demo-data.js";
import { appState } from "../state/app-state.js";
import { authService } from "./auth-service.js";
import { FirebaseClients, isUsingLiveFirebase } from "../config/firebase-config.js";

// Storage keys for persistent state
const KEYS = {
  POSTS: "campuslink_db_posts",
  OPPORTUNITIES: "campuslink_db_opps",
  CIRCLES: "campuslink_db_circles",
  EVENTS: "campuslink_db_events",
  RESEARCH: "campuslink_db_research",
  CONVERSATIONS: "campuslink_db_conversations",
  NOTIFICATIONS: "campuslink_db_notifications",
  REPORTS: "campuslink_db_reports"
};

class DatabaseService {
  constructor() {
    this.postsListeners = new Set();
    this.messagesListeners = new Map();
    this.notificationsListeners = new Set();

    this._initCollections();
  }

  _initCollections() {
    this.posts = this._loadCollection(KEYS.POSTS, DEMO_POSTS);
    this.opportunities = this._loadCollection(KEYS.OPPORTUNITIES, DEMO_OPPORTUNITIES);
    this.circles = this._loadCollection(KEYS.CIRCLES, DEMO_CIRCLES);
    this.events = this._loadCollection(KEYS.EVENTS, DEMO_EVENTS);
    this.research = this._loadCollection(KEYS.RESEARCH, DEMO_RESEARCH);
    this.conversations = this._loadCollection(KEYS.CONVERSATIONS, DEMO_CONVERSATIONS);
    this.notifications = this._loadCollection(KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
    this.reports = this._loadCollection(KEYS.REPORTS, DEMO_REPORTS);
  }

  _loadCollection(key, initialData) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`Failed to parse ${key}, resetting to default`, e);
      }
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return [...initialData];
  }

  _saveCollection(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /* ----------------------------------------------------------------------
     POSTS
     ---------------------------------------------------------------------- */
  getPosts(filter = "all") {
    const user = appState.get("currentUser");
    let list = [...this.posts];

    if (filter === "My University" && user) {
      list = list.filter(p => p.university === user.university);
    } else if (filter === "My Faculty" && user) {
      list = list.filter(p => p.faculty === user.faculty);
    } else if (filter === "My Department" && user) {
      list = list.filter(p => p.department === user.department);
    } else if (filter === "Research") {
      list = list.filter(p => p.postType === "Research");
    } else if (filter === "Opportunities") {
      list = list.filter(p => p.postType === "Opportunity");
    } else if (filter === "Events") {
      list = list.filter(p => p.postType === "Event");
    }

    return list;
  }

  addPost({ content, postType = "General", media = null, hashtags = [] }) {
    const user = appState.get("currentUser");
    if (!user) throw new Error("You must be logged in to create a post.");

    const newPost = {
      id: "post-" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorHeadline: user.headline || `${user.department} @ ${user.university}`,
      authorAvatar: user.avatar,
      university: user.university,
      faculty: user.faculty,
      department: user.department,
      postType,
      content,
      media,
      hashtags: hashtags.length ? hashtags : ["#CampusLink"],
      timestamp: "Just now",
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      sharesCount: 0
    };

    this.posts.unshift(newPost);
    this._saveCollection(KEYS.POSTS, this.posts);
    this._notifyPosts();

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("posts").doc(newPost.id).set(newPost).catch(console.error);
    }

    return newPost;
  }

  toggleLikePost(postId) {
    const user = appState.get("currentUser");
    if (!user) throw new Error("Log in to like posts.");

    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    if (!Array.isArray(post.likes)) post.likes = [];
    const idx = post.likes.indexOf(user.id);
    let liked = false;

    if (idx !== -1) {
      post.likes.splice(idx, 1);
      liked = false;
    } else {
      post.likes.push(user.id);
      liked = true;

      // Create notification for author if not self
      if (post.authorId !== user.id) {
        this.addNotification({
          type: "like",
          icon: "❤️",
          text: `<strong>${user.name}</strong> liked your ${post.postType} post.`,
          recipientId: post.authorId
        });
      }
    }

    this._saveCollection(KEYS.POSTS, this.posts);
    this._notifyPosts();

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("posts").doc(postId).update({ likes: post.likes }).catch(console.error);
    }

    return { liked, count: post.likes.length };
  }

  addComment(postId, commentText) {
    const user = appState.get("currentUser");
    if (!user) throw new Error("Log in to comment.");
    if (!commentText || !commentText.trim()) return null;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    if (!Array.isArray(post.comments)) post.comments = [];

    const newComment = {
      id: "c-" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: commentText.trim(),
      time: "Just now",
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    this._saveCollection(KEYS.POSTS, this.posts);
    this._notifyPosts();

    if (post.authorId !== user.id) {
      this.addNotification({
        type: "comment",
        icon: "💬",
        text: `<strong>${user.name}</strong> commented on your post: "${commentText.slice(0, 40)}..."`,
        recipientId: post.authorId
      });
    }

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("posts").doc(postId).update({ comments: post.comments }).catch(console.error);
    }

    return newComment;
  }

  deletePost(postId) {
    const user = appState.get("currentUser");
    const index = this.posts.findIndex(p => p.id === postId);
    if (index === -1) return false;

    const post = this.posts[index];
    if (post.authorId !== user?.id && user?.role !== "admin") {
      throw new Error("You are not authorized to delete this post.");
    }

    this.posts.splice(index, 1);
    this._saveCollection(KEYS.POSTS, this.posts);
    this._notifyPosts();

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("posts").doc(postId).delete().catch(console.error);
    }

    return true;
  }

  editPost(postId, newContent) {
    const user = appState.get("currentUser");
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    if (post.authorId !== user?.id && user?.role !== "admin") {
      throw new Error("Not authorized to edit this post.");
    }

    post.content = newContent;
    post.edited = true;
    this._saveCollection(KEYS.POSTS, this.posts);
    this._notifyPosts();

    if (isUsingLiveFirebase() && FirebaseClients.firestore) {
      FirebaseClients.firestore.collection("posts").doc(postId).update({ content: newContent, edited: true }).catch(console.error);
    }

    return post;
  }

  onPostsSnapshot(callback) {
    this.postsListeners.add(callback);
    callback(this.posts);
    return () => this.postsListeners.delete(callback);
  }

  _notifyPosts() {
    this.postsListeners.forEach(cb => cb(this.posts));
  }

  /* ----------------------------------------------------------------------
     OPPORTUNITIES
     ---------------------------------------------------------------------- */
  getOpportunities({ category = "all", search = "", sortBy = "deadline" } = {}) {
    let list = [...this.opportunities];

    if (category && category !== "all") {
      list = list.filter(o => o.opportunityType.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "deadline") {
      list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    }

    return list;
  }

  toggleSaveOpportunity(oppId) {
    const opp = this.opportunities.find(o => o.id === oppId);
    if (!opp) return false;
    opp.saved = !opp.saved;
    this._saveCollection(KEYS.OPPORTUNITIES, this.opportunities);
    return opp.saved;
  }

  addOpportunity(oppData) {
    const newOpp = {
      id: "opp-" + Date.now(),
      saved: false,
      postedDate: new Date().toISOString().split("T")[0],
      ...oppData
    };
    this.opportunities.unshift(newOpp);
    this._saveCollection(KEYS.OPPORTUNITIES, this.opportunities);
    return newOpp;
  }

  deleteOpportunity(oppId) {
    const index = this.opportunities.findIndex(o => o.id === oppId);
    if (index !== -1) {
      this.opportunities.splice(index, 1);
      this._saveCollection(KEYS.OPPORTUNITIES, this.opportunities);
      return true;
    }
    return false;
  }

  /* ----------------------------------------------------------------------
     CIRCLES
     ---------------------------------------------------------------------- */
  getCircles(search = "") {
    let list = [...this.circles];
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    return list;
  }

  getCircleById(id) {
    return this.circles.find(c => c.id === id) || null;
  }

  toggleJoinCircle(circleId) {
    const circle = this.circles.find(c => c.id === circleId);
    if (!circle) return false;
    circle.isJoined = !circle.isJoined;
    circle.membersCount += circle.isJoined ? 1 : -1;
    this._saveCollection(KEYS.CIRCLES, this.circles);
    return circle.isJoined;
  }

  createCircle(data) {
    const user = appState.get("currentUser");
    const newCircle = {
      id: "circle-" + Date.now(),
      name: data.name,
      category: data.category || "Programming",
      description: data.description,
      cover: data.cover || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      creatorId: user?.id || "usr-1",
      creatorName: user?.name || "Student Leader",
      membersCount: 1,
      isJoined: true
    };
    this.circles.unshift(newCircle);
    this._saveCollection(KEYS.CIRCLES, this.circles);
    return newCircle;
  }

  /* ----------------------------------------------------------------------
     EVENTS
     ---------------------------------------------------------------------- */
  getEvents() {
    return [...this.events];
  }

  toggleRsvpEvent(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return false;
    evt.rsvp = !evt.rsvp;
    this._saveCollection(KEYS.EVENTS, this.events);
    return evt.rsvp;
  }

  createEvent(data) {
    const newEvt = {
      id: "evt-" + Date.now(),
      rsvp: true,
      ...data
    };
    this.events.unshift(newEvt);
    this._saveCollection(KEYS.EVENTS, this.events);
    return newEvt;
  }

  /* ----------------------------------------------------------------------
     RESEARCH HUB
     ---------------------------------------------------------------------- */
  getResearchProjects(search = "") {
    let list = [...this.research];
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.field.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.interests.some(i => i.toLowerCase().includes(q))
      );
    }
    return list;
  }

  publishResearch(data) {
    const user = appState.get("currentUser");
    const newResearch = {
      id: "res-" + Date.now(),
      authorId: user?.id || "usr-1",
      authorName: user?.name || "Student Researcher",
      authorUniversity: user?.university || "University",
      teamSizeCurrent: 1,
      ...data
    };
    this.research.unshift(newResearch);
    this._saveCollection(KEYS.RESEARCH, this.research);
    return newResearch;
  }

  joinResearchTeam(researchId) {
    const res = this.research.find(r => r.id === researchId);
    if (!res) return false;
    if (res.teamSizeCurrent < res.teamSizeRequired) {
      res.teamSizeCurrent += 1;
      this._saveCollection(KEYS.RESEARCH, this.research);
      return true;
    }
    return false;
  }

  /* ----------------------------------------------------------------------
     CONNECTIONS
     ---------------------------------------------------------------------- */
  getConnections(userId) {
    const user = authService.getUserById(userId);
    if (!user || !user.connections) return [];
    return user.connections.map(id => authService.getUserById(id)).filter(Boolean);
  }

  sendConnectionRequest(targetId) {
    const user = appState.get("currentUser");
    if (!user) return false;

    // Direct connect or request
    if (!user.connections.includes(targetId)) {
      user.connections.push(targetId);
      authService.updateProfile({ connections: user.connections });

      const targetUser = authService.getUserById(targetId);
      if (targetUser && !targetUser.connections.includes(user.id)) {
        targetUser.connections.push(user.id);
      }

      this.addNotification({
        type: "connection",
        icon: "🤝",
        text: `<strong>${user.name}</strong> connected with you.`,
        recipientId: targetId
      });
      return true;
    }
    return false;
  }

  removeConnection(targetId) {
    const user = appState.get("currentUser");
    if (!user) return false;
    user.connections = user.connections.filter(id => id !== targetId);
    authService.updateProfile({ connections: user.connections });
    return true;
  }

  /* ----------------------------------------------------------------------
     MESSAGING
     ---------------------------------------------------------------------- */
  getConversations() {
    return [...this.conversations];
  }

  getConversationById(convId) {
    return this.conversations.find(c => c.id === convId) || null;
  }

  sendMessage(convId, text) {
    const user = appState.get("currentUser");
    if (!user || !text.trim()) return null;

    const conv = this.conversations.find(c => c.id === convId);
    if (!conv) return null;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: "m-" + Date.now(),
      senderId: user.id,
      text: text.trim(),
      time: timeStr
    };

    conv.messages.push(newMsg);
    conv.lastMessage = text.trim();
    conv.lastTime = timeStr;
    conv.unread = false;

    this._saveCollection(KEYS.CONVERSATIONS, this.conversations);

    // Notify active conversation listeners
    if (this.messagesListeners.has(convId)) {
      this.messagesListeners.get(convId).forEach(cb => cb(conv.messages));
    }

    return newMsg;
  }

  startConversationWith(studentId) {
    const target = authService.getUserById(studentId);
    if (!target) return null;

    let existing = this.conversations.find(c => c.partnerId === studentId);
    if (existing) return existing;

    const newConv = {
      id: "conv-" + Date.now(),
      partnerId: target.id,
      partnerName: target.name,
      partnerAvatar: target.avatar,
      partnerUniversity: target.university,
      lastMessage: "Conversation started",
      lastTime: "Just now",
      unread: false,
      messages: []
    };

    this.conversations.unshift(newConv);
    this._saveCollection(KEYS.CONVERSATIONS, this.conversations);
    return newConv;
  }

  onMessagesSnapshot(convId, callback) {
    if (!this.messagesListeners.has(convId)) {
      this.messagesListeners.set(convId, new Set());
    }
    this.messagesListeners.get(convId).add(callback);
    const conv = this.getConversationById(convId);
    if (conv) callback(conv.messages);
    return () => this.messagesListeners.get(convId)?.delete(callback);
  }

  /* ----------------------------------------------------------------------
     NOTIFICATIONS
     ---------------------------------------------------------------------- */
  getNotifications() {
    return [...this.notifications];
  }

  addNotification({ type = "info", icon = "🔔", text, recipientId }) {
    const current = appState.get("currentUser");
    // If targeted at someone else, skip local notification if we aren't that person
    if (recipientId && current && recipientId !== current.id) {
      return;
    }

    const newNotif = {
      id: "notif-" + Date.now(),
      type,
      icon,
      text,
      time: "Just now",
      unread: true,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotif);
    this._saveCollection(KEYS.NOTIFICATIONS, this.notifications);

    const unreadCount = this.notifications.filter(n => n.unread).length;
    appState.set("unreadNotificationsCount", unreadCount);
    this.notificationsListeners.forEach(cb => cb(this.notifications));
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => (n.unread = false));
    this._saveCollection(KEYS.NOTIFICATIONS, this.notifications);
    appState.set("unreadNotificationsCount", 0);
    this.notificationsListeners.forEach(cb => cb(this.notifications));
  }

  onNotificationsSnapshot(callback) {
    this.notificationsListeners.add(callback);
    callback(this.notifications);
    return () => this.notificationsListeners.delete(callback);
  }

  /* ----------------------------------------------------------------------
     REPORTS & SAFETY
     ---------------------------------------------------------------------- */
  createReport({ targetType, targetId, targetPreview, category, reason }) {
    const user = appState.get("currentUser");
    const newReport = {
      id: "rep-" + Date.now(),
      targetType,
      targetId,
      targetPreview: targetPreview || "Reported Item",
      reportedBy: user?.id || "anonymous",
      reporterName: user?.name || "Anonymous Student",
      category,
      reason,
      timestamp: new Date().toLocaleString(),
      status: "pending"
    };

    this.reports.unshift(newReport);
    this._saveCollection(KEYS.REPORTS, this.reports);
    return newReport;
  }

  getReports() {
    return [...this.reports];
  }

  resolveReport(reportId, action = "dismiss") {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = action === "takedown" ? "taken_down" : "dismissed";
    report.resolvedAt = new Date().toLocaleString();

    // If takedown, remove target if it's a post
    if (action === "takedown" && report.targetType === "post") {
      this.posts = this.posts.filter(p => p.id !== report.targetId);
      this._saveCollection(KEYS.POSTS, this.posts);
      this._notifyPosts();
    }

    this._saveCollection(KEYS.REPORTS, this.reports);
    return true;
  }

  /* ----------------------------------------------------------------------
     PLATFORM STATS FOR ADMIN
     ---------------------------------------------------------------------- */
  getPlatformStats() {
    const allUsers = authService.getAllUsers();
    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.online).length + 4,
      totalPosts: this.posts.length,
      totalOpportunities: this.opportunities.length,
      totalEvents: this.events.length,
      totalCircles: this.circles.length,
      pendingReports: this.reports.filter(r => r.status === "pending").length
    };
  }
}

export const dbService = new DatabaseService();
