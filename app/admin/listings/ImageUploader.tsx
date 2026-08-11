"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type ImageUploaderProps = {
  name: string;
  defaultImages: string;
};

export default function ImageUploader({ name, defaultImages }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(
    defaultImages ? defaultImages.split(",").filter(Boolean) : []
  );
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Uploading "${label}" timed out. Check your connection and try again.`)),
        ms
      );
      promise.then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const fileList = Array.from(files);
    const uploaded: string[] = [];

    for (const file of fileList) {
      setStatusText(`Uploading ${file.name}…`);
      try {
        const blob = await withTimeout(
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          }),
          60_000,
          file.name
        );
        uploaded.push(blob.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
        break;
      }
    }

    if (uploaded.length > 0) {
      setImages((prev) => [...prev, ...uploaded]);
    }
    setUploading(false);
    setStatusText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function addUrl(value: string) {
    const extra = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (extra.length === 0) return;
    setImages((prev) => Array.from(new Set([...prev, ...extra])));
  }

  return (
    <div>
      <input type="hidden" name={name} value={images.join(",")} />

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src) => (
            <div
              key={src}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(src)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-4 py-4 text-center text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-700">
        {uploading ? statusText || "Uploading…" : "Upload photos from your phone or computer"}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <p className="mt-2 text-xs text-slate-500">Or paste an image URL and press Enter:</p>
      <input
        type="text"
        placeholder="/images/example.svg or https://…"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addUrl(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
