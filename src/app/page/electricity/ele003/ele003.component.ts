import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_service/ common.service';
import { MessageService } from 'src/app/_service/message.service';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { ModalComponent } from 'src/app/components/modal/modal-normal/modal.component';
import { Utils } from 'src/app/common/helper';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';

const URLS = {
  GET_LIST: 'electric003/findElec',
  SEND_SAP: 'electric003/sendToSAP'
};
declare var $: any;
@Component({
  selector: 'app-ele003',
  templateUrl: './ele003.component.html',
  styleUrls: ['./ele003.component.css']
})
export class Ele003Component implements OnInit, AfterViewInit {
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  @ViewChild('normalModal') normalModal: ModalComponent;
  @ViewChild('successModal') successModal: ModalSuccessComponent;

  formSearch: FormGroup = new FormGroup({});
  dataTable: any;
  dataList: any[] = [];
  datas: any[] = [];
  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.formSearch = this.fb.group({
      customerCode: [''],
      customerName: [''],
      contracNo: [''],
      requestStatus: [''],
      rentalAreaName: [''],
      installPositionService: [''],
      customerType:['']
    });
  }



  breadcrumb: any = [
    {
      label: 'หมวดไฟฟ้า',
      link: '/home/elec',
    },
    {
      label: 'ขอใช้ไฟฟ้าแบบถาวร/ชั่วคราว',
      link: '#',
    },

  ];

  ngOnInit() { }

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
        this.datas = res.data;
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
    // render check number is null or empty
    const renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data)) ? '-' : $.fn.dataTable.render.number(',', '.', 2, '').display(data);
    };
    this.dataTable = $('#datatable').DataTable({
      data: this.datas, ...this.commonService.configDataTable(),
      ...{ scrollX: false },
      columns: [
        {
          data: 'dateStartReq', className: 'text-center'
        }, {
          data: 'dateEndReq', className: 'text-center'
        },
        {
          data: 'customerCode', className: 'text-left'
        }, {
          data: 'customerName', className: 'text-left'
        },
        {
          data: 'contracNo', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        },
        {
          data: 'meterSerialNo', className: 'text-left'
        },
        {
          data: 'rentalAreaName', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'installPositionService', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }, {
          data: 'sumChargeRates', className: 'text-right', render: renderNumber,
        }, {
          data: 'totalChargeRate', className: 'text-right', render: renderNumber,
        }, {
          data: 'requestStatus', className: 'text-center',
          render(data) {
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
        }
        ,
        {
          data: 'dzdocNoCash', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }
        ,
        {
          data: 'sapStatusCash',
          className: 'text-center',
          render(data, type, row, meta) {
            let status = '';
            if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST || data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
              <button type="button" class="btn btn-info btn-social-icon" id="sapErrorDescCash">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>`;
            } else {
              if (row.customerType === 'C') {
                status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
              } else {
                status = '-'
              }

            }
            return status;
          }
        },
        {
          data: 'invoiceNoLg', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }
        ,
        {
          data: 'dzdocNoLg', className: 'text-center',
          render(data, type, full, meta) {
            return Utils.isNull($.trim(data)) ? "-" : data;
          }
        }
        , {
          className: 'text-center',
          data: 'sapStatusLg',
          render(data, type, row, meta) {
            let status = '';
            if (data === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
              status = `<span class="text-success">${SAP_CONSTANT.STATUS.SUCCESS.DESC}</span>`;
            } else if (data === SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST || data === SAP_CONSTANT.STATUS.FAIL.CONST) {
              status = `<span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
              <button type="button" class="btn btn-info btn-social-icon" id="sapErrorDescLg">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>`;
            } else {
              if (row.customerType === 'C') {
                status = `<span class="text-warning">${SAP_CONSTANT.STATUS.PENDING.DESC}</span>`;
              } else {
                status = '-'
              }

            }
            return status;
          }
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn1 = '';
            _btn1 = '<button class="btn btn-info  btn-sm"  type="button" id="detail"><i class="fa fa-search" aria-hidden="true"></i>รายละเอียด</button>';

            let _btn2 = '';
           // _btn2 = `<button class="btn btn-success btn-sm send-sap" type="button" ><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>`;
            if (Utils.isNotNull(row.showButtonCash) && Utils.isNotNull(row.showButtonLg)) {
              _btn2 = `<button class="btn btn-success btn-sm send-sap" type="button" ><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>`;
            } else {
              _btn2 = '<button class="btn btn-success btn-sm" disabled type="button" ><i class="fa fa-share-square-o" aria-hidden="true"></i>ส่งข้อมูลเข้าระบบ SAP</button>';
            }

            let _btn3 = '';
            if (Utils.isNotNull(row.buttonManageCash) || Utils.isNotNull(row.buttonManageLg)) {
              _btn3 = `<button class="btn btn-warning btn-sm" disabled type="button">เปลี่ยนมิเตอร์</button>
              <button class="btn btn-danger btn-sm" disabled type="button">ยกเลิกการใช้ไฟฟ้า</button>`;
            } else {
              _btn3 = `<button class="btn btn-warning btn-sm" type="button" id="ele06">เปลี่ยนมิเตอร์</button>
              <button class="btn btn-danger btn-sm" type="button" id="ele05">ยกเลิกการใช้ไฟฟ้า</button>`;
            }

            let _btn4 = '';
            _btn4 = `<button class="btn btn-warning btn-sm" type="button" id="ele06">เปลี่ยนมิเตอร์</button>
            <button class="btn btn-danger btn-sm" type="button" id="ele05">ยกเลิกการใช้ไฟฟ้า</button>`;

            let _res = '';
            if (row.customerType === 'C') {
              _res = _btn1 + " " + _btn2 + " " + _btn3;
            } else {
              _res = _btn1+" "+_btn4;
            }
            return _res;
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
      this.router.navigate(['/electricity/ele003detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button#ele06', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['electricity/ele006detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button#ele05', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['electricity/ele005detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button#sapErrorDescCash', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapError);
    });

    this.dataTable.on('click', 'tbody tr button#sapErrorDescLg', (event) => {
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

}
