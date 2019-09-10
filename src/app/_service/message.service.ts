import { Injectable } from '@angular/core';
import { SAP_CONSTANT } from '../common/constant/SAP.Constant';

@Injectable()
export class MessageService {
  public static MSG = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    DUPLICATE_DATA: 'DUPLICATE_DATA',
    FAILED_CALLBACK: 'กรุณาติดต่อผู้ดูแลระบบ',
    REQUIRE_FIELD: 'กรุณากรอกข้อมูลให้ถูกต้อง'
  };

  public static SAP = {
    getMsgErr(sapErrorJSON: any): String {
      let msgErr = "";
      if (sapErrorJSON) {
        let sapError = JSON.parse(sapErrorJSON);
        let itemList = sapError.RETURN.DETAIL_RETURN.item;
        itemList.forEach(item => {
          if ("E" === item.TYPE) {
            msgErr = `${msgErr} | ${item.MESSAGE} | `;
          }
        });
      }
      return msgErr;
    },
    getStatus(sapStatus: string): String {
      let status: string = '';
      switch (sapStatus) {
        case SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST:
          status = `
          <span class="text-danger">${SAP_CONSTANT.STATUS.CONNECTION_FAIL.DESC}</span>
            `;
          break;
        case SAP_CONSTANT.STATUS.FAIL.CONST:
          status = `
          <span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
          <button type="button" class="btn btn-info btn-social-icon" id="sapMsgErr">
              <i class="fa fa-search" aria-hidden="true"></i>
          </button>
            `;
          break;
        case SAP_CONSTANT.STATUS.SUCCESS.CONST:
          status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
          break;
        default:
          status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
          break;
      }
      return status;
    }
  }
}
