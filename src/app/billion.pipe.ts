import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
    name: 'billion'
})
export class BillionPipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) {}

    transform( value: any, digits?: any ): any {
        if ( value > 1000000000 ) {
            return this.decimalPipe.transform( value / 1000000000, digits ) + 'B';
        } else {
            return this.decimalPipe.transform( value / 1000000, digits ) + 'M';
        }
    }
}
