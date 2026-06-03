"use client";

import { useState, useRef } from "react";
import { useMedia, MediaItem } from "../../context/MediaContext";

const MAX = 16;
const MAX_VIDEO_MB = 25;

function Toast({
  msg,
  type,
}: {
  msg: string;
  type: "success" | "error" | "";
}) {
  if (!msg) return null;
  return (
    <div className={`toast show ${type}`} style={{ position: "fixed", bottom: 32, right: 32 }}>
      {msg}
    </div>
  );
}

function ConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h4>Delete Video</h4>
        <p>
          This will permanently remove this video from the server and your
          public portfolio. This cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h4 style={{ color: "#E07070" }}>Upload Failed</h4>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn-primary" onClick={onClose}><span>OK</span></button>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const { videos, uploadVideo, uploadFromUrl, deleteVideo } = useMedia();
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => { setToastMsg(""); setToastType(""); }, 3500);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videos.length >= MAX) {
      showToast(`Maximum ${MAX} videos reached. Delete one to add more.`, "error");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setErrorMsg(`Video too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${MAX_VIDEO_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploading(true);
    const err = await uploadVideo(file);
    setUploading(false);
    if (err) showToast(err, "error");
    else showToast("Video uploaded successfully!", "success");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlImport = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!urlInput) return;
    if (videos.length >= MAX) {
      showToast(`Maximum ${MAX} videos reached. Delete one to add more.`, "error");
      return;
    }
    setUploading(true);
    const err = await uploadFromUrl(urlInput, "video");
    setUploading(false);
    if (err) setErrorMsg(err);
    else {
      showToast("Video imported successfully!", "success");
      setUrlInput("");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteVideo(id);
    setConfirmId(null);
    if (ok) showToast("Video deleted.", "success");
    else showToast("Failed to delete. Please try again.", "error");
  };

  const isFull = videos.length >= MAX;

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Video Library</h1>
          <p className="dash-subtitle">Manage your cinematic portfolio</p>
        </div>
        <div
          className={`media-counter${isFull ? " full" : ""}`}
          title={isFull ? "Delete a video to upload more" : ""}
        >
          {videos.length} / {MAX} Videos
        </div>
      </div>

      {isFull && (
        <div
          style={{
            padding: "14px 20px",
            background: "rgba(224,112,112,0.06)",
            border: "1px solid rgba(224,112,112,0.2)",
            color: "#E07070",
            fontSize: "0.82rem",
            marginBottom: 24,
          }}
        >
          ⚠ You&apos;ve reached the maximum of {MAX} videos. Delete an existing
          video to upload a new one.
        </div>
      )}

      <div className="dash-grid">
        {/* Upload slot */}
        {!isFull && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label className={`dash-upload-cell${uploading ? " disabled" : ""}`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleUpload}
                disabled={uploading}
              />
              <span style={{ fontSize: "2rem", color: "var(--gold)" }}>▷</span>
              <span>{uploading ? "Uploading…" : "Upload Local Video"}</span>
              <span style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
                MP4, WebM, MOV · Max 25MB
              </span>
            </label>
            <form onSubmit={handleUrlImport} style={{ display: "flex", gap: "8px" }}>
              <input
                type="url"
                className="form-input"
                placeholder="Or paste Instagram/Direct URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={uploading}
                required
                style={{ padding: "8px 12px", fontSize: "0.8rem", flex: 1 }}
              />
              <button type="submit" className="btn-primary" disabled={uploading} style={{ padding: "8px 16px", fontSize: "0.8rem", height: "auto" }}>
                <span>{uploading ? "Importing…" : "Import"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Filled slots */}
        {videos.map((vid: MediaItem) => (
          <div
            key={vid.id}
            className="dash-media-cell"
            onMouseEnter={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (v) v.play().catch(() => { });
            }}
            onMouseLeave={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (v) { v.pause(); v.currentTime = 0; }
            }}
          >
            <video
              src={vid.url}
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Play icon */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                color: "var(--white)",
              }}
            >
              ▷
            </div>
            <div className="dash-media-cell-actions">
              <button
                className="btn-primary"
                style={{ padding: "8px 14px", fontSize: "0.7rem" }}
                onClick={() => setPreviewVideo(vid.url)}
              >
                <span>Preview</span>
              </button>
              <button
                className="btn-danger"
                style={{ padding: "8px 14px", fontSize: "0.7rem" }}
                onClick={() => setConfirmId(vid.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: MAX - videos.length - (isFull ? 0 : 1) }, (_, i) => (
          <div key={`empty-${i}`} className="dash-upload-cell disabled" style={{ opacity: 0.15 }}>
            <span style={{ fontSize: "1.5rem" }}>▷</span>
            <span>Empty Slot</span>
          </div>
        ))}
      </div>

      {/* Video preview modal */}
      {previewVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setPreviewVideo(null)}
            >
              ✕ Close
            </button>
            <video
              src={previewVideo}
              controls
              autoPlay
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmId && (
        <ConfirmModal
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {errorMsg && (
        <ErrorModal message={errorMsg} onClose={() => setErrorMsg("")} />
      )}

      <Toast msg={toastMsg} type={toastType} />
    </>
  );
}
