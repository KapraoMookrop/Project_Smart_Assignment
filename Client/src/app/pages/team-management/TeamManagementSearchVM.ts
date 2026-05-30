import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/api/user-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { User, Category } from '../../models/app-models';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TeamManagementSearchView.html',
})
export class TeamManagementSearchVM implements OnInit {
  members: User[] = [];
  categories: Category[] = [];

  constructor(
    private userApi: UserApiService,
    private categoryApi: CategoryApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      this.members = await this.userApi.getUsers();
      this.categories = await this.categoryApi.getCategories();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  }

  async addMember() {
    console.log('Opening add member modal...');
  }

  async editMember(id: string) {
    console.log(`Editing member ${id}...`);
  }
}
