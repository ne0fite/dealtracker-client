import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { toPercent, toRatio, withinRange } from '../common/conversions';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { ProfitLossText } from '../profit-loss-text/profit-loss-text.component';

@Component({
  selector: 'dt-progress-bar',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ProfitLossText,
    FontAwesomeModule,
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBar implements OnChanges {
  @Input() startingValue?: number | null = null;
  @Input() currentValue?: number | null = null;
  @Input() upperLimit?: number | null = null;
  @Input() upperLimitLabel: string = '';
  @Input() lowerLimit?: number | null = null;
  @Input() lowerLimitLabel: string = '';

  faCaretDown = faCaretDown;

  progress: number | null = null;

  progressClass = {
    'one-way': true,
    'two-way': false,
  }

  currentIndicatorStyle = {
    left: '0%'
  }

  stopLossProgressStyle = {
    width: '0%'
  };

  losingProgressStyle = {
    width: '0%'
  };

  winningProgressStyle = {
    width: '0%'
  };

  ngOnChanges() {
    this.currentIndicatorStyle.left = '0%';
    this.losingProgressStyle.width = '0%';
    this.winningProgressStyle.width = '0%';

    if (this.startingValue == null || this.currentValue == null || this.upperLimit == null) {
      return;
    }

    const op = this.startingValue;
    const tp = this.upperLimit;
    const sl = this.lowerLimit != null ? this.lowerLimit : op;
    const cp = this.currentValue;
    const pl = cp - op;
    const totalRange = tp - sl;

    const cpPercent = withinRange(toPercent(cp - sl, totalRange), 0, 100);

    let slPercent = 0;
    let lPercent = 0;
    let pPercent = 0;

    if (pl < 0) {
      slPercent = withinRange(toPercent(op - sl + pl, totalRange), 0, 100);
      lPercent = withinRange(toPercent(Math.abs(pl), totalRange), 0, 100);
    } else {
      slPercent = withinRange(toPercent(op - sl, totalRange), 0, 100);
      pPercent = withinRange(toPercent(pl, totalRange), 0, 100);
    }

    this.currentIndicatorStyle.left = `${cpPercent}%`;
    this.stopLossProgressStyle.width = `${slPercent}%`;
    this.losingProgressStyle.width = `${lPercent}%`;
    this.winningProgressStyle.width = `${pPercent}%`;
  }
}
