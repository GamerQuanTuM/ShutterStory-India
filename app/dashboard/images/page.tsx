"use client";

import { useState, useRef } from "react";
import { useMedia, MediaItem } from "../../context/MediaContext";
import { Loader2 } from "lucide-react";

const MAX = 16;
const MAX_IMAGE_MB = 5;

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
  isDeleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h4>Delete Image</h4>
        <p>
          This will permanently remove this image from the server and your
          public portfolio. This cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button className="btn-danger" onClick={onConfirm} disabled={isDeleting} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isDeleting ? <><Loader2 className="animate-spin" size={16} /> Deleting...</> : "Delete"}
          </button>
          <button className="btn-ghost" onClick={onCancel} disabled={isDeleting}>
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

export default function ImagesPage() {
  const { images, uploadImage, uploadFromUrl, deleteImage } = useMedia();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
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
    if (images.length >= MAX) {
      showToast(`Maximum ${MAX} images reached. Delete one to add more.`, "error");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrorMsg(`Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${MAX_IMAGE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploading(true);
    const err = await uploadImage(file);
    setUploading(false);
    if (err) showToast(err, "error");
    else showToast("Image uploaded successfully!", "success");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    if (images.length >= MAX) {
      showToast(`Maximum ${MAX} images reached. Delete one to add more.`, "error");
      return;
    }
    setUploading(true);
    const err = await uploadFromUrl(urlInput, "image");
    setUploading(false);
    if (err) setErrorMsg(err);
    else {
      showToast("Image imported successfully!", "success");
      setUrlInput("");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteImage(id);
    setDeletingId(null);
    setConfirmId(null);
    if (ok) showToast("Image deleted.", "success");
    else showToast("Failed to delete. Please try again.", "error");
  };

  const isFull = images.length >= MAX;

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Image Gallery</h1>
          <p className="dash-subtitle">Manage your portfolio photographs</p>
        </div>
        <div
          className={`media-counter${isFull ? " full" : ""}`}
          title={isFull ? "Delete an image to upload more" : ""}
        >
          {images.length} / {MAX} Images
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
          ⚠ You&apos;ve reached the maximum of {MAX} images. Delete an existing
          image to upload a new one.
        </div>
      )}

      <div className="dash-grid">
        {/* Upload slot (only if not full) */}
        {!isFull && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label className={`dash-upload-cell${uploading ? " disabled" : ""}`} style={{ position: "relative" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Loader2 className="animate-spin" size={32} color="var(--gold)" />
                  <span>Uploading…</span>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: "2rem", color: "var(--gold)" }}>+</span>
                  <span>Upload Local Image</span>
                  <span style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
                    JPG, PNG, WebP · Max 5MB
                  </span>
                </>
              )}
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
              <button type="submit" className="btn-primary" disabled={uploading} style={{ padding: "8px 16px", fontSize: "0.8rem", height: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                {uploading ? <><Loader2 className="animate-spin" size={14} /> <span>Importing…</span></> : <span>Import</span>}
              </button>
            </form>
          </div>
        )}

        {/* Filled slots */}
        {images.map((img: MediaItem) => (
          <div key={img.id} className="dash-media-cell" style={{ opacity: deletingId === img.id ? 0.5 : 1 }}>
            <img
              src={img.url}
              alt={`Photo ${images.indexOf(img) + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {deletingId === img.id && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
                <Loader2 className="animate-spin" size={32} color="#fff" />
              </div>
            )}
            <div className="dash-media-cell-actions">
              <button
                className="btn-danger"
                style={{ padding: "8px 14px", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}
                onClick={() => setConfirmId(img.id)}
                disabled={deletingId === img.id}
              >
                {deletingId === img.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}

        {/* Empty placeholder slots */}
        {Array.from({ length: MAX - images.length - (isFull ? 0 : 1) }, (_, i) => (
          <div key={`empty-${i}`} className="dash-upload-cell disabled" style={{ opacity: 0.15 }}>
            <span style={{ fontSize: "1.5rem" }}>◈</span>
            <span>Empty Slot</span>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmId && (
        <ConfirmModal
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
          isDeleting={deletingId === confirmId}
        />
      )}

      {errorMsg && (
        <ErrorModal message={errorMsg} onClose={() => setErrorMsg("")} />
      )}

      <Toast msg={toastMsg} type={toastType} />
    </>
  );
}
