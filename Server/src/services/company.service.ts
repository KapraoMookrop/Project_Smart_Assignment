import pool from "../config/database.js";
import { AppError } from "../utils/errors/AppError.js";
import type { Company } from "../module/app-models.js";
import bcrypt from 'bcrypt';
import { UserRole } from "../module/app-models.js";

export async function getCompanies(role: string): Promise<Company[]> {
  const sqlResult = await pool.query("SELECT * FROM sa.Companies ORDER BY created_at DESC");
  const countEmployee = await pool.query(
    `SELECT company_id, 
      COUNT(*) as employees_count 
    FROM sa.Users 
    GROUP BY company_id`
  );

  const result = sqlResult.rows.map((company) => ({
    ...company,
    employees_count: countEmployee.rows.find((row) => row.company_id === company.company_id)?.employees_count || 0
  }));

  return result;
}

export async function getCompanyById(userCompanyId: string, companyId: string, role: string): Promise<Company> {
  if (role !== 'AppAdmin' && userCompanyId !== companyId) {
     throw new AppError("ไม่มีสิทธิ์เข้าถึงข้อมูลบริษัทนี้", 403);
  }
  
  const result = await pool.query(
    "SELECT * FROM sa.Companies WHERE company_id = $1",
    [companyId]
  );
  if (result.rows.length === 0) {
    throw new AppError("ไม่พบบริษัทนี้", 404);
  }
  return result.rows[0];
}

export async function saveCompany(companyId: string, company: Partial<Company>, role: string): Promise<Company> {
  // Skeleton. Normally AppAdmin creates, CompanyAdmin updates.
  if (company.company_id) {
    if (role !== 'AppAdmin' && company.company_id !== companyId) {
      throw new AppError("ไม่มีสิทธิ์อัปเดตบริษัทนี้", 403);
    }
    const result = await pool.query(
      `UPDATE sa.Companies 
       SET name = $1, domain = $2, plan_tier = $3, is_active = $4, internal_notes = $5 
       WHERE company_id = $6 
       RETURNING *`,
      [company.name, company.domain, company.plan_tier, company.is_active, company.internal_notes, company.company_id]
    );
    return result.rows[0];
  } else {
    if (role !== 'AppAdmin') {
      throw new AppError("ไม่มีสิทธิ์สร้างบริษัท", 403);
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Insert Company
      const companyResult = await client.query(
        `INSERT INTO sa.Companies (name, domain, plan_tier, is_active, internal_notes) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [company.name, company.domain, company.plan_tier, company.is_active, company.internal_notes]
      );
      const createdCompany = companyResult.rows[0];

      // 2. Create Company Admin User
      const defaultPassword = "password123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      // Use email as username if not provided
      const username = company.email?.split('@')[0] || `admin_${createdCompany.company_id.substring(0, 5)}`;

      await client.query(
        `INSERT INTO sa.Users (company_id, username, email, password_hash, role, full_name, is_active, must_change_password) 
         VALUES ($1, $2, $3, $4, $5, $6, true, true)`,
        [
          createdCompany.company_id, 
          username, 
          company.email, 
          hashedPassword, 
          UserRole.CompanyAdmin, 
          `Admin ${company.name}`
        ]
      );

      await client.query("COMMIT");
      return createdCompany;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export async function deleteCompany(companyId: string, idToDelete: string, role: string): Promise<void> {
  if (role !== 'AppAdmin') {
    throw new AppError("ไม่มีสิทธิ์ลบบริษัท", 403);
  }

  const result = await pool.query("DELETE FROM sa.Companies WHERE company_id = $1", [idToDelete]);
  if (result.rowCount === 0) {
    throw new AppError("ไม่พบบริษัทนี้ หรือไม่สามารถลบได้", 404);
  }
}
