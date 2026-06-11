import { auth } from "@/auth";
import { execFile } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  const parsed = new URL(url);
  const host = parsed.hostname || "localhost";
  const port = parsed.port || "3306";
  const user = decodeURIComponent(parsed.username || "root");
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace(/^\//, "") || "saraswat_db";

  const mysqldumpPaths = [
    "C:\\wamp\\bin\\mysql\\mysql5.6.12\\bin\\mysqldump.exe",
    "mysqldump",
  ];

  let stdout = "";
  let lastError: Error | null = null;

  for (const bin of mysqldumpPaths) {
    try {
      const args = [`-h${host}`, `-P${port}`, `-u${user}`, database];
      if (password) args.splice(3, 0, `-p${password}`);
      const result = await execFileAsync(bin, args, { maxBuffer: 50 * 1024 * 1024 });
      stdout = result.stdout;
      lastError = null;
      break;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  if (lastError || !stdout) {
    return NextResponse.json(
      { error: "mysqldump failed. Ensure WAMP MySQL is running." },
      { status: 500 }
    );
  }

  const filename = `saraswat_db_${new Date().toISOString().slice(0, 10)}.sql`;
  return new NextResponse(stdout, {
    headers: {
      "Content-Type": "application/sql",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
