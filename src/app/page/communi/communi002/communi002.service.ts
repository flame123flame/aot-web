import { Injectable } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormGroup } from '@angular/forms';

const URL = {
    SEARCH: 'communicate002/search',
};
@Injectable()
export class Communi002Service {
    constructor(private ajax: AjaxService, ) { }

    search(formSave: FormGroup) {
        return this.ajax.doPost(URL.SEARCH, formSave.value);
    }
}