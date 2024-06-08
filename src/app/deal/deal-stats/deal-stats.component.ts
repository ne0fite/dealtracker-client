import { Component, Input, OnInit } from '@angular/core';

import { CurrencyPipe } from '../../pipes/currency.pipe';
import { PercentPipe } from '../../pipes/percent.pipe';

import { DealStats } from '../../common/types/deal-stats';
import { DealService } from '../deal.service';
import { ProfitLossText } from '../../profit-loss-text/profit-loss-text.component';
import { DealFilter, DealQuery } from '../../common/types';
import { QueryInterface } from '../../common/query-interface';

@Component({
  selector: 'dt-deal-stats',
  standalone: true,
  imports: [
    CurrencyPipe,
    PercentPipe,
    ProfitLossText
  ],
  templateUrl: './deal-stats.component.html',
  styleUrl: './deal-stats.component.scss'
})
export class DealStatsComponent implements OnInit {
  @Input() filter?: DealFilter;

  constructor(
    private dealService: DealService
  ) {}

  stats: DealStats = {
    wins: null,
    losses: null,
    totalProfitLoss: null,
    totalProfitPercent: null,
    totalProgress: null,
  };

  async ngOnInit() {
    const query: QueryInterface = {};

    if (this.filter) {
      query.filter = {
        logic: 'and',
        filters: []
      };

      query.filter.filters.push({
        field: 'status',
        operator: 'eq',
        value: 'closed'
      });
    }

    this.stats = await this.dealService.getStats(query);
  }
}
