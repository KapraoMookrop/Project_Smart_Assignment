import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskApiService } from '../../services/api/task-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Task, User } from '../../models/app-models';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskDetailsSearchView.html',
})
export class TaskDetailsSearchVM implements OnInit {
  task: Task | null = null;
  currentUser: User | null = null;

  isClaiming: boolean = false;
  isClaimed: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private taskApi: TaskApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.currentUser();
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTaskDetails(taskId);
    }
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  async loadTaskDetails(id: string) {
    try {
      console.log(`Loading task details for ${id}...`);
      this.task = await this.taskApi.getTaskById(id);
      if (this.task && this.task.assigned_to) {
        this.isClaimed = true;
      }
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('ไม่พบข้อมูลงาน');
      console.error('Error loading task details:', error);
    }
  }

  async claimTask() {
    if (this.isClaimed || !this.task || !this.currentUser) return;

    const confirm = await this.notification.confirm('ยืนยันการรับงาน', 'คุณต้องการรับงานนี้ใช่หรือไม่?');
    if (confirm.isConfirmed) {
      try {
        this.isClaiming = true;
        this.cdr.detectChanges();
        console.log(`Claiming task ${this.task.task_id}...`);

        await this.taskApi.claimTask(this.task.task_id, this.currentUser.user_id);

        this.isClaimed = true;
        this.isClaiming = false;
        this.task.status = (undefined as any); // Will be updated by real API
        this.task.assigned_to = this.currentUser.user_id;
        this.notification.success('สำเร็จ', 'รับงานเรียบร้อยแล้ว ขอให้โชคดีกับการทำงาน!');
        this.cdr.detectChanges();
      } catch (error) {
        this.isClaiming = false;
        this.cdr.detectChanges();
        this.notification.error('เกิดข้อผิดพลาดในการรับงาน');
        console.error('Error claiming task:', error);
      }
    }
  }
}

