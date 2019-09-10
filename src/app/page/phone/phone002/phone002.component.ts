import { Component, OnInit, ViewChild } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_service/ common.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { Utils } from 'src/app/common/helper/utils';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { ModalComponent } from 'src/app/components/modal/modal-normal/modal.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { MessageService } from 'src/app/_service/message.service';
declare var $: any;

const URLS = {
  GET_LIST: 'phone002/list',
  SEND_SAP: 'phone002/sendToSAP',
  SAVE_RECEIPT_NO: 'phone002/save-receipt-no'
};

@Component({
  selector: 'app-phone002',
  templateUrl: './phone002.component.html',
  styleUrls: ['./phone002.component.css']
})
export class Phone002Component implements OnInit {
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  @ViewChild('normalModal') normalModal: ModalComponent;
  @ViewChild('successModal') successModal: ModalSuccessComponent;

  dataTable: any;
  dataList: any[] = [];
  formSearch: FormGroup;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.formSearch = this.fb.group({
      entrepreneurName: [""],
      contractNo: [""],
      phoneNo: [""],
      requestStatus: [""],
    })
  }
  breadcrumb: any = [
    {
      label: 'หมวดโทรศัพท์',
      link: '/phone',
    }, {
      label: 'ขอใช้งานเลขหมายโทรศัพท์',
      link: '#',
    },
  ];

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.getFindList();
    this.initDataTable();
    // call Function event Click button in dataTable
    this.clickBtn();
  }


  getFindList() {
    this.commonService.loading();
    this.ajax.doPost(URLS.GET_LIST, this.formSearch.value).subscribe(
      (res: ResponseData<any>) => {
        this.dataList = res.data;
        this.initDataTable();
        this.commonService.unLoading();
      },
      (err) => {
        this.commonService.unLoading();
      }
    );
  }


  initDataTable = () => {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    const renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data)) ? '-' : $.fn.dataTable.render.number(',', '.', 2, '').display(data);
    };
    this.dataTable = $('#datatable').DataTable({
      data: this.dataList,
      ...this.commonService.configDataTable(),
      ...{ scrollX: false },
      columns: [
        {
          data: 'entrepreneurCode', className: 'text-center'
        },
        {
          data: 'entrepreneurName', className: 'text-center'
        },
        {
          data: 'contractNo', className: 'text-center'
        },
        {
          data: 'phoneNo', className: 'text-center'
        },
        {
          data: 'chargeRates', className: 'text-right', render: renderNumber,
        },
        {
          data: 'vat', className: 'text-right', render: renderNumber,
        },
        {
          data: 'totalChargeRates', className: 'text-right', render: renderNumber,
        },
        {
          data: 'requestStartDate', className: 'text-center'
        },
        {
          data: 'requestEndDate', className: 'text-center'
        },
        {
          data: 'requestStatus', className: 'text-center',
          render(data, type, full, meta) {
            // return this.checkDataEmpty(data);
            let text = '-';
            if (data === 'Y') {
              text = '<span class="text-success">ใช้งาน</span>';
            } else if (data === 'N') {
              text = '<span class="text-danger">ไม่ใช้งาน</span>';
            }
            return text;
          }
        },
        {
          data: 'invoiceNoCash', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        },
        {
          data: 'dzdocNoCash', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        },
        {
          className: 'text-center',
          data: 'sapStatusCash',
          render(data, type, full, meta) {
            let status = '';
            if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST || data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
              <button type="button" class="btn btn-info btn-social-icon" id="modalErrCashIn">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>`;
            } else {
              status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
            }
            return status;
          }
        },
        {
          data: 'invoiceNoLg', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        },
        {
          data: 'dzdocNoLg', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        },
        {
          className: 'text-center',
          data: 'sapStatusLg',
          render(data, type, full, meta) {
            let status = '';
            if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST || data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
              <button type="button" class="btn btn-info btn-social-icon" id="modalErrLg">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>`;
            } else {
              status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
            }
            return status;
          }
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn_dtl = '';
            _btn_dtl += `<button type="button" class="btn btn-info btn-social-icon" id="detail">
                      <i class="fa fa-search" aria-hidden="true"></i></button>`;
            return _btn_dtl;
          }
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let btn1 = '';
            if (Utils.isNull(row.sapReturnS) || (Utils.isNull(row.showButtonCash) && Utils.isNull(row.showButtonLg))) {
              btn1 = '<button class="btn btn-success btn-sm send-sap" disabled type="button" ><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>';
            } else {
              btn1 = `<button class="btn btn-success btn-sm send-sap" type="button" ><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>`;
            }

            let btn2 = '';
            if (Utils.isNull(row.sapReturnS)) {
              btn2 = `<button class="btn btn-danger btn-sm" id="cancelPhone" type="button">ยกเลิกการใช้โทรศัพท์</button>`;
            } else {
              btn2 = `<button class="btn btn-danger btn-sm" disabled type="button">ยกเลิกการใช้โทรศัพท์</button>`;
            }
            return btn1 + " " + btn2;
          }
        }
      ],
    });
  }




  // event Click button in dataTable
  clickBtn() {
    // detail button
    this.dataTable.on('click', 'tbody tr button#detail', (e) => {
      const closestRow = $(e.target).closest('tr');
      const data = this.dataTable.row(closestRow).data();
      this.router.navigate(['/phone/phone002detail'], {
        queryParams: {
          id: data.phoneReqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button#cancelPhone', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['phone/phone003detail'], {
        queryParams: {
          id: data.phoneReqId
        }
      });
      this.saveReceipt(data);
    });

    this.dataTable.on('click', 'tbody tr button#modalErrCashIn', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDescCash);
    });

    this.dataTable.on('click', 'tbody tr button#modalErrLg', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapErrorDescLg);
    });

    this.dataTable.on('click', 'tbody tr button.send-sap', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.commonService.loading();
      this.ajax.doPost(URLS.SEND_SAP, data).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.message) {
          if (res.data.messageType === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
            this.successModal.openModal();
          } else {
            this.modalError.openModal(res.data.message);
          }
          this.getFindList();
        } else {
          this.modalError.openModal(res.message);
        }
        this.commonService.unLoading();
      });
    });
  }


  saveReceipt(data: any) {
    this.ajax.doPost(URLS.SAVE_RECEIPT_NO, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.message) {
      } else {
        this.modalError.openModal(res.message);
      }
    });
  }


}
