import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import { seedAdmins } from "./scripts/seedAdmins";

const port = config.port;

async function server() {
  try {
    await prisma.$connect();

    app.listen(port, async () => {
      console.log(`Server is running on port ${port}`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Starting admin seeding...");
      await seedAdmins();
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();
