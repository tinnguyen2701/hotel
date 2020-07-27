import {Pipe} from '@angular/core';

@Pipe({
    name: 'LookupDisplay'
})

export class LookupDisplay {
    transform(value: number, list: any[]): string {
        const item = list.find(_ => _.value === value);

        if (!item) {
            return '';
        } else {
            return item.name;
        }
    }
}
