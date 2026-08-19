import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskApiService } from '../../services/api/task-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Task, User, TaskPriority, TaskStatus } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskDetailsSearchView.html',
})
export class TaskDetailsSearchVM implements OnInit {
  task: Task | null = null;
  currentUser: User | null = null;
  isLoading = false;

  isClaiming: boolean = false;
  isClaimed: boolean = false;

  dummyTask: Task = {
    task_id: 'loading-id',
    company_id: 'loading-company-id',
    title: 'กำลังโหลดรายละเอียดงาน...',
    description: 'รายละเอียดงานกำลังอยู่ในขั้นตอนการดึงข้อมูลจากระบบหลักเพื่อแสดงผลการทำงาน กรุณารอสักครู่เพื่อแสดงข้อมูลรายละเอียดงานทั้งหมด',
    category_id: 'loading',
    category_name: 'แผนก...',
    priority: TaskPriority.Medium,
    status: TaskStatus.Pending,
    deadline: new Date(),
    created_at: new Date(),
    created_by: 'กำลังโหลด...',
    assigned_to: 'กำลังโหลด...'
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private taskApi: TaskApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.currentUser = this.authService.currentUser();
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTaskDetails(taskId);
    } else {
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.location.back();
  }

  editTask() {
    if (this.task) {
      this.router.navigate(['/tasks/edit', this.task.task_id]);
    }
  }

  canEdit(): boolean {
    if (!this.task || !this.currentUser || this.isLoading) return false;
    return this.task.created_by === this.currentUser.user_id || this.task.assigned_to === this.currentUser.user_id;
  }

  async loadTaskDetails(id: string) {
    this.isLoading = true;
    this.task = this.dummyTask;
    this.cdr.detectChanges();
    try {
      this.task = await this.taskApi.getTaskById(id, true);
      if (this.task && this.task.assigned_to) {
        this.isClaimed = true;
      }
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่พบข้อมูลงาน', err.error?.message || err.message);
      this.task = null;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async claimTask() {
    if (this.isClaimed || !this.task || !this.currentUser) return;

    const confirm = await this.notification.confirm('ยืนยันการรับงาน', 'คุณต้องการรับงานนี้ใช่หรือไม่?');
    if (confirm.isConfirmed) {
      try {
        this.isClaiming = true;
        this.cdr.detectChanges();

        await this.taskApi.claimTask(this.task.task_id);

        this.isClaimed = true;
        this.isClaiming = false;
        this.task.status = (undefined as any); // Will be updated by real API
        this.task.assigned_to = this.currentUser.user_id;
        this.notification.success('สำเร็จ', 'รับงานเรียบร้อยแล้ว ขอให้โชคดีกับการทำงาน!');
        this.cdr.detectChanges();
      } catch (err: HttpErrorResponse | any) {
        this.isClaiming = false;
        this.cdr.detectChanges();
        this.notification.error('เกิดข้อผิดพลาดในการรับงาน', err.error?.message || err.message);
      }
    }
  }
}

