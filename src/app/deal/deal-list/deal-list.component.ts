import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown, faSliders } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { DateTime } from 'luxon';

import { DealFilter } from '../../common/types';
import { Deal } from '../../common/types/deal.type';

import { DealService } from '../deal.service';
import { DealCard } from '../deal-card/deal-card.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { DialogService } from '../../dialog/dialog.service';
import { QueryInterface, SortItem } from '../../common/query-interface';

@Component({
  selector: 'dt-deal-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ButtonModule,
    DealCard
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss'
})
export class DealList implements OnInit {
  @Input() max?: number = 0;
  @Input() filter?: DealFilter;

  static LS_DEAL_LIST_FILTER_STATE = 'dt-shift-list-state';

  faSliders = faSliders;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  deals: Array<Deal> = [];

  numFilters? = '';

  sortDirection: 'asc' | 'desc' = 'desc';
  sortArrowIcon = faArrowDown;

  lastOffset: number | null = null;
  pageSize = 50;
  totalRows = 0;
  hasMore = false;

  constructor(
    private dialogService: DialogService,
    private dealService: DealService
  ) {}

  async ngOnInit() {
    this.loadState();
    this.updateNumFilters();
    await this.loadNextPage();
  }

  loadState() {
    const savedStateJson = localStorage.getItem(DealList.LS_DEAL_LIST_FILTER_STATE);
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
        this.sortDirection = savedState.sortDirection;
      } catch {
        // no-op
      }
    }
  }

  saveState() {
    const state = {
      filters: this.filter,
      sortDirection: this.sortDirection
    };
    localStorage.setItem(DealList.LS_DEAL_LIST_FILTER_STATE, JSON.stringify(state));
  }

  updateNumFilters() {
    // update the filter count badge
    let numFilters = 0;
    if (this.filter?.dateRange != null) {
      numFilters++;
    }
    if (this.filter?.symbols && this.filter.symbols.length > 0) {
      numFilters++;
    }
    this.numFilters = numFilters > 0 ? numFilters.toString() : undefined;
  }

  async loadNextPage() {
    const sort: SortItem[] = [{
      field: 'openDate',
      dir: this.sortDirection,
    }];

    if (this.lastOffset == null) {
      // starting from the beginning
      this.lastOffset = 0;
    } else {
      // get next page of data
      this.lastOffset += this.pageSize;
    }

    const query: QueryInterface = {
      sort,
      offset: this.lastOffset,
      take: this.pageSize
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

    console.log(query);

    const response = await this.dealService.find(query);
    this.deals = this.deals.concat(response.results);
    this.totalRows = response.totalRows;

    if (this.totalRows > this.deals.length + this.pageSize) {
      this.hasMore = true;
    } else {
      this.hasMore = false;
    }
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

      // filters changed - go back to top
      this.lastOffset = null;
      this.deals = [];

      // query the shifts
      await this.loadNextPage();
    }
  }
}
