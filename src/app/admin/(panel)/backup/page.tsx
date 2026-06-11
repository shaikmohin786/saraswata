import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { fixLegacyData } from "@/actions/admin";

const sqlInstructions = `Database Backup & Import Instructions
=====================================

Prerequisites:
- WAMP MySQL service must be running

Import legacy database:
1. Open MySQL console or run: npm run db:import

Export backup:
   Click "Download Database" above, or run:
   mysqldump -u root saraswat_db > saraswat_db_backup.sql
`;

export default async function AdminBackupPage() {
  const session = await auth();
  const downloadHref = `data:text/plain;charset=utf-8,${encodeURIComponent(sqlInstructions)}`;

  return (
    <>
      <AdminHeader title="Backup" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="max-w-2xl space-y-6 rounded-lg border border-primary/10 bg-white p-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-primary">Database Backup</h2>
            <p className="text-sm text-muted">
              Download a full SQL dump of your database. Use this for regular backups before making changes.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-md bg-secondary/40 p-4 text-xs">{sqlInstructions}</pre>

          <div className="flex flex-wrap gap-3">
            <a href="/api/admin/backup">
              <Button type="button">Download Database (.sql)</Button>
            </a>
            <a href={downloadHref} download="sql-backup-instructions.txt">
              <Button type="button" variant="outline">Download Instructions</Button>
            </a>
            <form action={async () => { "use server"; await fixLegacyData(); }}>
              <Button type="submit" variant="outline">Fix Legacy Data</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
