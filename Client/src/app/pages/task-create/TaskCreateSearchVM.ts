import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TaskCreateSearchView.html',
})
export class TaskCreateSearchVM implements OnInit {
  task = {
    title: '',
    categoryId: null,
    priority: 'medium',
    description: '',
    points: 0,
    attachments: [] as any[]
  };

  categories = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Sales' },
    { id: 3, name: 'IT Support' },
    { id: 4, name: 'Product' }
  ];

  priorities = [
    { value: 'low', label: 'Low', colorClass: 'btn-outline-secondary' },
    { value: 'medium', label: 'Medium', colorClass: 'btn-outline-warning' },
    { value: 'high', label: 'High', colorClass: 'btn-outline-orange' },
    { value: 'urgent', label: 'Urgent', colorClass: 'btn-outline-danger' }
  ];

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  async onSubmit() {
    try {
      console.log('Submitting task:', this.task);
      
      if (!this.task.title || !this.task.categoryId) {
        alert('กรุณากรอกข้อมูลหัวข้อและหมวดหมู่ให้ครบถ้วน');
        return;
      }

      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.createTask(this.task);
      // if (response.status === 'success') {
      //   alert('สร้างงานและแจ้งเตือนสำเร็จ!');
      //   this.goBack();
      // }
      
      alert('สร้างงานและแจ้งเตือนสำเร็จ! (Mockup)');
      this.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('เกิดข้อผิดพลาดในการสร้างงาน');
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
