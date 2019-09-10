import { Injectable } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { Observable } from 'rxjs';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { MessageService } from 'src/app/_service/message.service';
const URLS = {
  GET_DROPDOWN: 'lov/list-data-detail',
  GET_SAP_CUT: 'common/getSAPCustumer/',
  GET_SAP_CON_NO: 'common/getSAPContractNo/',
  SAVE_PHONE_REQ: 'phone002/save',
  GET_SERVICE_TYPE: 'phone002/get-service-type/',
  GET_RENTAL_AREA: 'common/getUtilityArea/'
};
@Injectable()
export class Phone002detailService {

  constructor(
    private ajax: AjaxService,
  ) { }

  getParams(paramsKey: string) {
    const primise = new Promise((resolve, reject) => {
      this.ajax.doPost(`${URLS.GET_DROPDOWN}`, { lovKey: paramsKey }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return primise.then((data: any) => {
      return data.data;
    });
  }

  getSapCustomerList(type: string) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doGet(`${URLS.GET_SAP_CUT}${type}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return promise.then((data: any) => {
      return data.data;
    });
  }

  getSapContractNo(partner: string) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doGet(`${URLS.GET_SAP_CON_NO}${partner}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return promise.then((data: any) => {
      return data.data;
    });
  }

  getRentalArea(contractNo: any) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doGet(`${URLS.GET_RENTAL_AREA}${contractNo}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return promise.then((data: any) => {
      return data.data;
    });
  }

  getServiceType(phoneType: string) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doGet(`${URLS.GET_SERVICE_TYPE}${phoneType}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return promise.then((data: any) => {
      return data.data;
    });
  }

  getRateCharge(phoneType: string) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doGet(`${URLS.GET_SERVICE_TYPE}${phoneType}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });

    return promise.then((data: any) => {
      return data.data;
    });
  }

  saveService(dataSave): Observable<any> {
    return new Observable((obs) => {
      this.ajax.doPost(URLS.SAVE_PHONE_REQ, dataSave).subscribe(
        (res: ResponseData<any>) => {
          obs.next(res);
        }, (err) => {
          obs.error(err);
        });
    });
  }
}
