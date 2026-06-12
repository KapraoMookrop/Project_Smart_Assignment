import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryApiService } from '../../services/api/category-api.service';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './CategoryEditSearchView.html',
})
export class CategoryEditSearchVM implements OnInit {
  category: Partial<Category> = {
    name: '',
    icon: 'bi-grid',
    color_accent: '#00F2FF'
  };
  isEditMode: boolean = false;

  availableIcons = [
    'bi-grid', 'bi-gear', 'bi-megaphone', 'bi-cart', 'bi-headset', 
    'bi-code-slash', 'bi-palette', 'bi-graph-up', 'bi-shield-lock',
    'bi-chat-dots', 'bi-folder', 'bi-file-earmark-text'
  ];

  availableColors = [
    '#00F2FF', '#06D6A0', '#FFB703', '#EF476F', '#118AB2', 
    '#FFD166', '#8338EC', '#3A86FF', '#FB5607'
  ];

  constructor(
    private location: Location,
    private categoryApi: CategoryApiService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadCategory(id);
    }
  }

  async loadCategory(id: string) {
    try {
      const data = await this.categoryApi.getCategoryById(id);
      if (data) {
        this.category = data;
        this.cdr.detectChanges();
      }
    } catch (error) {
      this.notification.error('ไม่พบข้อมูลหมวดหมู่');
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  async saveCategory() {
    try {
      if (!this.category.name) {
        this.notification.warning('กรุณากรอกชื่อหมวดหมู่');
        return;
      }

      console.log('Saving category:', this.category);
      await this.categoryApi.saveCategory(this.category);
      this.notification.success(
        this.isEditMode ? 'อัปเดตสำเร็จ' : 'สร้างสำเร็จ', 
        `หมวดหมู่ "${this.category.name}" ถูกบันทึกเรียบร้อยแล้ว`
      );
      this.cdr.detectChanges();
      this.goBack();
    } catch (error) {
      this.notification.error('บันทึกไม่สำเร็จ');
      console.error('Error saving category:', error);
    }
  }

  selectIcon(icon: string) {
    this.category.icon = icon;
    this.cdr.detectChanges();
  }

  selectColor(color: string) {
    this.category.color_accent = color;
    this.cdr.detectChanges();
  }
}
