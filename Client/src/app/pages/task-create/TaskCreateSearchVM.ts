import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskApiService } from '../../services/api/task-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Task, Category } from '../../models/app-models';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TaskCreateSearchView.html',
})
export class TaskCreateSearchVM implements OnInit {
  task: Partial<Task> = {
    title: '',
    category_id: '',
    priority: undefined,
    description: '',
    reward_points: 0,
    status: undefined
  };

  categories: Category[] = [];

  priorities = [
    { value: 'Low', label: 'Low', colorClass: 'btn-outline-secondary' },
    { value: 'Medium', label: 'Medium', colorClass: 'btn-outline-warning' },
    { value: 'High', label: 'High', colorClass: 'btn-outline-orange' },
    { value: 'Urgent', label: 'Urgent', colorClass: 'btn-outline-danger' }
  ];

  constructor(
    private location: Location,
    private taskApi: TaskApiService,
    private categoryApi: CategoryApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryApi.getCategories();
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
    }
  }

  goBack() {
    this.location.back();
  }

  async onSubmit() {
    try {
      console.log('Submitting task:', this.task);

      if (!this.task.title || !this.task.category_id) {
        this.notification.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกหัวข้องานและเลือกหมวดหมู่');
        return;
      }

      await this.taskApi.createTask(this.task);
      this.notification.success('สร้างงานสำเร็จ', 'ระบบได้ทำการส่งแจ้งเตือนไปยังสมาชิกกลุ่มแล้ว');
      this.cdr.detectChanges();
      this.goBack();
    } catch (error) {
      this.notification.error('สร้างงานไม่สำเร็จ');
      console.error('Error creating task:', error);
    }
  }


  handleFileUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      console.log('Files selected:', files);
      // Logic สำหรับจัดการไฟล์ (ในอนาคตจะอัปโหลดไปที่ Server/S3)
    }
  }
}
