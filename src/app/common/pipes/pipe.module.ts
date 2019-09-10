import { NgModule } from '@angular/core';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { IsEmptyPipe } from './empty.pipe';
import { IsNaNPipe } from './isnan.pipe';
import { DateStringPipe } from './date-string.pipe';

@NgModule({
    imports: [],
    declarations: [
        DecimalFormatPipe,
        IsEmptyPipe,
        IsNaNPipe,
        DateStringPipe
    ],
    exports: [
        DecimalFormatPipe,
        IsEmptyPipe,
        IsNaNPipe,
        DateStringPipe
    ],
})
export class PipeModule { }
