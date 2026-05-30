import { Injectable } from '@angular/core';
import { Task, TaskAttachment, TaskPriority, TaskStatus } from '../../models/app-models';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  constructor() {}

  async getTasks(): Promise<Task[]> {
    return [
      {
        task_id: 't-001',
        company_id: 'c-001',
        category_id: 'cat-001',
        title: 'ตรวจสอบระบบเครือข่ายชั้น 4',
        description: 'แก้ไขปัญหาการเชื่อมต่อ Wi-Fi ไม่เสถียรในแผนกการเงิน และตรวจสอบการทำงานของ Access Point หมายเลข AP-402',
        priority: TaskPriority.High,
        reward_points: 500,
        estimated_duration: '4 ชม.',
        status: TaskStatus.Pending,
        created_by: 'u-001',
        created_at: new Date()
      },
      {
        task_id: 't-002',
        company_id: 'c-001',
        category_id: 'cat-003',
        title: 'ติดต่อประสานงานลูกค้า VIP',
        description: 'ติดตามความคืบหน้าของใบเสนอราคาโครงการ Smart Factory 2.0 สำหรับลูกค้ารายใหญ่ และนัดหมายการประชุมสรุปสัญญา',
        priority: TaskPriority.Medium,
        reward_points: 1200,
        estimated_duration: '1 วัน',
        status: TaskStatus.Pending,
        created_by: 'u-001',
        created_at: new Date()
      }
    ];
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return {
      task_id: taskId,
      company_id: 'c-001',
      category_id: 'cat-001',
      title: 'อัปเดตโมดูลจัดการข้อมูลลูกค้า (CRM Sync)',
      description: 'พัฒนาระบบเชื่อมต่อข้อมูลระหว่างฐานข้อมูลกลางและโมดูล CRM เพื่อให้ทีมขายสามารถเข้าถึงข้อมูลการซื้อขายล่าสุดได้แบบ Real-time โดยต้องรองรับการทำงานในสภาวะที่มีการเรียกใช้งานพร้อมกันสูง',
      priority: TaskPriority.Urgent,
      reward_points: 2500,
      estimated_duration: '23 ชม. 45 นาที',
      status: TaskStatus.Pending,
      created_by: 'u-001',
      deadline: new Date(Date.now() + 86400000),
      created_at: new Date()
    };
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    // Skeleton implementation
    return task as Task;
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    // Skeleton implementation
    return task as Task;
  }

  async deleteTask(taskId: string): Promise<void> {
    // Skeleton implementation
  }

  async claimTask(taskId: string, userId: string): Promise<Task> {
    // Skeleton implementation
    return {} as Task;
  }

  async getAttachments(taskId: string): Promise<TaskAttachment[]> {
    // Skeleton implementation
    return [];
  }

  async addAttachment(taskId: string, attachment: Partial<TaskAttachment>): Promise<TaskAttachment> {
    // Skeleton implementation
    return attachment as TaskAttachment;
  }
}
