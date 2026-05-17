import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Fouda1234", 10);

  const user = await prisma.user.upsert({
    where:  { email: "abdelrahmanfouda17@gmail.com" },
    update: {
      role:            "ADMIN",
      password:        hashedPassword,
      isEmailVerified: true,
    },
    create: {
      name:            "Admin",
      email:           "abdelrahmanfouda17@gmail.com",
      password:        hashedPassword,
      role:            "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log(`✅ Done! ${user.email} is now role: ${user.role}`);
}

main()
  .catch((e) => { console.error("❌ Failed:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
