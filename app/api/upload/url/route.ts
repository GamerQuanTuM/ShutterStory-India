import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { instagramGetUrl } from "instagram-url-direct";
import cloudinary from "../../../../lib/cloudinary";
import redis from "../../../../lib/redis";

const MAX_IMAGES = 16;
const MAX_VIDEOS = 16;
const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 25;

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
  try {
    const { url, type } = await req.json();

    if (!url || !type) {
      return NextResponse.json({ error: "URL and type are required" }, { status: 400 });
    }

    if (type !== "image" && type !== "video") {
      return NextResponse.json({ error: "Invalid type. Must be image or video" }, { status: 400 });
    }

    const store = await readStore();
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

    const id = `url_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let itemUrl = "";
    let itemPublicId = "";
    let finalSize = 0;
    let finalExt = type === "image" ? "jpg" : "mp4";

    if (process.env.ASSETS_PROVIDER === "Cloudinary") {
      try {
        const uploadResult = await cloudinary.uploader.upload(downloadUrl, {
          folder: `ShutterStory-India/${type}`,
          resource_type: type === "image" ? "image" : "video",
        });
        itemUrl = uploadResult.secure_url;
        itemPublicId = uploadResult.public_id;
        finalSize = uploadResult.bytes;
        finalExt = uploadResult.format || finalExt;
      } catch (err) {
        console.error("Cloudinary upload URL error:", err);
        return NextResponse.json({ error: "Failed to upload from URL to Cloudinary" }, { status: 500 });
      }
    } else {
      // Fetch the raw file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to download media from URL." }, { status: 400 });
      }

      const buffer = await response.arrayBuffer();
      finalSize = buffer.byteLength;
      const maxMb = type === "image" ? MAX_IMAGE_MB : MAX_VIDEO_MB;

      if (finalSize > maxMb * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large. Maximum ${maxMb}MB allowed for ${type}s.` },
          { status: 400 }
        );
      }

      // Determine extension from content-type or URL
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("png")) finalExt = "png";
      else if (contentType.includes("webp")) finalExt = "webp";
      else if (contentType.includes("gif")) finalExt = "gif";
      else if (contentType.includes("webm")) finalExt = "webm";

      const uploadDir = path.join(process.cwd(), "public", "uploads", type === "image" ? "images" : "videos");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${id}.${finalExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, Buffer.from(buffer));
      itemUrl = `/uploads/${type === "image" ? "images" : "videos"}/${filename}`;
    }

    const item = {
      id,
      filename: process.env.ASSETS_PROVIDER === "Cloudinary" ? itemPublicId : `${id}.${finalExt}`,
      public_id: itemPublicId || undefined,
      url: itemUrl,
      uploadedAt: new Date().toISOString(),
      size: finalSize,
    };

    if (type === "image") {
      store.images = [...items, item];
    } else {
      store.videos = [...items, item];
    }
    
    await writeStore(store);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An unexpected error occurred during URL import." }, { status: 500 });
  }
}
