import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { toPercent, withinRange } from '../common/conversions';
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

  lowerBoundLabel = this.lowerLimitLabel;
  upperBoundLabel = this.upperLimitLabel;

  lowerBound = this.lowerLimit;
  upperBound = this.upperLimit;

  progress: number | null = null;

  slLabelStyle = {
    left: '0%'
  }

  slLabelClass = {
    ['left-align']: false,
    ['right-align']: false
  }

  opLabelStyle = {
    left: '0%'
  }

  opLabelClass = {
    ['left-align']: false,
    ['right-align']: false
  }

  tpLabelStyle = {
    left: '0%'
  }

  tpLabelClass = {
    ['left-align']: false,
    ['right-align']: false
  }

  slIndicatorStyle = {
    left: '0%'
  }

  cpIndicatorStyle = {
    left: '0%'
  }

  opIndicatorStyle = {
    left: '50%'
  }

  tpIndicatorStyle = {
    left: '50%'
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
    this.slIndicatorStyle.left = '0%';
    this.opIndicatorStyle.left = '0%';
    this.tpIndicatorStyle.left = '0%';
    this.cpIndicatorStyle.left = '0%';
    this.losingProgressStyle.width = '0%';
    this.winningProgressStyle.width = '0%';

    if (this.startingValue == null || this.currentValue == null || this.upperLimit == null) {
      return;
    }

    const op = this.startingValue;
    const tp = this.upperLimit;
    const sl = this.lowerLimit != null ? this.lowerLimit : op;

    this.lowerBoundLabel = this.lowerLimit != null ? this.lowerLimitLabel || 'SL' : 'OP';
    this.upperBoundLabel = this.upperLimitLabel || 'TP';

    const cp = this.currentValue;
    const pl = cp - op;

    this.lowerBound = Math.min(cp, sl);
    this.upperBound = Math.max(cp, tp);
    const totalRange = this.upperBound - this.lowerBound;

    const slIndicatorPercent = withinRange(toPercent(sl - this.lowerBound, totalRange), 0, 100);
    const opIndicatorPercent = withinRange(toPercent(op - this.lowerBound, totalRange), 0, 100);
    const tpIndicatorPercent = withinRange(toPercent(tp - this.lowerBound, totalRange), 0, 100);
    const cpIndicatorPercent = withinRange(toPercent(cp - this.lowerBound, totalRange), 0, 100);

    let slPercent = 0;
    let lPercent = 0;
    let pPercent = 0;
    this.progress = null;

    if (pl < 0) {
      slPercent = withinRange(toPercent(op - sl + pl, totalRange), 0, 100);
      lPercent = withinRange(toPercent(Math.abs(pl), totalRange), 0, 100);
    } else {
      slPercent = withinRange(toPercent(op - sl, totalRange), 0, 100);
      pPercent = withinRange(toPercent(pl, totalRange), 0, 100);
    }

    this.slLabelStyle.left = `${slIndicatorPercent}%`;
    this.setLabelClass(this.slLabelClass, slIndicatorPercent);
    this.opLabelStyle.left = `${opIndicatorPercent}%`;
    this.setLabelClass(this.opLabelClass, opIndicatorPercent);
    this.tpLabelStyle.left = `${tpIndicatorPercent}%`;
    this.setLabelClass(this.tpLabelClass, tpIndicatorPercent);

    this.cpIndicatorStyle.left = `${cpIndicatorPercent}%`;
    this.slIndicatorStyle.left = `${slIndicatorPercent}%`;
    this.opIndicatorStyle.left = `${opIndicatorPercent}%`;
    this.tpIndicatorStyle.left = `${tpIndicatorPercent}%`;

    this.stopLossProgressStyle.width = `${slPercent}%`;
    this.losingProgressStyle.width = `${lPercent}%`;
    this.winningProgressStyle.width = `${pPercent}%`;

    this.progress = (cp - op) / (tp - op) * 100;
  }

  setLabelClass(labelClass: any, leftPercent: number) {
    if (leftPercent < 10) {
      labelClass['left-align'] = true;
      labelClass['right-align'] = false;
    } else if (leftPercent > 90) {
      labelClass['left-align'] = false;
      labelClass['right-align'] = true;
    } else {
      labelClass['left-align'] = false;
      labelClass['right-align-right'] = false;
    }
  }
}
