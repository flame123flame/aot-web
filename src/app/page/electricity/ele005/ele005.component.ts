import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { MessageService } from 'src/app/_service/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { CheckNumber, Utils } from 'src/app/common/helper';

const URL = {
  GET_ALL: "electric005/get_all",
  SEND_TO_SAP: 'electric005/sendToSAP',
}
@Component({
  selector: 'app-ele005',
  templateUrl: './ele005.component.html',
  styleUrls: ['./ele005.component.css']
})
export class Ele005Component implements OnInit {

  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;

  breadcrumb: any = [
    {
      label: "หมวดไฟฟ้า",
      link: "/home/elec",
    },
    {
      label: "ขอยกเลิกการใช้ไฟฟ้า",
      link: "#",
    }
  ]

  dataTable: any;
  formGroup: FormGroup;
  dataList: any[] = [];

  constructor(
    private ajax: AjaxService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.setFormGroup();
  }

  // ===================== Initial setting ============
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.formGroup.get('dateCancel').patchValue('');
    this.getList();
    this.initDataTable();
    // call Function event Click button in dataTable
    this.clickBtn();
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      customerName: [""],
      contractNo: [""],
      serialNo: [""],
      dateCancel: [""]
    })
  }

  // =============== Action ======================
  dateChange(event) {
    this.formGroup.get('dateCancel').patchValue(event);
  }

  onSearchCriteria() {
    this.getList();
  }

  initDataTable = () => {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    console.log("this.commonService.configDataTable", this.commonService.configDataTable);
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
          data: 'voltageType', className: 'text-left'
        }, {
          data: 'serialNo', className: 'text-left'
        }, {
          data: 'meterName', className: 'text-left'
        }, {
          data: 'meterType', className: 'text-left'
        }, {
          data: 'totalchargeRates', className: 'text-left',
          render(data, type, row, meta) {
            let total = Utils.isNotNull(data) ? data.toFixed(2) : 0;
            return `${CheckNumber(total)} บาท`;
          }
        }, {
          data: 'functionalLocation', className: 'text-left'
        }, {
          data: 'dateCancel', className: 'text-left'
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
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn = '';
            if (Utils.isNull(row.showButton)) {
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
            if (Utils.isNull(row.showButton)) {
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
    this.dataTable.on('click', 'td > button.edit', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['/electricity/ele005detail'], {
        queryParams: {
          reqCancelId: data.reqCancelId
        }
      })
    });

    this.dataTable.on('click', 'tbody tr button#sapErr', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDesc);
    });

    this.dataTable.on('click', 'td > button#sendToSAP', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.sendToSAP(data);
    });
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
        this.formGroup.get('dateCancel').patchValue('');
        this.getList();
        console.log(this.formGroup.value);



      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    })
  }
}
