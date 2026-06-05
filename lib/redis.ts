import fs from "fs";
import path from "path";
import Redis from "ioredis";

// Dynamically load .env in development if REDIS_URL is missing
if (!process.env.REDIS_URL) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, "utf-8");
      envFile.split("\n").forEach((line) => {
        const idx = line.indexOf("=");
        if (idx !== -1) {
          const key = line.substring(0, idx).trim();
          const value = line.substring(idx + 1).replace(/(^"|"$)/g, "").replace(/\\n/g, "\n").trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to parse .env:", err);
  }
}

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export default redis;