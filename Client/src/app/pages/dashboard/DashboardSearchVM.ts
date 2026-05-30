import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './DashboardSearchView.html',
})
export class DashboardSearchVM implements OnInit {
  // Dummy Data
  userProfile = {
    name: 'สมชาย มั่นคง',
    role: 'Admin User',
    company: 'Global Enterprise',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1CJWeawNf88OaMlk3iyMoRp6lS1_spta2alZ9kv_FXZusL9HDF_UuWgaAuZgKcP_maD2W9Rl-riiAy6yhG5op7AAb3MpCqmq4UJhtN6SykX-BhusHswR5w2ziJ1NLPD-iXgSsegTgUBxd0HVocr2J8xpgnPG-zXoSioZhH9Poc67xiP1jLLrwL1tVEKiFMXjHG1UHG9TgFhob2oF2qywaCqpNsfZJ_JmVvlNFeT9ls_8m8F7S4AmaWSmG68mT4d0lp5hsBFBDpX0'
  };

  stats = {
    inProgress: 3,
    notifications: 5,
    completed: 12
  };

  newTasks = [
    {
      id: 1,
      category: 'IT SUPPORT',
      categoryColor: '#00E5FF',
      timeAgo: '2 ชม. ที่แล้ว',
      title: 'ตรวจสอบระบบเครือข่ายชั้น 4',
      description: 'แก้ไขปัญหาการเชื่อมต่อ Wi-Fi ไม่เสถียรในแผนกการเงิน และตรวจสอบการทำงานของ Access Point หมายเลข AP-402',
      duration: '4 ชม.'
    },
    {
      id: 2,
      category: 'SALES',
      categoryColor: '#FFB703',
      timeAgo: '5 ชม. ที่แล้ว',
      title: 'ติดต่อประสานงานลูกค้า VIP',
      description: 'ติดตามความคืบหน้าของใบเสนอราคาโครงการ Smart Factory 2.0 สำหรับลูกค้ารายใหญ่ และนัดหมายการประชุมสรุปสัญญา',
      duration: '1 วัน'
    },
    {
      id: 3,
      category: 'ENGINEERING',
      categoryColor: '#06D6A0',
      timeAgo: '1 วันที่แล้ว',
      title: 'ตรวจสอบคุณภาพบอร์ดวงจร',
      description: 'สุ่มตรวจคุณภาพแผ่นวงจรพิมพ์จากล็อตการผลิตที่ 502 เพื่อให้แน่ใจว่าเป็นไปตามมาตรฐานความปลอดภัยระดับอุตสาหกรรม',
      duration: '6 ชม.'
    }
  ];

  activities = [
    { user: 'ธนพล', action: 'ได้รับงาน "จัดทำสรุปงบประมาณรายไตรมาส"', time: '10 นาทีที่แล้ว', type: 'new' },
    { user: 'วรรณิศา', action: 'ส่งมอบงาน "อัปเดตคู่มือการใช้งานระบบ"', time: '45 นาทีที่แล้ว', type: 'complete' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.getDashboardData();
      // if (response.status === 'success') {
      //   this.stats = response.data.stats;
      //   this.newTasks = response.data.tasks;
      // }
      console.log('Dashboard data loaded (Dummy)');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async claimTask(taskId: number) {
    try {
      console.log(`Claiming task ${taskId}...`);
      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.claimTask(taskId);
      // if (response.status === 'success') {
      //   // อัปเดต UI หลังจากรับงานสำเร็จ
      // }
      
      // Mock success for UI feedback
      const task = this.newTasks.find(t => t.id === taskId);
      if (task) {
        alert(`รับงาน "${task.title}" สำเร็จ!`);
      }
    } catch (error) {
      console.error('Error claiming task:', error);
      alert('เกิดข้อผิดพลาดในการรับงาน');
    }
  }
}
