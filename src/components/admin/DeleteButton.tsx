"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  label = "Delete",
}: {
  action: () => Promise<unknown>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
      onClick={() => {
        if (confirm("Are you sure you want to delete this item?")) {
          startTransition(async () => {
            await action();
          });
        }
      }}
    >
      {pending ? "..." : label}
    </Button>
  );
}
