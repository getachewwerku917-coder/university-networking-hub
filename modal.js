/* ==========================================================================
   CampusLink - Modal Controller Component
   Handles all interactive modals (Auth, Post Composer, Edit Profile, Apply, Report, etc.)
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { authService } from "../services/auth-service.js";
import { dbService } from "../services/db-service.js";
import { storageService } from "../services/storage-service.js";
import { escapeHtml, showToast } from "../utils/helpers.js";
import { getActiveFirebaseConfig, saveCustomFirebaseConfig, initFirebase } from "../config/firebase-config.js";
import { DEMO_USERS } from "../models/demo-data.js";

class ModalManager {
  constructor() {
    this.backdrop = null;
  }

  _getOrCreateBackdrop() {
    if (!this.backdrop) {
      this.backdrop = document.getElementById("global-modal-backdrop");
      if (!this.backdrop) {
        this.backdrop = document.createElement("div");
        this.backdrop.id = "global-modal-backdrop";
        this.backdrop.className = "modal-backdrop";
        document.body.appendChild(this.backdrop);

        this.backdrop.addEventListener("click", (e) => {
          if (e.target === this.backdrop) {
            this.close();
          }
        });
      }
    }
    return this.backdrop;
  }

  open(contentHtml, { onAttach = null, maxWidth = "580px" } = {}) {
    const backdrop = this._getOrCreateBackdrop();
    backdrop.innerHTML = `
      <div class="modal-container" style="max-width: ${maxWidth}">
        ${contentHtml}
      </div>
    `;

    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";

    // Auto attach close buttons
    const closeBtns = backdrop.querySelectorAll(".modal-close-trigger");
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    if (onAttach) {
      onAttach(backdrop);
    }
  }

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (this.backdrop) this.backdrop.innerHTML = "";
      }, 250);
    }
  }

  /* ----------------------------------------------------------------------
     AUTH MODAL (Sign Up, Login, Forgot Password)
     ---------------------------------------------------------------------- */
  openAuthModal(initialTab = "login") {
    const html = `
      <div class="modal-header">
        <h3 class="modal-title" id="auth-modal-title">Welcome to CampusLink</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="tabs-nav" style="margin-bottom: var(--space-4);">
          <button class="tab-btn ${initialTab === 'login' ? 'active' : ''}" id="auth-tab-login">Log In</button>
          <button class="tab-btn ${initialTab === 'signup' ? 'active' : ''}" id="auth-tab-signup">Create Account</button>
          <button class="tab-btn ${initialTab === 'forgot' ? 'active' : ''}" id="auth-tab-forgot">Reset Password</button>
        </div>

        <!-- Login Form -->
        <form id="form-login" style="${initialTab !== 'login' ? 'display: none;' : ''}">
          <div class="form-group">
            <label class="form-label" for="login-email">University / Student Email</label>
            <input class="form-input" type="email" id="login-email" placeholder="name@aau.edu.et" value="nahom.tadesse@aau.edu.et" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" placeholder="••••••••" value="password123" required />
          </div>
          <div id="login-error-msg" class="form-error" style="display:none; margin-bottom: var(--space-3);"></div>
          <button type="submit" class="btn btn-primary w-full" id="btn-submit-login">Log In to CampusLink</button>

          <div style="margin-top: var(--space-4); text-align: center; font-size: var(--font-size-xs); color: var(--text-muted);">
            Quick Demo: Default credentials pre-filled for instant testing!
          </div>
        </form>

        <!-- Sign Up Form (Comprehensive Registration) -->
        <form id="form-signup" style="${initialTab !== 'signup' ? 'display: none;' : ''}">
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name *</label>
            <input class="form-input" type="text" id="signup-name" placeholder="Abebe Bikila" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-email">Student Email *</label>
            <input class="form-input" type="email" id="signup-email" placeholder="student@university.edu.et" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-password">Password *</label>
            <input class="form-input" type="password" id="signup-password" minlength="6" placeholder="At least 6 characters" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label" for="signup-uni">University *</label>
              <select class="form-select" id="signup-uni" required>
                <option value="Addis Ababa University">Addis Ababa University (AAU)</option>
                <option value="Addis Ababa Science & Technology University">AASTU</option>
                <option value="Hawassa University">Hawassa University</option>
                <option value="Jimma University">Jimma University</option>
                <option value="Bahir Dar University">Bahir Dar University</option>
                <option value="University of Gondar">University of Gondar</option>
                <option value="Mekelle University">Mekelle University</option>
                <option value="Arba Minch University">Arba Minch University</option>
                <option value="Other African University">Other African University</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-year">Academic Year *</label>
              <select class="form-select" id="signup-year">
                <option value="Year 1">Year 1 (Freshman)</option>
                <option value="Year 2">Year 2 (Sophomore)</option>
                <option value="Year 3" selected>Year 3 (Junior)</option>
                <option value="Year 4">Year 4 (Senior)</option>
                <option value="Year 5">Year 5 (Graduating)</option>
                <option value="Postgraduate / Masters">Masters / PhD</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label" for="signup-faculty">Faculty / College</label>
              <input class="form-input" type="text" id="signup-faculty" placeholder="e.g. Technology / Informatics" />
            </div>
            <div class="form-group">
              <label class="form-label" for="signup-dept">Department *</label>
              <input class="form-input" type="text" id="signup-dept" placeholder="Software Engineering" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-skills">Skills (comma-separated)</label>
            <input class="form-input" type="text" id="signup-skills" placeholder="Python, React, Machine Learning, UI/UX" />
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-interests">Research Interests</label>
            <input class="form-input" type="text" id="signup-interests" placeholder="Natural Language Processing, Cloud Computing" />
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-location">Campus / City Location</label>
            <input class="form-input" type="text" id="signup-location" placeholder="Addis Ababa, Ethiopia" />
          </div>

          <div id="signup-error-msg" class="form-error" style="display:none; margin-bottom: var(--space-3);"></div>
          <button type="submit" class="btn btn-primary w-full" id="btn-submit-signup">Register Student Account</button>
        </form>

        <!-- Forgot Password Form -->
        <form id="form-forgot" style="${initialTab !== 'forgot' ? 'display: none;' : ''}">
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">
            Enter your registered university email to receive a password reset link.
          </p>
          <div class="form-group">
            <label class="form-label" for="forgot-email">Email Address</label>
            <input class="form-input" type="email" id="forgot-email" placeholder="student@aau.edu.et" required />
          </div>
          <div id="forgot-error-msg" class="form-error" style="display:none; margin-bottom: var(--space-3);"></div>
          <button type="submit" class="btn btn-primary w-full">Send Reset Instructions</button>
        </form>
      </div>
    `;

    this.open(html, {
      maxWidth: "520px",
      onAttach: (container) => {
        const tabLogin = container.querySelector("#auth-tab-login");
        const tabSignup = container.querySelector("#auth-tab-signup");
        const tabForgot = container.querySelector("#auth-tab-forgot");
        const formLogin = container.querySelector("#form-login");
        const formSignup = container.querySelector("#form-signup");
        const formForgot = container.querySelector("#form-forgot");
        const title = container.querySelector("#auth-modal-title");

        const switchTab = (tab) => {
          [tabLogin, tabSignup, tabForgot].forEach(b => b.classList.remove("active"));
          formLogin.style.display = tab === "login" ? "block" : "none";
          formSignup.style.display = tab === "signup" ? "block" : "none";
          formForgot.style.display = tab === "forgot" ? "block" : "none";

          if (tab === "login") {
            tabLogin.classList.add("active");
            title.textContent = "Log In to CampusLink";
          } else if (tab === "signup") {
            tabSignup.classList.add("active");
            title.textContent = "Create Student Profile";
          } else {
            tabForgot.classList.add("active");
            title.textContent = "Reset Your Password";
          }
        };

        tabLogin.addEventListener("click", () => switchTab("login"));
        tabSignup.addEventListener("click", () => switchTab("signup"));
        tabForgot.addEventListener("click", () => switchTab("forgot"));

        // Login Submit
        formLogin.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = container.querySelector("#login-email").value.trim();
          const password = container.querySelector("#login-password").value;
          const errBox = container.querySelector("#login-error-msg");
          try {
            errBox.style.display = "none";
            await authService.login(email, password);
            showToast("Welcome back!", "success");
            this.close();
            window.location.hash = "#/feed";
          } catch (err) {
            errBox.textContent = err.message;
            errBox.style.display = "block";
          }
        });

        // Sign Up Submit
        formSignup.addEventListener("submit", async (e) => {
          e.preventDefault();
          const name = container.querySelector("#signup-name").value.trim();
          const email = container.querySelector("#signup-email").value.trim();
          const password = container.querySelector("#signup-password").value;
          const university = container.querySelector("#signup-uni").value;
          const year = container.querySelector("#signup-year").value;
          const faculty = container.querySelector("#signup-faculty").value.trim();
          const department = container.querySelector("#signup-dept").value.trim();
          const skills = container.querySelector("#signup-skills").value.split(",").map(s => s.trim()).filter(Boolean);
          const researchInterests = container.querySelector("#signup-interests").value.split(",").map(s => s.trim()).filter(Boolean);
          const location = container.querySelector("#signup-location").value.trim();
          const errBox = container.querySelector("#signup-error-msg");

          try {
            errBox.style.display = "none";
            await authService.signUp({
              name,
              email,
              password,
              university,
              year,
              faculty,
              department,
              skills,
              researchInterests,
              location
            });
            showToast("Account successfully created!", "success");
            this.close();
            window.location.hash = "#/profile";
          } catch (err) {
            errBox.textContent = err.message;
            errBox.style.display = "block";
          }
        });

        // Forgot Submit
        formForgot.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = container.querySelector("#forgot-email").value.trim();
          const errBox = container.querySelector("#forgot-error-msg");
          try {
            errBox.style.display = "none";
            await authService.sendPasswordReset(email);
            showToast("Password reset instructions sent to your email.", "info");
            switchTab("login");
          } catch (err) {
            errBox.textContent = err.message;
            errBox.style.display = "block";
          }
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     POST COMPOSER MODAL
     ---------------------------------------------------------------------- */
  openPostComposerModal() {
    const user = appState.get("currentUser");
    if (!user) {
      this.openAuthModal("login");
      return;
    }

    let uploadedMediaUrl = null;

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Create a Post</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
          <div class="avatar avatar-sm">
            <img src="${user.avatar}" alt="${escapeHtml(user.name)}" />
          </div>
          <div>
            <div style="font-weight: 700; font-size: var(--font-size-sm);">${escapeHtml(user.name)}</div>
            <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${escapeHtml(user.university)}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="composer-post-type">Post Category</label>
          <select class="form-select" id="composer-post-type">
            <option value="General">General Discussion</option>
            <option value="Academic">Academic Resource</option>
            <option value="Research">Research Hub Collaboration</option>
            <option value="Opportunity">Opportunity / Internship Alert</option>
            <option value="Event">Event Announcement</option>
            <option value="Question">Student Question / Advice</option>
            <option value="Achievement">Achievement / Win</option>
          </select>
        </div>

        <div class="form-group">
          <textarea 
            class="form-textarea" 
            id="composer-text" 
            placeholder="Share an achievement, ask a question, or post academic resources..." 
            rows="5"
            style="min-height: 120px;"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="composer-hashtags">Hashtags (space or comma-separated)</label>
          <input class="form-input" type="text" id="composer-hashtags" placeholder="#SoftwareEngineering #Research #AAU" />
        </div>

        <!-- Attachment Preview -->
        <div id="media-preview-container" style="display: none; margin-bottom: var(--space-3); position: relative;">
          <img id="media-preview-img" style="max-height: 200px; border-radius: var(--radius-md); object-fit: cover;" />
          <button id="btn-remove-media" class="btn btn-sm btn-danger" style="position: absolute; top: 8px; right: 8px; padding: 2px 6px;">✕</button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-light); padding-top: var(--space-3);">
          <label class="btn btn-outline btn-sm" style="cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Add Image
            <input type="file" id="composer-file-input" accept="image/*" style="display: none;" />
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost modal-close-trigger">Cancel</button>
        <button class="btn btn-primary" id="btn-publish-post">Publish Post</button>
      </div>
    `;

    this.open(html, {
      onAttach: (container) => {
        const fileInput = container.querySelector("#composer-file-input");
        const previewContainer = container.querySelector("#media-preview-container");
        const previewImg = container.querySelector("#media-preview-img");
        const removeMediaBtn = container.querySelector("#btn-remove-media");
        const publishBtn = container.querySelector("#btn-publish-post");

        fileInput.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              uploadedMediaUrl = await storageService.uploadImage(file, "posts");
              previewImg.src = uploadedMediaUrl;
              previewContainer.style.display = "block";
            } catch (err) {
              showToast(err.message, "error");
            }
          }
        });

        removeMediaBtn.addEventListener("click", () => {
          uploadedMediaUrl = null;
          previewContainer.style.display = "none";
          fileInput.value = "";
        });

        publishBtn.addEventListener("click", () => {
          const text = container.querySelector("#composer-text").value.trim();
          if (!text) {
            showToast("Please enter some content for your post.", "warning");
            return;
          }

          const postType = container.querySelector("#composer-post-type").value;
          const rawTags = container.querySelector("#composer-hashtags").value;
          const hashtags = rawTags
            .split(/[\s,]+/)
            .map(t => (t.startsWith("#") ? t : `#${t}`).trim())
            .filter(t => t.length > 1);

          dbService.addPost({
            content: text,
            postType,
            media: uploadedMediaUrl,
            hashtags
          });

          showToast("Post shared with university network!", "success");
          this.close();
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     EDIT PROFILE MODAL
     ---------------------------------------------------------------------- */
  openEditProfileModal() {
    const user = appState.get("currentUser");
    if (!user) return;

    let updatedAvatarUrl = user.avatar;

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Edit Professional Profile</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Avatar preview & Upload -->
        <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-5);">
          <div class="avatar avatar-lg">
            <img id="edit-avatar-preview" src="${user.avatar}" alt="${escapeHtml(user.name)}" />
          </div>
          <div>
            <label class="btn btn-outline btn-sm" style="cursor: pointer;">
              Upload New Photo
              <input type="file" id="edit-avatar-file" accept="image/*" style="display: none;" />
            </label>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">PNG, JPG up to 5MB</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-name">Full Name</label>
          <input class="form-input" type="text" id="edit-name" value="${escapeHtml(user.name)}" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-headline">Headline</label>
          <input class="form-input" type="text" id="edit-headline" value="${escapeHtml(user.headline || '')}" placeholder="Software Engineering Student @ AAU | Distributed Systems" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div class="form-group">
            <label class="form-label" for="edit-university">University</label>
            <input class="form-input" type="text" id="edit-university" value="${escapeHtml(user.university)}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-year">Year</label>
            <input class="form-input" type="text" id="edit-year" value="${escapeHtml(user.year || 'Year 3')}" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div class="form-group">
            <label class="form-label" for="edit-faculty">Faculty</label>
            <input class="form-input" type="text" id="edit-faculty" value="${escapeHtml(user.faculty || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-department">Department</label>
            <input class="form-input" type="text" id="edit-department" value="${escapeHtml(user.department || '')}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-bio">Bio / About</label>
          <textarea class="form-textarea" id="edit-bio" rows="4">${escapeHtml(user.bio || '')}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-skills">Skills (comma-separated)</label>
          <input class="form-input" type="text" id="edit-skills" value="${escapeHtml((user.skills || []).join(', '))}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-interests">Research Interests (comma-separated)</label>
          <input class="form-input" type="text" id="edit-interests" value="${escapeHtml((user.researchInterests || []).join(', '))}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-location">Location</label>
          <input class="form-input" type="text" id="edit-location" value="${escapeHtml(user.location || '')}" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost modal-close-trigger">Cancel</button>
        <button class="btn btn-primary" id="btn-save-profile">Save Changes</button>
      </div>
    `;

    this.open(html, {
      onAttach: (container) => {
        const fileInput = container.querySelector("#edit-avatar-file");
        const previewImg = container.querySelector("#edit-avatar-preview");
        const saveBtn = container.querySelector("#btn-save-profile");

        fileInput.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              updatedAvatarUrl = await storageService.uploadImage(file, "avatars");
              previewImg.src = updatedAvatarUrl;
            } catch (err) {
              showToast(err.message, "error");
            }
          }
        });

        saveBtn.addEventListener("click", () => {
          const name = container.querySelector("#edit-name").value.trim();
          const headline = container.querySelector("#edit-headline").value.trim();
          const university = container.querySelector("#edit-university").value.trim();
          const year = container.querySelector("#edit-year").value.trim();
          const faculty = container.querySelector("#edit-faculty").value.trim();
          const department = container.querySelector("#edit-department").value.trim();
          const bio = container.querySelector("#edit-bio").value.trim();
          const location = container.querySelector("#edit-location").value.trim();
          const skills = container.querySelector("#edit-skills").value.split(",").map(s => s.trim()).filter(Boolean);
          const researchInterests = container.querySelector("#edit-interests").value.split(",").map(s => s.trim()).filter(Boolean);

          authService.updateProfile({
            name,
            headline,
            university,
            year,
            faculty,
            department,
            bio,
            location,
            skills,
            researchInterests,
            avatar: updatedAvatarUrl
          });

          showToast("Profile updated successfully!", "success");
          this.close();
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     REPORT MODAL
     ---------------------------------------------------------------------- */
  openReportModal(targetType, targetId, targetPreview) {
    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Report Content</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">
          Help keep CampusLink safe for all students. Our moderation team reviews reported items in accordance with academic community standards.
        </p>

        <div style="background: var(--bg-surface-hover); padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: var(--space-4);">
          <strong>Item Preview:</strong> ${escapeHtml(targetPreview || "Selected Item")}
        </div>

        <div class="form-group">
          <label class="form-label" for="report-category">Report Category</label>
          <select class="form-select" id="report-category">
            <option value="Spam">Spam or unwanted advertising</option>
            <option value="Fake information">Fake academic credentials / False info</option>
            <option value="Harassment">Harassment or bullying</option>
            <option value="Inappropriate content">Inappropriate / Obscene content</option>
            <option value="Scam">Fraudulent opportunity or payment scam</option>
            <option value="Other">Other violation</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="report-reason">Specific details</label>
          <textarea class="form-textarea" id="report-reason" placeholder="Please describe why this content violates community standards..." rows="3"></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost modal-close-trigger">Cancel</button>
        <button class="btn btn-danger" id="btn-submit-report">Submit Report</button>
      </div>
    `;

    this.open(html, {
      maxWidth: "480px",
      onAttach: (container) => {
        container.querySelector("#btn-submit-report").addEventListener("click", () => {
          const category = container.querySelector("#report-category").value;
          const reason = container.querySelector("#report-reason").value.trim();

          dbService.createReport({
            targetType,
            targetId,
            targetPreview,
            category,
            reason
          });

          showToast("Report submitted for administrator review.", "info");
          this.close();
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     APPLY OPPORTUNITY MODAL
     ---------------------------------------------------------------------- */
  openApplyModal(opp) {
    const user = appState.get("currentUser");

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Apply for ${escapeHtml(opp.title)}</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <div style="margin-bottom: var(--space-4);">
          <div style="font-size: var(--font-size-md); font-weight: 700;">${escapeHtml(opp.organization)}</div>
          <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${escapeHtml(opp.location)} • ${escapeHtml(opp.opportunityType)}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Applicant Name</label>
          <input class="form-input" type="text" value="${escapeHtml(user?.name || '')}" readonly />
        </div>

        <div class="form-group">
          <label class="form-label">University & Department</label>
          <input class="form-input" type="text" value="${escapeHtml(user ? `${user.university} - ${user.department}` : '')}" readonly />
        </div>

        <div class="form-group">
          <label class="form-label">Cover Note / Why are you a great match?</label>
          <textarea class="form-textarea" placeholder="Highlight relevant coursework, projects, or programming skills..." rows="4"></textarea>
        </div>

        <div style="background: var(--bg-surface-hover); border-radius: var(--radius-md); padding: var(--space-3); font-size: var(--font-size-xs); color: var(--text-secondary);">
          Your CampusLink profile and skills will be automatically packaged into your student application dossier.
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost modal-close-trigger">Cancel</button>
        <button class="btn btn-primary" id="btn-confirm-apply">
          Submit Application
        </button>
      </div>
    `;

    this.open(html, {
      maxWidth: "520px",
      onAttach: (container) => {
        container.querySelector("#btn-confirm-apply").addEventListener("click", () => {
          showToast(`Application submitted to ${opp.organization}!`, "success");
          if (opp.applicationLink && opp.applicationLink !== "#") {
            window.open(opp.applicationLink, "_blank");
          }
          this.close();
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     SWITCH DEMO PERSONA MODAL
     ---------------------------------------------------------------------- */
  openSwitchUserModal() {
    const current = appState.get("currentUser");

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Switch Demo Persona</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">
          Quickly test the platform from different student viewpoints or as the platform administrator:
        </p>

        <div style="display: flex; flex-direction: column; gap: var(--space-2); max-height: 380px; overflow-y: auto;">
          ${DEMO_USERS.map(u => `
            <div class="conversation-item switch-user-item ${u.id === current?.id ? 'active' : ''}" data-uid="${u.id}" style="border-radius: var(--radius-md); padding: var(--space-3);">
              <div class="avatar avatar-sm">
                <img src="${u.avatar}" alt="${escapeHtml(u.name)}" />
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <strong style="font-size: var(--font-size-sm);">${escapeHtml(u.name)}</strong>
                  ${u.role === 'admin' ? '<span class="badge badge-warning">Admin</span>' : `<span class="badge badge-neutral">${escapeHtml(u.year || 'Student')}</span>`}
                </div>
                <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(u.university)} • ${escapeHtml(u.department)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.open(html, {
      maxWidth: "500px",
      onAttach: (container) => {
        const items = container.querySelectorAll(".switch-user-item");
        items.forEach(el => {
          el.addEventListener("click", () => {
            const uid = el.getAttribute("data-uid");
            authService.switchDemoUser(uid);
            showToast(`Switched persona to ${authService.getUserById(uid).name}`, "success");
            this.close();
            window.location.reload();
          });
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     FIREBASE CONFIG & STATUS MODAL
     ---------------------------------------------------------------------- */
  openFirebaseConfigModal() {
    const config = getActiveFirebaseConfig();

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Firebase Architecture & Configuration</h3>
        <button class="modal-close modal-close-trigger" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <div style="padding: var(--space-3); background: var(--bg-surface-hover); border-radius: var(--radius-md); margin-bottom: var(--space-4); font-size: var(--font-size-xs); line-height: 1.5;">
          <strong>⚡ Dual-Mode Engine:</strong> CampusLink features a hybrid Firestore layer. When your Firebase keys are plugged in, it communicates live with Firebase Auth, Firestore, and Storage. When testing offline or locally, it runs on our reactive simulated store with full persistence!
        </div>

        <form id="form-firebase-config">
          <div class="form-group">
            <label class="form-label" for="cfg-api-key">API Key</label>
            <input class="form-input" type="text" id="cfg-api-key" value="${escapeHtml(config.apiKey)}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="cfg-auth-domain">Auth Domain</label>
            <input class="form-input" type="text" id="cfg-auth-domain" value="${escapeHtml(config.authDomain)}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="cfg-proj-id">Project ID</label>
            <input class="form-input" type="text" id="cfg-proj-id" value="${escapeHtml(config.projectId)}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="cfg-bucket">Storage Bucket</label>
            <input class="form-input" type="text" id="cfg-bucket" value="${escapeHtml(config.storageBucket)}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="cfg-app-id">App ID</label>
            <input class="form-input" type="text" id="cfg-app-id" value="${escapeHtml(config.appId)}" />
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0;">
            <button type="button" class="btn btn-ghost modal-close-trigger">Close</button>
            <button type="submit" class="btn btn-primary">Save Firebase Settings</button>
          </div>
        </form>
      </div>
    `;

    this.open(html, {
      maxWidth: "540px",
      onAttach: (container) => {
        container.querySelector("#form-firebase-config").addEventListener("submit", (e) => {
          e.preventDefault();
          const newCfg = {
            apiKey: container.querySelector("#cfg-api-key").value.trim(),
            authDomain: container.querySelector("#cfg-auth-domain").value.trim(),
            projectId: container.querySelector("#cfg-proj-id").value.trim(),
            storageBucket: container.querySelector("#cfg-bucket").value.trim(),
            appId: container.querySelector("#cfg-app-id").value.trim()
          };
          saveCustomFirebaseConfig(newCfg);
          initFirebase();
          showToast("Firebase configuration saved! Reloading...", "success");
          this.close();
          setTimeout(() => window.location.reload(), 400);
        });
      }
    });
  }
}

export const modal = new ModalManager();
