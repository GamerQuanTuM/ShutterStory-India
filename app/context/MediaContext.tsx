"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface MediaStore {
  images: MediaItem[];
  videos: MediaItem[];
}

export interface Submission {
  submittedAt: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface MediaContextType {
  images: MediaItem[];
  videos: MediaItem[];
  submissions: Submission[];
  loading: boolean;
  refresh: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  uploadVideo: (file: File) => Promise<string | null>;
  uploadFromUrl: (url: string, type: "image" | "video") => Promise<string | null>;
  deleteImage: (id: string) => Promise<boolean>;
  deleteVideo: (id: string) => Promise<boolean>;
}

const MediaContext = createContext<MediaContextType | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [mediaRes, subRes] = await Promise.all([
        fetch("/api/media").catch(() => null),
        fetch("/api/submissions").catch(() => null)
      ]);

      if (mediaRes && mediaRes.ok) {
        const data: MediaStore = await mediaRes.json();
        setImages(data.images ?? []);
        setVideos(data.videos ?? []);
      }
      if (subRes && subRes.ok) {
        const data = await subRes.json();
        setSubmissions(data.submissions ?? []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadImage = async (
    file: File
  ): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/images", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return (await res.json()).error ?? "Upload failed";
    await refresh();
    return null;
  };

  const uploadVideo = async (
    file: File
  ): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/videos", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return (await res.json()).error ?? "Upload failed";
    await refresh();
    return null;
  };

  const uploadFromUrl = async (
    url: string,
    type: "image" | "video"
  ): Promise<string | null> => {
    const res = await fetch("/api/upload/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, type }),
    });
    if (!res.ok) return (await res.json()).error ?? "URL Import failed";
    await refresh();
    return null;
  };

  const deleteImage = async (id: string): Promise<boolean> => {
    const res = await fetch("/api/media/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: "image" }),
    });
    if (res.ok) await refresh();
    return res.ok;
  };

  const deleteVideo = async (id: string): Promise<boolean> => {
    const res = await fetch("/api/media/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: "video" }),
    });
    if (res.ok) await refresh();
    return res.ok;
  };

  return (
    <MediaContext.Provider
      value={{
        images,
        videos,
        submissions,
        loading,
        refresh,
        uploadImage,
        uploadVideo,
        uploadFromUrl,
        deleteImage,
        deleteVideo,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used inside MediaProvider");
  return ctx;
}
