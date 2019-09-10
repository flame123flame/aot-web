import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalComponent } from 'src/app/components/modal/modal-normal/modal.component';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { MessageService } from 'src/app/_service/message.service';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { Utils } from 'src/app/common/helper/utils';

declare var $: any;
const URLS = {
  GET_LIST: 'water003/findWaterList',
  SEND_SAP: 'water003/send_sap',
};
@Component({
  selector: 'app-water003',
  templateUrl: './water003.component.html',
  styleUrls: ['./water003.component.css']
})
export class Water003Component implements OnInit, AfterViewInit {
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  @ViewChild('normalModal') normalModal: ModalComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;

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
      serialNo: [''],
      meterName: [''],
      meterLocation: [''],
      status: [''],
    });
  }

  breadcrumb: any = [
    {
      label: 'หมวดน้ำประปา',
      link: '/',
    }, {
      label: 'ขอใช้น้ำประปาและบริการอื่นๆ',
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
      }, () => {
        this.commonService.unLoading();
      }
    );
  }

  initDataTable = () => {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }

    let renderNumber = function (number: number, length: number = 0) {
      return Utils.isNull($.trim(number)) ? "-" : $.fn.dataTable.render.number(",", ".", length, "").display(number);
    };

    let renderString = function (data, type, row, meta) {
      return Utils.isNull($.trim(data)) ? "-" : data;
    };

    this.dataTable = $('#dataTable').DataTable({
      ...this.commonService.configDataTable(),
      data: this.datas,
      columns: [
        {
          data: 'userCode', className: 'text-left'
        }, {
          data: 'userName', className: 'text-left'
        }, {
          data: 'contracNo', className: 'text-left',
          render(data) {
            if (data) {
              return data;
            } else {
              return '-';
            }
          }
        }, {
          data: 'meterName', className: 'text-center'
        }, {
          data: 'sumChargeRate', className: 'text-center'
        }, {
          data: 'requestStartDate', className: 'text-center'
        }, {
          data: 'requestEndDate', className: 'text-center'
        }, {
          data: 'status', className: 'text-center',
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
          data: 'invoiceNoCh',
          render: renderString
        },
        {
          data: 'sapControlVoCh.reverseRec',
          render: renderString
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let status: string = '';
            switch (row.sapStatusCh) {
              case SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST:
                status = `
                <span class="text-danger">${SAP_CONSTANT.STATUS.CONNECTION_FAIL.DESC}</span>
                  `;
                break;
              case SAP_CONSTANT.STATUS.FAIL.CONST:
                status = `
                <span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
                <button type="button" class="btn btn-info btn-social-icon" id="error">
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
        },
        {
          data: 'invoiceNoLg',
          render: renderString
        },
        {
          data: 'sapControlVoLg.reverseRec',
          render: renderString
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let status: string = '';
            switch (row.sapStatusLg) {
              case SAP_CONSTANT.STATUS.CONNECTION_FAIL.CONST:
                status = `
                <span class="text-danger">${SAP_CONSTANT.STATUS.CONNECTION_FAIL.DESC}</span>
                  `;
                break;
              case SAP_CONSTANT.STATUS.FAIL.CONST:
                status = `
                <span class="text-danger">${SAP_CONSTANT.STATUS.FAIL.DESC}</span>
                <button type="button" class="btn btn-info btn-social-icon" id="error">
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
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let _btn = '';
            /* ____________ show button manage on get receiptNo ____________ */
            if ((row.sapControlVoCh.reverseBtn || row.sapControlVoLg.reverseBtn) || !row.manageReqBtn) {
              _btn = `<button class="btn btn-success btn-sm send-sap">
              <i class="fa fa-share-square-o" aria-hidden="true"></i>
              ส่งข้อมูลเข้าระบบ SAP
              </button>
              <button class="btn btn-warning btn-sm" disabled type="button">เปลี่ยนมาตร</button>
              <button class="btn btn-danger btn-sm" disabled type="button">ยกเลิกการใช้น้ำ</button>`;
            } else {
              _btn = `<button class="btn btn-success btn-sm send-sap" disabled>
              <i class="fa fa-share-square-o" aria-hidden="true"></i>
              ส่งข้อมูลเข้าระบบ SAP
              </button>
              <button class="btn btn-warning btn-sm" type="button">เปลี่ยนมาตร</button>
              <button class="btn btn-danger btn-sm" type="button">ยกเลิกการใช้น้ำ</button> `
            }

            /* ____________ show button manage on get receiptNo ____________ */
            // if ((row.sapStatusCh && row.sapStatusLg == SAP_CONSTANT.STATUS.SUCCESS.CONST) && (!row.sapControlVoCh.reverseBtn)) {
            //   _btn += `<button class="btn btn-warning btn-sm" disabled type="button">เปลี่ยนมาตร</button>
            //   <button class="btn btn-danger btn-sm" disabled type="button">ยกเลิกการใช้น้ำ</button>`;
            // } else {
            //   _btn += `<button class="btn btn-warning btn-sm" type="button">เปลี่ยนมาตร</button>
            //   <button class="btn btn-danger btn-sm" type="button">ยกเลิกการใช้น้ำ</button>`;
            // }
            return _btn;
          }
        },
      ],
    });
  }

  // event Click button in dataTable
  clickBtn() {
    // detail button
    this.dataTable.on('click', 'tbody tr button#detail', (e) => {
      const closestRow = $(e.target).closest('tr');
      const data = this.dataTable.row(closestRow).data();
      this.router.navigate(['/water/water003detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button.btn-warning', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['water/water008detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button.btn-danger', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.router.navigate(['water/water007detail'], {
        queryParams: {
          id: data.reqId
        }
      });
    });

    this.dataTable.on('click', 'tbody tr button.btn.btn-info.btn-social-icon', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.modalError.openModal(data.sapError);
    });

    this.dataTable.on('click', 'tbody tr button.send-sap', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.commonService.loading();
      this.ajax.doPost(URLS.SEND_SAP, {
        id: data.reqId,
        reverseChBtn: data.sapControlVoCh.reverseBtn,
        reverseLgBtn: data.sapControlVoLg.reverseBtn
      }).subscribe((res: any) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.modalSuccess.openModal();
          this.getFindList();
        } else {
          this.modalError.openModal(res.message);
        }
        this.commonService.unLoading();
      }, () => {
        this.modalError.openModal('กรุณาติดต่อผู้ดูแลระบบ');
        this.commonService.unLoading();
      });
    });
  }
}
