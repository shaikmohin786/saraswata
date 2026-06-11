"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  uploadCategory: string;
};

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  uploadCategory,
}: ImageUploadFieldProps) {
  const [filename, setFilename] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", uploadCategory);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFilename(data.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const previewUrl = filename
    ? filename.startsWith("/") || filename.startsWith("http")
      ? filename
      : `/media/${uploadCategory}/${filename}`
    : null;

  return (
    <div className="space-y-3 rounded-lg border border-[var(--border)] bg-secondary/20 p-4">
      <Label htmlFor={`${name}-file`}>{label}</Label>
      <input type="hidden" name={name} value={filename} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={filename}
          readOnly
          placeholder="No image selected"
          className="admin-input flex-1 bg-white"
        />
        <label htmlFor={`${name}-file`} className="shrink-0 cursor-pointer">
          <span className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-white px-3 text-sm font-medium text-primary hover:bg-secondary sm:w-auto">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Browse"}
          </span>
        </label>
        <input
          id={`${name}-file`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Preview"
          className="h-28 w-auto max-w-full rounded-md border border-[var(--border)] object-contain bg-white p-1"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
