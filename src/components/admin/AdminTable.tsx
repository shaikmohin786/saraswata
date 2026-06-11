import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type AdminTableProps<T extends { id?: number }> = {
  columns: Column<T>[];
  rows: T[];
  editPath?: string;
  idKey?: string;
  onDelete?: (id: number) => void;
  deleteAction?: (id: number) => Promise<unknown>;
  className?: string;
};

export function AdminTable<T extends Record<string, unknown>>({
  columns,
  rows,
  editPath,
  idKey = "id",
  deleteAction,
  className,
}: AdminTableProps<T>) {
  const hasActions = editPath || deleteAction;

  return (
    <div className={cn("admin-table-wrap", className)}>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="admin-table-empty">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const rowId = row[idKey] as number;
              return (
                <tr key={rowId ?? i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {editPath && (
                          <Link href={`${editPath}/${rowId}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        )}
                        {deleteAction && (
                          <form
                            action={async () => {
                              "use server";
                              await deleteAction(rowId);
                            }}
                          >
                            <Button variant="outline" size="sm" type="submit">
                              Delete
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: number }) {
  return (
    <Badge variant={status === 0 ? "success" : "warning"}>
      {status === 0 ? "Active" : "Inactive"}
    </Badge>
  );
}

/** Shared table wrapper for inline admin list pages */
export function AdminTableShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("admin-table-wrap", className)}>{children}</div>;
}

export function adminTableClassName() {
  return "admin-table";
}
