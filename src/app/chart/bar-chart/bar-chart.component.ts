import { Component, Input } from '@angular/core';
import { ChartComponent } from '../chart.component';
import { Chart } from 'chart.js';

export type ChartSeries = {
  name: string;
  valueField: string;
  valueFormatter?: (value: any) => string
}

export type ChartOptions = {
  title?: string,
  series: ChartSeries[],
  categoryField: string,
  categoryFormatter?: (value: any) => string;
}

@Component({
  selector: 'dt-bar-chart',
  standalone: true,
  imports: [
    ChartComponent
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) data!: any;
  @Input({ required: true }) options!: ChartOptions;

  chartId!: string;

  chart!: Chart | null;

  constructor() {
    this.chartId = `${this.id}-chart`;
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges() {
    this.chartId = `${this.id}-chart`;
    if (this.chart) {
      this.chart.destroy();
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  renderChart() {
    if (this.options == null) {
      return;
    }

    const chartType = 'bar';

    const datasets = [];
    const labels: string[] = [];

    const { series, categoryField, categoryFormatter } = this.options;

    for (let i = 0; i < series.length; i++) {
      datasets.push({
        label: series[i].name,
        data: [] as any[]
      });
    }

    for (const dataItem of this.data) {
      let label = dataItem[categoryField];
      if (categoryFormatter) {
        label = categoryFormatter(label);
      }
      labels.push(label);

      for (let i = 0; i < series.length; i++) {
        const seriesItem = series[i];
        let value = dataItem[seriesItem.valueField];
        if (seriesItem.valueFormatter) {
          value = seriesItem.valueFormatter(value);
        }

        datasets[i].data.push(value);
      }
    }

    this.chart = new Chart(this.chartId, {
      type: chartType,
      data: {
        labels,
        datasets,
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true
      }
    });
  }
}
