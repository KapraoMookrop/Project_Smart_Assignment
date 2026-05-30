import pool from "../config/database.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/errors/AppError.js";
import { UserRole } from "../module/app-models.js";
import type { User } from "../module/app-models.js";

export async function getUsers(companyId: string): Promise<User[]> {
  const result = await pool.query(
    "SELECT user_id, company_id, username, email, role, full_name, phone, bio, profile_picture_url, is_active, last_login_at, created_at, updated_at FROM sa.Users WHERE company_id = $1 ORDER BY created_at DESC",
    [companyId]
  );
  return result.rows;
}

export async function getUserById(companyId: string, userId: string): Promise<User> {
  const result = await pool.query(
    "SELECT user_id, company_id, username, email, role, full_name, phone, bio, profile_picture_url, is_active, last_login_at, created_at, updated_at FROM sa.Users WHERE company_id = $1 AND user_id = $2",
    [companyId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError("ไม่พบผู้ใช้งานนี้", 404);
  }

  return result.rows[0];
}

export async function saveUser(companyId: string, user: Partial<User>): Promise<User> {
  if (user.user_id) {
    // Update
    const result = await pool.query(
      `UPDATE sa.Users 
       SET full_name = $1, role = $2, is_active = $3, phone = $4 
       WHERE company_id = $5 AND user_id = $6 
       RETURNING user_id, company_id, username, email, role, full_name, phone, bio, profile_picture_url, is_active`,
      [user.full_name, user.role, user.is_active, user.phone, companyId, user.user_id]
    );

    if (result.rows.length === 0) {
      throw new AppError("ไม่สามารถอัปเดตผู้ใช้งานได้", 404);
    }
    return result.rows[0];
  } else {
    // Insert new user
    const defaultPassword = "password123"; // In a real app, generate a random password or send invite link
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const result = await pool.query(
      `INSERT INTO sa.Users (company_id, username, email, password_hash, role, full_name, phone, is_active, must_change_password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) 
       RETURNING user_id, company_id, username, email, role, full_name, phone, bio, profile_picture_url, is_active`,
      [companyId, user.username, user.email, hashedPassword, user.role || UserRole.User, user.full_name, user.phone, user.is_active !== false]
    );
    return result.rows[0];
  }
}

export async function deleteUser(companyId: string, userId: string): Promise<void> {
  const result = await pool.query(
    "DELETE FROM sa.Users WHERE company_id = $1 AND user_id = $2",
    [companyId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError("ไม่พบผู้ใช้งานนี้หรือไม่สามารถลบได้", 404);
  }
}

export async function updateProfile(companyId: string, userId: string, profile: Partial<User>): Promise<User> {
  const result = await pool.query(
    `UPDATE sa.Users 
     SET full_name = $1, phone = $2, bio = $3 
     WHERE company_id = $4 AND user_id = $5 
     RETURNING user_id, company_id, username, email, role, full_name, phone, bio, profile_picture_url, is_active`,
    [profile.full_name, profile.phone, profile.bio, companyId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError("ไม่สามารถอัปเดตโปรไฟล์ได้", 404);
  }

  return result.rows[0];
}
