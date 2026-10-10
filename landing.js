/* ==========================================================================
   CampusLink - Landing Page View
   ========================================================================== */

import { modal } from "../components/modal.js";
import { appState } from "../state/app-state.js";
import { router } from "../utils/router.js";

export function renderLandingPage() {
  const user = appState.get("currentUser");

  return `
    <div class="landing-wrapper">
      <!-- Landing Header -->
      <header class="landing-nav">
        <div class="landing-nav-container">
          <a href="#/landing" class="navbar-brand">
            <div class="navbar-logo-icon">CL</div>
            <span>CampusLink</span>
          </a>

          <div class="landing-links">
            <a href="#features" class="landing-link">Features</a>
            <a href="#opportunities" class="landing-link">Opportunities</a>
            <a href="#circles" class="landing-link">Circles</a>
            <a href="#research" class="landing-link">Research Hub</a>
            <a href="#testimonials" class="landing-link">Stories</a>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-3);">
            ${user ? `
              <a href="#/feed" class="btn btn-primary btn-sm">Go to Campus Feed →</a>
            ` : `
              <button class="btn btn-ghost btn-sm" id="btn-landing-login">Log In</button>
              <button class="btn btn-primary btn-sm" id="btn-landing-signup">Get Started</button>
            `}
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-badge">
          <span>🎓 The Modern University Network for Africa</span>
        </div>

        <h1 class="hero-title">
          Connect. Learn. <span class="hero-title-highlight">Grow.</span>
        </h1>

        <p class="hero-subtitle">
          Your professional network for university life, verified opportunities, collaborative research, and career growth across Ethiopia and Africa.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" id="btn-hero-get-started">
            Get Started Free
          </button>
          <a href="#/opportunities" class="btn btn-outline btn-lg">
            Explore Opportunities →
          </a>
        </div>

        <!-- Metric Banner -->
        <div class="hero-stats-banner">
          <div class="hero-stat-item">
            <div class="hero-stat-number">8+</div>
            <div class="hero-stat-label">Universities Connected</div>
          </div>
          <div class="hero-stat-item">
            <div class="hero-stat-number">500+</div>
            <div class="hero-stat-label">Active Student Leaders</div>
          </div>
          <div class="hero-stat-item">
            <div class="hero-stat-number">100+</div>
            <div class="hero-stat-label">Verified Internships</div>
          </div>
          <div class="hero-stat-item">
            <div class="hero-stat-number">40+</div>
            <div class="hero-stat-label">Cross-Campus Research Teams</div>
          </div>
        </div>
      </section>

      <!-- Section: How CampusLink Works -->
      <section class="landing-section" id="features">
        <div class="section-header">
          <div class="section-eyebrow">How It Works</div>
          <h2 class="section-title">Built specifically for the university journey</h2>
          <p class="section-desc">From your freshman year to your postgraduate research and first industry role.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3 class="step-title">Create Student Profile</h3>
            <p class="step-text">Showcase your university, department, technical projects, academic achievements, and research interests to peers and recruiters.</p>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <h3 class="step-title">Join Study Circles</h3>
            <p class="step-text">Collaborate inside focused academic communities for Software Engineering, FinTech, AI, Entrepreneurship, and competitive coding.</p>
          </div>

          <div class="step-card">
            <div class="step-number">3</div>
            <h3 class="step-title">Discover Opportunities</h3>
            <p class="step-text">Access internships, scholarships, competitions, and research assistantships verified with top African employers.</p>
          </div>

          <div class="step-card">
            <div class="step-number">4</div>
            <h3 class="step-title">Form Research Teams</h3>
            <p class="step-text">Post capstone project abstracts, find cross-disciplinary collaborators, and team up for national competitions.</p>
          </div>
        </div>
      </section>

      <!-- Section: Feature Highlights Grid -->
      <section class="landing-section" style="background-color: var(--bg-surface-hover); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
        <div class="section-header">
          <div class="section-eyebrow">Platform Ecosystem</div>
          <h2 class="section-title">LinkedIn meets student community + opportunity platform</h2>
          <p class="section-desc">Tailored tools designed for university students in Ethiopia and across the continent.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">💼</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Opportunities Board</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Internships, graduate trainee programs, international scholarships, and fellowships with automated deadline tracking so you never miss a cutoff.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔬</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Dedicated Research Hub</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Publish capstone ideas, find peer co-authors in Amharic NLP, GIS, or biomedical informatics, and recruit team members with complementary skills.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Academic Circles</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Private and open study circles across campuses. Share lab guides, past exam solutions, and organize LeetCode & hackathon squads.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Events & Workshops</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Keep track of university guest lectures, hackathons, virtual masterclasses, and career fairs with instant one-click calendar RSVPs.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Peer Messaging</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Direct messaging with other students, seniors, and research mentors across Addis Ababa University, AASTU, Hawassa, Jimma, and beyond.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: 8px;">Verified Student Safety</h3>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6;">
              Role-based student moderation, scam detection, reporting channels, and administrative controls ensure a supportive academic environment.
            </p>
          </div>
        </div>
      </section>

      <!-- Section: Testimonials -->
      <section class="landing-section" id="testimonials">
        <div class="section-header">
          <div class="section-eyebrow">Student Stories</div>
          <h2 class="section-title">Loved by ambitious university scholars</h2>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p class="testimonial-quote">
              "Finding team members for the national hackathon used to be difficult because our circles were limited to our physical classroom. On CampusLink, I connected with software students from AAU and ECE hardware students from AASTU in hours!"
            </p>
            <div class="testimonial-author">
              <div class="avatar avatar-sm">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" alt="Bethlehem Abebe" />
              </div>
              <div class="author-meta">
                <h5>Bethlehem Abebe</h5>
                <p>Hawassa University • Computer Science</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <p class="testimonial-quote">
              "The opportunity section filtered directly for local tech traineeships helped me secure my summer internship at Ethio Telecom. The deadline countdown tracker is a lifesaver during finals week."
            </p>
            <div class="testimonial-author">
              <div class="avatar avatar-sm">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Nahom Tadesse" />
              </div>
              <div class="author-meta">
                <h5>Nahom Tadesse</h5>
                <p>Addis Ababa University • Software Engineering</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <p class="testimonial-quote">
              "Through the Research Hub, I recruited co-investigators for our rural clinic health analytics paper. It's truly LinkedIn tailored for the African university reality."
            </p>
            <div class="testimonial-author">
              <div class="avatar avatar-sm">
                <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80" alt="Selamawit Kebede" />
              </div>
              <div class="author-meta">
                <h5>Selamawit Kebede</h5>
                <p>Jimma University • Health Informatics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Banner -->
      <section class="cta-banner">
        <h2>Ready to build your academic and career network?</h2>
        <p>Join thousands of university students connecting across disciplines, launching research, and landing career-defining opportunities.</p>
        <button class="btn btn-primary btn-lg" id="btn-cta-signup">Create Your Profile Today</button>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="navbar-brand">
              <div class="navbar-logo-icon">CL</div>
              <span>CampusLink</span>
            </div>
            <p>Empowering university students across Ethiopia and Africa with professional networks, research teams, and career opportunities.</p>
          </div>

          <div class="footer-col">
            <h6>Platform</h6>
            <div class="footer-links">
              <a href="#/feed">Student Feed</a>
              <a href="#/opportunities">Opportunities</a>
              <a href="#/circles">Study Circles</a>
              <a href="#/research">Research Hub</a>
            </div>
          </div>

          <div class="footer-col">
            <h6>Universities</h6>
            <div class="footer-links">
              <a href="#/search?q=AAU">Addis Ababa University</a>
              <a href="#/search?q=AASTU">AASTU</a>
              <a href="#/search?q=Hawassa">Hawassa University</a>
              <a href="#/search?q=Jimma">Jimma University</a>
            </div>
          </div>

          <div class="footer-col">
            <h6>Safety & Standards</h6>
            <div class="footer-links">
              <a href="javascript:void(0)" id="footer-link-guidelines">Community Guidelines</a>
              <a href="javascript:void(0)" id="footer-link-privacy">Privacy Policy</a>
              <a href="javascript:void(0)" id="footer-link-support">Student Support</a>
              <a href="#/admin">Administration</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 CampusLink. All rights reserved. Designed for university students in Africa.</div>
          <div>Powered by Modern Web Architecture & Firebase</div>
        </div>
      </footer>
    </div>
  `;
}

export function attachLandingEvents() {
  const loginBtns = [document.getElementById("btn-landing-login")].filter(Boolean);
  const signupBtns = [
    document.getElementById("btn-landing-signup"),
    document.getElementById("btn-hero-get-started"),
    document.getElementById("btn-cta-signup")
  ].filter(Boolean);

  loginBtns.forEach(btn => btn.addEventListener("click", () => modal.openAuthModal("login")));
  signupBtns.forEach(btn => btn.addEventListener("click", () => modal.openAuthModal("signup")));
}
