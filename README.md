# CampusLink - Modern Student Professional Platform

**CampusLink** is a student-focused professional platform combining the strengths of **LinkedIn**, an active **student community**, and a verified **opportunity board**, tailored specifically for university students in Ethiopia and other African countries.

---

## 🌟 Key Features

1. **Landing Page:**
   - Hero: *"Connect. Learn. Grow."*
   - Subtitle: *"Your professional network for university life, opportunities, research, and career growth."*
   - Sections: How CampusLink Works, Opportunity Ecosystem, Study Circles, Research Hub, Student Testimonials, and Call to Action.

2. **Authentication & Student Profiles:**
   - Sign up with university, faculty, department, academic year, skills, research interests, location, and avatar.
   - Login, logout, password reset flow, protected route guards.
   - LinkedIn-style student profile: Cover photo, avatar, headline, bio, skills endorsements, research topics, academic history, experience, projects, and certifications.
   - Interactive profile editor with image upload preview.

3. **Home & Real-Time Student Feed:**
   - Real-time updates with reactive data layer.
   - Post composer supporting post categories: *General, Academic, Research, Opportunity, Event, Question, Achievement*.
   - Media attachments and hashtag support.
   - Like/unlike counters, comment threads, post editing, post deletion, and safety reporting.
   - Feed filters: *All Posts, My University, My Faculty, My Department, Research, Opportunities, Events*.

4. **Dedicated Opportunities Board:**
   - Categories: *Internships, Jobs, Scholarships, Research, Fellowships, Competitions, Volunteering, Training*.
   - Each card displays organization, location, deadline with **automatic Expired status detection**, requirements tags, and application dossier modal.
   - Keyword search and deadline sorting.

5. **Study Groups & Circles:**
   - Specialized circles: *Computer Science Students, AI & Technology Ethiopia, Student Entrepreneurship & FinTech, Academic Research & Thesis Club, Competitive Programming & ICPC*.
   - One-click Join/Leave, member counters, and Circle discussion rooms.

6. **Campus Events:**
   - Discover hackathons, workshops, conferences, and student webinars.
   - Calendar date badge, time, venue, and one-click RSVP registration.

7. **Research Hub:**
   - Dedicated space for cross-campus capstone collaboration and paper co-authorship.
   - Project cards highlight required collaborator skills, target team capacity, and open spots.

8. **Peer Messaging:**
   - Real-time chat interface with student search, active conversation switcher, message timestamps, and online indicators.

9. **Notifications Center:**
   - Live alerts for post likes, comments, connection requests, and deadline countdowns with a "Mark all as read" button.

10. **Connection Network & Smart Recommendations:**
    - Algorithmic student matching (*People You May Know*) based on shared university, department, skills, and research interests.

11. **Super Admin Dashboard & Content Safety:**
    - Live platform metrics: total users, active users, posts, opportunities, events, circles.
    - Responsive SVG data visualizations for student registration distribution and opportunity breakdown.
    - Moderation queue: review student reports (*Spam, Fake info, Harassment, Inappropriate, Scam*) with Take Down and Dismiss controls.

12. **Theme & Mobile Experience:**
    - Persistent Light / Dark mode toggle.
    - Fully responsive layout: collapses to a bottom navigation bar and touch-friendly controls on mobile devices.

---

## 🏗️ Project Architecture

```
campuslink/
├── index.html                   # SPA Shell & Font / Firebase scripts
├── 404.html                     # Hosting fallback
├── firebase.json                # Firebase Hosting & Firestore deployment configuration
├── firestore.rules              # Production-grade Firestore Security Rules
├── firestore.indexes.json       # Composite Firestore query indexes
├── README.md                    # Setup and documentation
│
├── css/
│   ├── main.css                 # Design tokens, CSS variables, typography, light/dark themes
│   ├── components.css           # Buttons, cards, modals, forms, badges, toasts, dropdowns
│   ├── layout.css               # Navbar, 3-column app grid, mobile bottom navigation
│   ├── landing.css              # Landing page hero, steps, testimonials, and footer
│   ├── feed.css                 # Post composer, post card, comments drawer
│   ├── profile.css              # LinkedIn-style profile header, timeline, skills cloud
│   ├── opportunities.css        # Opportunity board, deadline status, filters
│   ├── circles.css              # Circles grid, room header, discussion threads
│   ├── events.css               # Calendar badges, RSVP action styling
│   ├── research.css             # Research hub cards, team slot badges
│   ├── messaging.css            # Split messaging layout and chat bubbles
│   ├── admin.css                # Admin analytics cards, SVG charts, moderation tables
│   └── notifications.css        # Notification center items & unread status
│
└── js/
    ├── app.js                   # Application bootstrap and route mounting
    ├── config/
    │   └── firebase-config.js   # Dual-Mode Firestore engine (Live Firebase + Mock fallback)
    ├── models/
    │   └── demo-data.js         # Realistic sample data (10 students, 10 opps, 5 circles, etc.)
    ├── state/
    │   └── app-state.js         # Centralized reactive state & pub-sub dispatcher
    ├── services/
    │   ├── auth-service.js      # Sign up, Login, Logout, Password reset, User switching
    │   ├── db-service.js        # Firestore abstraction layer with real-time listeners
    │   └── storage-service.js   # Image uploads with Cloud Storage and fallback
    ├── components/
    │   ├── navbar.js            # Top bar with global search, notifications badge, theme toggle
    │   ├── sidebar.js           # Left sidebar navigation
    │   ├── bottom-nav.js        # Mobile bottom navigation bar
    │   ├── post-card.js         # Post card with likes, comments, edit, delete, report
    │   ├── opportunity-card.js  # Opportunity card with deadline indicators
    │   ├── circle-card.js       # Circle community card
    │   ├── event-card.js        # Event card with RSVP
    │   ├── research-card.js     # Research team card
    │   └── modal.js             # Reusable modal manager (Auth, Composer, Profile, Report, Apply)
    ├── pages/
    │   ├── landing.js           # Landing page renderer
    │   ├── feed.js              # Real-time student feed
    │   ├── profile.js           # Student profile view and editor
    │   ├── opportunities.js     # Opportunity search and filtering
    │   ├── circles.js           # Study circles and circle rooms
    │   ├── events.js            # Campus events calendar
    │   ├── research.js          # Research hub and collaborator finder
    │   ├── messaging.js         # Direct peer chat
    │   ├── network.js           # Connection network and recommendations
    │   ├── notifications-page.js# Notification center
    │   ├── admin.js             # Platform administration dashboard
    │   └── search-page.js       # Categorized global search results
    └── utils/
        ├── helpers.js           # Deadlines, date formatting, smart recommendations engine, toasts
        └── router.js            # Client-side hash router with parameter matching and guards
```

---

## ⚡ Running Locally

Because CampusLink is built with standard modern ES Modules:

### Option 1: Python HTTP Server (Recommended)
Open your terminal in the `campuslink` directory:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🔑 Dual-Mode Architecture & Firebase Setup

CampusLink comes with a **Dual-Mode Engine**:
1. **Out of the box (Local Simulation Mode):**
   - The application is pre-seeded with 10 realistic students from universities like Addis Ababa University, AASTU, Hawassa, and Jimma, 10 opportunities, 5 circles, 5 events, and research projects.
   - Everything works immediately in your browser without requiring any setup: posting, liking, commenting, messaging, editing profiles, and admin moderation!
2. **Connecting to Live Firebase:**
   - Create a project at [https://console.firebase.google.com](https://console.firebase.google.com).
   - Enable **Authentication** (Email/Password).
   - Enable **Cloud Firestore** and **Firebase Storage**.
   - Copy your Firebase config object.
   - Either:
     - Click the **Firebase icon** in the top navigation bar to open the in-app configuration modal and paste your credentials, OR
     - Update `js/config/firebase-config.js` with your project keys.
   - Deploy your security rules:
     ```bash
     firebase deploy --only firestore:rules
     ```

---

## 👥 Demo Personas

You can switch between student viewpoints or test administrative privileges at any time by clicking your avatar in the top navbar and choosing **"Switch Demo Persona"**:
- **Nahom Tadesse** (Default) - 4th Year Software Engineering @ Addis Ababa University (AAiT)
- **Bethlehem Abebe** - 3rd Year Computer Science @ Hawassa University
- **Dawit Haile** - 5th Year Electrical & Computer Engineering @ AASTU
- **Selamawit Kebede** - 4th Year Health Informatics @ Jimma University
- **CampusLink Administrator** - Platform Super Admin (Unlocks Admin Dashboard `#admin` and moderation queue)
