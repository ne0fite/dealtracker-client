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
// import { WebSocketService } from '../../api/websocket.service';

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

  faCheck = faCheck;

  constructor(
    // private webSocketService: WebSocketService,
    private router: Router
  ) { }

  ngOnChanges(): void {
    calculateDeal(this.deal);
  }

  // ngOnInit(): void {
  //   this.webSocketService.sendMessage('monitordeal', {
  //     id: this.deal.id
  //   });

  //   this.webSocketService.on('dealupdate', (message) => {
  //     if (message.deal && message.deal.id === this.deal.id) {
  //       this.deal = {
  //         ...message.deal
  //       };
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.webSocketService.sendMessage('unmonitordeal', {
  //     id: this.deal.id
  //   });
  // }

  editDeal() {
    this.router.navigate(['deal', this.deal.id]);
  }
}
