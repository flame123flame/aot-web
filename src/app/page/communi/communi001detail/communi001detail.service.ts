import { Injectable } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormGroup } from '@angular/forms';

const URL = {
    GET_DROPDOWN: 'lov/list-data-detail',
    GET_SAP_CUT: 'common/getSAPCustumer/',
    GET_SAP_CON_NO: 'common/getSAPContractNo/',
    SAVE: 'communicate001/save',
};

@Injectable()
export class Communi001DetailSrevice {

    constructor(
        private ajax: AjaxService,
    ) { }

    getSapCustomerList(type: string) {
        return this.ajax.doGet(`${URL.GET_SAP_CUT}${type}`);
    }

    getSapContractNo(partner: string) {
        return this.ajax.doGet(`${URL.GET_SAP_CON_NO}${partner}`);
    }

    save(formSave: FormGroup) {
        return this.ajax.doPost(URL.SAVE, formSave.value);
    }

}