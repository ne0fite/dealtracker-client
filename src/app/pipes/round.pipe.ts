import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    standalone: true,
    name: 'dtround',
})
export class RoundPipe implements PipeTransform {
    transform(
        value?: number | null,
        precision: number = 3
    ): string | null {
        if (value == null) {
            return '--';
        }

        const factor = 10 ** precision;
        return (Math.round(value * factor) / factor).toString();
    }
}
