import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import cloudinary from "../../../../lib/cloudinary";
import redis from "../../../../lib/redis";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "videos");
const MAX_VIDEOS = 16;
const MAX_SIZE_MB = 25;

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

  const store = await readStore();
  const videos: object[] = store.videos ?? [];

  if (videos.length >= MAX_VIDEOS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_VIDEOS} videos allowed. Delete one to add more.` },
      { status: 400 }
    );
  }

  const id = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let itemUrl = "";
  let itemPublicId = "";
  let finalSize = file.size;

  if (process.env.ASSETS_PROVIDER === "Cloudinary") {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ShutterStory-India/video",
            resource_type: "video",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const result = uploadResult as any;
      itemUrl = result.secure_url;
      itemPublicId = result.public_id;
      finalSize = result.bytes;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json({ error: "Failed to upload to Cloudinary" }, { status: 500 });
    }
  } else {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const ext = file.name.split(".").pop() ?? "mp4";
    const filename = `${id}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    itemUrl = `/uploads/videos/${filename}`;
  }

  const item = {
    id,
    filename: process.env.ASSETS_PROVIDER === "Cloudinary" ? itemPublicId : file.name,
    public_id: itemPublicId || undefined,
    url: itemUrl,
    uploadedAt: new Date().toISOString(),
    size: finalSize,
  };

  store.videos = [...videos, item];
  await writeStore(store);

  return NextResponse.json({ success: true, item }, { status: 201 });
}
