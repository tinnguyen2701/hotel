import {Pipe} from '@angular/core';

@Pipe({
    name: 'CurrencyDisplay'
})

export class CurrencyDisplay {
    transform(value: number): string {
        return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' VND';
    }
}
