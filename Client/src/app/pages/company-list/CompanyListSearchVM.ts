import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyApiService } from '../../services/api/company-api.service';
import { NotificationService } from '../../services/notification.service';
import { Company } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './CompanyListSearchView.html',
})
export class CompanyListSearchVM implements OnInit {
  companies: Company[] = [];
  searchQuery: string = '';
  searchSubject = new Subject<string>();

  constructor(
    private companyApi: CompanyApiService,
    private notification: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
    this.searchSubject.pipe(debounceTime(1000)).subscribe(query => {
      this.searchQuery = query;
      this.loadCompanies();
    });
  }

  async loadCompanies() {
    try {
      this.companies = await this.companyApi.getCompanies({ keyword: this.searchQuery });
      this.cdr.detectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  async deleteCompany(company: Company) {
    const result = await this.notification.confirm('ยืนยันการลบ', `คุณแน่ใจหรือไม่ว่าต้องการลบ <br/> บริษัท ${company.name}?`);
    if (result.isConfirmed) {
      try {
        await this.companyApi.deleteCompany(company.company_id);
        this.companies = this.companies.filter(c => c.company_id !== company.company_id);
        this.notification.success('ลบสำเร็จ');
        this.cdr.detectChanges();
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('ลบไม่สำเร็จ', err.error?.message || err.message);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
  }

  editCompany(id: string) {
    this.router.navigate(['/companies/edit', id]);
  }
}
