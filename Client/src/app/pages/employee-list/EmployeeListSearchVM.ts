import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/api/user-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { User, Category } from '../../models/app-models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './EmployeeListSearchView.html',
})
export class EmployeeListSearchVM implements OnInit {
  members: User[] = [];

  constructor(
    private userApi: UserApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const companyId = this.authService.currentUser()?.company_id;
      this.members = await this.userApi.getUsersByCompany(companyId!);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  }

  async addMember() {
    this.router.navigate(['/employees/edit', 'new']);
  }

  async editMember(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  async deleteMember(id: string) {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานนี้?')) {
      try {
        await this.userApi.deleteUser(id);
        this.loadData();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  }
}
