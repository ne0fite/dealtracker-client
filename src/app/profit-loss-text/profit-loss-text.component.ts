import { CommonModule, formatCurrency, formatPercent, getCurrencySymbol } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'dt-profit-loss',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit-loss-text.component.html',
  styleUrl: './profit-loss-text.component.scss'
})
export class ProfitLossText implements OnChanges {
  @Input() profitLoss?: number | null = null;
  @Input() format: 'percent' | 'amount' = 'amount';

  profitLossText: string = '--';

  classes = {
    profit: false,
    loss: false
  };

  ngOnChanges(): void {
    this.classes.profit = false;
    this.classes.loss = false;

    if (this.profitLoss != null) {
      if (this.profitLoss > 0) {
        this.classes.profit = true;
      } else if (this.profitLoss < 0) {
        this.classes.loss = true;
      }

      if (this.format === 'percent') {
        this.profitLossText = formatPercent(
          this.profitLoss / 100,
          'en-US',
          '1.3',
        );
      } else {
        this.profitLossText = formatCurrency(
          this.profitLoss,
          'en-US',
          getCurrencySymbol('USD', 'wide'),
          'USD',
          '1.3',
        );
      }
    } else {
      this.profitLossText = '--';
    }
  }
}
