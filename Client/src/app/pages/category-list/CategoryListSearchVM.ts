import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Category, UserRole } from '../../models/app-models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './CategoryListSearchView.html',
})
export class CategoryListSearchVM implements OnInit {
  categories: Category[] = [];
  searchQuery: string = '';

  constructor(
    private categoryApi: CategoryApiService,
    private notification: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryApi.getCategories();
      
      if (this.searchQuery) {
        this.categories = this.categories.filter(c =>
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', err.message);
    }
  }

  async deleteCategory(id: string) {
    const result = await this.notification.confirm('คุณแน่ใจหรือไม่?', 'ต้องการลบหมวดหมู่นี้ใช่หรือไม่?');
    if (result.isConfirmed) {
      try {
        await this.categoryApi.deleteCategory(id);
        this.categories = this.categories.filter(c => c.category_id !== id);
        this.notification.success('ลบสำเร็จ', 'หมวดหมู่ถูกลบเรียบร้อยแล้ว');
        this.cdr.detectChanges();
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('ลบไม่สำเร็จ', err.message);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCategories();
  }

  editCategory(id: string) {
    this.router.navigate(['/categories/edit', id]);
  }

  manageMembers(id: string) {
    this.router.navigate(['/members', id]);
  }
}
