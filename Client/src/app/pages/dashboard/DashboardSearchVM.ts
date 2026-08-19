import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskApiService } from '../../services/api/task-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Task, User } from '../../models/app-models';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './DashboardSearchView.html',
})
export class DashboardSearchVM implements OnInit {
  userProfile: User | null = null;
  isLoading = false;

  stats = {
    inProgress: 0,
    completed: 0
  };

  newTasks: Task[] = [];
  activities: any[] = [];

  dummyTasks: Task[] = Array(3).fill({
    task_id: 'loading-id',
    title: 'กำลังโหลดข้อมูลงาน...',
    description: 'รายละเอียดของงานกำลังถูกโหลด กรุณารอสักครู่เพื่อแสดงข้อมูลจริงในแผนกของคุณ',
    status: 'Pending',
    created_at: new Date().toISOString(),
    deadline: new Date().toISOString(),
    category_name: 'แผนก...'
  });

  constructor(
    private taskApi: TaskApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.currentUser();
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoading = true;
    this.cdr.detectChanges();
    try {
      const currentUser = this.authService.currentUser();
      const filters: any = {
        categoryId: currentUser?.category_id
      };

      const tasksPromise = this.taskApi.getTasks(filters, true);
      const statsPromise = currentUser?.user_id 
        ? this.taskApi.getUserTaskStats(currentUser.user_id, true) 
        : Promise.resolve({ inProgress: 0, completed: 0 });

      const [tasks, stats] = await Promise.all([tasksPromise, statsPromise]);
      this.newTasks = tasks;
      this.stats = stats;
      this.cdr.detectChanges();

    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', err.error?.message || err.message);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async claimTask(taskId: string) {
    const confirm = await this.notification.confirm('ยืนยันการรับงาน', 'คุณต้องการรับงานนี้ไปดำเนินการใช่หรือไม่?');
    if (confirm.isConfirmed) {
      try {
        if (this.userProfile) {
          await this.taskApi.claimTask(taskId);
          const task = this.newTasks.find(t => t.task_id === taskId);
          if (task) {
            this.notification.success('รับงานสำเร็จ', `คุณได้รับงาน<br/>"${task.title}"`);
            this.loadDashboardData();
          }
        }
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('เกิดข้อผิดพลาด', err.error?.message || err.message || 'ไม่สามารถรับงานได้ในขณะนี้');
      }
    }
  }
}
