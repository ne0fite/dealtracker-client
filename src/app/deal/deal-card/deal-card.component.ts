import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { calculateDeal } from '../../common/calculator';
import { Deal } from '../../common/types/deal.type';
import { ProgressBar } from '../../progress-bar/progress-bar.component';
import { ProfitLossText } from '../../profit-loss-text/profit-loss-text.component';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { WebsocketService } from '../../coinbase/websocket.service';

@Component({
  selector: 'dt-deal-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    ProfitLossText,
    ProgressBar,
    CurrencyPipe,
  ],
  templateUrl: './deal-card.component.html',
  styleUrl: './deal-card.component.scss'
})
export class DealCard {
  @Input({ required: true }) deal!: Deal;

  productId?: string;

  faCheck = faCheck;

  constructor(
    private webSocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    calculateDeal(this.deal);
  }

  async ngOnInit() {
    if (this.deal.status === 'open') {
      if (this.deal.exchange === 'coinbase' && this.deal.ticker != null) {
        this.productId = this.deal.ticker;
        if (this.deal.assetType === 'crypto') {
          this.productId += '-USD';
        }
      }

      if (this.productId) {
        const products = [
          this.productId
        ]
        await this.webSocketService.subscribeToProducts(products, 'ticker', (tickers: any[]) => {
          const ticker = tickers.find((ticker) => ticker.product_id === this.productId);
          if (ticker) {
            this.deal.closePrice = parseFloat(ticker.price);
            this.deal.closeDate = new Date();
            calculateDeal(this.deal);
          }
        });
      }
    }
  }

  async ngOnDestroy() {
    if (this.productId) {
      const products = [
        this.productId
      ]
      await this.webSocketService.unsubscribeToProducts(products, 'ticker');
    }
  }

  editDeal() {
    this.router.navigate(['deal', this.deal.id]);
  }
}
