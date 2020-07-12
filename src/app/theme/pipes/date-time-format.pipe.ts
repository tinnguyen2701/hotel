import {Pipe} from '@angular/core';

@Pipe({
    name: 'DateTimeDisplay'
})

export class DateTimeDisplay {
    transform(value: any): string {
        return value;
    }
}
