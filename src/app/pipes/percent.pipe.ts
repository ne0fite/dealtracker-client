import { Pipe, PipeTransform } from '@angular/core';
import { formatPercent } from '@angular/common';
@Pipe({
    standalone: true,
    name: 'dtpercent',
})
export class PercentPipe implements PipeTransform {
    transform(
        value?: number | null
    ): string | null {
        if (value == null) {
            return '--';
        }

        return formatPercent(
            value / 100,
            'en-US',
            '1.3',
        );
    }
}
