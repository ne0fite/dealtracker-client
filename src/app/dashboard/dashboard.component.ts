import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';

import { DealFilter } from '../common/types';
import { DealList } from '../deal/deal-list/deal-list.component';
import { DealStatsComponent } from '../deal/deal-stats/deal-stats.component';
import { DialogService } from '../dialog/dialog.service';
import { FilterDialogComponent } from '../deal/filter-dialog/filter-dialog.component';
import { BarChartComponent, ChartOptions } from '../chart/bar-chart/bar-chart.component';
import { DateTime } from 'luxon';
import { QueryInterface } from '../common/query-interface';
import { DealService } from '../deal/deal.service';

@Component({
  selector: 'dt-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    ButtonModule,
    BarChartComponent,
    DealList,
    DealStatsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() filter?: DealFilter;

  static LS_DASHBOARD_FILTER_STATE = 'dt-dashboard-state';

  faSliders = faSliders;

  numFilters? = '';

  monthlyProfitChartOptions: ChartOptions = {
    title: 'Monthly Profit',
    series: [{
      name: 'Profit',
      valueField: 'profit_loss_sum',
    }],
    categoryField: 'bucket',
    categoryFormatter: this.formatProfitDate.bind(this)
  }

  mothlyProfitChartData: any[] = [];

  bucket: string = 'month';

  bucketDateFormat: string = 'M/d/yyyy';

  constructor(
    private dialogService: DialogService,
    private dealService: DealService
  ) { }

  async ngOnInit() {
    this.loadState();
    this.updateNumFilters();
    await this.queryChartData();
  }

  ngOnDestroy() {
  }

  loadState() {
    const savedStateJson = localStorage.getItem(DashboardComponent.LS_DASHBOARD_FILTER_STATE);
    if (savedStateJson) {
      try {
        const savedState = JSON.parse(savedStateJson);
        const savedFilters = savedState.filters;
        if (Array.isArray(savedFilters.dateRangeDates)) {
          for (let i = 0; i < savedFilters.dateRangeDates.length; i++) {
            savedFilters.dateRangeDates[i] = new Date(savedFilters.dateRangeDates[i]);
          }
        }
        this.filter = {
          ...savedFilters
        };
      } catch {
        // no-op
      }
    }
  }

  saveState() {
    const state = {
      filters: this.filter,
    };
    localStorage.setItem(DashboardComponent.LS_DASHBOARD_FILTER_STATE, JSON.stringify(state));
  }

  updateNumFilters() {
    // update the filter count badge
    let numFilters = 0;
    if (this.filter) {
      if (this.filter.dateRange != null) {
        numFilters++;
      }
      if (this.filter.status) {
        numFilters++;
      }
      if (this.filter.symbols && this.filter.symbols.length > 0) {
        numFilters++;
      }
    }
    this.numFilters = numFilters > 0 ? numFilters.toString() : undefined;
  }

  async filterDeals() {
    const result = await this.dialogService.show(
      FilterDialogComponent, {
      initialState: {
        filters: this.filter,
      }
    });

    if (result.result) {
      this.updateNumFilters();

      // copy the applied filters
      this.filter = {
        ...result.filters
      }

      this.saveState();

      await this.queryChartData();
    }
  }

  async queryChartData() {
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

    const monthlyProfitQuery: QueryInterface = {
      ...query,
      aggregates: [{
        field: 'profit_loss',
        aggregate: 'sum'
      }],
      sort: [{
        field: 'bucket',
        dir: 'asc'
      }],
      bucket: this.bucket,
      bucketField: 'close_date'
    }

    const response = await this.dealService.find(monthlyProfitQuery);
    this.mothlyProfitChartData = response.results as any[];

    if (this.bucket === 'month') {
      if (this.mothlyProfitChartData.length > 12) {
        this.bucketDateFormat = 'MMM yyyy';
      } else {
        this.bucketDateFormat = 'MMM';
      }
    } else if (this.bucket === 'year') {
      this.bucketDateFormat = 'yyyy';
    } else {
      if (this.mothlyProfitChartData.length > 366) {
        this.bucketDateFormat = 'M/d/yyyy';
      } else if (this.mothlyProfitChartData.length > 31) {
        this.bucketDateFormat = 'M/d';
      } else {
        this.bucketDateFormat = 'd';
      }
    }
  }

  formatProfitDate(value: string): string {
    const bucketDate = new Date(value);
    // work date is date-only but comes from the server at midnight UTC
    const formatted = DateTime.fromJSDate(bucketDate).toUTC().toFormat(this.bucketDateFormat);
    return formatted;
  }
}
