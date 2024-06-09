export interface AggregateItem {
  field: string;
  aggregate: string;
}

export interface FilterItem {
  field: string;
  value: number | string | boolean;
  operator: string;
}

export interface Filter {
  logic: 'and' | 'or';
  filters: FilterItem[];
}

export interface GroupItem {
  field: string;
  dir: 'asc' | 'desc';
}

export interface SortItem {
  field: string;
  dir: 'asc' | 'desc';
}

export interface QueryInterface {
  attributes?: string[];
  aggregates?: AggregateItem[];
  filter?: Filter;
  group?: GroupItem[];
  sort?: SortItem[];
  take?: number;
  offset?: number;
  bucket?: string;
  bucketField?: string;
}
