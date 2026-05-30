import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../models/app-models';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      console.log('Loading categories...');
      this.categories = await this.categoryApi.getCategories();
      if (this.searchQuery) {
        this.categories = this.categories.filter(c => 
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดรายการหมวดหมู่ได้');
      console.error('Error loading categories:', error);
    }
  }

  async deleteCategory(id: string) {
    const result = await this.notification.confirm('คุณแน่ใจหรือไม่?', 'ต้องการลบหมวดหมู่นี้ใช่หรือไม่?');
    if (result.isConfirmed) {
      try {
        console.log(`Deleting category ${id}...`);
        await this.categoryApi.deleteCategory(id);
        this.categories = this.categories.filter(c => c.category_id !== id);
        this.notification.success('ลบสำเร็จ', 'หมวดหมู่ถูกลบเรียบร้อยแล้ว');
        this.cdr.detectChanges();
      } catch (error) {
        this.notification.error('ลบไม่สำเร็จ');
        console.error('Error deleting category:', error);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCategories();
  }
}
