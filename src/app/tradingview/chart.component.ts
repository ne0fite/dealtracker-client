import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dt-trading-view-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class TradingViewChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) ticker?: string | null;
  @Input({ required: true }) assetType?: string | null;

  widget?: any;

  constructor(
    private renderer: Renderer2, private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
      this.updateChart();
  }

  updateChart() {
    if (this.widget) {
      this.renderer.removeChild(this.el.nativeElement, this.widget);
      this.widget = null;
    }

    if (!this.ticker || !this.assetType) {
      return;
    }

    if (!['crypto', 'stock'].includes(this.assetType)) {
      return;
    }

    let symbol;
    if (this.assetType === 'crypto') {
      symbol = this.ticker.toUpperCase() + 'USD';
    } else {
      symbol = this.ticker;
    }


    this.widget = this.renderer.createElement('div');
    this.widget.innerHTML = `
      <div class="tradingview-widget-container__widget"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    `;

    const script = this.renderer.createElement("script");
    this.renderer.setAttribute(script, 'src', 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js');
    this.renderer.setAttribute(script, 'type', 'text/javascript');
    this.renderer.setAttribute(script, 'async', 'true');

    script.innerHTML = `
      {
        "symbols": [
          [
            "COINBASE:${symbol}|1D"
          ]
        ],
        "chartOnly": false,
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "colorTheme": "dark",
        "autosize": true,
        "showVolume": false,
        "showMA": true,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "fontSize": "10",
        "noTimeScale": false,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "candlesticks",
        "maLineColor": "#2962FF",
        "maLineWidth": 1,
        "maLength": 9,
        "lineType": 0,
        "dateRanges": [
          "1d|1",
          "1m|30",
          "3m|60",
          "12m|1D",
          "60m|1W",
          "all|1M"
        ],
        "upColor": "#22ab94",
        "downColor": "#f7525f",
        "borderUpColor": "#22ab94",
        "borderDownColor": "#f7525f",
        "wickUpColor": "#22ab94",
        "wickDownColor": "#f7525f"
      }
    `;

    this.renderer.appendChild(this.widget, script);

    this.renderer.appendChild(this.el.nativeElement, this.widget);
  }
}
