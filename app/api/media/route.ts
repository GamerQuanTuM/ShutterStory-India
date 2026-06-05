import { NextResponse } from "next/server";
import redis from "../../../lib/redis";

export async function GET() {
  try {
    const raw = await redis.get("media_store");
    const store = raw ? JSON.parse(raw as string) : { images: [], videos: [] };
    return NextResponse.json(store);
  } catch (e) {
    console.error("Redis error:", e);
    return NextResponse.json({ images: [], videos: [] });
  }
}
