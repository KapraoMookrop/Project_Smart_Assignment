import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskApiService } from '../../services/api/task-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Task, Category, TaskPriority, TaskStatus } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import flatpickr from 'flatpickr';
import { Thai } from 'flatpickr/dist/l10n/th';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TaskEditSearchView.html',
})
export class TaskEditSearchVM implements OnInit, AfterViewInit {
  @ViewChild('deadlinePicker') deadlinePicker!: ElementRef;

  task: Partial<Task> = {
    title: '',
    category_id: '',
    priority: TaskPriority.Medium,
    description: '',
    reward_points: 0,
    status: TaskStatus.Pending,
    deadline: undefined
  };
  categories: Category[] = [];
  flatpickrInstance: any;

  priorities = [
    { value: TaskPriority.Low, label: 'ต่ำ' },
    { value: TaskPriority.Medium, label: 'ปานกลาง' },
    { value: TaskPriority.High, label: 'สูง' },
    { value: TaskPriority.Urgent, label: 'เร่งด่วน' }
  ];

  statusOptions = [
    { value: TaskStatus.Pending, label: 'รอดำเนินการ' },
    { value: TaskStatus.InProgress, label: 'กำลังดำเนินการ' },
    { value: TaskStatus.Done, label: 'เสร็จสิ้น' }
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
      await this.loadTask(id);
    }
  }

  ngAfterViewInit(): void {
    this.initFlatpickr();
  }

  initFlatpickr() {
    this.flatpickrInstance = flatpickr(this.deadlinePicker.nativeElement, {
      locale: Thai,
      disableMobile: true,
      enableTime: true,
      time_24hr: true,
      dateFormat: 'Y-m-d H:i',
      altInput: true,
      altFormat: 'd/m/Y H:i',
      defaultDate: this.task.deadline || new Date(),

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
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryApi.getCategories();
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดแผนกไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  async loadTask(id: string) {
    try {
      const data = await this.taskApi.getTaskById(id);
      if (data) {
        this.task = data;
        if (this.task.deadline && this.flatpickrInstance) {
          this.flatpickrInstance.setDate(this.task.deadline);
        }
        this.cdr.detectChanges();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่พบข้อมูลงาน', err.error?.message || err.message);
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

      await this.taskApi.updateTask(this.task.task_id!, this.task);
      this.notification.success('อัปเดตสำเร็จ', 'ข้อมูลงานถูกบันทึกเรียบร้อยแล้ว');
      this.cdr.detectChanges();
      this.goBack();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('บันทึกไม่สำเร็จ', err.error?.message || err.message);
    }
  }
}
