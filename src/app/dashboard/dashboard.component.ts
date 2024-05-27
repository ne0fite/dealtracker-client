import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DealFilter } from '../common/types';
import { DealList } from '../deal/deal-list/deal-list.component';
import { DealStatsComponent } from '../deal/deal-stats/deal-stats.component';

@Component({
  selector: 'dt-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    DealList,
    DealStatsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  dealFilter: DealFilter = {
    status: 'open'
  };

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
