import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskDetailsSearchView.html',
})
export class TaskDetailsSearchVM implements OnInit {
  task: any = {
    id: 'TTG-44021',
    title: 'อัปเดตโมดูลจัดการข้อมูลลูกค้า (CRM Sync)',
    category: 'วิศวกรรมซอฟต์แวร์',
    priority: 'เร่งด่วน',
    description: 'พัฒนาระบบเชื่อมต่อข้อมูลระหว่างฐานข้อมูลกลางและโมดูล CRM เพื่อให้ทีมขายสามารถเข้าถึงข้อมูลการซื้อขายล่าสุดได้แบบ Real-time โดยต้องรองรับการทำงานในสภาวะที่มีการเรียกใช้งานพร้อมกันสูง',
    creator: 'Admin Pathom',
    createdAt: '12 ต.ค. 2566, 14:30',
    status: 'รอดำเนินการ',
    points: 2500,
    timeLeft: '23 ชม. 45 นาที',
    requirements: [
      'ปรับปรุง API Endpoint สำหรับการรับค่า JSON จากระบบภายนอก',
      'เพิ่มระบบ Retry Mechanism ในกรณีที่การเชื่อมต่อล้มเหลว',
      'เขียนเอกสารประกอบการใช้งาน (API Documentation) บน Swagger'
    ],
    groupRequirement: 'Engineering Alpha'
  };

  isClaiming: boolean = false;
  isClaimed: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTaskDetails(taskId);
    }
  }

  goBack() {
    this.location.back();
  }

  async loadTaskDetails(id: string) {
    try {
      console.log(`Loading task details for ${id}...`);
      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.getTaskDetails(id);
      // if (response.status === 'success') {
      //   this.task = response.data;
      // }
    } catch (error) {
      console.error('Error loading task details:', error);
    }
  }

  async claimTask() {
    if (this.isClaimed) return;

    try {
      this.isClaiming = true;
      console.log(`Claiming task ${this.task.id}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.claimTask(this.task.id);
      
      this.isClaimed = true;
      this.isClaiming = false;
      this.task.status = 'กำลังดำเนินการ';
    } catch (error) {
      this.isClaiming = false;
      console.error('Error claiming task:', error);
      alert('เกิดข้อผิดพลาดในการรับงาน');
    }
  }
}
