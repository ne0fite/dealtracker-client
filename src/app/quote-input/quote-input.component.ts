import { Component, Input, forwardRef } from '@angular/core';
import { NumericInput } from '../numeric-input/numeric-input.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

import { ApiService } from '../alphavantage/api.service';
import { DealType } from '../../../../common/types';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'dt-quote-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule
  ],
  templateUrl: './quote-input.component.html',
  styleUrl: './quote-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuoteInput),
      multi: true,
    },
  ]
})
export class QuoteInput extends NumericInput {
  @Input({ required: true }) ticker?: string | null;
  @Input({ required: true }) assetType?: DealType | null | '';

  faRefresh = faRefresh;

  loading = false;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    super();
  }

  async getQuote() {
    if (!this.ticker || !this.assetType) {
      return;
    }

    this.loading = true;

    try {
      const quotes = await this.apiService.getIntraday(this.ticker, '1min', this.assetType);

      if (quotes.length > 0) {
        this.writeValue(quotes[0].close);
      }
    } catch (error) {
      this.toastr.error('Error Retrieving Quote');
    } finally {
      this.loading = false;
    }
  }
}
