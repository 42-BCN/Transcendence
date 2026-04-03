import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { prisma } from "../src/lib/prisma";
import { generateUsername } from "../src/shared/utils/username-generator";

async function insertSeedUser(): Promise<boolean> {
  const email = faker.internet.email().toLowerCase();
  const username = generateUsername();
  const plainPassword = "Password123!";
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        provider: "local",
        emailVerifiedAt: new Date(),
        isBlocked: false,
        failedAttempts: 0,
        lastLoginAt: new Date(),
      },
      select: { id: true },
    });

    return true;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return false;
    }
    throw error;
  }
}

async function insertSpecificUser(user: string): Promise<void> {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  await prisma.user.upsert({
    where: { email: `${user}@fakemail.com` },
    update: {},
    create: {
      email: `${user}@fakemail.com`,
      username: user,
      passwordHash,
      provider: "local",
      emailVerifiedAt: new Date(),
      isBlocked: false,
      failedAttempts: 0,
      lastLoginAt: new Date(),
    },
  });
}

export async function seed(): Promise<void> {
  console.log("Seeding Database");

  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seeding is only allowed in development.");
  }

  const requested = Number(process.argv[2] ?? 10);
  const safeCount = Math.min(Math.max(requested, 1), 500);

  let inserted = 0;
  let attempts = 0;

  try {
    await insertSpecificUser("capapes");
    await insertSpecificUser("mfontser");
    await insertSpecificUser("joanavar");
    await insertSpecificUser("cmanica");

    while (inserted < safeCount && attempts < safeCount * 5) {
      attempts++;
      if (await insertSeedUser()) inserted++;
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log({ requested: safeCount, inserted, attempts });
  console.log("Seeded");
}

seed().catch((err) => {
  console.error("Database Seed failed: ", err);
  process.exitCode = 1;
});
