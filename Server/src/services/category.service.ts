import pool from "../config/database.js";
import { AppError } from "../utils/errors/AppError.js";
import type { Category, User, CategorySearchPayload } from "../module/app-models.js";

export async function getCategories(companyId: string, payload?: CategorySearchPayload): Promise<Category[]> {
  let query = "SELECT * FROM sa.Categories WHERE company_id = $1";
  const params: any[] = [companyId];
  
  if (payload?.keyword) {
    query += " AND name ILIKE $2";
    params.push(`%${payload.keyword}%`);
  }
  
  query += " ORDER BY created_at DESC";
  
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getCategoriesByCompany(companyId: string, payload?: CategorySearchPayload): Promise<Category[]> {
  let query = "SELECT * FROM sa.Categories WHERE company_id = $1";
  const params: any[] = [companyId];
  
  if (payload?.keyword) {
    query += " AND name ILIKE $2";
    params.push(`%${payload.keyword}%`);
  }
  
  query += " ORDER BY created_at DESC";
  
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getCategoryById(companyId: string, categoryId: string): Promise<Category> {
  const result = await pool.query(
    "SELECT * FROM sa.Categories WHERE company_id = $1 AND category_id = $2",
    [companyId, categoryId]
  );
  if (result.rows.length === 0) {
    throw new AppError("ไม่พบหมวดหมู่นี้", 404);
  }
  return result.rows[0];
}

export async function saveCategory(companyId: string, category: Partial<Category>, userId: string): Promise<Category> {
  if (category.category_id) {
    // Update
    const result = await pool.query(
      `UPDATE sa.Categories 
       SET name = $1, icon = $2, color_accent = $3 
       WHERE company_id = $4 AND category_id = $5 
       RETURNING *`,
      [category.name, category.icon, category.color_accent, companyId, category.category_id]
    );
    if (result.rows.length === 0) {
      throw new AppError("ไม่สามารถอัปเดตหมวดหมู่ได้", 404);
    }
    return result.rows[0];
  } else {
    // Insert
    const result = await pool.query(
      `INSERT INTO sa.Categories (company_id, name, icon, color_accent, created_by) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [companyId, category.name, category.icon, category.color_accent, userId]
    );
    return result.rows[0];
  }
}

export async function deleteCategory(companyId: string, categoryId: string): Promise<void> {
  const result = await pool.query(
    "DELETE FROM sa.Categories WHERE company_id = $1 AND category_id = $2",
    [companyId, categoryId]
  );
  if (result.rowCount === 0) {
    throw new AppError("ไม่สามารถลบหมวดหมู่ได้ หรือไม่พบหมวดหมู่นี้", 404);
  }
}

export async function getCategoryMembers(companyId: string, categoryId: string): Promise<User[]> {
  // Check if category belongs to the company
  await getCategoryById(companyId, categoryId);

  const result = await pool.query(
    `SELECT u.* FROM sa.Users u
     JOIN sa.Category_Members cm ON u.user_id = cm.user_id
     WHERE cm.category_id = $1 AND u.company_id = $2`,
    [categoryId, companyId]
  );
  return result.rows;
}

export async function addMemberToCategory(companyId: string, categoryId: string, userId: string): Promise<void> {
  // Check if category belongs to the company
  await getCategoryById(companyId, categoryId);

  // Check if user belongs to the company
  const userResult = await pool.query("SELECT * FROM sa.Users WHERE company_id = $1 AND user_id = $2", [companyId, userId]);
  if (userResult.rows.length === 0) {
    throw new AppError("ไม่พบผู้ใช้งานนี้ในบริษัท", 404);
  }

  // Insert ignores duplicate
  await pool.query(
    `INSERT INTO sa.Category_Members (category_id, user_id) 
     VALUES ($1, $2) 
     ON CONFLICT DO NOTHING`,
    [categoryId, userId]
  );
}

export async function removeMemberFromCategory(companyId: string, categoryId: string, userId: string): Promise<void> {
  await getCategoryById(companyId, categoryId);

  await pool.query(
    "DELETE FROM sa.Category_Members WHERE category_id = $1 AND user_id = $2",
    [categoryId, userId]
  );
}
