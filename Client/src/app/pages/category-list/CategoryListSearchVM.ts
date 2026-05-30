import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './CategoryListSearchView.html',
})
export class CategoryListSearchVM implements OnInit {
  categories = [
    { id: 1, name: 'Engineering', members: 24, icon: 'bi-gear', color: '#00E5FF' },
    { id: 2, name: 'Marketing', members: 12, icon: 'bi-megaphone', color: '#06D6A0' },
    { id: 3, name: 'Sales', members: 45, icon: 'bi-cart', color: '#FFB703' },
    { id: 4, name: 'IT Support', members: 8, icon: 'bi-headset', color: '#00daf3' }
  ];

  searchQuery: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      console.log('Loading categories...');
      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.apiService.getCategories(this.searchQuery);
      // if (response.status === 'success') {
      //   this.categories = response.data;
      // }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async deleteCategory(id: number) {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
      try {
        console.log(`Deleting category ${id}...`);
        // โครงสร้างการติดต่อ API ในอนาคต
        // await this.apiService.deleteCategory(id);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCategories();
  }
}
