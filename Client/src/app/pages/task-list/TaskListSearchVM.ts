import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskApiService } from '../../services/api/task-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Task, User, TaskStatus } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './TaskListSearchView.html',
})
export class TaskListSearchVM implements OnInit {
  tasks: Task[] = [];
  currentUser: User | null = null;
  listType: 'created' | 'assigned' = 'created';
  title: string = '';

  constructor(
    private taskApi: TaskApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.route.data.subscribe(data => {
      this.listType = data['type'] || 'created';
      this.title = this.listType === 'created' ? 'งานที่ฉันสร้าง' : 'งานของฉัน (ที่รับมา)';
      this.loadTasks();
    });
  }

  async loadTasks() {
    try {
      if (!this.currentUser) return;

      const filters: any = {};
      if (this.listType === 'created') {
        filters.createdBy = this.currentUser.user_id;
      } else {
        filters.assignedTo = this.currentUser.user_id;
      }

      this.tasks = await this.taskApi.getTasks(filters);
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  async deleteTask(taskId: string) {
    const confirm = await this.notification.confirm('ยืนยันการลบ', 'คุณต้องการลบงานนี้ใช่หรือไม่?');
    if (confirm.isConfirmed) {
      try {
        await this.taskApi.deleteTask(taskId);
        this.notification.success('ลบสำเร็จ');
        this.loadTasks();
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('ลบไม่สำเร็จ', err.error?.message || err.message);
      }
    }
  }

  canDelete(task: Task): boolean {
    return task.created_by === this.currentUser?.user_id;
  }

  canEdit(task: Task): boolean {
    return task.assigned_to === this.currentUser?.user_id || task.created_by === this.currentUser?.user_id;
  }

  viewDetails(taskId: string) {
    this.router.navigate(['/tasks', taskId]);
  }

  editTask(taskId: string) {
    this.router.navigate(['/tasks/edit', taskId]);
  }
}
