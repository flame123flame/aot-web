import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { CommonService } from 'src/app/_service/ common.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { MessageService } from 'src/app/_service/message.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { CheckNumber, Utils } from 'src/app/common/helper';

const URL = {
  GET_ALL: "water008/get_all",
  FIND_OLD_AND_NEW_METER: 'water008/find_old_and_new_meter',
  SEND_TO_SAP: 'water008/sendToSAP',
}
@Component({
  selector: 'app-water008',
  templateUrl: './water008.component.html',
  styleUrls: ['./water008.component.css']
})
export class Water008Component implements OnInit {
  private modalRef: BsModalRef;
  @ViewChild('detailMeter') modalDetailMeter: ElementRef;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;

  breadcrumb: any = [
    {
      label: "หมวดน้ำประปา",
      link: "/",
    },
    {
      label: "ขอเปลี่ยนมิเตอร์การใช้น้ำประปา",
      link: "#",
    },

  ];

  dataTable: any;
  dataList: any[] = [];

  formGroup: FormGroup;
  form2MeterGroup: FormGroup;

  constructor(
    private ajax: AjaxService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.setFormGroup();
    this.setForm2MeterGroup();
  }

  // ===================== Initial setting ============
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.formGroup.get('dateChange').patchValue('');
    this.getList();
    this.initDataTable();
    // call Function event Click button in dataTable
    this.clickBtn();
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      customerName: [""],
      contractNo: [""],
      newSerialNo: [""],
      dateChange: [""]
    })
  }

  setForm2MeterGroup() {
    this.form2MeterGroup = this.fb.group({
      oldSerialNo: [''],
      oldMeterName: [''],
      oldMeterType: [''],
      oldMeterLocation: [''],
      oldFunctionalLocation: [''],
      newSerialNo: [''],
      newMeterName: [''],
      newMeterType: [''],
      newMeterLocation: [''],
      newFunctionalLocation: [''],
    })
  }

  // =============== Action ======================
  dateChange(event) {
    this.formGroup.get('dateChange').patchValue(event);
  }

  onSearchCriteria() {
    this.getList();
  }

  initDataTable = () => {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }

    let checkBtnSAP = (data: any) => {
      return Utils.isNull(data.showButton) && Utils.isNull(data.showButtonIc) && Utils.isNull(data.showButtonIb);
    }

    this.dataTable = $('#datatable').DataTable({
      ...this.commonService.configDataTable(),
      ...{ scrollX: false },
      data: this.dataList,
      columns: [
        {
          data: 'customerCode', className: 'text-left'
        }, {
          data: 'customerName', className: 'text-left'
        }, {
          data: 'contractNo', className: 'text-left'
        }, {
          data: 'requestType', className: 'text-left'
        }, {
          data: 'oldSerialNo', className: 'text-left',
          render(data, type, row, meta) {
            return `<span>${data}</span>
            <button type="button" class="btn btn-info btn-social-icon" id="meterDtl">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>`;
          }
        }, {
          data: 'newSerialNo', className: 'text-left',
          render(data, type, row, meta) {
            return `<span>${data}</span>
            <button type="button" class="btn btn-info btn-social-icon" id="meterDtl">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>`;
          }
        }, {
          data: 'oldTotalchargeRates', className: 'text-left',
          render(data, type, row, meta) {
            let total = Utils.isNotNull(data) ? data.toFixed(2) : 0;
            return `${CheckNumber(total)} บาท`;
          }
        }, {
          data: 'dateChange', className: 'text-left'
        }, {
          data: 'rateInvoiceNo', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'rateReceiptNo', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'lgInvoiceNo', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'lgReceiptNo', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'invoiceNo', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          className: 'text-center',
          data: 'sapStatus',
          render(data, type, full, meta) {
            let status = '';
            if (data === 'pending') {
              status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST ||
              data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
                      <button type="button" class="btn btn-info btn-social-icon" id="sapErr">
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>`;
            } else if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            }
            return status;
          }
        }, {
          data: 'invoiceNoIb', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'receiptNoIb', className: 'text-left',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          className: 'text-center',
          data: 'sapStatusIb',
          render(data, type, full, meta) {
            let status = '';
            if (data === 'pending') {
              status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST ||
              data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
                      <button type="button" class="btn btn-info btn-social-icon" id="sapErrIb">
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>`;
            } else if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            }
            return status;
          }
        }, {
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn = '';
            if (checkBtnSAP(row)) {
              _btn = '<button class="btn btn-warning btn-sm" disabled type="button">แก้ไข</button>';
            } else {
              _btn = `<button class="btn btn-warning btn-sm edit" type="button">แก้ไข</button>`;
            }
            return _btn;
          }
        }, {
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn = '';
            if (checkBtnSAP(row)) {
              _btn = '<button class="btn btn-success btn-sm" type="button" id="sendToSAP" disabled><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>';
            } else {
              _btn = `<button class="btn btn-success btn-sm" type="button" id="sendToSAP"><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>`;
            }
            return _btn;
          }
        }

      ],
    });

  }

  // event Click button in dataTable
  clickBtn() {
    this.dataTable.on('click', 'button#meterDtl', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.findMeter(data);
    });

    this.dataTable.on('click', 'td > button.edit', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['/water/water008detail'], {
        queryParams: {
          waterChangeId: data.waterChangeId
        }
      })
    });

    this.dataTable.on('click', 'tbody tr button#sapErr', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDesc);
    });

    this.dataTable.on('click', 'tbody tr button#sapErrIc', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDescIc);
    });

    this.dataTable.on('click', 'tbody tr button#sapErrIb', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDescIb);
    });

    this.dataTable.on('click', 'td > button#sendToSAP', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.sendToSAP(data);
    });
  }

  openModalCustom(template: ElementRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  // =================== call back-end ===================
  getList() {
    this.commonService.loading();
    this.ajax.doPost(URL.GET_ALL, this.formGroup.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = res.data;
        this.initDataTable();
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    })
  }

  findMeter(data: any) {
    this.commonService.loading();
    this.ajax.doPost(URL.FIND_OLD_AND_NEW_METER, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.form2MeterGroup.patchValue({
          oldSerialNo: res.data.oldSerialNo,
          oldMeterName: res.data.oldMeterName,
          oldMeterType: res.data.oldMeterType,
          oldMeterLocation: res.data.oldMeterLocation,
          newSerialNo: res.data.newSerialNo,
          newMeterName: res.data.newMeterName,
          newMeterType: res.data.newMeterType,
          newMeterLocation: res.data.newMeterLocation
        })
        this.openModalCustom(this.modalDetailMeter);
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    })
  }

  sendToSAP(data: any) {
    this.commonService.loading();
    this.ajax.doPost(URL.SEND_TO_SAP, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // if (
        //   res.data.messageType === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST
        //   || res.data.messageType === SAP_CONSTANT.STATUS.FAIL.CONST
        // ) {
        //   this.modalError.openModal(res.data.message);
        //   this.getList();
        // }

        if (res.data.messageType === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
          this.modalSuccess.openModal();
        } else {
          this.modalError.openModal(res.data.message);
        }
        this.formGroup.get('dateChange').patchValue('');
        this.getList();
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    })
  }

}
