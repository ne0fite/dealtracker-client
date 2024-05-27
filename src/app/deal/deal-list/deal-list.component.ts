import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealFilter, DealQuery } from '../../common/types';
import { Deal } from '../../common/types/deal.type';

import { DealService } from '../deal.service';
import { DealCard } from '../deal-card/deal-card.component';

@Component({
  selector: 'dt-deal-list',
  standalone: true,
  imports: [
    CommonModule,
    DealCard
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss'
})
export class DealList implements OnInit {
  @Input() max?: number = 0;
  @Input() filter?: DealFilter;

  deals: Array<Deal> = [];

  constructor(
    private dealService: DealService
  ) {}

  async ngOnInit() {
    const query: DealQuery = {};

    if (this.filter) {
      const filters = [];

      if (this.filter.status) {
        filters.push({ status: this.filter.status });
      }

      query.filter = {
        filters,
      }
    }

    const result = await this.dealService.find(query);

    this.deals = result.results;
  }
}
