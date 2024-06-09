import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DateTime } from 'luxon';

import { CurrencyPipe } from '../../pipes/currency.pipe';
import { PercentPipe } from '../../pipes/percent.pipe';

import { DealStats } from '../../common/types/deal-stats';
import { DealService } from '../deal.service';
import { ProfitLossText } from '../../profit-loss-text/profit-loss-text.component';
import { DealFilter } from '../../common/types';
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
export class DealStatsComponent implements OnInit, OnChanges {
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
    await this.queryData();
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.queryData();
  }

  async queryData() {
    const query: QueryInterface = {
    };

    if (this.filter) {
      query.filter = {
        logic: 'and',
        filters: []
      };

      if (this.filter.dateRangeDates != null && this.filter.dateRangeDates.length > 0) {
        query.filter.filters.push({
          field: 'openDate',
          operator: 'gte',
          value: DateTime.fromJSDate(this.filter.dateRangeDates[0]).toFormat('yyyy-MM-dd')
        });
        query.filter.filters.push({
          field: 'openDate',
          operator: 'lte',
          value: DateTime.fromJSDate(this.filter.dateRangeDates[1]).toFormat('yyyy-MM-dd')
        });
      }

      if (this.filter.status) {
        query.filter.filters.push({
          field: 'status',
          operator: 'eq',
          value: this.filter.status
        });
      }

      if (this.filter.symbols && this.filter.symbols.length > 0) {
        query.filter.filters.push({
          field: 'ticker',
          operator: 'in',
          value: this.filter.symbols.join(',')
        });
      }
    }

    this.stats = await this.dealService.getStats(query);
  }
}
