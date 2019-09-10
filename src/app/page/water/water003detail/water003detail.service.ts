import { Injectable } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/_service/message.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { Observable } from 'rxjs';

const URLS = {
  SAVE_DATA: 'water003/save',
  GET_DROPDOWN: 'lov/list-data-detail',
  GET_CONFIG: 'electric003/getRateChargeConfig',
  GET_SAP_CUT: 'common/getSAPCustumer/',
  GET_SAP_CON_NO: 'common/getSAPContractNo/',
  GET_WATER_SIZE: 'water003/get_water_size',
  GET_OTHER_LIST: 'water003/listOrther',
};

@Injectable()
export class Water003detailService {

  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
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

  getConfig(ampare: string, phase: string) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doPost(`${URLS.GET_CONFIG}`, { electricPhase: phase, electricAmpere: ampare }).subscribe(
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

  getSapCus(type: string) {
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

  saveService(dataSave): Observable<any> {
    return new Observable((obs) => {
      this.ajax.doPost(URLS.SAVE_DATA, dataSave).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          obs.next(res);
        } else {
          console.log(res.message);
        }
      });
    });
  }

  getOtherList(): Observable<any> {
    return new Observable((obs) => {
      this.ajax.doGet(URLS.GET_OTHER_LIST).subscribe((res: any) => {
        obs.next(res);
      });
    });
  }

  getWaterSize() {
    return new Observable((obs) => {
      this.ajax.doGet(URLS.GET_WATER_SIZE).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          obs.next(res);
        } else {
          console.log(res.message);
        }
      });
    });
  }

  getFormSave() {
    return {
      userId: [],
      userCode: [],
      userName: [],
      branch: [],
      sumChargeRate: [],
      serviceChargee: [],
      totalChargeRate: [],
      requestStartDate: [],
      requestEndDate: [],
      requestStatus: [],
      contractNo: [],
      airport: [],
      addressId: [],
      addressDocument: [],
      requestType: [''],
      applyType: [],
      voltageType: [],
      electricRateType: [],
      electricVoltageType: [],
      meterSerialNo: [],
      meterType: [''],
      adhocType: ['0'],
      adhocUnit: [],
      adhocChargeRate: [],
      installPosition: [],
      installPositionService: [],
      installServiceArea: [],
      rentalAreaCode: [],
      paymentType: [''],
      remark: [],
      meterName: [],
      userType: [],
      serviceCharge: this.formBuilder.array([]),

      personUnit: [],
      insuranceRates: [],
      vatInsurance: [],
      totalInsuranceChargeRates: [],
      installRates: [],
      vatInstall: [],
      totalInstallChargeRates: [],
      totalChargeRates: []
    };
  }

}
