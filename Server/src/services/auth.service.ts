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
    `SELECT 
      u.*, 
      cm.category_id,
      c.name as category_name
    FROM sa.Users as u 
    LEFT JOIN 
      sa.Category_Members as cm ON 
    u.user_id = cm.user_id 
    LEFT JOIN 
      sa.Categories as c ON 
    cm.category_id = c.category_id
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
    category_id: userRow.category_id,
    category_name: userRow.category_name
  };

  const token = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: "2h" });

  // Update last_login_at
  await pool.query("UPDATE sa.Users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1", [user.user_id]);

  return { token, user };
}

export async function getCurrentUser(userId: string): Promise<User> {
  const result = await pool.query(`SELECT 
    u.*, 
    (SELECT COUNT(*) FROM sa.Tasks WHERE assigned_to = u.user_id AND status = 'Done') as completed_tasks,
    (SELECT COUNT(*) FROM sa.Tasks WHERE assigned_to = u.user_id AND status = 'In Progress') as in_progress_tasks,
    (SELECT COUNT(*) FROM sa.Tasks WHERE created_by = u.user_id) as created_tasks,
    c.name as category_name,
    cm.category_id as category_id,
    comp.name as company_name
    FROM sa.Users as u 
    LEFT JOIN sa.Category_Members as cm ON u.user_id = cm.user_id
    LEFT JOIN sa.Categories as c ON cm.category_id = c.category_id
    LEFT JOIN sa.Companies as comp ON u.company_id = comp.company_id
    WHERE u.user_id = $1`, [userId]);
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
    category_id: userRow.category_id,
    category_name: userRow.category_name,
    company_name: userRow.company_name,
    completed_tasks: userRow.completed_tasks ?? 0,
    in_progress_tasks: userRow.in_progress_tasks ?? 0,
    created_tasks: userRow.created_tasks ?? 0
  };
  return user;
}
