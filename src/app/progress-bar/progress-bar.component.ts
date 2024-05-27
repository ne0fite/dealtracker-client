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

  spacerStyle = {
    flex: 0
  }

  losingStyle = {
    flex: 0
  }

  winningStyle = {
    flex: 1
  }

  losingProgressStyle = {
    width: '0%'
  };

  winningProgressStyle = {
    width: '0%'
  };

  ngOnChanges() {
    this.currentIndicatorStyle.left = '0%';
    this.spacerStyle.flex = 0;
    this.losingStyle.flex = 0;
    this.winningStyle.flex = 1;
    this.losingProgressStyle.width = '0%';
    this.winningProgressStyle.width = '0%';

    if (this.startingValue == null || this.currentValue == null || this.upperLimit == null) {
      return;
    }

    const lowerLimit = this.lowerLimit != null ? this.lowerLimit : this.startingValue;

    const isWinning = this.currentValue >= this.startingValue;

    const maxLosing = this.startingValue - lowerLimit;
    const maxWinning = this.upperLimit - this.startingValue;

    const currentAmount = this.currentValue - lowerLimit;
    const winningAmount = !isWinning ? 0 : this.currentValue - this.startingValue;
    const losingAmount = isWinning ? 0 : this.startingValue - this.currentValue;
    const totalDistance = this.upperLimit - lowerLimit;

    const currentPercent = withinRange(toPercent(currentAmount, totalDistance) || 0, 0, 100);
    const losingPercent = maxLosing > 0 ? withinRange(toPercent(maxLosing, totalDistance) || 0, 0, 100) : 100;
    const losingRatio = toRatio(losingAmount, maxLosing) || 1;
    const winningPercent = withinRange(toPercent(maxWinning, totalDistance) || 0, 0, 100);
    this.progress = toPercent(isWinning ? winningAmount : -losingAmount, maxWinning);

    console.log({
      currentValue: this.currentValue,
      lowerLimit,
      upperLimit: this.upperLimit,
      isWinning,
      currentAmount,
      winningAmount,
      losingAmount,
      maxLosing,
      maxWinning,
      totalDistance,
      losingRatio,
      losingPercent,
      winningPercent,
      currentPercent,
      progress: this.progress
    });

    this.currentIndicatorStyle.left = `${currentPercent}%`;

    if (!isWinning) {
      this.losingStyle.flex = losingPercent * losingRatio;
      this.spacerStyle.flex = losingPercent * (1 - losingRatio);
      this.winningStyle.flex = winningPercent;
      this.losingProgressStyle.width = '100%';
      this.winningProgressStyle.width = '0%';
    } else {
      this.spacerStyle.flex = 0;
      this.losingStyle.flex = 0;
      this.winningStyle.flex = 1;
      this.losingProgressStyle.width = '0%';
      this.winningProgressStyle.width = `${this.progress}%`;
    }
  }
}
