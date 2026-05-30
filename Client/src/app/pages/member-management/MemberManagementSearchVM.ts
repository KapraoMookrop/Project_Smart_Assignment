import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './MemberManagementSearchView.html',
})
export class MemberManagementSearchVM implements OnInit {
  categoryName: string = 'Engineering Team';
  
  currentMembers = [
    { id: 1, name: 'Elena Rodriguez', role: 'Lead Architect', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigpG30t_baCiF-X0tIZLRnXD6Aita0oezWJDu9HqeQIMkVdnUTdp2RehL9ATB8BO92wIIEytDI2cUsoVH_muMUGuTs2SxYvqAP8HW5YLebFY_3P-kOBndeAWHZvnaE2EqP0MgpXv6Z46W2njCf32nHiu9ezS2Vb6RF0ibg_3zW3a-O7TM-B2fAJ-JsNfpD7ktlHpJW_Lw-tBdlCUrMr5QcXrprnoMGf8Z7YC48LTaRucArc8K8zRdjRVr20MzKS77WWkCqQ1kfvA' },
    { id: 2, name: 'Marcus Chen', role: 'Senior Developer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBAnF508ZWr37-2tSTy3epYg14RfCjVkrRZEsBKEuNgQF-j-2f-jSOkqbH-ufPTqiFsELDAmZr6hqZ5PBSRsX1HPtmQtvPDRac3NI5Eu84hkiS-lvECaXYrX6U6jbkl5CujQO2pdthz_f_I6nNKbojM1ASTbLgwyE-TgvbGu5TnZhKbR69Ku14hOgXgiY-QGRxf-TOS8YyFWxH0ScwbfwLthYYKb80ZGyncVJoIoiY-mnHnAnoN2J729V9WjGf48U0VfO9zZLnScQ' },
    { id: 3, name: 'Sarah Jenkins', role: 'QA Specialist', avatar: '' }
  ];

  availableEmployees = [
    { id: 4, name: 'David Kim', role: 'Backend Engineer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAJtmlqjcmHjLXvrI8nlYWrnLXwQPPcRgBcU_HIsJYq9iK_k_y2U-PZ6JBnHn7q03y2bF-Zo3fHE617A9UivdvYJ_FO3mLVGZM_yWQoi1sLgNMxT7B6FTSqFAgnWIWVrRIL75waIjn_uYqYcxjjafrZa3nOVIbEi39aUBJaY8cySe2EgdF_BkwcEor8iorRzI4BmcwlK6H5bLgCR7kMmEpkOF2wDrIGK5A4y1B3LtvyC0g3gC_dRrDMpVLzwHc_DXn4_YZdRaTL-U' },
    { id: 5, name: 'Aisha Patel', role: 'UX Designer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNzbjVsStrJ1IjKnmm-NE4V3LeHR1wNTOd50pCKvLVO8ZXvxNNX3CbIk9wWTlPf7mzxGQBxgR566h9syTItVCNlBDZHduuMve3cVJ9GKKqPAk-9lORgaX0OTOH9pXvxem_NlSqbrRatizzt7mpyMvR7aZHvC95g6_YNI6IAP-n4nY3ObfOKficFTt3T7kJ8sWidqne0AvtE32jqMEpLBDcT3XGVaKetfZ7d3HieDQ7BVdJypxd_0i-_cmpHdk_T-C3xUGKuH_wryI' },
    { id: 6, name: 'Tom Jackson', role: 'DevOps Engineer', avatar: '' }
  ];

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  async removeMember(id: number) {
    try {
      console.log(`Removing member ${id}...`);
      // โครงสร้างการติดต่อ API ในอนาคต
      // await this.apiService.removeMemberFromCategory(id, categoryId);
      this.currentMembers = this.currentMembers.filter(m => m.id !== id);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  async addMember(employee: any) {
    try {
      console.log(`Adding member ${employee.id}...`);
      // โครงสร้างการติดต่อ API ในอนาคต
      // await this.apiService.addMemberToCategory(employee.id, categoryId);
      this.currentMembers.push(employee);
      this.availableEmployees = this.availableEmployees.filter(e => e.id !== employee.id);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  }
}
