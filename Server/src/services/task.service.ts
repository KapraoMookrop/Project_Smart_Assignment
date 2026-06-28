import pool from "../config/database.js";
import { AppError } from "../utils/errors/AppError.js";
import { TaskStatus } from "../module/app-models.js";
import type { Task, TaskAttachment } from "../module/app-models.js";

export async function getTasks(companyId: string, filters: { categoryId?: string, createdBy?: string, assignedTo?: string }): Promise<Task[]> {
  let query = `SELECT 
  t.*, 
  c.name as category_name
  FROM sa.Tasks as t 
    LEFT JOIN sa.categories as c ON t.category_id = c.category_id 
  WHERE t.company_id = $1`;
  const params: any[] = [companyId];
  let paramCount = 1;

  if (filters.categoryId) {
    paramCount++;
    query += ` AND t.category_id = $${paramCount}`;
    params.push(filters.categoryId);
  }

  if (filters.createdBy) {
    paramCount++;
    query += ` AND t.created_by = $${paramCount}`;
    params.push(filters.createdBy);
  }

  if (filters.assignedTo) {
    paramCount++;
    query += ` AND t.assigned_to = $${paramCount}`;
    params.push(filters.assignedTo);
  }

  if (!filters.categoryId && !filters.createdBy && !filters.assignedTo) {
    query += " AND t.assigned_to IS NULL";
  }

  query += " ORDER BY t.created_at DESC";

  const resultSql = await pool.query(query, params);
  const result = resultSql.rows.map((task) => ({
    ...task,
    category_name: task.category_name || null
  })) as Task[];

  return result;
}

export async function getUserTaskStats(companyId: string, userId: string): Promise<{ inProgress: number, completed: number }> {
  const query = `
    SELECT 
      CAST(COUNT(CASE WHEN status = $1 THEN 1 END) AS INTEGER) AS "inProgress",
      CAST(COUNT(CASE WHEN status = $2 THEN 1 END) AS INTEGER) AS "completed"
    FROM sa.Tasks
    WHERE company_id = $3 AND assigned_to = $4
  `;
  const result = await pool.query(query, [TaskStatus.InProgress, TaskStatus.Done, companyId, userId]);
  
  if (result.rows.length > 0) {
    return {
      inProgress: result.rows[0].inProgress || 0,
      completed: result.rows[0].completed || 0
    };
  }
  
  return { inProgress: 0, completed: 0 };
}

export async function getTaskById(companyId: string, taskId: string): Promise<Task> {
  const resultSql = await pool.query(
    `SELECT 
      t.task_id,
      t.company_id,
      t.category_id, 
      c.name as category_name,
      t.title,
      t.description,
      t.priority,
      t.assigned_to,
      t.status,
      cr.username as created_by,
      ass.username as assigned_to,
      t.deadline,
      t.created_at,
      t.updated_at
    FROM sa.Tasks as t 
      LEFT JOIN sa.categories as c ON t.category_id = c.category_id 
      LEFT JOIN sa.users as ass ON t.assigned_to = ass.user_id
      LEFT JOIN sa.users as cr ON t.created_by = cr.user_id
    WHERE t.company_id = $1 AND t.task_id = $2`,
    [companyId, taskId]
  );

  if (resultSql.rows.length === 0) {
    throw new AppError("ไม่พบงานนี้", 404);
  }

  const task = resultSql.rows[0];

  return resultSql.rows[0];
}

export async function createTask(companyId: string, task: Partial<Task>, userId: string): Promise<Task> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert Task
    const taskResult = await client.query(
      `INSERT INTO sa.Tasks (company_id, category_id, title, description, priority, reward_points, estimated_duration, created_by, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [companyId, task.category_id, task.title, task.description, task.priority, task.reward_points || 0, task.estimated_duration, userId, task.deadline]
    );

    const createdTask = taskResult.rows[0];

    // Notification Logic
    // Create notifications for all users in the category
    const membersResult = await client.query(
      `SELECT user_id FROM sa.Category_Members WHERE category_id = $1`,
      [task.category_id]
    );

    const members = membersResult.rows;
    for (const member of members) {
      await client.query(
        `INSERT INTO sa.Notifications (user_id, task_id, type, message) 
         VALUES ($1, $2, $3, $4)`,
        [member.user_id, createdTask.task_id, 'NewTask', `มีงานใหม่: ${createdTask.title}`]
      );
    }

    await client.query("COMMIT");
    return createdTask;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateTask(companyId: string, taskId: string, task: Partial<Task>): Promise<Task> {
  const result = await pool.query(
    `UPDATE sa.Tasks 
     SET title = $1, description = $2, priority = $3, reward_points = $4, estimated_duration = $5, status = $6, deadline = $7 
     WHERE company_id = $8 AND task_id = $9 
     RETURNING *`,
    [task.title, task.description, task.priority, task.reward_points, task.estimated_duration, task.status, task.deadline, companyId, taskId]
  );

  if (result.rows.length === 0) {
    throw new AppError("ไม่สามารถอัปเดตงานได้", 404);
  }

  return result.rows[0];
}

export async function deleteTask(companyId: string, taskId: string): Promise<void> {
  const result = await pool.query(
    "DELETE FROM sa.Tasks WHERE company_id = $1 AND task_id = $2",
    [companyId, taskId]
  );

  if (result.rowCount === 0) {
    throw new AppError("ไม่พบงานนี้หรือไม่สามารถลบได้", 404);
  }
}

export async function claimTask(companyId: string, taskId: string, userId: string): Promise<Task> {
  // Update task assigned_to, change status to InProgress
  const result = await pool.query(
    `UPDATE sa.Tasks 
     SET assigned_to = $1, status = $2 
     WHERE company_id = $3 AND task_id = $4 AND assigned_to IS NULL 
     RETURNING *`,
    [userId, TaskStatus.InProgress, companyId, taskId]
  );

  if (result.rows.length === 0) {
    throw new AppError("ไม่สามารถรับงานนี้ได้ (อาจถูกรับไปแล้วหรือไม่มีอยู่จริง)", 400);
  }

  return result.rows[0];
}

export async function getAttachments(companyId: string, taskId: string): Promise<TaskAttachment[]> {
  // Check if task exists and belongs to company
  await getTaskById(companyId, taskId);

  const result = await pool.query(
    "SELECT * FROM sa.Task_Attachments WHERE task_id = $1 ORDER BY created_at DESC",
    [taskId]
  );

  return result.rows;
}

export async function addAttachment(companyId: string, taskId: string, attachment: Partial<TaskAttachment>): Promise<TaskAttachment> {
  // Check if task exists and belongs to company
  await getTaskById(companyId, taskId);

  const result = await pool.query(
    `INSERT INTO sa.Task_Attachments (task_id, file_name, file_url, file_type, file_size) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [taskId, attachment.file_name, attachment.file_url, attachment.file_type, attachment.file_size]
  );

  return result.rows[0];
}
