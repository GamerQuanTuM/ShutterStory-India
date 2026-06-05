import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import cloudinary from "../../../../lib/cloudinary";
import redis from "../../../../lib/redis";

async function readStore() {
  try {
    const raw = await redis.get("media_store");
    return raw ? JSON.parse(raw as string) : { images: [], videos: [] };
  } catch {
    return { images: [], videos: [] };
  }
}

async function writeStore(store: object) {
  await redis.set("media_store", JSON.stringify(store));
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, type } = body;

  if (!id || !type) {
    return NextResponse.json({ error: "id and type are required" }, { status: 400 });
  }

  const store = await readStore();

  if (type === "image") {
    const item = store.images?.find((i: { id: string, public_id?: string, filename: string }) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (process.env.ASSETS_PROVIDER === "Cloudinary" && item.public_id) {
      try {
        await cloudinary.uploader.destroy(item.public_id, { resource_type: "image" });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    } else {
      // Remove physical file
      const filePath = path.join(process.cwd(), "public", "uploads", "images", item.filename);
      try { fs.unlinkSync(filePath); } catch { /* may already be deleted */ }
    }

    store.images = store.images.filter((i: { id: string }) => i.id !== id);
    await writeStore(store);
    return NextResponse.json({ success: true });
  }

  if (type === "video") {
    const item = store.videos?.find((i: { id: string, public_id?: string, filename: string }) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (process.env.ASSETS_PROVIDER === "Cloudinary" && item.public_id) {
      try {
        await cloudinary.uploader.destroy(item.public_id, { resource_type: "video" });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    } else {
      // Remove physical file
      const filePath = path.join(process.cwd(), "public", "uploads", "videos", item.filename);
      try { fs.unlinkSync(filePath); } catch { /* may already be deleted */ }
    }

    store.videos = store.videos.filter((i: { id: string }) => i.id !== id);
    await writeStore(store);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
