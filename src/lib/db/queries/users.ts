import { query, queryOne } from "@/lib/db/connection";

export type AdminUser = {
  UserID: number;
  UserName: string;
  UserFirstName: string;
  UserLastName: string;
  UserEmailID: string;
  UserPassword: string;
  UserRole: number;
  UserStatus: number;
  UserDelete: number;
  UserProfilePic: string;
  UserPhone: string;
};

export async function getUserByEmail(email: string) {
  return queryOne<AdminUser>(
    "SELECT * FROM users WHERE UserEmailID = ? AND UserDelete = 0 LIMIT 1",
    [email]
  );
}

export async function getUserById(id: number) {
  return queryOne<AdminUser>(
    "SELECT UserID, UserName, UserFirstName, UserLastName, UserEmailID, UserRole, UserStatus, UserDelete, UserProfilePic, UserPhone FROM users WHERE UserID = ? LIMIT 1",
    [id]
  );
}

export async function getAllUsers() {
  return query<AdminUser>(
    "SELECT UserID, UserName, UserFirstName, UserLastName, UserEmailID, UserRole, UserStatus, UserDelete FROM users WHERE UserDelete = 0 ORDER BY UserID ASC"
  );
}
