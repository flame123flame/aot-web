import { Injectable } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormGroup } from '@angular/forms';

const URL = {
    SEARCH: 'communicate001/search',
};

@Injectable()
export class Communi001Srevice {
    constructor(private ajax: AjaxService) { }

    search(formSearch: FormGroup) {
        return this.ajax.doPost(URL.SEARCH, formSearch.value);
    }
}