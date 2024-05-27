import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DateTime } from 'luxon';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { calculateDeal } from '../../common/calculator';
import { Deal } from '../../common/types/deal.type';
import { DealDto } from '../../common/types/deal.dto';
import { Ticker } from '../../common/types';

import { fromPercent, fromRatio, toPercent, toRatio } from '../../conversions';
import { ApiService } from '../../alphavantage/api.service';
import { DealService } from '../deal.service';
import { DialogService } from '../../dialog/dialog.service';
import { QuoteInput } from '../../quote-input/quote-input.component';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { PercentPipe } from '../../pipes/percent.pipe';
import { ProfitLossText } from '../../profit-loss-text/profit-loss-text.component';
import { ProgressBar } from '../../progress-bar/progress-bar.component';
import { DealView } from '../deal.view';
import { CloseDealResult } from '../close-deal-dialog/close-deal-dialog.component';
import { TradingViewChartComponent } from '../../tradingview/chart.component';

@Component({
  selector: 'app-deal-create',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,

    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,

    CurrencyPipe,
    PercentPipe,

    ProfitLossText,
    ProgressBar,
    QuoteInput,

    TradingViewChartComponent,
  ],
  templateUrl: './edit-deal.component.html',
  styleUrl: './edit-deal.component.scss'
})
export class EditDealComponent implements OnInit, OnChanges {
  @Input() id?: string;

  faChevronLeft = faChevronLeft;

  title: string = '';

  deal: DealView = {
    openDate: DateTime.now().toFormat('D'),
    openPrice: null,
    closeDate: null,
    closePrice: null,
    exchange: '',
    feeOpen: 0,
    feeClose: 0,
    feeType: 'flat',
    ticker: '',
    assetType: '',
    units: null,
    invest: null,
    takeProfit: null,
    takeProfitAmount: null,
    stopLoss: null,
    stopLossAmount: null,
    status: 'open',
    // projectId: null,
    notes: '',
    id: null,
    openFeeAmount: null,
    takeProfitFeeAmount: null,
    takeProfitCostBasis: null,
    takeProfitGross: null,
    takeProfitPrice: null,
    stopLossFeeAmount: null,
    stopLossCostBasis: null,
    stopLossGross: null,
    stopLossPrice: null,
    closeFeeAmount: null,
    closeCostBasis: null,
    closeGross: null,
    profitLoss: null,
    profitLossPercent: null,
    progress: null,
    progressPercent: null
  };

  dealForm = this.formBuilder.group(this.deal);

  assetTypes = [{
    name: 'Crypto',
    value: 'crypto'
  }, {
    name: 'Future',
    value: 'future'
  }, {
    name: 'Option',
    value: 'option'
  }, {
    name: 'Stock',
    value: 'stock'
  }];

  feeTypes = [{
    name: 'Flat',
    value: 'flat'
  }, {
    name: 'Percent',
    value: 'percent'
  }];

  exchanges = [{
    name: 'Coinbase',
    value: 'coinbase'
  }, {
    name: 'Charles Schwab',
    value: 'schwab'
  }, {
    name: 'Robing Hood',
    value: 'robinhood'
  }];

  filteredTickers: Ticker[] = [];

  investAs: 'units' | 'amount' = 'amount';
  takeProfitAs: 'percent' | 'amount' = 'percent';
  stopLossAs: 'percent' | 'amount' = 'percent';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService,
    private dealService: DealService,
    private dialogService: DialogService,
  ) {
    this.dealForm.controls.openPrice.valueChanges.subscribe(change => {
      this.calcInvest();
    });
    this.dealForm.controls.units.valueChanges.subscribe(change => {
      this.calcInvest();
    });
    this.dealForm.controls.invest.valueChanges.subscribe(change => {
      this.calcUnits();
    });

    this.dealForm.controls.takeProfit.valueChanges.subscribe(change => {
      this.calcTakeProfitAmount();
    });
    this.dealForm.controls.takeProfitAmount.valueChanges.subscribe(change => {
      this.calcTakeProfit();
    });

    this.dealForm.controls.stopLoss.valueChanges.subscribe(change => {
      this.calcStopLossAmount();
    });
    this.dealForm.controls.stopLossAmount.valueChanges.subscribe(change => {
      this.calcStopLoss();
    });

    this.dealForm.valueChanges.subscribe(change => {
      this.calculateDeal();
    });
  }

  async ngOnInit() {
    if (this.id != null) {
      const data = await this.dealService.getById(this.id);

      this.deal = {
        id: data.id,
        openDate: null,
        openPrice: data.openPrice,
        closeDate: null,
        closePrice: data.closePrice,
        exchange: data.exchange,
        feeOpen: data.feeOpen,
        feeClose: data.feeClose,
        feeType: data.feeType,
        ticker: data.ticker,
        assetType: data.assetType,
        units: data.units,
        invest: data.invest,
        takeProfit: data.takeProfit,
        takeProfitAmount: data.takeProfitAmount,
        stopLoss: data.stopLoss,
        stopLossAmount: data.stopLossAmount,
        status: data.status,
        // @TODO
        // projectId: null,
        notes: data.notes,
      } as DealView;

      if (data.openDate != null) {
        const openDate = new Date(data.openDate);
        this.deal.openDate = DateTime.fromJSDate(openDate).toFormat('D');
      }

      if (data.closeDate != null) {
        const closeDate = new Date(data.closeDate);
        this.deal.closeDate = DateTime.fromJSDate(closeDate).toFormat('D');
      }

      this.setTitle();

      this.dealForm.patchValue(this.deal);

      this.calculateDeal();
    }
  }

  ngOnChanges(): void {
    this.setTitle();
  }

  setTitle() {
      if (this.deal.id != null) {
        this.title = 'Edit Deal';
      } else {
        this.title = 'New Deal';
      }
  }

  goBack() {
    this.location.back();
  }

  async saveDeal() {
    try {
      await this._saveDeal();
      this.toastr.success('Deal Saved!');
    } catch (error) {
      this.toastr.error('Error Saving Deal');
    }
  }

  private getDealDto() {
    const dto: DealDto = {
      openDate: this.dealForm.value.openDate,
      closeDate: this.dealForm.value.closeDate,
      exchange: this.dealForm.value.exchange,
      ticker: this.dealForm.value.ticker,
      assetType: this.dealForm.value.assetType || undefined,
      status: this.dealForm.value.status || 'open',

      units: this.dealForm.value.units,
      openPrice: this.dealForm.value.openPrice,
      takeProfit: this.dealForm.value.takeProfit,
      stopLoss: this.dealForm.value.stopLoss,
      feeOpen: this.dealForm.value.feeOpen,
      feeClose: this.dealForm.value.feeClose,
      feeType: this.dealForm.value.feeType || 'flat',
      closePrice: this.dealForm.value.closePrice,

      projectId: null,
      notes: this.dealForm.value.notes,
    };

    if (dto.ticker != null && typeof dto.ticker  === 'object') {
      const ticker: Ticker = dto.ticker ;
      dto.ticker = ticker.symbol;
    }

    this.calculateDeal();

    return dto;
  }

  private async _saveDeal() {

    const dto = this.getDealDto();

    const dealId = this.deal.id || undefined;

    this.deal = await this.dealService.save(dto, dealId) as DealView;

    this.setTitle();
  }

  async closeDeal() {
    if (this.deal.id == null) {
      return;
    }

    const dto = this.getDealDto();

    try {
      const result = await this.dealService.closeDeal(dto, this.deal.id) as CloseDealResult;
      if (result.result) {
        dto.closeDate = result.deal.closeDate;
        dto.closePrice = result.deal.closePrice;
        dto.notes = result.deal.notes;

        this.toastr.success('Deal Closed!');
        this.goBack();
      }
    } catch (error) {
      this.toastr.error('Error Closing Deal');
    }
  }

  async reopenDeal() {
    if (this.deal.id == null) {
      return;
    }
    this.dealForm.patchValue({ status: 'open' });

    try {
      await this._saveDeal();
      this.deal.status = 'open';
    } catch (error) {
      this.toastr.error('Error Reopening Deal');
    }
  }

  async deleteDeal() {
    if (this.deal.id == null) {
      return;
    }

    const result = await this.dialogService.confirm(
      'Are you sure you want to delete this deal?', {
        title: 'Delete Deal?'
      }
    );

    if (result) {
      try {
        await this.dealService.delete(this.deal.id);
        this.toastr.success('Deal Deleted!');
        this.goBack();
      } catch (error) {
        this.toastr.error('Error Deleting Deal');
      }
    }
  }

  async filterTicker(event: any) {
    const { query } = event;

    if (this.dealForm.value.assetType !== 'stock') {
      this.filteredTickers = [];
      return;
    }

    try {
      this.filteredTickers = await this.apiService.searchSymbol(query);
    } catch (error) {
      console.error(error);
    }
  }

  toggleInvestAs() {
    if (this.investAs === 'units') {
      this.investAs = 'amount';
    } else {
      this.investAs = 'units';
    }
  }

  toggleTakeProfitAs() {
    if (this.takeProfitAs === 'percent') {
      this.takeProfitAs = 'amount';
    } else {
      this.takeProfitAs = 'percent';
    }
  }

  toggleStopLossAs() {
    if (this.stopLossAs === 'percent') {
      this.stopLossAs = 'amount';
    } else {
      this.stopLossAs = 'percent';
    }
  }

  calcInvest() {
    const units = this.dealForm.controls.units.value;
    const price = this.dealForm.controls.openPrice.value;
    const invest = fromRatio(price, units);
    this.dealForm.patchValue({ invest }, { emitEvent: false });
  }

  calcUnits() {
    const invest = this.dealForm.controls.invest.value;
    const price = this.dealForm.controls.openPrice.value;
    const units = toRatio(invest, price);
    this.dealForm.patchValue({ units }, { emitEvent: false });
  }

  calcTakeProfit() {
    const invest = this.dealForm.controls.invest.value;
    const takeProfitAmount = this.dealForm.controls.takeProfitAmount.value;
    const takeProfit = toPercent(takeProfitAmount, invest);
    this.dealForm.patchValue({ takeProfit }, { emitEvent: false });
  }

  calcTakeProfitAmount() {
    const invest = this.dealForm.controls.invest.value;
    const takeProfit = this.dealForm.controls.takeProfit.value;
    const takeProfitAmount = fromPercent(takeProfit, invest);
    this.dealForm.patchValue({ takeProfitAmount }, { emitEvent: false });
  }

  calcStopLoss() {
    const invest = this.dealForm.controls.invest.value;
    const stopLossAmount = this.dealForm.controls.stopLossAmount.value;
    const stopLoss = toPercent(stopLossAmount, invest);
    this.dealForm.patchValue({ stopLoss }, { emitEvent: false });
  }

  calcStopLossAmount() {
    const invest = this.dealForm.controls.invest.value;
    const stopLoss = this.dealForm.controls.stopLoss.value;
    const stopLossAmount = fromPercent(stopLoss, invest);
    this.dealForm.patchValue({ stopLossAmount }, { emitEvent: false });
  }

  calculateDeal() {
    this.deal.units = this.dealForm.controls.units.value;
    this.deal.openPrice = this.dealForm.controls.openPrice.value;
    this.deal.takeProfit = this.dealForm.controls.takeProfit.value;
    this.deal.stopLoss = this.dealForm.controls.stopLoss.value;
    this.deal.closePrice = this.dealForm.controls.closePrice.value;
    this.deal.feeOpen = this.dealForm.controls.feeOpen.value;
    this.deal.feeClose = this.dealForm.controls.feeClose.value;
    this.deal.feeType = (this.dealForm.controls.feeType.value || 'flat') as 'flat' | 'percent';

    calculateDeal(this.deal as Deal);
  }
}
