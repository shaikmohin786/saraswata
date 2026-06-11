import { cache } from "react";
import { queryOne } from "@/lib/db/connection";
import type { GlobalSettings } from "@/types/cms";

export const getGlobalSettings = cache(async () => {
  return queryOne<GlobalSettings>(
    "SELECT * FROM global_settings ORDER BY ConfigID ASC LIMIT 1"
  );
});
