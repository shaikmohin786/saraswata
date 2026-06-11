"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "password" | "image" | "date";
  defaultValue?: string | number;
  options?: { value: string | number; label: string }[];
  rows?: number;
  uploadCategory?: string;
};

type CrudFormProps = {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  fields: Field[];
  hiddenFields?: Record<string, string | number>;
  cancelHref: string;
  submitLabel?: string;
  className?: string;
};

export function CrudForm({
  action,
  fields,
  hiddenFields,
  cancelHref,
  submitLabel = "Save",
  className,
}: CrudFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          const result = await action(fd);
          if (result?.error) setError(result.error);
          else window.location.href = cancelHref;
        });
      }}
      className={cn("admin-form-card space-y-5", className)}
    >
      {hiddenFields &&
        Object.entries(hiddenFields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          {field.type === "image" ? (
            <ImageUploadField
              name={field.name}
              label={field.label}
              defaultValue={String(field.defaultValue ?? "")}
              uploadCategory={field.uploadCategory ?? "images"}
            />
          ) : (
            <>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  defaultValue={String(field.defaultValue ?? "")}
                  rows={field.rows ?? 8}
                  className="admin-input min-h-[8rem] resize-y"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  defaultValue={String(field.defaultValue ?? "")}
                  className="admin-input flex h-10 w-full rounded-md border border-primary/20 bg-white px-3 text-sm"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type === "date" ? "date" : field.type ?? "text"}
                  defaultValue={String(field.defaultValue ?? "")}
                  className="admin-input"
                />
              )}
            </>
          )}
        </div>
      ))}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="admin-form-actions">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        <Link href={cancelHref}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
