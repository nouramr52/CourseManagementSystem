/**
 * Seed script — populates the database with realistic data.
 *
 * Run with:  npm run seed
 *
 * What it creates:
 *  1. 4 instructors
 *  2. 12 courses with schedules
 *  3. 20 students
 *  4. Enrollments (students spread across courses)
 *  5. Materials (PDF, PPT, DOC, LINK) for each course
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

// ─── Instructors ─────────────────────────────────────────────────────────────

const INSTRUCTORS = [
  { name: "Dr. James Carter", email: "james.carter@university.edu" },
  { name: "Prof. Aisha Patel", email: "aisha.patel@university.edu" },
  { name: "Sarah Kim", email: "sarah.kim@university.edu" },
  { name: "Dr. Lena Müller", email: "lena.muller@university.edu" },
];

// ─── Courses ──────────────────────────────────────────────────────────────────

const COURSES = [
  {
    title: "Database Systems",
    description: "Covers relational database design, SQL, normalization, transactions, and an introduction to NoSQL systems.",
    capacity: 30,
    dept: "Computer Science",
    icon: "🗄️",
    instructorIndex: 0,
    schedules: [
      { day: "Monday", startTime: "10:00", endTime: "11:30" },
      { day: "Wednesday", startTime: "10:00", endTime: "11:30" },
    ],
  },
  {
    title: "Software Engineering",
    description: "Agile methodologies, software design patterns, version control, testing strategies, and CI/CD pipelines.",
    capacity: 25,
    dept: "Software Engineering",
    icon: "⚙️",
    instructorIndex: 1,
    schedules: [
      { day: "Tuesday", startTime: "13:00", endTime: "14:30" },
      { day: "Thursday", startTime: "13:00", endTime: "14:30" },
    ],
  },
  {
    title: "Web Development",
    description: "Full-stack web development with HTML, CSS, JavaScript, React, Node.js, and REST API design.",
    capacity: 35,
    dept: "Information Systems",
    icon: "🌐",
    instructorIndex: 2,
    schedules: [
      { day: "Monday", startTime: "09:00", endTime: "10:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:00" },
      { day: "Friday", startTime: "09:00", endTime: "10:00" },
    ],
  },
  {
    title: "Operating Systems",
    description: "Process management, memory management, file systems, concurrency, and OS security fundamentals.",
    capacity: 30,
    dept: "Computer Science",
    icon: "💻",
    instructorIndex: 3,
    schedules: [
      { day: "Tuesday", startTime: "10:00", endTime: "11:30" },
      { day: "Thursday", startTime: "10:00", endTime: "11:30" },
    ],
  },
  {
    title: "Network Security",
    description: "Cryptography, firewalls, intrusion detection, VPNs, ethical hacking, and security policy design.",
    capacity: 20,
    dept: "Cybersecurity",
    icon: "🔐",
    instructorIndex: 0,
    schedules: [
      { day: "Wednesday", startTime: "14:00", endTime: "15:30" },
      { day: "Friday", startTime: "14:00", endTime: "15:30" },
    ],
  },
  {
    title: "Data Structures & Algorithms",
    description: "Arrays, linked lists, trees, graphs, sorting, searching, and algorithm complexity analysis.",
    capacity: 40,
    dept: "Computer Science",
    icon: "📊",
    instructorIndex: 1,
    schedules: [
      { day: "Monday", startTime: "15:00", endTime: "16:30" },
      { day: "Wednesday", startTime: "15:00", endTime: "16:30" },
    ],
  },
  {
    title: "Machine Learning",
    description: "Supervised and unsupervised learning, neural networks, model evaluation, and practical ML with Python.",
    capacity: 28,
    dept: "Artificial Intelligence",
    icon: "🤖",
    instructorIndex: 2,
    schedules: [
      { day: "Tuesday", startTime: "09:00", endTime: "10:30" },
      { day: "Thursday", startTime: "09:00", endTime: "10:30" },
    ],
  },
  {
    title: "Computer Networks",
    description: "OSI model, TCP/IP, routing protocols, network programming, and wireless networking concepts.",
    capacity: 30,
    dept: "Networking",
    icon: "📡",
    instructorIndex: 3,
    schedules: [
      { day: "Monday", startTime: "13:00", endTime: "14:30" },
      { day: "Friday", startTime: "13:00", endTime: "14:30" },
    ],
  },
  {
    title: "Discrete Mathematics",
    description: "Logic, set theory, combinatorics, graph theory, and proof techniques for computer science.",
    capacity: 35,
    dept: "Mathematics",
    icon: "🧮",
    instructorIndex: 0,
    schedules: [
      { day: "Tuesday", startTime: "11:00", endTime: "12:30" },
      { day: "Thursday", startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title: "Cloud Computing",
    description: "AWS, Azure, and GCP fundamentals, containerisation with Docker, orchestration with Kubernetes.",
    capacity: 25,
    dept: "Information Systems",
    icon: "☁️",
    instructorIndex: 1,
    schedules: [
      { day: "Wednesday", startTime: "11:00", endTime: "12:30" },
      { day: "Friday", startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "Threat modelling, vulnerability assessment, secure coding practices, and incident response.",
    capacity: 22,
    dept: "Cybersecurity",
    icon: "🔐",
    instructorIndex: 2,
    schedules: [
      { day: "Monday", startTime: "11:00", endTime: "12:30" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title: "Artificial Intelligence",
    description: "Search algorithms, knowledge representation, planning, natural language processing, and AI ethics.",
    capacity: 30,
    dept: "Artificial Intelligence",
    icon: "🤖",
    instructorIndex: 3,
    schedules: [
      { day: "Tuesday", startTime: "14:00", endTime: "15:30" },
      { day: "Thursday", startTime: "14:00", endTime: "15:30" },
    ],
  },
];

// ─── Students ─────────────────────────────────────────────────────────────────

const STUDENTS = [
  { name: "Alex Johnson", email: "alex.johnson@student.edu" },
  { name: "Maria Garcia", email: "maria.garcia@student.edu" },
  { name: "James Wilson", email: "james.wilson@student.edu" },
  { name: "Fatima Al-Said", email: "fatima.alsaid@student.edu" },
  { name: "Chen Wei", email: "chen.wei@student.edu" },
  { name: "Sara Ahmed", email: "sara.ahmed@student.edu" },
  { name: "Omar Hassan", email: "omar.hassan@student.edu" },
  { name: "Lena Müller", email: "lena.mueller@student.edu" },
  { name: "Priya Sharma", email: "priya.sharma@student.edu" },
  { name: "Lucas Oliveira", email: "lucas.oliveira@student.edu" },
  { name: "Yuki Tanaka", email: "yuki.tanaka@student.edu" },
  { name: "Amira Khalil", email: "amira.khalil@student.edu" },
  { name: "Noah Williams", email: "noah.williams@student.edu" },
  { name: "Sofia Rossi", email: "sofia.rossi@student.edu" },
  { name: "Ethan Brown", email: "ethan.brown@student.edu" },
  { name: "Hana Park", email: "hana.park@student.edu" },
  { name: "Carlos Mendez", email: "carlos.mendez@student.edu" },
  { name: "Aisha Diallo", email: "aisha.diallo@student.edu" },
  { name: "Ryan O'Brien", email: "ryan.obrien@student.edu" },
  { name: "Mei Lin", email: "mei.lin@student.edu" },
];

// ─── Materials per course (by course title) ───────────────────────────────────
// uploadedByIndex refers to the instructor index who owns that course

const MATERIALS_BY_COURSE = {
  "Database Systems": [
    { title: "Introduction to SQL", type: "PDF", url: "https://example.com/materials/intro-sql.pdf" },
    { title: "ER Diagram Lecture Slides", type: "PPT", url: "https://example.com/materials/er-diagrams.pptx" },
    { title: "Normalization Worksheet", type: "DOC", url: "https://example.com/materials/normalization.docx" },
    { title: "W3Schools SQL Tutorial", type: "LINK", url: "https://www.w3schools.com/sql/" },
    { title: "Transaction & ACID Properties", type: "PDF", url: "https://example.com/materials/transactions.pdf" },
  ],
  "Network Security": [
    { title: "Cryptography Basics", type: "PDF", url: "https://example.com/materials/crypto-basics.pdf" },
    { title: "Firewall Configuration Lab", type: "DOC", url: "https://example.com/materials/firewall-lab.docx" },
    { title: "OWASP Top 10 Reference", type: "LINK", url: "https://owasp.org/www-project-top-ten/" },
    { title: "VPN Setup Guide", type: "PDF", url: "https://example.com/materials/vpn-guide.pdf" },
  ],
  "Discrete Mathematics": [
    { title: "Logic & Proof Techniques", type: "PDF", url: "https://example.com/materials/logic-proofs.pdf" },
    { title: "Graph Theory Slides", type: "PPT", url: "https://example.com/materials/graph-theory.pptx" },
    { title: "Combinatorics Problem Set", type: "DOC", url: "https://example.com/materials/combinatorics.docx" },
    { title: "MIT OpenCourseWare – Discrete Math", type: "LINK", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/" },
  ],
  "Software Engineering": [
    { title: "Agile & Scrum Overview", type: "PPT", url: "https://example.com/materials/agile-scrum.pptx" },
    { title: "Design Patterns Cheat Sheet", type: "PDF", url: "https://example.com/materials/design-patterns.pdf" },
    { title: "Git Workflow Guide", type: "LINK", url: "https://www.atlassian.com/git/tutorials/comparing-workflows" },
    { title: "CI/CD Pipeline Lab", type: "DOC", url: "https://example.com/materials/cicd-lab.docx" },
  ],
  "Data Structures & Algorithms": [
    { title: "Big-O Complexity Reference", type: "PDF", url: "https://example.com/materials/big-o.pdf" },
    { title: "Sorting Algorithms Visualized", type: "LINK", url: "https://visualgo.net/en/sorting" },
    { title: "Trees & Graphs Lecture", type: "PPT", url: "https://example.com/materials/trees-graphs.pptx" },
  ],
  "Cloud Computing": [
    { title: "AWS Core Services Overview", type: "PDF", url: "https://example.com/materials/aws-overview.pdf" },
    { title: "Docker & Kubernetes Lab", type: "DOC", url: "https://example.com/materials/docker-k8s-lab.docx" },
    { title: "AWS Free Tier Getting Started", type: "LINK", url: "https://aws.amazon.com/free/" },
  ],
  "Web Development": [
    { title: "HTML & CSS Fundamentals", type: "PDF", url: "https://example.com/materials/html-css.pdf" },
    { title: "React Crash Course Slides", type: "PPT", url: "https://example.com/materials/react-crash.pptx" },
    { title: "MDN Web Docs", type: "LINK", url: "https://developer.mozilla.org/" },
    { title: "REST API Design Lab", type: "DOC", url: "https://example.com/materials/rest-api-lab.docx" },
  ],
  "Machine Learning": [
    { title: "Intro to ML — Lecture 1", type: "PPT", url: "https://example.com/materials/ml-lecture1.pptx" },
    { title: "Scikit-learn Quickstart", type: "LINK", url: "https://scikit-learn.org/stable/getting_started.html" },
    { title: "Neural Networks Explained", type: "PDF", url: "https://example.com/materials/neural-nets.pdf" },
  ],
  "Cybersecurity Fundamentals": [
    { title: "Threat Modelling Guide", type: "PDF", url: "https://example.com/materials/threat-modelling.pdf" },
    { title: "Secure Coding Practices", type: "DOC", url: "https://example.com/materials/secure-coding.docx" },
    { title: "NIST Cybersecurity Framework", type: "LINK", url: "https://www.nist.gov/cyberframework" },
  ],
  "Operating Systems": [
    { title: "Process Scheduling Slides", type: "PPT", url: "https://example.com/materials/process-scheduling.pptx" },
    { title: "Memory Management Notes", type: "PDF", url: "https://example.com/materials/memory-mgmt.pdf" },
    { title: "Linux Command Reference", type: "LINK", url: "https://man7.org/linux/man-pages/" },
  ],
  "Computer Networks": [
    { title: "OSI Model Reference Card", type: "PDF", url: "https://example.com/materials/osi-model.pdf" },
    { title: "TCP/IP Deep Dive", type: "PPT", url: "https://example.com/materials/tcpip.pptx" },
    { title: "Wireshark Lab Guide", type: "DOC", url: "https://example.com/materials/wireshark-lab.docx" },
    { title: "Cisco Networking Academy", type: "LINK", url: "https://www.netacad.com/" },
  ],
  "Artificial Intelligence": [
    { title: "Search Algorithms Overview", type: "PDF", url: "https://example.com/materials/search-algos.pdf" },
    { title: "NLP Introduction Slides", type: "PPT", url: "https://example.com/materials/nlp-intro.pptx" },
    { title: "AI Ethics Reading", type: "LINK", url: "https://aiethics.princeton.edu/" },
  ],
};

// ─── Enrollment distribution ──────────────────────────────────────────────────
// Each entry: [studentIndex, courseTitle]
// Spread students across courses realistically

const ENROLLMENTS = [
  // Database Systems (Dr. James Carter) — 10 students
  [0, "Database Systems"], [1, "Database Systems"], [2, "Database Systems"],
  [3, "Database Systems"], [4, "Database Systems"], [5, "Database Systems"],
  [6, "Database Systems"], [7, "Database Systems"], [8, "Database Systems"],
  [9, "Database Systems"],

  // Network Security (Dr. James Carter) — 8 students
  [0, "Network Security"], [2, "Network Security"], [4, "Network Security"],
  [6, "Network Security"], [8, "Network Security"], [10, "Network Security"],
  [12, "Network Security"], [14, "Network Security"],

  // Discrete Mathematics (Dr. James Carter) — 9 students
  [1, "Discrete Mathematics"], [3, "Discrete Mathematics"], [5, "Discrete Mathematics"],
  [7, "Discrete Mathematics"], [9, "Discrete Mathematics"], [11, "Discrete Mathematics"],
  [13, "Discrete Mathematics"], [15, "Discrete Mathematics"], [17, "Discrete Mathematics"],

  // Software Engineering (Prof. Aisha Patel) — 8 students
  [0, "Software Engineering"], [3, "Software Engineering"], [6, "Software Engineering"],
  [9, "Software Engineering"], [12, "Software Engineering"], [15, "Software Engineering"],
  [18, "Software Engineering"], [19, "Software Engineering"],

  // Data Structures & Algorithms (Prof. Aisha Patel) — 10 students
  [1, "Data Structures & Algorithms"], [4, "Data Structures & Algorithms"],
  [7, "Data Structures & Algorithms"], [10, "Data Structures & Algorithms"],
  [13, "Data Structures & Algorithms"], [16, "Data Structures & Algorithms"],
  [2, "Data Structures & Algorithms"], [5, "Data Structures & Algorithms"],
  [8, "Data Structures & Algorithms"], [11, "Data Structures & Algorithms"],

  // Cloud Computing (Prof. Aisha Patel) — 7 students
  [0, "Cloud Computing"], [5, "Cloud Computing"], [10, "Cloud Computing"],
  [15, "Cloud Computing"], [2, "Cloud Computing"], [7, "Cloud Computing"],
  [12, "Cloud Computing"],

  // Web Development (Sarah Kim) — 12 students
  [0, "Web Development"], [1, "Web Development"], [2, "Web Development"],
  [3, "Web Development"], [4, "Web Development"], [5, "Web Development"],
  [6, "Web Development"], [7, "Web Development"], [8, "Web Development"],
  [9, "Web Development"], [10, "Web Development"], [11, "Web Development"],

  // Machine Learning (Sarah Kim) — 9 students
  [12, "Machine Learning"], [13, "Machine Learning"], [14, "Machine Learning"],
  [15, "Machine Learning"], [16, "Machine Learning"], [17, "Machine Learning"],
  [18, "Machine Learning"], [19, "Machine Learning"], [0, "Machine Learning"],

  // Cybersecurity Fundamentals (Sarah Kim) — 6 students
  [1, "Cybersecurity Fundamentals"], [4, "Cybersecurity Fundamentals"],
  [7, "Cybersecurity Fundamentals"], [10, "Cybersecurity Fundamentals"],
  [13, "Cybersecurity Fundamentals"], [16, "Cybersecurity Fundamentals"],

  // Operating Systems (Dr. Lena Müller) — 8 students
  [2, "Operating Systems"], [5, "Operating Systems"], [8, "Operating Systems"],
  [11, "Operating Systems"], [14, "Operating Systems"], [17, "Operating Systems"],
  [3, "Operating Systems"], [6, "Operating Systems"],

  // Computer Networks (Dr. Lena Müller) — 7 students
  [0, "Computer Networks"], [4, "Computer Networks"], [8, "Computer Networks"],
  [12, "Computer Networks"], [16, "Computer Networks"], [1, "Computer Networks"],
  [9, "Computer Networks"],

  // Artificial Intelligence (Dr. Lena Müller) — 8 students
  [3, "Artificial Intelligence"], [6, "Artificial Intelligence"],
  [9, "Artificial Intelligence"], [12, "Artificial Intelligence"],
  [15, "Artificial Intelligence"], [18, "Artificial Intelligence"],
  [2, "Artificial Intelligence"], [7, "Artificial Intelligence"],
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting seed…\n");

  const defaultInstructorPassword = await bcrypt.hash("Instructor@123", 10);
  const defaultStudentPassword = await bcrypt.hash("Student@123", 10);

  // ── 1. Upsert instructors ──────────────────────────────────────────────────
  console.log("👨‍🏫  Upserting instructors…");
  const instructors = [];
  for (const inst of INSTRUCTORS) {
    const user = await prisma.user.upsert({
      where: { email: inst.email },
      update: { name: inst.name, role: "INSTRUCTOR" },
      create: {
        name: inst.name,
        email: inst.email,
        password: defaultInstructorPassword,
        role: "INSTRUCTOR",
      },
    });
    instructors.push(user);
    console.log(`  ✅  ${user.name}  (id=${user.id})`);
  }

  // ── 2. Delete existing courses for these instructors (clean re-seed) ───────
  const instructorIds = instructors.map((i) => i.id);
  const deleted = await prisma.course.deleteMany({
    where: { instructorId: { in: instructorIds } },
  });
  if (deleted.count > 0) {
    console.log(`\n  🗑   Removed ${deleted.count} existing course(s).`);
  }

  // ── 3. Create courses ──────────────────────────────────────────────────────
  console.log("\n📚  Creating courses…");
  const courseMap = {}; // title → course record
  for (const c of COURSES) {
    const instructor = instructors[c.instructorIndex];
    const course = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        capacity: c.capacity,
        dept: c.dept,
        icon: c.icon,
        instructorId: instructor.id,
        schedules: { create: c.schedules },
      },
    });
    courseMap[course.title] = { course, instructor };
    console.log(`  📖  "${course.title}"  →  ${instructor.name}`);
  }

  // ── 4. Upsert students ─────────────────────────────────────────────────────
  console.log("\n🎓  Upserting students…");
  const students = [];
  for (const s of STUDENTS) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, role: "STUDENT" },
      create: {
        name: s.name,
        email: s.email,
        password: defaultStudentPassword,
        role: "STUDENT",
      },
    });
    students.push(user);
  }
  console.log(`  ✅  ${students.length} students ready.`);

  // ── 5. Create enrollments ──────────────────────────────────────────────────
  console.log("\n📋  Creating enrollments…");
  let enrollCount = 0;
  for (const [studentIdx, courseTitle] of ENROLLMENTS) {
    const student = students[studentIdx];
    const entry = courseMap[courseTitle];
    if (!entry) continue;

    // Use upsert-style: skip if already exists
    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: student.id, courseId: entry.course.id } },
    });
    if (!existing) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: entry.course.id,
          status: "ACTIVE",
        },
      });
      enrollCount++;
    }
  }
  console.log(`  ✅  ${enrollCount} enrollments created.`);

  // ── 6. Create materials ────────────────────────────────────────────────────
  console.log("\n📁  Creating materials…");
  let matCount = 0;
  for (const [courseTitle, materials] of Object.entries(MATERIALS_BY_COURSE)) {
    const entry = courseMap[courseTitle];
    if (!entry) continue;

    for (const m of materials) {
      await prisma.material.create({
        data: {
          title: m.title,
          type: m.type,
          url: m.url,
          storagePath: null,
          courseId: entry.course.id,
          uploadedById: entry.instructor.id,
        },
      });
      matCount++;
    }
  }
  console.log(`  ✅  ${matCount} materials created.`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n✨  Seed complete!\n");
  console.log("─────────────────────────────────────────────────────");
  console.log("Instructor credentials (password: Instructor@123):");
  for (const inst of INSTRUCTORS) {
    console.log(`  ${inst.email}`);
  }
  console.log("\nStudent credentials (password: Student@123):");
  console.log("  Any student email from the list above");
  console.log("  e.g. alex.johnson@student.edu");
  console.log("─────────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
