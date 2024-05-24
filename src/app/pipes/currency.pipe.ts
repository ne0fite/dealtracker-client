import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
@Pipe({
    standalone: true,
    name: 'dtcurrency',
})
export class CurrencyPipe implements PipeTransform {
    transform(
        value?: number | null
    ): string | null {
        if (value == null) {
            return '--';
        }

        return formatCurrency(
            value,
            'en-US',
            getCurrencySymbol('USD', 'wide'),
            'USD',
            '1.3-8',
        );
    }
}
