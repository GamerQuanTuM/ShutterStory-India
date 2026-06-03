import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "media.json");

function readStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { images: [], videos: [] };
  }
}

export async function GET() {
  const store = readStore();
  return NextResponse.json(store);
}
