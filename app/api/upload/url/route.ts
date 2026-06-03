import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { instagramGetUrl } from "instagram-url-direct";

const DATA_FILE = path.join(process.cwd(), "data", "media.json");
const MAX_IMAGES = 16;
const MAX_VIDEOS = 16;
const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 25;

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
  try {
    const { url, type } = await req.json();

    if (!url || !type) {
      return NextResponse.json({ error: "URL and type are required" }, { status: 400 });
    }

    if (type !== "image" && type !== "video") {
      return NextResponse.json({ error: "Invalid type. Must be image or video" }, { status: 400 });
    }

    const store = readStore();
    const items = type === "image" ? (store.images ?? []) : (store.videos ?? []);
    const maxItems = type === "image" ? MAX_IMAGES : MAX_VIDEOS;

    if (items.length >= maxItems) {
      return NextResponse.json(
        { error: `Maximum ${maxItems} items allowed. Delete one to add more.` },
        { status: 400 }
      );
    }

    let downloadUrl = url;

    // Check if it's an Instagram URL
    if (url.includes("instagram.com")) {
      try {
        const result = await instagramGetUrl(url);
        if (result && result.url_list && result.url_list.length > 0) {
          downloadUrl = result.url_list[0];
        } else {
          return NextResponse.json({ error: "Could not extract media from Instagram URL." }, { status: 400 });
        }
      } catch (e) {
        return NextResponse.json({ error: "Failed to parse Instagram URL. Post might be private or API blocked." }, { status: 400 });
      }
    }

    // Fetch the raw file
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to download media from URL." }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    const size = buffer.byteLength;
    const maxMb = type === "image" ? MAX_IMAGE_MB : MAX_VIDEO_MB;

    if (size > maxMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Maximum ${maxMb}MB allowed for ${type}s.` },
        { status: 400 }
      );
    }

    // Determine extension from content-type or URL
    const contentType = response.headers.get("content-type") || "";
    let ext = type === "image" ? "jpg" : "mp4";
    
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("webm")) ext = "webm";

    const uploadDir = path.join(process.cwd(), "public", "uploads", type === "image" ? "images" : "videos");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const id = `url_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const filename = `${id}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, Buffer.from(buffer));

    const item = {
      id,
      filename,
      url: `/uploads/${type === "image" ? "images" : "videos"}/${filename}`,
      uploadedAt: new Date().toISOString(),
      size,
    };

    if (type === "image") {
      store.images = [...items, item];
    } else {
      store.videos = [...items, item];
    }
    
    writeStore(store);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An unexpected error occurred during URL import." }, { status: 500 });
  }
}
