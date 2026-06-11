import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskApiService } from '../../services/api/task-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Task, User } from '../../models/app-models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.currentUser();
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      this.newTasks = await this.taskApi.getTasks();
      
      console.log('Dashboard data loaded');
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ');
      console.error('Error loading dashboard data:', error);
    }
  }

  async claimTask(taskId: string) {
    const confirm = await this.notification.confirm('ยืนยันการรับงาน', 'คุณต้องการรับงานนี้ไปดำเนินการใช่หรือไม่?');
    if (confirm.isConfirmed) {
      try {
        console.log(`Claiming task ${taskId}...`);
        if (this.userProfile) {
          await this.taskApi.claimTask(taskId, this.userProfile.user_id);
          const task = this.newTasks.find(t => t.task_id === taskId);
          if (task) {
            this.notification.success('รับงานสำเร็จ', `คุณได้รับงาน "${task.title}" แล้ว`);
            this.loadDashboardData();
          }
        }
      } catch (error) {
        this.notification.error('เกิดข้อผิดพลาด', 'ไม่สามารถรับงานได้ในขณะนี้');
        console.error('Error claiming task:', error);
      }
    }
  }
}
