"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageOff, Loader2, CheckCircle } from "lucide-react";
import { uploadListingImage } from "@/lib/storage";
import styles from "./ImageUploader.module.css";

interface Props {
  listingId: string;
  onUploaded: (url: string | null) => void;
  currentUrl?: string;
}

export default function ImageUploader({ listingId, onUploaded, currentUrl }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError("");

    // Validate
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, WEBP or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    const url = await uploadListingImage(file, listingId);
    setUploading(false);

    if (!url) {
      setError("Upload failed. Check your Supabase storage bucket exists.");
      setPreview(null);
      onUploaded(null);
      return;
    }

    onUploaded(url);
  }, [listingId, onUploaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError("");
    onUploaded(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ""} ${preview ? styles.hasPreview : ""}`}
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* No image state */}
        {!preview && !uploading && (
          <div className={styles.empty}>
            <div className={styles.noImageIcon}>
              <ImageOff size={36} className={styles.noImgSvg} />
            </div>
            <div className={styles.emptyText}>
              <span className={styles.emptyMain}>Drop image here or <u>click to browse</u></span>
              <span className={styles.emptySub}>JPG, PNG, WEBP, GIF · Max 5MB · Deleted after 10 days</span>
            </div>
            <div className={styles.uploadIconWrap}>
              <Upload size={18} className={styles.uploadIcon} />
            </div>
          </div>
        )}

        {/* Uploading state */}
        {uploading && (
          <div className={styles.uploading}>
            {preview && <img src={preview} alt="preview" className={styles.uploadingImg} />}
            <div className={styles.uploadingOverlay}>
              <Loader2 size={28} className={styles.spinner} />
              <span>Uploading...</span>
            </div>
          </div>
        )}

        {/* Preview state */}
        {preview && !uploading && (
          <div className={styles.preview}>
            <img src={preview} alt="Listing image" className={styles.previewImg} />
            <div className={styles.previewOverlay}>
              <CheckCircle size={18} className={styles.checkIcon} />
              <span>Image uploaded</span>
              <span className={styles.expiry}>⏱ Expires in 10 days</span>
            </div>
            <button className={styles.clearBtn} onClick={clear} title="Remove image">
              <X size={14} />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.hiddenInput}
          onChange={onInputChange}
        />
      </div>

      {error && (
        <p className={styles.error}>
          <ImageOff size={13} /> {error}
        </p>
      )}

      <p className={styles.note}>
        📦 Images are stored in Supabase Storage and automatically deleted after 10 days. For permanent images, use an external URL below.
      </p>
    </div>
  );
}
