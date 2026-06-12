import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskApiService } from '../../services/api/task-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Task, Category, TaskPriority } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TaskEditSearchView.html',
})
export class TaskEditSearchVM implements OnInit {
  task: Partial<Task> = {
    title: '',
    category_id: '',
    priority: TaskPriority.Medium,
    description: '',
    reward_points: 0
  };
  categories: Category[] = [];

  priorities = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Urgent, label: 'Urgent' }
  ];

  constructor(
    private location: Location,
    private taskApi: TaskApiService,
    private categoryApi: CategoryApiService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    await this.loadCategories();
    if (id) {
      this.loadTask(id);
    }
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryApi.getCategories();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadTask(id: string) {
    try {
      const data = await this.taskApi.getTaskById(id);
      if (data) {
        this.task = data;
        this.cdr.detectChanges();
      }
    } catch (error) {
      this.notification.error('ไม่พบข้อมูลงาน');
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  async saveTask() {
    try {
      if (!this.task.title || !this.task.category_id) {
        this.notification.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      console.log('Saving task:', this.task);
      await this.taskApi.updateTask(this.task.task_id!, this.task);
      this.notification.success('อัปเดตสำเร็จ', 'ข้อมูลงานถูกบันทึกเรียบร้อยแล้ว');
      this.cdr.detectChanges();
      this.goBack();
    } catch (error) {
      this.notification.error('บันทึกไม่สำเร็จ');
      console.error('Error updating task:', error);
    }
  }
}
