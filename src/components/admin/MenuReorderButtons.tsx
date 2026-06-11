"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { reorderMenuItem } from "@/actions/admin";
import { ChevronUp, ChevronDown } from "lucide-react";

export function MenuReorderButtons({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await reorderMenuItem(id, direction);
      window.location.reload();
    });
  }

  return (
    <div className="flex gap-1">
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => move("up")}>
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => move("down")}>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
