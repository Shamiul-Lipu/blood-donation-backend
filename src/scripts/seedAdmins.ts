import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export async function seedAdmins(): Promise<void> {
  try {
    const BETTER_AUTH_URL =
      process.env.BETTER_AUTH_URL || "http://localhost:5000";

    const raw = process.env.ADMIN_USER_JSON;

    if (!raw) {
      console.log("[SeedAdmins] No ADMIN_USER_JSON found");
      return;
    }

    const admin = JSON.parse(raw);

    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (existing) {
      console.log("[SeedAdmins] Admin already exists");
      return;
    }

    console.log("[SeedAdmins] Creating admin...");

    const res = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BETTER_AUTH_URL,
      },
      body: JSON.stringify(admin),
    });

    if (!res.ok) {
      console.error("[SeedAdmins] Sign-up failed");
      return;
    }

    await prisma.user.update({
      where: { email: admin.email },
      data: {
        role: UserRole.SUPER_ADMIN,
        emailVerified: true,
      },
    });

    console.log("[SeedAdmins] ✅ Done");
  } catch (err) {
    console.error("[SeedAdmins] ❌ Error:", err);
  }
}
