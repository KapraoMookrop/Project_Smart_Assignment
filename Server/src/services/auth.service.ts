import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { AppError } from "../utils/errors/AppError.js";
import { UserRole } from "../module/app-models.js";
import type { User } from "../module/app-models.js";

export async function login(username: string, password: string):Promise<{ token: string; user: User }> {
  // Allow login by either username or email
  const result = await pool.query(
    `SELECT * FROM sa.Users as u 
    LEFT JOIN 
      sa.Category_Members as cm ON 
    u.user_id = cm.user_id 
      WHERE u.username = $1 OR u.email = $1`,
    [username]
  );

  if (result.rows.length === 0) {
    throw new AppError("ไม่พบผู้ใช้งานนี้ในระบบ", 401);
  }

  const userRow = result.rows[0];

  if (!userRow.is_active) {
    throw new AppError("บัญชีผู้ใช้งานนี้ถูกระงับการใช้งาน", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);
  if (!isPasswordValid) {
    throw new AppError("รหัสผ่านไม่ถูกต้อง", 401);
  }

  const user: User = {
    user_id: userRow.user_id,
    company_id: userRow.company_id,
    username: userRow.username,
    email: userRow.email,
    role: userRow.role as UserRole,
    full_name: userRow.full_name,
    phone: userRow.phone,
    bio: userRow.bio,
    profile_picture_url: userRow.profile_picture_url,
    must_change_password: userRow.must_change_password,
    is_active: userRow.is_active,
    category_id: userRow.category_id
  };

  const token = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: "2h" });

  // Update last_login_at
  await pool.query("UPDATE sa.Users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1", [user.user_id]);

  return { token, user };
}

export async function getCurrentUser(userId: string): Promise<User> {
  const result = await pool.query("SELECT * FROM sa.Users WHERE user_id = $1", [userId]);
  if (result.rows.length === 0) {
     throw new AppError("ไม่พบข้อมูลผู้ใช้งาน", 404);
  }
  
  const userRow = result.rows[0];
  const user: User = {
    user_id: userRow.user_id,
    company_id: userRow.company_id,
    username: userRow.username,
    email: userRow.email,
    role: userRow.role as UserRole,
    full_name: userRow.full_name,
    phone: userRow.phone,
    bio: userRow.bio,
    profile_picture_url: userRow.profile_picture_url,
    must_change_password: userRow.must_change_password,
    is_active: userRow.is_active,
    category_id: userRow.category_id
  };
  return user;
}
