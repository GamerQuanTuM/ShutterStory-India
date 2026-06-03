import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "media.json");

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return { images: [], videos: [] };
  }
}

function writeStore(store: object) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, type } = body;

  if (!id || !type) {
    return NextResponse.json({ error: "id and type are required" }, { status: 400 });
  }

  const store = readStore();

  if (type === "image") {
    const item = store.images?.find((i: { id: string }) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove physical file
    const filePath = path.join(process.cwd(), "public", "uploads", "images", item.filename);
    try { fs.unlinkSync(filePath); } catch { /* may already be deleted */ }

    store.images = store.images.filter((i: { id: string }) => i.id !== id);
    writeStore(store);
    return NextResponse.json({ success: true });
  }

  if (type === "video") {
    const item = store.videos?.find((i: { id: string }) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove physical file
    const filePath = path.join(process.cwd(), "public", "uploads", "videos", item.filename);
    try { fs.unlinkSync(filePath); } catch { /* may already be deleted */ }

    store.videos = store.videos.filter((i: { id: string }) => i.id !== id);
    writeStore(store);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
