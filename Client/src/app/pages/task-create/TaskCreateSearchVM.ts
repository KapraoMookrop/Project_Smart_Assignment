import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskApiService } from '../../services/api/task-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Task, Category } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';
import flatpickr from 'flatpickr';
import { Thai } from 'flatpickr/dist/l10n/th';


@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TaskCreateSearchView.html',
})
export class TaskCreateSearchVM implements OnInit, AfterViewInit {
  @ViewChild('deadlinePicker') deadlinePicker!: ElementRef;

  task: Partial<Task> = {
    title: '',
    category_id: '',
    priority: undefined,
    description: '',
    reward_points: 0,
    status: undefined,
    deadline: undefined
  };

  categories: Category[] = [];
  flatpickrInstance: any;

  priorities = [
    { value: 'Low', label: 'ต่ำ', colorClass: 'btn-outline-secondary' },
    { value: 'Medium', label: 'ปานกลาง', colorClass: 'btn-outline-warning' },
    { value: 'High', label: 'สูง', colorClass: 'btn-outline-orange' },
    { value: 'Urgent', label: 'เร่งด่วน', colorClass: 'btn-outline-danger' }
  ];

  constructor(
    private location: Location,
    private taskApi: TaskApiService,
    private categoryApi: CategoryApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.initFlatpickr();
  }

  initFlatpickr() {
    flatpickr(this.deadlinePicker.nativeElement, {
      locale: Thai,
      disableMobile: true,
      enableTime: true,
      time_24hr: true,
      dateFormat: 'Y-m-d H:i',
      altInput: true,
      altFormat: 'd/m/Y H:i',
      defaultDate: new Date(),

      formatDate: (date, format) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543;
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        if (format === 'd/m/Y H:i') {
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        return flatpickr.formatDate(date, format);
      },

      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          this.task.deadline = selectedDates[0];
          this.cdr.detectChanges();
        }
      }
    });
    
    // Set initial value for model if empty
    if (!this.task.deadline) {
      this.task.deadline = new Date();
    }
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryApi.getCategories();
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้', err.error?.message || err.message);
    }
  }

  goBack() {
    this.location.back();
  }

  async onSubmit() {
    try {
      if (!this.task.title || !this.task.category_id) {
        this.notification.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกหัวข้องานและเลือกหมวดหมู่');
        return;
      }

      await this.taskApi.createTask(this.task);
      this.notification.success('สร้างงานสำเร็จ', 'ระบบได้ทำการส่งแจ้งเตือนไปยังสมาชิกกลุ่มแล้ว');
      this.cdr.detectChanges();
      this.goBack();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('สร้างงานไม่สำเร็จ', err.error?.message || err.message);
    }
  }


  handleFileUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      // Logic สำหรับจัดการไฟล์ (ในอนาคตจะอัปโหลดไปที่ Server/S3)
    }
  }
}
