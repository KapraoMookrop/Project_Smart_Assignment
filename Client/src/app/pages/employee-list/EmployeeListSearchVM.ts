import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/api/user-api.service';
import { CategoryApiService } from '../../services/api/category-api.service';
import { User, Category } from '../../models/app-models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { DisplayableUrlPipe } from '../../pipes/displayable-url.pipe';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, DisplayableUrlPipe],
  templateUrl: './EmployeeListSearchView.html',
})
export class EmployeeListSearchVM implements OnInit {
  members: User[] = [];
  searchQuery: string = '';
  searchSubject = new Subject<string>();

  constructor(
    private userApi: UserApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.searchSubject.pipe(debounceTime(1000)).subscribe(query => {
      this.searchQuery = query;
      this.loadData();
    });
  }

  async loadData() {
    try {
      const companyId = this.authService.currentUser()?.company_id;
      this.members = await this.userApi.getUsersByCompany(companyId!, { keyword: this.searchQuery });
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลพนักงานไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
  }

  async addMember() {
    this.router.navigate(['/employees/edit', 'new']);
  }

  async editMember(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  async deleteMember(id: string) {
    const result = await this.notification.confirm('คุณแน่ใจหรือไม่?', 'ต้องการลบพนักงานนี้ใช่หรือไม่?');
    if (result.isConfirmed) {
      try {
        await this.userApi.deleteUser(id);
        this.loadData();
        this.cdr.detectChanges();
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('ลบไม่สำเร็จ', err.error?.message || err.message);
      }
    }
  }
}
