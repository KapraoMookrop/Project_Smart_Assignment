import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TenantEditSearchView.html',
})
export class TenantEditSearchVM implements OnInit {
  company = {
    name: 'Acme Corp Global',
    id: 'acme-corp-492',
    isActive: true,
    adminEmail: 'admin@acmecorp.com',
    notes: 'Enterprise tier client. Requires strict SLA compliance tracking.'
  };

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  async saveChanges() {
    try {
      console.log('Saving company changes:', this.company);
      // โครงสร้างการติดต่อ API ในอนาคต
      // await this.apiService.updateCompany(this.company);
      alert('บันทึกการเปลี่ยนแปลงสำเร็จ!');
      this.goBack();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }
}
