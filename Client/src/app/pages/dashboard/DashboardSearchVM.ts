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

  stats = {
    inProgress: 3,
    notifications: 5,
    completed: 12
  };

  newTasks: Task[] = [];
  activities: any[] = [];

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
    try {
      this.newTasks = await this.taskApi.getTasks();
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', err.error?.message || err.message);
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
