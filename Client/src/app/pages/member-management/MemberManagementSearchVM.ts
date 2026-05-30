import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CategoryApiService } from '../../services/api/category-api.service';
import { UserApiService } from '../../services/api/user-api.service';
import { User } from '../../models/app-models';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './MemberManagementSearchView.html',
})
export class MemberManagementSearchVM implements OnInit {
  categoryName: string = 'Engineering Team';
  categoryId: string = ''; // Should be passed via route or state
  
  currentMembers: User[] = [];
  availableEmployees: User[] = [];

  constructor(
    private location: Location,
    private categoryApi: CategoryApiService,
    private userApi: UserApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers() {
    try {
      if (this.categoryId) {
        this.currentMembers = await this.categoryApi.getCategoryMembers(this.categoryId);
      }
      this.availableEmployees = await this.userApi.getUsers();
      const memberIds = new Set(this.currentMembers.map(m => m.user_id));
      this.availableEmployees = this.availableEmployees.filter(e => !memberIds.has(e.user_id));
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  goBack() {
    this.location.back();
  }

  async removeMember(id: string) {
    try {
      console.log(`Removing member ${id}...`);
      if (this.categoryId) {
        await this.categoryApi.removeMemberFromCategory(this.categoryId, id);
        this.currentMembers = this.currentMembers.filter(m => m.user_id !== id);
        this.loadMembers();
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  async addMember(employee: User) {
    try {
      console.log(`Adding member ${employee.user_id}...`);
      if (this.categoryId) {
        await this.categoryApi.addMemberToCategory(this.categoryId, employee.user_id);
        this.currentMembers.push(employee);
        this.availableEmployees = this.availableEmployees.filter(e => e.user_id !== employee.user_id);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  }
}
