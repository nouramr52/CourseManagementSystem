/**
 * Seed script for instructor: Ameera ElGhamry (id=6)
 *
 * Run with:  node prisma/seedAmeera.js
 *
 * Creates:
 *  - 3 courses with schedules
 *  - 20 students
 *  - Enrollments spread across the 3 courses
 *  - Materials for each course
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

const INSTRUCTOR_EMAIL = "ameeraelghamry@gmail.com";

// ─── Courses ──────────────────────────────────────────────────────────────────

const COURSES = [
    {
        title: "Database Systems",
        description: "Covers relational database design, SQL, normalization, transactions, and an introduction to NoSQL systems.",
        capacity: 30,
        dept: "Computer Science",
        icon: "🗄️",
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
        schedules: [
            { day: "Tuesday", startTime: "13:00", endTime: "14:30" },
            { day: "Thursday", startTime: "13:00", endTime: "14:30" },
        ],
    },
    {
        title: "Data Structures & Algorithms",
        description: "Arrays, linked lists, trees, graphs, sorting, searching, and algorithm complexity analysis.",
        capacity: 35,
        dept: "Computer Science",
        icon: "📊",
        schedules: [
            { day: "Monday", startTime: "13:00", endTime: "14:30" },
            { day: "Wednesday", startTime: "13:00", endTime: "14:30" },
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

// ─── Materials ────────────────────────────────────────────────────────────────
// Keyed by course title

const MATERIALS = {
    "Database Systems": [
        { title: "Introduction to SQL", type: "PDF", url: "https://example.com/materials/intro-sql.pdf" },
        { title: "ER Diagram Lecture Slides", type: "PPT", url: "https://example.com/materials/er-diagrams.pptx" },
        { title: "Normalization Worksheet", type: "DOC", url: "https://example.com/materials/normalization.docx" },
        { title: "W3Schools SQL Tutorial", type: "LINK", url: "https://www.w3schools.com/sql/" },
        { title: "Transaction & ACID Properties", type: "PDF", url: "https://example.com/materials/transactions.pdf" },
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
        { title: "Dynamic Programming Notes", type: "DOC", url: "https://example.com/materials/dp-notes.docx" },
    ],
};

// ─── Enrollment distribution ──────────────────────────────────────────────────
// [studentIndex, courseTitle]

const ENROLLMENTS = [
    // Database Systems — 12 students
    [0, "Database Systems"], [1, "Database Systems"], [2, "Database Systems"],
    [3, "Database Systems"], [4, "Database Systems"], [5, "Database Systems"],
    [6, "Database Systems"], [7, "Database Systems"], [8, "Database Systems"],
    [9, "Database Systems"], [10, "Database Systems"], [11, "Database Systems"],

    // Software Engineering — 10 students
    [0, "Software Engineering"], [2, "Software Engineering"], [4, "Software Engineering"],
    [6, "Software Engineering"], [8, "Software Engineering"], [10, "Software Engineering"],
    [12, "Software Engineering"], [14, "Software Engineering"], [16, "Software Engineering"],
    [18, "Software Engineering"],

    // Data Structures & Algorithms — 11 students
    [1, "Data Structures & Algorithms"], [3, "Data Structures & Algorithms"],
    [5, "Data Structures & Algorithms"], [7, "Data Structures & Algorithms"],
    [9, "Data Structures & Algorithms"], [11, "Data Structures & Algorithms"],
    [13, "Data Structures & Algorithms"], [15, "Data Structures & Algorithms"],
    [17, "Data Structures & Algorithms"], [19, "Data Structures & Algorithms"],
    [2, "Data Structures & Algorithms"],
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log("🌱  Seeding data for Ameera ElGhamry…\n");

    // 1. Find the instructor
    const instructor = await prisma.user.findUnique({ where: { email: INSTRUCTOR_EMAIL } });
    if (!instructor) {
        throw new Error(`Instructor not found: ${INSTRUCTOR_EMAIL}`);
    }
    console.log(`✅  Instructor: ${instructor.name}  (id=${instructor.id})\n`);

    // 2. Remove any existing courses for this instructor (clean re-seed)
    //    Must delete enrollments and materials first due to FK constraints
    const existingCourses = await prisma.course.findMany({
        where: { instructorId: instructor.id },
        select: { id: true },
    });
    if (existingCourses.length > 0) {
        const ids = existingCourses.map((c) => c.id);
        await prisma.enrollment.deleteMany({ where: { courseId: { in: ids } } });
        await prisma.material.deleteMany({ where: { courseId: { in: ids } } });
        await prisma.course.deleteMany({ where: { id: { in: ids } } });
        console.log(`🗑   Removed ${existingCourses.length} existing course(s) and their data.\n`);
    }

    // 3. Create courses
    console.log("📚  Creating courses…");
    const courseMap = {}; // title → course record
    for (const c of COURSES) {
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
        courseMap[course.title] = course;
        console.log(`  📖  "${course.title}"  (id=${course.id})`);
    }

    // 4. Upsert students
    console.log("\n🎓  Upserting students…");
    const studentPassword = await bcrypt.hash("Student@123", 10);
    const students = [];
    for (const s of STUDENTS) {
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: { name: s.name, role: "STUDENT" },
            create: { name: s.name, email: s.email, password: studentPassword, role: "STUDENT" },
        });
        students.push(user);
    }
    console.log(`  ✅  ${students.length} students ready.`);

    // 5. Create enrollments — bulk insert, skip duplicates
    console.log("\n📋  Creating enrollments…");
    const enrollmentData = ENROLLMENTS
        .map(([studentIdx, courseTitle]) => {
            const student = students[studentIdx];
            const course = courseMap[courseTitle];
            if (!student || !course) return null;
            return { studentId: student.id, courseId: course.id, status: "ACTIVE" };
        })
        .filter(Boolean);

    const { count: enrollCount } = await prisma.enrollment.createMany({
        data: enrollmentData,
        skipDuplicates: true,
    });
    console.log(`  ✅  ${enrollCount} enrollments created.`);

    // 6. Create materials — bulk insert per course
    console.log("\n📁  Creating materials…");
    let matCount = 0;
    for (const [courseTitle, materials] of Object.entries(MATERIALS)) {
        const course = courseMap[courseTitle];
        if (!course) continue;
        const { count } = await prisma.material.createMany({
            data: materials.map((m) => ({
                title: m.title,
                type: m.type,
                url: m.url,
                storagePath: null,
                courseId: course.id,
                uploadedById: instructor.id,
            })),
            skipDuplicates: true,
        });
        matCount += count;
    }
    console.log(`  ✅  ${matCount} materials created.`);

    // ── Summary ────────────────────────────────────────────────────────────────
    console.log("\n✨  Done!\n");
    console.log("─────────────────────────────────────────────────────");
    console.log(`Instructor login:`);
    console.log(`  Email:    ${INSTRUCTOR_EMAIL}`);
    console.log(`  Password: (your existing password)`);
    console.log(`\nStudent login (any of the 20 students):`);
    console.log(`  e.g.  alex.johnson@student.edu  /  Student@123`);
    console.log("─────────────────────────────────────────────────────");
}

main()
    .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
