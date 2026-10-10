/* ==========================================================================
   CampusLink - Helper Utilities & Smart Recommendations Engine
   ========================================================================== */

import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function calculateDeadlineStatus(deadlineDateStr) {
  if (!deadlineDateStr) return { isExpired: false, text: "Ongoing", statusClass: "open" };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDateStr);
  deadline.setHours(23, 59, 59, 999);

  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { isExpired: true, text: "Expired", statusClass: "expired", daysLeft: diffDays };
  } else if (diffDays <= 7) {
    return {
      isExpired: false,
      text: diffDays === 0 ? "Deadline Today" : `${diffDays} days left`,
      statusClass: "urgent",
      daysLeft: diffDays
    };
  } else {
    return {
      isExpired: false,
      text: `${diffDays} days left`,
      statusClass: "open",
      daysLeft: diffDays
    };
  }
}

/**
 * Intelligent Recommendation Engine:
 * Suggests students, opportunities, circles, and events matched to the user's
 * university, faculty, department, skills, and research interests.
 */
export function getSmartRecommendations(user) {
  if (!user) return { students: [], opportunities: [], circles: [], events: [] };

  const allUsers = authService.getAllUsers();
  const allOpps = dbService.getOpportunities();
  const allCircles = dbService.getCircles();
  const allEvents = dbService.getEvents();

  // 1. Student Recommendations (People You May Know)
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const userInterests = (user.researchInterests || []).map(i => i.toLowerCase());

  const scoredStudents = allUsers
    .filter(u => u.id !== user.id && !(user.connections || []).includes(u.id))
    .map(other => {
      let score = 0;
      let reasons = [];

      // Same university bonus (+30)
      if (other.university === user.university) {
        score += 30;
        reasons.push(`Attends ${user.university}`);
      }
      // Same department bonus (+25)
      if (other.department === user.department) {
        score += 25;
        reasons.push(`Studies ${user.department}`);
      }
      // Shared skills (+10 each)
      const otherSkills = (other.skills || []).map(s => s.toLowerCase());
      const commonSkills = userSkills.filter(s => otherSkills.includes(s));
      if (commonSkills.length > 0) {
        score += commonSkills.length * 10;
        reasons.push(`Both know ${commonSkills[0]}`);
      }
      // Shared research interests (+15 each)
      const otherInterests = (other.researchInterests || []).map(i => i.toLowerCase());
      const commonInterests = userInterests.filter(i => otherInterests.includes(i));
      if (commonInterests.length > 0) {
        score += commonInterests.length * 15;
        reasons.push(`Shared research in ${commonInterests[0]}`);
      }

      return { student: other, score, reason: reasons[0] || "University Student" };
    })
    .sort((a, b) => b.score - a.score);

  // 2. Opportunity Recommendations
  const scoredOpps = allOpps
    .map(opp => {
      let score = 0;
      const titleLower = opp.title.toLowerCase();
      const descLower = opp.description.toLowerCase();

      userSkills.forEach(skill => {
        if (titleLower.includes(skill) || descLower.includes(skill)) score += 15;
      });

      // Prefer non-expired
      const status = calculateDeadlineStatus(opp.deadline);
      if (status.isExpired) score -= 50;

      return { opp, score };
    })
    .sort((a, b) => b.score - a.score);

  // 3. Recommended Circles
  const scoredCircles = allCircles
    .filter(c => !c.isJoined)
    .slice(0, 3);

  return {
    students: scoredStudents.slice(0, 5),
    opportunities: scoredOpps.slice(0, 3).map(o => o.opp),
    circles: scoredCircles,
    events: allEvents.slice(0, 3)
  };
}

export function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="color: var(--${type === 'info' ? 'brand-primary' : type})">${icons[type] || icons.info}</div>
    <div class="toast-message">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
