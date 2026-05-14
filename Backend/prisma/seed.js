/**
 * Seed script — populates the database with realistic course data.
 *
 * Run with:  node prisma/seed.js
 *
 * What it does:
 *  1. Upserts 4 instructor accounts (safe to re-run — won't duplicate).
 *  2. Clears any existing courses owned by those instructors.
 *  3. Creates 12 courses with schedules, dept labels, and icons.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from the Backend folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

// ─── Instructors ────────────────────────────────────────────────────────────

const INSTRUCTORS = [
  { name: "Dr. James Carter",  email: "james.carter@university.edu"  },
  { name: "Prof. Aisha Patel", email: "aisha.patel@university.edu"   },
  { name: "Sarah Kim",         email: "sarah.kim@university.edu"     },
  { name: "Dr. Lena Müller",   email: "lena.muller@university.edu"   },
];

// ─── Courses ────────────────────────────────────────────────────────────────

// instructorIndex refers to the position in INSTRUCTORS above (0-based)
const COURSES = [
  {
    title:       "Database Systems",
    description: "Covers relational database design, SQL, normalization, transactions, and an introduction to NoSQL systems.",
    capacity:    30,
    dept:        "Computer Science",
    icon:        "🗄️",
    instructorIndex: 0,
    schedules: [
      { day: "Monday",    startTime: "10:00", endTime: "11:30" },
      { day: "Wednesday", startTime: "10:00", endTime: "11:30" },
    ],
  },
  {
    title:       "Software Engineering",
    description: "Agile methodologies, software design patterns, version control, testing strategies, and CI/CD pipelines.",
    capacity:    25,
    dept:        "Software Engineering",
    icon:        "⚙️",
    instructorIndex: 1,
    schedules: [
      { day: "Tuesday",  startTime: "13:00", endTime: "14:30" },
      { day: "Thursday", startTime: "13:00", endTime: "14:30" },
    ],
  },
  {
    title:       "Web Development",
    description: "Full-stack web development with HTML, CSS, JavaScript, React, Node.js, and REST API design.",
    capacity:    35,
    dept:        "Information Systems",
    icon:        "🌐",
    instructorIndex: 2,
    schedules: [
      { day: "Monday",    startTime: "09:00", endTime: "10:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:00" },
      { day: "Friday",    startTime: "09:00", endTime: "10:00" },
    ],
  },
  {
    title:       "Operating Systems",
    description: "Process management, memory management, file systems, concurrency, and OS security fundamentals.",
    capacity:    30,
    dept:        "Computer Science",
    icon:        "💻",
    instructorIndex: 3,
    schedules: [
      { day: "Tuesday",  startTime: "10:00", endTime: "11:30" },
      { day: "Thursday", startTime: "10:00", endTime: "11:30" },
    ],
  },
  {
    title:       "Network Security",
    description: "Cryptography, firewalls, intrusion detection, VPNs, ethical hacking, and security policy design.",
    capacity:    20,
    dept:        "Cybersecurity",
    icon:        "🔐",
    instructorIndex: 0,
    schedules: [
      { day: "Wednesday", startTime: "14:00", endTime: "15:30" },
      { day: "Friday",    startTime: "14:00", endTime: "15:30" },
    ],
  },
  {
    title:       "Data Structures & Algorithms",
    description: "Arrays, linked lists, trees, graphs, sorting, searching, and algorithm complexity analysis.",
    capacity:    40,
    dept:        "Computer Science",
    icon:        "📊",
    instructorIndex: 1,
    schedules: [
      { day: "Monday",    startTime: "15:00", endTime: "16:30" },
      { day: "Wednesday", startTime: "15:00", endTime: "16:30" },
    ],
  },
  {
    title:       "Machine Learning",
    description: "Supervised and unsupervised learning, neural networks, model evaluation, and practical ML with Python.",
    capacity:    28,
    dept:        "Artificial Intelligence",
    icon:        "🤖",
    instructorIndex: 2,
    schedules: [
      { day: "Tuesday",  startTime: "09:00", endTime: "10:30" },
      { day: "Thursday", startTime: "09:00", endTime: "10:30" },
    ],
  },
  {
    title:       "Computer Networks",
    description: "OSI model, TCP/IP, routing protocols, network programming, and wireless networking concepts.",
    capacity:    30,
    dept:        "Networking",
    icon:        "📡",
    instructorIndex: 3,
    schedules: [
      { day: "Monday",  startTime: "13:00", endTime: "14:30" },
      { day: "Friday",  startTime: "13:00", endTime: "14:30" },
    ],
  },
  {
    title:       "Discrete Mathematics",
    description: "Logic, set theory, combinatorics, graph theory, and proof techniques for computer science.",
    capacity:    35,
    dept:        "Mathematics",
    icon:        "🧮",
    instructorIndex: 0,
    schedules: [
      { day: "Tuesday",  startTime: "11:00", endTime: "12:30" },
      { day: "Thursday", startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title:       "Cloud Computing",
    description: "AWS, Azure, and GCP fundamentals, containerisation with Docker, orchestration with Kubernetes.",
    capacity:    25,
    dept:        "Information Systems",
    icon:        "☁️",
    instructorIndex: 1,
    schedules: [
      { day: "Wednesday", startTime: "11:00", endTime: "12:30" },
      { day: "Friday",    startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title:       "Cybersecurity Fundamentals",
    description: "Threat modelling, vulnerability assessment, secure coding practices, and incident response.",
    capacity:    22,
    dept:        "Cybersecurity",
    icon:        "🔐",
    instructorIndex: 2,
    schedules: [
      { day: "Monday",    startTime: "11:00", endTime: "12:30" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:30" },
    ],
  },
  {
    title:       "Artificial Intelligence",
    description: "Search algorithms, knowledge representation, planning, natural language processing, and AI ethics.",
    capacity:    30,
    dept:        "Artificial Intelligence",
    icon:        "🤖",
    instructorIndex: 3,
    schedules: [
      { day: "Tuesday",  startTime: "14:00", endTime: "15:30" },
      { day: "Thursday", startTime: "14:00", endTime: "15:30" },
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting seed…\n");

  // 1. Upsert instructors
  const defaultPassword = await bcrypt.hash("Instructor@123", 10);

  const instructors = [];
  for (const inst of INSTRUCTORS) {
    const user = await prisma.user.upsert({
      where:  { email: inst.email },
      update: { name: inst.name, role: "INSTRUCTOR" },
      create: {
        name:     inst.name,
        email:    inst.email,
        password: defaultPassword,
        role:     "INSTRUCTOR",
      },
    });
    instructors.push(user);
    console.log(`  ✅  Instructor: ${user.name} (id=${user.id})`);
  }

  // 2. Delete existing courses owned by these instructors (clean re-seed)
  const instructorIds = instructors.map(i => i.id);
  const deleted = await prisma.course.deleteMany({
    where: { instructorId: { in: instructorIds } },
  });
  if (deleted.count > 0) {
    console.log(`\n  🗑   Removed ${deleted.count} existing course(s) for these instructors.`);
  }

  // 3. Create courses
  console.log("\n  Creating courses…");
  for (const c of COURSES) {
    const instructor = instructors[c.instructorIndex];
    const course = await prisma.course.create({
      data: {
        title:        c.title,
        description:  c.description,
        capacity:     c.capacity,
        dept:         c.dept,
        icon:         c.icon,
        instructorId: instructor.id,
        schedules: {
          create: c.schedules,
        },
      },
    });
    console.log(`  📚  "${course.title}" → ${instructor.name}`);
  }

  console.log("\n✨  Seed complete!");
  console.log("\nInstructor login credentials (all share the same password):");
  for (const inst of INSTRUCTORS) {
    console.log(`  ${inst.email}  /  Instructor@123`);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
