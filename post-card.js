/* ==========================================================================
   CampusLink - Post Card Component
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { dbService } from "../services/db-service.js";
import { escapeHtml, showToast } from "../utils/helpers.js";
import { modal } from "./modal.js";

export function renderPostCard(post) {
  const currentUser = appState.get("currentUser");
  const isLiked = currentUser && Array.isArray(post.likes) && post.likes.includes(currentUser.id);
  const likesCount = (post.likes || []).length;
  const commentsCount = (post.comments || []).length;
  const isAuthor = currentUser && post.authorId === currentUser.id;
  const isAdmin = currentUser?.role === "admin";

  return `
    <article class="post-card" id="post-card-${post.id}">
      <!-- Header -->
      <div class="post-header">
        <div class="post-author-info">
          <a href="#/profile/${post.authorId}" class="avatar avatar-md">
            <img src="${post.authorAvatar}" alt="${escapeHtml(post.authorName)}" />
          </a>
          <div class="author-name-group">
            <div style="display: flex; align-items: center; gap: 6px;">
              <a href="#/profile/${post.authorId}" style="color: inherit; font-weight: 700;">
                ${escapeHtml(post.authorName)}
              </a>
              <span class="post-type-badge type-${post.postType}">${post.postType}</span>
            </div>
            <div class="author-meta">
              ${escapeHtml(post.authorHeadline || `${post.department} @ ${post.university}`)}
            </div>
            <div class="author-meta" style="color: var(--text-muted); font-size: 11px;">
              ${escapeHtml(post.university)} • <span>${post.timestamp || "Recently"}</span>
              ${post.edited ? ' • <span style="font-style: italic;">(edited)</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Options Dropdown -->
        <div class="dropdown">
          <button class="btn btn-ghost btn-icon-sm post-options-btn" data-post-id="${post.id}" title="Post options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div class="dropdown-menu">
            ${(isAuthor || isAdmin) ? `
              <button class="dropdown-item btn-edit-post" data-post-id="${post.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Edit Post
              </button>
              <button class="dropdown-item btn-delete-post" data-post-id="${post.id}" style="color: var(--danger);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete Post
              </button>
            ` : ""}
            <button class="dropdown-item btn-report-post" data-post-id="${post.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              Report Post
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="post-content">
        ${escapeHtml(post.content)}
      </div>

      <!-- Hashtags -->
      ${Array.isArray(post.hashtags) && post.hashtags.length > 0 ? `
        <div class="post-hashtags">
          ${post.hashtags.map(tag => `<span class="post-hashtag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      ` : ""}

      <!-- Media Image (if any) -->
      ${post.media ? `
        <div class="post-media-container">
          <img src="${post.media}" alt="Post image attachment" loading="lazy" />
        </div>
      ` : ""}

      <!-- Stats Bar -->
      <div class="post-stats">
        <div>
          ${likesCount > 0 ? `<span>❤️ ${likesCount} ${likesCount === 1 ? 'like' : 'likes'}</span>` : '<span style="color:var(--text-muted);">Be the first to like</span>'}
        </div>
        <div>
          <span>${commentsCount} ${commentsCount === 1 ? 'comment' : 'comments'}</span> • 
          <span>${post.sharesCount || 0} shares</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="post-actions-bar">
        <button class="post-action-btn btn-like-post ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>${isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button class="post-action-btn btn-toggle-comments" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span>Comment</span>
        </button>

        <button class="post-action-btn btn-share-post" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>Share</span>
        </button>
      </div>

      <!-- Comments Drawer (collapsible) -->
      <div class="comments-section" id="comments-section-${post.id}" style="display: none;">
        <!-- Input -->
        ${currentUser ? `
          <div class="comment-input-box">
            <div class="avatar avatar-xs">
              <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" />
            </div>
            <input type="text" class="comment-input" placeholder="Write a constructive student comment..." id="input-comment-${post.id}" />
            <button class="btn btn-primary btn-sm btn-submit-comment" data-post-id="${post.id}">Send</button>
          </div>
        ` : `
          <div style="font-size: var(--font-size-xs); color: var(--text-muted); text-align: center;">
            <a href="javascript:void(0)" class="trigger-login">Log in</a> to join this academic discussion.
          </div>
        `}

        <!-- Comments List -->
        <div class="comments-list" id="comments-list-${post.id}" style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-2);">
          ${(post.comments || []).map(c => `
            <div class="comment-item">
              <div class="avatar avatar-xs">
                <img src="${c.authorAvatar}" alt="${escapeHtml(c.authorName)}" />
              </div>
              <div class="comment-bubble">
                <div class="comment-header">
                  <span class="comment-author">${escapeHtml(c.authorName)}</span>
                  <span class="comment-time">${c.time || "recently"}</span>
                </div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}

export function attachPostCardListeners(container = document) {
  // Like Button
  container.querySelectorAll(".btn-like-post").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      try {
        dbService.toggleLikePost(postId);
      } catch (err) {
        showToast(err.message, "warning");
      }
    });
  });

  // Toggle Comments
  container.querySelectorAll(".btn-toggle-comments").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const drawer = document.getElementById(`comments-section-${postId}`);
      if (drawer) {
        drawer.style.display = drawer.style.display === "none" ? "flex" : "none";
      }
    });
  });

  // Submit Comment
  container.querySelectorAll(".btn-submit-comment").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const input = document.getElementById(`input-comment-${postId}`);
      if (input && input.value.trim()) {
        dbService.addComment(postId, input.value.trim());
        input.value = "";
      }
    });
  });

  // Share
  container.querySelectorAll(".btn-share-post").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast("Post link copied to clipboard!", "success");
    });
  });

  // Dropdown menus
  container.querySelectorAll(".post-options-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = btn.closest(".dropdown");
      dropdown.classList.toggle("open");
    });
  });

  // Delete Post
  container.querySelectorAll(".btn-delete-post").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const postId = btn.getAttribute("data-post-id");
      if (confirm("Are you sure you want to delete this post?")) {
        dbService.deletePost(postId);
        showToast("Post deleted.", "info");
      }
    });
  });

  // Edit Post
  container.querySelectorAll(".btn-edit-post").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const post = dbService.getPosts().find(p => p.id === postId);
      if (post) {
        const newText = prompt("Edit your post content:", post.content);
        if (newText !== null && newText.trim()) {
          dbService.editPost(postId, newText.trim());
          showToast("Post updated.", "success");
        }
      }
    });
  });

  // Report Post
  container.querySelectorAll(".btn-report-post").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const post = dbService.getPosts().find(p => p.id === postId);
      modal.openReportModal("post", postId, post ? post.content.slice(0, 60) : "Post");
    });
  });

  // Trigger login from comment placeholder
  container.querySelectorAll(".trigger-login").forEach(btn => {
    btn.addEventListener("click", () => modal.openAuthModal("login"));
  });
}

