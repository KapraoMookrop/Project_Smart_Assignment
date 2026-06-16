import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryApiService } from '../../services/api/category-api.service';
import { UserApiService } from '../../services/api/user-api.service';
import { User } from '../../models/app-models';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DisplayableUrlPipe } from '../../pipes/displayable-url.pipe';

@Component({
  selector: 'app-category-member-edit',
  standalone: true,
  imports: [CommonModule, DisplayableUrlPipe],
  templateUrl: './CategoryMemberEditSearchView.html',
})
export class CategoryMemberEditSearchVM implements OnInit {
  categoryName: string = '';
  categoryId: string = ''; 
  
  currentMembers: User[] = [];
  availableEmployees: User[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private categoryApi: CategoryApiService,
    private userApi: UserApiService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('categoryId');
    if (id) {
      this.categoryId = id;
      this.loadCategoryDetails();
      this.loadMembers();
    }
  }

  async loadCategoryDetails() {
    try {
      const category = await this.categoryApi.getCategoryById(this.categoryId);
      if (category) {
        this.categoryName = category.name;
        this.cdr.detectChanges();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่พบข้อมูลแผนก', err.error?.message || err.message);
    }
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
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลสมาชิกไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  goBack() {
    this.location.back();
  }

  async removeMember(id: string) {
    try {
      if (this.categoryId) {
        await this.categoryApi.removeMemberFromCategory(this.categoryId, id);
        this.currentMembers = this.currentMembers.filter(m => m.user_id !== id);
        this.loadMembers();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ลบสมาชิกไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  async addMember(employee: User) {
    try {
      if (this.categoryId) {
        await this.categoryApi.addMemberToCategory(this.categoryId, employee.user_id);
        this.currentMembers.push(employee);
        this.availableEmployees = this.availableEmployees.filter(e => e.user_id !== employee.user_id);
        this.cdr.detectChanges();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('เพิ่มสมาชิกไม่สำเร็จ', err.error?.message || err.message);
    }
  }
}
