/* ==========================================================================
   CampusLink - Demo Data Model
   Realistic sample data representing Ethiopian & African universities
   ========================================================================== */

export const DEMO_USERS = [
  {
    id: "usr-1",
    email: "nahom.tadesse@aau.edu.et",
    role: "student",
    name: "Nahom Tadesse",
    headline: "Software Engineering Student @ AAU | Distributed Systems & AI Enthusiast",
    university: "Addis Ababa University",
    faculty: "Institute of Technology (AAiT)",
    department: "Software Engineering",
    year: "Year 4",
    location: "Addis Ababa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    bio: "Passionate software engineering undergraduate exploring high-performance distributed systems, database internals, and Amharic NLP. Actively organizing peer study groups and mentoring junior students in algorithms.",
    skills: ["Go", "Python", "React", "Distributed Systems", "PostgreSQL", "Docker", "Machine Learning"],
    researchInterests: ["Natural Language Processing for Ethiopic Scripts", "Distributed Consensus", "Cloud Infrastructure"],
    connections: ["usr-2", "usr-3", "usr-4", "usr-5"],
    education: [
      {
        institution: "Addis Ababa University - AAiT",
        degree: "B.Sc. in Software Engineering",
        years: "2022 - 2026 (Expected)",
        description: "Focus on software architecture, algorithms, and distributed systems. Dean's List (GPA: 3.86/4.00)."
      }
    ],
    experience: [
      {
        title: "Software Engineering Intern",
        organization: "Ethio Telecom Innovation Hub",
        period: "Jul 2025 - Sep 2025",
        location: "Addis Ababa",
        description: "Built microservices for subscriber identity verification and integrated high-throughput Kafka event streaming."
      },
      {
        title: "Undergraduate Teaching Assistant",
        organization: "AAiT Department of Software Engineering",
        period: "Oct 2025 - Present",
        location: "Addis Ababa",
        description: "Assisting faculty in teaching Data Structures & Algorithms lab sessions for 120+ 2nd-year students."
      }
    ],
    projects: [
      {
        title: "Ge'ez-BERT Amharic Tokenizer",
        description: "Custom subword tokenizer and pre-trained lightweight transformer for Ethiopian language text classification.",
        link: "https://github.com/campuslink-demo/geez-bert"
      },
      {
        title: "Campus RideShare P2P",
        description: "Decentralized carpooling & bus tracker for university students with real-time GPS websocket feeds.",
        link: "https://github.com/campuslink-demo/campusrider"
      }
    ],
    certifications: [
      {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2025"
      },
      {
        title: "Deep Learning Specialization",
        issuer: "DeepLearning.AI",
        date: "2024"
      }
    ],
    achievements: [
      "1st Place Winner - National University Hackathon Ethiopia 2025",
      "Lead Organizer - Google Developer Student Club AAU (2024 - 2025)"
    ],
    online: true
  },
  {
    id: "usr-2",
    email: "bethlehem.a@hu.edu.et",
    role: "student",
    name: "Bethlehem Abebe",
    headline: "Computer Science @ Hawassa University | Mobile Developer & UI/UX Designer",
    university: "Hawassa University",
    faculty: "College of Natural & Computational Sciences",
    department: "Computer Science",
    year: "Year 3",
    location: "Hawassa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    bio: "Passionate about creating accessible digital experiences for African users. Building cross-platform Flutter apps with a special focus on offline-first architectures.",
    skills: ["Flutter", "Dart", "Figma", "Firebase", "TypeScript", "UI/UX Research"],
    researchInterests: ["Human-Computer Interaction in Developing Regions", "Mobile Healthcare Systems"],
    connections: ["usr-1", "usr-3", "usr-6"],
    education: [
      {
        institution: "Hawassa University",
        degree: "B.Sc. in Computer Science",
        years: "2023 - 2027",
        description: "Specializing in software engineering and human-centered design."
      }
    ],
    experience: [
      {
        title: "UI/UX & Mobile Intern",
        organization: "Kifiya Financial Technology",
        period: "Jun 2025 - Aug 2025",
        location: "Remote / Addis Ababa",
        description: "Redesigned mobile onboarding flow reducing dropout rates by 22%."
      }
    ],
    projects: [
      {
        title: "AgriPrice Mobile",
        description: "Mobile app for regional farmers to check real-time crop market prices via USSD and offline caching.",
        link: "https://github.com/campuslink-demo/agriprice"
      }
    ],
    certifications: [
      {
        title: "Google UX Design Professional Certificate",
        issuer: "Google / Coursera",
        date: "2024"
      }
    ],
    achievements: ["Finalist at Safaricom Youth Innovation Challenge"],
    online: true
  },
  {
    id: "usr-3",
    email: "dawit.h@aastu.edu.et",
    role: "student",
    name: "Dawit Haile",
    headline: "ECE Student @ AASTU | Embedded Systems & Robotics Researcher",
    university: "Addis Ababa Science & Technology University",
    faculty: "College of Electrical & Mechanical Engineering",
    department: "Electrical & Computer Engineering",
    year: "Year 5",
    location: "Addis Ababa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    bio: "Final year graduating engineer. Investigating sensor networks, edge compute microcontrollers, and solar telemetry.",
    skills: ["C/C++", "Rust", "Embedded Linux", "PCB Design", "ROS2", "Python"],
    researchInterests: ["Edge AI for Agricultural Automation", "Renewable Energy Grid Telemetry"],
    connections: ["usr-1", "usr-2", "usr-4"],
    education: [
      {
        institution: "AASTU",
        degree: "B.Sc. in Electrical & Computer Engineering",
        years: "2021 - 2026",
        description: "Specialized in Embedded Systems and Computer Hardware Architecture."
      }
    ],
    experience: [
      {
        title: "Hardware Engineering Intern",
        organization: "Ethiopian Space Science and Geospatial Institute (SSGI)",
        period: "2024",
        location: "Addis Ababa",
        description: "Assisted in testing telemetry transceivers for CubeSat environmental monitoring."
      }
    ],
    projects: [
      {
        title: "SolarGrid Edge Monitor",
        description: "Microcontroller system measuring photovoltaic output and predicting inverter failures with Edge Impulse.",
        link: "https://github.com/campuslink-demo/solargrid-edge"
      }
    ],
    certifications: [{ title: "ARM Cortex Microcontroller Mastery", issuer: "edX", date: "2024" }],
    achievements: ["AASTU Outstanding Engineering Capstone Award 2025"],
    online: false
  },
  {
    id: "usr-4",
    email: "selamawit.k@ju.edu.et",
    role: "student",
    name: "Selamawit Kebede",
    headline: "Health Informatics @ Jimma University | Data Science in Public Health",
    university: "Jimma University",
    faculty: "Institute of Health",
    department: "Health Informatics",
    year: "Year 4",
    location: "Jimma, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    bio: "Bridging the gap between clinical healthcare and digital data systems. Leading student research initiatives on maternal health analytics in Oromia region.",
    skills: ["R", "Python", "SQL", "Tableau", "Epidemiological Modeling", "DHIS2"],
    researchInterests: ["Maternal Health Informatics", "Machine Learning for Malaria Early Detection"],
    connections: ["usr-1", "usr-3", "usr-7"],
    education: [
      {
        institution: "Jimma University",
        degree: "B.Sc. in Health Informatics",
        years: "2022 - 2026",
        description: "Dean's list honors, top 5% of cohort."
      }
    ],
    experience: [],
    projects: [],
    certifications: [],
    achievements: ["WHO Regional Youth Health Informatics Delegate 2025"],
    online: true
  },
  {
    id: "usr-5",
    email: "yared.t@bdu.edu.et",
    role: "student",
    name: "Yared Tesfaye",
    headline: "Information Technology @ Bahir Dar University | Cloud & DevOps Specialist",
    university: "Bahir Dar University",
    faculty: "Bahir Dar Institute of Technology (BiT)",
    department: "Information Technology",
    year: "Year 3",
    location: "Bahir Dar, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    bio: "Linux nerd, containerization fanatic, and open source advocate. Helping student projects set up automated CI/CD and secure deployments.",
    skills: ["Linux", "Kubernetes", "Docker", "Terraform", "GitHub Actions", "Go"],
    researchInterests: ["Zero-Trust Networking for Higher Education", "Edge Micro-data Centers"],
    connections: ["usr-1"],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: false
  },
  {
    id: "usr-6",
    email: "meron.g@aau.edu.et",
    role: "student",
    name: "Meron Girma",
    headline: "Business & FinTech @ AAU School of Commerce | Aspiring Venture Builder",
    university: "Addis Ababa University",
    faculty: "College of Business & Economics",
    department: "Management & Information Systems",
    year: "Year 4",
    location: "Addis Ababa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    bio: "Exploring East African startup ecosystems, digital payment rails (Telebirr & MPESA), and micro-lending algorithms.",
    skills: ["Financial Modeling", "Market Research", "Product Management", "Python for Finance"],
    researchInterests: ["Financial Inclusion in Horn of Africa", "Digital Identity Systems"],
    connections: ["usr-2"],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: true
  },
  {
    id: "usr-7",
    email: "eyob.s@uog.edu.et",
    role: "student",
    name: "Eyob Solomon",
    headline: "Computer Science @ University of Gondar | Fullstack Web & Open Source",
    university: "University of Gondar",
    faculty: "Faculty of Informatics",
    department: "Computer Science",
    year: "Year 2",
    location: "Gondar, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    bio: "2nd year developer building web tools that simplify campus life. Passionate about JavaScript, Node.js, and web standards.",
    skills: ["JavaScript", "Node.js", "Express", "TailwindCSS", "MongoDB"],
    researchInterests: ["Web Accessibility", "Decentralized Educational Repositories"],
    connections: ["usr-4"],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: true
  },
  {
    id: "usr-8",
    email: "rahel.d@mu.edu.et",
    role: "student",
    name: "Rahel Daniel",
    headline: "Software Engineering @ Mekelle University | Machine Learning & NLP",
    university: "Mekelle University",
    faculty: "Mekelle Institute of Technology (MIT)",
    department: "Software Engineering",
    year: "Year 4",
    location: "Mekelle, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    bio: "Working on low-resource language translation models, Tigrinya dataset curation, and speech-to-text acoustic modeling.",
    skills: ["PyTorch", "Hugging Face", "NLP", "Python", "Data Annotation"],
    researchInterests: ["Low-Resource Machine Translation", "Speech Recognition"],
    connections: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: false
  },
  {
    id: "usr-9",
    email: "fitsum.k@amu.edu.et",
    role: "student",
    name: "Fitsum Kassa",
    headline: "Water Engineering & Software @ Arba Minch University | GIS & Climate Tech",
    university: "Arba Minch University",
    faculty: "Faculty of Water Resources Engineering",
    department: "Hydrology & Water Resources",
    year: "Year 4",
    location: "Arba Minch, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    bio: "Combining hydrological engineering with GIS modeling and Python automation to map water catchments and drought risks.",
    skills: ["QGIS", "Python", "ArcGIS", "Hydrological Modeling", "Remote Sensing"],
    researchInterests: ["Satellite Remote Sensing for Drought Forecasts", "River Basin Management"],
    connections: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: true
  },
  {
    id: "usr-10",
    email: "amen.t@aastu.edu.et",
    role: "student",
    name: "Amen Tefera",
    headline: "Data Science @ AASTU | Amharic Speech & Text Processing",
    university: "Addis Ababa Science & Technology University",
    faculty: "College of Applied Sciences",
    department: "Data Science & Analytics",
    year: "Year 3",
    location: "Addis Ababa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    bio: "Data science enthusiast obsessed with building statistical corpora and analyzing social media trends in Ethiopia.",
    skills: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "SQL"],
    researchInterests: ["Sentiment Analysis in Multilingual Social Networks"],
    connections: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    online: true
  },
  {
    id: "admin-1",
    email: "admin@campuslink.et",
    role: "admin",
    name: "CampusLink Administrator",
    headline: "Platform Operations & Academic Partnerships Lead",
    university: "Addis Ababa University",
    faculty: "Directorate of Student Affairs",
    department: "Career Services",
    year: "Faculty / Admin",
    location: "Addis Ababa, Ethiopia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    bio: "Overseeing campus engagement, career fair partnerships with industry sponsors, and community safety moderation across all universities.",
    skills: ["Academic Partnerships", "Community Safety", "Career Guidance"],
    researchInterests: ["Higher Education Digital Transformation in Africa"],
    connections: ["usr-1", "usr-2", "usr-3", "usr-4"],
    online: true
  }
];

export const DEMO_OPPORTUNITIES = [
  {
    id: "opp-1",
    title: "Graduate Software Engineer Trainee 2026",
    organization: "Ethio Telecom",
    location: "Addis Ababa, Ethiopia (Hybrid)",
    opportunityType: "Jobs",
    deadline: "2026-11-30",
    postedDate: "2026-10-01",
    description: "Ethio Telecom is recruiting ambitious graduating seniors and recent B.Sc. graduates in Computer Science, Software Engineering, and Information Systems for our accelerated 12-month engineering rotation program.",
    requirements: ["Graduating in 2025/2026", "Proficiency in Java, C#, or Python", "Understanding of Relational Databases", "Minimum Cumulative GPA 3.2"],
    applicationLink: "https://www.ethiotelecom.et/careers",
    saved: true
  },
  {
    id: "opp-2",
    title: "AI Research & Development Intern",
    organization: "Ethiopian Artificial Intelligence Institute (EAII)",
    location: "Addis Ababa, Ethiopia",
    opportunityType: "Internships",
    deadline: "2026-12-15",
    postedDate: "2026-09-28",
    description: "Join EAII researchers in advancing foundational AI models for Ethiopian local languages, agricultural computer vision, and healthcare diagnostics. Interns gain direct mentorship from senior PhD researchers.",
    requirements: ["Undergraduate in CS, Data Science, or ECE", "Experience with PyTorch or TensorFlow", "Interest in NLP or Computer Vision"],
    applicationLink: "https://ai.gov.et/internships",
    saved: false
  },
  {
    id: "opp-3",
    title: "Mastercard Foundation Scholars Program 2027",
    organization: "Mastercard Foundation & AAU",
    location: "Addis Ababa / Regional Africa",
    opportunityType: "Scholarships",
    deadline: "2026-12-31",
    postedDate: "2026-09-15",
    description: "Comprehensive scholarship covering 100% of university tuition, accommodation, stipend, and leadership development for high-achieving students with demonstrated financial need.",
    requirements: ["Enrolled full-time at an accredited university", "Outstanding academic record", "Demonstrated community leadership potential"],
    applicationLink: "https://mastercardfdn.org/scholars",
    saved: true
  },
  {
    id: "opp-4",
    title: "Cloud & Cybersecurity Junior Apprentice",
    organization: "Safaricom Ethiopia",
    location: "Addis Ababa, Ethiopia",
    opportunityType: "Internships",
    deadline: "2026-10-28",
    postedDate: "2026-10-02",
    description: "Hands-on apprenticeship working alongside Safaricom's Cloud Infrastructure & SOC security teams to monitor threats and maintain telecom infrastructure.",
    requirements: ["Basic knowledge of Linux & Networking", "Familiarity with AWS or Azure", "Year 3 or Year 4 university student"],
    applicationLink: "https://safaricom.et/careers",
    saved: false
  },
  {
    id: "opp-5",
    title: "ALX Ventures Tech Innovation Challenge 2026",
    organization: "ALX Ventures Africa",
    location: "Virtual / Pan-African",
    opportunityType: "Competitions",
    deadline: "2026-11-20",
    postedDate: "2026-09-20",
    description: "Pan-African student pitch competition with up to $25,000 in equity-free grant funding, cloud credits, and 3 months of venture acceleration for tech-enabled student startups.",
    requirements: ["At least 2 student co-founders", "Working prototype / MVP", "Focus on FinTech, AgriTech, Health, or EdTech"],
    applicationLink: "https://alxventures.com/pitch",
    saved: false
  },
  {
    id: "opp-6",
    title: "AfDB Youth in Coding & Cloud Fellowship",
    organization: "African Development Bank (AfDB)",
    location: "Remote (All Africa)",
    opportunityType: "Fellowships",
    deadline: "2026-11-10",
    postedDate: "2026-09-10",
    description: "A prestigious 6-month fellowship designed to train 1,000 young developers across Africa in cloud-native technologies, devops automation, and open-source public goods.",
    requirements: ["Aged 18 - 25", "Current student or recent graduate", "Passionate about building scalable digital public infrastructure"],
    applicationLink: "https://www.afdb.org/fellowships",
    saved: false
  },
  {
    id: "opp-7",
    title: "Google Africa Developer Training Cohort",
    organization: "Google for Developers Africa",
    location: "Remote / Online",
    opportunityType: "Training",
    deadline: "2026-12-05",
    postedDate: "2026-10-03",
    description: "Fully sponsored certification training paths in Cloud Engineering, Android Development, and Data Engineering with free certification exam vouchers upon completion.",
    requirements: ["Enrolled student in any African university", "Commitment to 8 hours/week for 4 months"],
    applicationLink: "https://developers.google.com/africa",
    saved: false
  },
  {
    id: "opp-8",
    title: "African Union Youth Volunteer Corps (AU-YVC)",
    organization: "African Union Commission",
    location: "Addis Ababa / Member States",
    opportunityType: "Volunteering",
    deadline: "2026-11-05",
    postedDate: "2026-09-05",
    description: "Continental flagship initiative that deploys young professionals to work in AU departments and international partners to foster pan-African unity and peace.",
    requirements: ["Citizens of an AU Member State", "Strong communication skills", "Completed at least 2 years of tertiary education"],
    applicationLink: "https://au.int/youth-volunteer",
    saved: false
  },
  {
    id: "opp-9",
    title: "Amharic Speech Dataset Collector & Research Assistant",
    organization: "AAU Natural Language Processing Lab",
    location: "Addis Ababa, Ethiopia",
    opportunityType: "Research",
    deadline: "2026-11-18",
    postedDate: "2026-10-04",
    description: "Funded research assistantship to record, annotate, and evaluate phonetic dialect variations for a national open-source speech recognition corpus.",
    requirements: ["Native fluency in Amharic", "Strong audio listening and text transcription skill", "Basic Python scripting is a plus"],
    applicationLink: "https://aau.edu.et/nlp-research",
    saved: true
  },
  {
    id: "opp-10",
    title: "Summer Code Camp 2025 - High School Mentorship",
    organization: "STEM Power Ethiopia",
    location: "Hawassa & Addis Ababa",
    opportunityType: "Volunteering",
    deadline: "2025-08-15", // Passed deadline to demonstrate expired status
    postedDate: "2025-06-01",
    description: "Volunteer mentorship program where university software students teach Scratch, HTML/CSS, and Python to secondary school girls in regional labs.",
    requirements: ["University student in good standing", "Enthusiastic about teaching beginners"],
    applicationLink: "https://stempower.org/volunteer",
    saved: false
  }
];

export const DEMO_CIRCLES = [
  {
    id: "circle-1",
    name: "Computer Science Students",
    category: "Programming",
    description: "A collaborative hub for computer science & software engineering students across Ethiopian universities to share resources, solve algorithm problems, and discuss tech stacks.",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    creatorId: "usr-1",
    creatorName: "Nahom Tadesse",
    membersCount: 428,
    isJoined: true
  },
  {
    id: "circle-2",
    name: "AI & Technology Ethiopia",
    category: "AI & Technology",
    description: "Exploring machine learning, deep learning architectures, computer vision, and NLP with special focus on Amharic, Afaan Oromoo, and Tigrinya language models.",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    creatorId: "usr-8",
    creatorName: "Rahel Daniel",
    membersCount: 312,
    isJoined: true
  },
  {
    id: "circle-3",
    name: "Student Entrepreneurship & FinTech",
    category: "Entrepreneurship",
    description: "For student innovators, startup founders, and business majors building products for the emerging African digital economy, Telebirr integration, and venture pitches.",
    cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    creatorId: "usr-6",
    creatorName: "Meron Girma",
    membersCount: 195,
    isJoined: false
  },
  {
    id: "circle-4",
    name: "Academic Research & Thesis Club",
    category: "Research Club",
    description: "Discussing thesis methodologies, peer review, latex formatting, citation management, and publishing in reputable scientific journals and conferences.",
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    creatorId: "usr-4",
    creatorName: "Selamawit Kebede",
    membersCount: 260,
    isJoined: false
  },
  {
    id: "circle-5",
    name: "Competitive Programming & ICPC",
    category: "Mathematics",
    description: "Weekly problem sets, LeetCode discussions, dynamic programming breakdowns, and team practice for the upcoming Ethiopian Collegiate Programming Contest.",
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    creatorId: "usr-3",
    creatorName: "Dawit Haile",
    membersCount: 178,
    isJoined: true
  }
];

export const DEMO_EVENTS = [
  {
    id: "evt-1",
    name: "AAU Annual Tech Innovation & Capstone Expo 2026",
    organizer: "AAiT Department of Software Engineering",
    category: "Conferences",
    date: "2026-11-12",
    time: "09:00 AM - 04:30 PM",
    location: "AAiT New Auditorium, 5 Kilo, Addis Ababa",
    description: "Annual showcase of top graduating student hardware and software capstone projects, featuring keynote presentations from local tech CEOs and recruitment booths.",
    rsvp: true
  },
  {
    id: "evt-2",
    name: "IndabaX Ethiopia: Deep Learning in Healthcare",
    organizer: "Ethiopian AI Institute & IndabaX",
    category: "Workshops",
    date: "2026-11-25",
    time: "01:30 PM - 05:00 PM",
    location: "EAII Main Campus / Virtual Stream",
    description: "Hands-on tutorial and presentation series on applying computer vision to medical imaging and training diagnostic models with low computational budgets.",
    rsvp: false
  },
  {
    id: "evt-3",
    name: "Safaricom Student Developer Hackathon",
    organizer: "Safaricom Ethiopia Developer Community",
    category: "Competitions",
    date: "2026-12-05",
    time: "48 Hours (Starting 10:00 AM)",
    location: "Hyatt Regency Addis Ababa & Online",
    description: "48-hour challenge to build innovative financial inclusion and merchant productivity solutions leveraging open APIs. Prizes and fast-track interviews for finalists.",
    rsvp: true
  },
  {
    id: "evt-4",
    name: "Webinar: Breaking into Global Remote Engineering",
    organizer: "CampusLink Career Series",
    category: "Webinars",
    date: "2026-10-30",
    time: "06:00 PM - 07:30 PM",
    location: "Google Meet (Link sent upon RSVP)",
    description: "Join Ethiopian engineers working remotely for international startups as they share practical tips on resume design, open-source portfolio building, and technical interviews.",
    rsvp: true
  },
  {
    id: "evt-5",
    name: "Women in STEM Regional Student Meetup",
    organizer: "Hawassa University STEM Union",
    category: "Student meetups",
    date: "2026-11-18",
    time: "02:00 PM - 05:00 PM",
    location: "Hawassa University Main Hall",
    description: "Networking, peer mentorship circles, and lighting talks celebrating female leadership in computing, mathematics, and biomedical engineering.",
    rsvp: false
  }
];

export const DEMO_RESEARCH = [
  {
    id: "res-1",
    title: "Amharic & Afaan Oromoo Cross-Lingual Semantic Search for Legal Texts",
    field: "Natural Language Processing",
    authorId: "usr-1",
    authorName: "Nahom Tadesse",
    authorUniversity: "Addis Ababa University",
    description: "Developing a dense passage retrieval model capable of querying Ethiopian federal proclamation records across languages without requiring manual translations.",
    interests: ["Dense Retrieval", "Bi-Encoder Transformers", "Legal Informatics"],
    requiredSkills: ["PyTorch", "Python", "Transformers", "Data Scraper"],
    teamSizeRequired: 2,
    teamSizeCurrent: 1,
    contactEmail: "nahom.tadesse@aau.edu.et"
  },
  {
    id: "res-2",
    title: "IoT-Driven Soil Moisture & Telemetry in Rift Valley Smallholder Farms",
    field: "Embedded Systems & Agriculture",
    authorId: "usr-3",
    authorName: "Dawit Haile",
    authorUniversity: "AASTU",
    description: "Deploying low-cost LoRaWAN soil moisture probes powered by micro solar cells to provide irrigation alerts to farmers via SMS in Hawassa and Ziway.",
    interests: ["LoRaWAN", "Edge Computing", "Precision Farming"],
    requiredSkills: ["C++", "Circuit Design", "SMS Gateway / USSD"],
    teamSizeRequired: 3,
    teamSizeCurrent: 2,
    contactEmail: "dawit.h@aastu.edu.et"
  },
  {
    id: "res-3",
    title: "Federated Learning for Private Clinic Health Records in Rural Oromia",
    field: "Biomedical Data Science",
    authorId: "usr-4",
    authorName: "Selamawit Kebede",
    authorUniversity: "Jimma University",
    description: "Investigating privacy-preserving federated machine learning to detect communicable disease trends across disconnected rural health centers without sharing patient-identifiable data.",
    interests: ["Differential Privacy", "Healthcare Analytics", "Federated Algorithms"],
    requiredSkills: ["R or Python", "Health Informatics", "Statistical Modeling"],
    teamSizeRequired: 2,
    teamSizeCurrent: 1,
    contactEmail: "selamawit.k@ju.edu.et"
  },
  {
    id: "res-4",
    title: "Graph Neural Networks for Telebirr Peer-to-Peer Micro-Lending Risk Analysis",
    field: "Financial Engineering",
    authorId: "usr-6",
    authorName: "Meron Girma",
    authorUniversity: "Addis Ababa University",
    description: "Formulating peer transactions as bipartite graph networks to estimate default probabilities for micro-entrepreneurs lacking traditional collateral bank records.",
    interests: ["Graph Neural Networks", "FinTech", "Credit Scoring"],
    requiredSkills: ["Python", "NetworkX or PyG", "Financial Modeling"],
    teamSizeRequired: 3,
    teamSizeCurrent: 1,
    contactEmail: "meron.g@aau.edu.et"
  }
];

export const DEMO_POSTS = [
  {
    id: "post-1",
    authorId: "usr-1",
    authorName: "Nahom Tadesse",
    authorHeadline: "Software Engineering Student @ AAU",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    university: "Addis Ababa University",
    faculty: "Institute of Technology (AAiT)",
    department: "Software Engineering",
    postType: "Achievement",
    content: "Thrilled to share that our team won 1st Place at the National University Hackathon 2025! 🏆\n\nWe spent 36 sleepless hours building a decentralized digital credential verification platform for Ethiopian university students that allows instant verification of degrees and transcripts using tamper-proof cryptographic proofs.\n\nHuge thanks to my teammates Dawit Haile and Bethlehem Abebe, and to our mentors at AAiT!",
    media: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    hashtags: ["#HackathonWinner", "#AAiT", "#EthiopianTech", "#Blockchain", "#StudentsWhoCode"],
    timestamp: "2 hours ago",
    likes: ["usr-2", "usr-3", "usr-4", "usr-6", "usr-7"],
    comments: [
      {
        id: "c-1",
        authorId: "usr-2",
        authorName: "Bethlehem Abebe",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        text: "What an unforgettable weekend! Proud of what we built under intense time pressure 🚀",
        time: "1 hour ago"
      },
      {
        id: "c-2",
        authorId: "usr-3",
        authorName: "Dawit Haile",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        text: "Now let's turn this prototype into an open-source tool for all universities!",
        time: "45 mins ago"
      }
    ],
    sharesCount: 12
  },
  {
    id: "post-2",
    authorId: "usr-2",
    authorName: "Bethlehem Abebe",
    authorHeadline: "Computer Science @ Hawassa University",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    university: "Hawassa University",
    faculty: "College of Natural & Computational Sciences",
    department: "Computer Science",
    postType: "Opportunity",
    content: "📢 Attention Hawassa University and regional students: Safaricom Ethiopia and Ethio Telecom just posted new software internship openings for the upcoming semester!\n\nI compiled a quick checklist of common technical interview questions, system design essentials, and CV formatting tips tailored for Ethiopian tech recruitment in the Opportunities tab. Check it out!",
    hashtags: ["#Internships", "#EthiopiaTech", "#HawassaUniversity", "#CareerAdvice"],
    timestamp: "5 hours ago",
    likes: ["usr-1", "usr-5", "usr-7"],
    comments: [
      {
        id: "c-3",
        authorId: "usr-5",
        authorName: "Yared Tesfaye",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        text: "Super helpful guide, Bethlehem! Sharing this with my classmates at Bahir Dar.",
        time: "3 hours ago"
      }
    ],
    sharesCount: 8
  },
  {
    id: "post-3",
    authorId: "usr-4",
    authorName: "Selamawit Kebede",
    authorHeadline: "Health Informatics @ Jimma University",
    authorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    university: "Jimma University",
    faculty: "Institute of Health",
    department: "Health Informatics",
    postType: "Research",
    content: "We are currently looking for 2 passionate student collaborators for our Research Hub project: 'Federated Learning for Private Clinic Health Records in Rural Oromia'.\n\nIf you have foundational knowledge in Python, statistical modeling, or biomedical information systems, drop me a message or check the Research Hub to join our paper reading group!",
    hashtags: ["#Research", "#HealthInformatics", "#JimmaUniversity", "#MachineLearning"],
    timestamp: "1 day ago",
    likes: ["usr-1", "usr-4"],
    comments: [],
    sharesCount: 5
  },
  {
    id: "post-4",
    authorId: "usr-3",
    authorName: "Dawit Haile",
    authorHeadline: "ECE Student @ AASTU",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    university: "Addis Ababa Science & Technology University",
    faculty: "College of Electrical & Mechanical Engineering",
    department: "Electrical & Computer Engineering",
    postType: "Question",
    content: "Hardware engineers & robotics folks: for those building battery-powered sensor nodes in field conditions, what is your preferred approach for handling transient solar dropouts without corrupting EEPROM / Flash writes on STM32 boards?\n\nWould love to hear your circuit recommendations!",
    hashtags: ["#EmbeddedSystems", "#AASTU", "#HardwareEngineering", "#AskCampus"],
    timestamp: "1 day ago",
    likes: ["usr-1", "usr-9"],
    comments: [],
    sharesCount: 2
  },
  {
    id: "post-5",
    authorId: "admin-1",
    authorName: "CampusLink Administrator",
    authorHeadline: "Platform Operations & Academic Partnerships",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    university: "Addis Ababa University",
    faculty: "Directorate of Student Affairs",
    department: "Career Services",
    postType: "Event",
    content: "🎓 Welcome to the 2026 Academic Year on CampusLink!\n\nWe have partnered with 8 universities across Ethiopia (AAU, AASTU, Hawassa, Jimma, Bahir Dar, Gondar, Mekelle, and Arba Minch) to connect undergraduate and postgraduate students with verified internships, research labs, study circles, and career mentors.\n\nMake sure your profile is 100% complete to receive smart opportunity recommendations matched directly to your faculty and department!",
    media: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    hashtags: ["#CampusLink", "#UniversityLife", "#EthiopiaStudents", "#CareerReady"],
    timestamp: "2 days ago",
    likes: ["usr-1", "usr-2", "usr-3", "usr-4", "usr-5", "usr-6", "usr-7", "usr-8", "usr-9", "usr-10"],
    comments: [],
    sharesCount: 34
  }
];

export const DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    partnerId: "usr-2",
    partnerName: "Bethlehem Abebe",
    partnerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    partnerUniversity: "Hawassa University",
    lastMessage: "Sounds great! Let's review the hackathon slides tomorrow.",
    lastTime: "10:30 AM",
    unread: false,
    messages: [
      { id: "m-1", senderId: "usr-2", text: "Hey Nahom! Have you submitted the final capstone proposal yet?", time: "10:15 AM" },
      { id: "m-2", senderId: "usr-1", text: "Hey Bethlehem! Yes, submitted it this morning with Dr. Assefa.", time: "10:22 AM" },
      { id: "m-3", senderId: "usr-2", text: "Sounds great! Let's review the hackathon slides tomorrow.", time: "10:30 AM" }
    ]
  },
  {
    id: "conv-2",
    partnerId: "usr-3",
    partnerName: "Dawit Haile",
    partnerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    partnerUniversity: "AASTU",
    lastMessage: "I ordered the LoRa modules, will test on Friday.",
    lastTime: "Yesterday",
    unread: true,
    messages: [
      { id: "m-4", senderId: "usr-3", text: "I ordered the LoRa modules, will test on Friday.", time: "Yesterday" }
    ]
  }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "like",
    icon: "❤️",
    text: "<strong>Bethlehem Abebe</strong> and 4 others liked your post about National University Hackathon 2025.",
    time: "2 hours ago",
    unread: true
  },
  {
    id: "notif-2",
    type: "comment",
    icon: "💬",
    text: "<strong>Dawit Haile</strong> commented: 'Now let's turn this prototype into an open-source tool...'",
    time: "45 mins ago",
    unread: true
  },
  {
    id: "notif-3",
    type: "connection",
    icon: "🤝",
    text: "<strong>Meron Girma</strong> accepted your connection request.",
    time: "1 day ago",
    unread: false
  },
  {
    id: "notif-4",
    type: "deadline",
    icon: "⏰",
    text: "Opportunity deadline alert: <strong>Safaricom Cloud Apprenticeship</strong> closes in 14 days.",
    time: "2 days ago",
    unread: false
  },
  {
    id: "notif-5",
    type: "circle",
    icon: "👥",
    text: "New post in <strong>Computer Science Students</strong> circle: 'Tips for ICPC Qualification'.",
    time: "3 days ago",
    unread: false
  }
];

export const DEMO_REPORTS = [
  {
    id: "rep-1",
    targetType: "post",
    targetId: "post-99",
    targetPreview: "Check out this guaranteed paid homework service...",
    reportedBy: "usr-4",
    reporterName: "Selamawit Kebede",
    category: "Spam",
    reason: "Promoting paid exam cheating and commercial spam on student feed.",
    timestamp: "2026-10-06 14:20",
    status: "pending"
  },
  {
    id: "rep-2",
    targetType: "opportunity",
    targetId: "opp-99",
    targetPreview: "Deposit 500 ETB for upfront interview processing fee",
    reportedBy: "usr-1",
    reporterName: "Nahom Tadesse",
    category: "Scam",
    reason: "Fake job posting demanding upfront wire transfers before interview.",
    timestamp: "2026-10-07 09:15",
    status: "pending"
  }
];
