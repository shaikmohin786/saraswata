import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const parsed = new URL(url);
  return mysql.createPool({
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    waitForConnections: true,
    connectionLimit: 20,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
    charset: "utf8mb4",
  });
}

export const pool = globalForMysql.mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForMysql.mysqlPool = pool;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: (string | number | Date | null)[] = []) {
  const [result] = await pool.execute(sql, params);
  return result as { insertId?: number; affectedRows?: number };
}
