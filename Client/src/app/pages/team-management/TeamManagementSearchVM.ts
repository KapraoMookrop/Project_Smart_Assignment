import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TeamManagementSearchView.html',
})
export class TeamManagementSearchVM implements OnInit {
  members = [
    { id: 1, name: 'Sarah Jenkins', role: 'Company Admin', initials: 'SJ', categories: ['Engineering', 'Product'], statusColor: '#00E5FF' },
    { id: 2, name: 'Marcus Chen', role: 'Regular User', initials: 'MC', categories: ['Sales'], statusColor: '#8e9196' },
    { id: 3, name: 'Elena Rossi', role: 'Regular User', initials: 'EL', categories: ['IT Support', 'Security'], statusColor: '#8e9196' }
  ];

  categories = [
    { name: 'Engineering', count: 12, icon: 'bi-gear' },
    { name: 'Sales', count: 8, icon: 'bi-shop' },
    { name: 'IT Support', count: 5, icon: 'bi-headset' },
    { name: 'Product', count: 4, icon: 'bi-lightbulb' }
  ];

  constructor() {}

  ngOnInit(): void {}

  async addMember() {
    console.log('Opening add member modal...');
  }

  async editMember(id: number) {
    console.log(`Editing member ${id}...`);
  }
}
