import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "media.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "videos");
const MAX_VIDEOS = 16;
const MAX_SIZE_MB = 10;

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

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: MP4, WebM, OGG, MOV, AVI" },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_SIZE_MB}MB` },
      { status: 400 }
    );
  }

  const store = readStore();
  const videos: object[] = store.videos ?? [];

  if (videos.length >= MAX_VIDEOS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_VIDEOS} videos allowed. Delete one to add more.` },
      { status: 400 }
    );
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() ?? "mp4";
  const id = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  // Write file
  const bytes = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(bytes));

  const item = {
    id,
    filename,
    url: `/uploads/videos/${filename}`,
    uploadedAt: new Date().toISOString(),
    size: file.size,
  };

  store.videos = [...videos, item];
  writeStore(store);

  return NextResponse.json({ success: true, item }, { status: 201 });
}
