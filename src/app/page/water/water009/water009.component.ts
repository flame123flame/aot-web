import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { DecimalFormatPipe } from 'src/app/common/pipes/decimal-format.pipe';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { Router } from '@angular/router';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { MessageService } from 'src/app/_service/message.service';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { SAP_CONSTANT } from 'src/app/common/constant/SAP.Constant';
import { Utils } from 'src/app/common/helper';

declare var $: any;
const URL = {
  LIST: "water009/list",
  SAP: "water009/sendToSAP"
}
@Component({
  selector: 'app-water009',
  templateUrl: './water009.component.html',
  styleUrls: ['./water009.component.css']
})

export class Water009Component implements OnInit {
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('modalRemark') modalRemark: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;

  dataList: any[] = [];
  dataTable: any;

  remarkStr: string = '';

  constructor(
    private ajax: AjaxService,
    private commonService: CommonService,
    private router: Router
  ) {

  }

  breadcrumb: any = [
    {
      label: "หมวดน้ำประปา",
      link: "/",
    },
    {
      label: "ค่าปรับน้ำเสีย",
      link: "#",
    },

  ];
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.getList();
    this.initDataTable();
    // call Function event Click button in dataTable
    this.clickBtn();
  }

  //================== action =================
  onClickRemark(text: string) {
    this.remarkStr = text;
    this.modalRemark.openModal();
  }
  onEdit(id: any) {
    this.router.navigate(["/water/water009detail"], {
      queryParams: {
        id: id
      }
    });
  }
  //=================== call back-end ==================
  getList() {
    this.commonService.loading();
    this.ajax.doPost(URL.LIST, {}).subscribe((res: ResponseData<any>) => {
      console.log(res);
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data.length > 0) {
          this.dataList = res.data;
        } else {
          this.dataList = [];
        }
      } else {
        this.dataList = [];
        this.modalError.openModal(res.message);
      }
      this.initDataTable();
      this.commonService.unLoading();
    });
  }

  sentSap(data: any) {
    this.commonService.loading();
    this.ajax.doPost(URL.SAP, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data.messageType === SAP_CONSTANT.STATUS.SUCCESS.CONST) {
          this.modalSuccess.openModal();
        } else {
          this.modalError.openModal(res.data.message);
        }
        this.getList();
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    })
  }

  //======================== table ======================
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

    this.dataTable = $('#datatable').DataTable({
      ...this.commonService.configDataTable(),
      ...{ scrollX: false },
      data: this.dataList,
      columns: [
        {
          data: 'customerName',
          className: 'text-left',
          render: renderString
        },
        {
          data: 'contractNo',
          className: 'text-center',
          render: renderString
        },
        {
          data: 'serviceType',
          className: 'text-left',
          render: renderString
        },
        {
          data: 'unit',
          render(data) {
            return new DecimalFormatPipe().transform(data);
          }, className: 'text-right'
        },
        {
          data: 'amount',
          render(data) {
            return new DecimalFormatPipe().transform(data);
          }, className: 'text-right'
        },
        {
          data: 'date',
          className: 'text-center'
        },
        {
          data: 'invoiceNo',
          render: renderString
        },
        {
          data: 'sapControlVo.reverseRec',
          render: renderString
        },
        {
          className: 'text-center',
          render(data, type, row, meta) {
            let status: string = '';
            switch (row.sapStatus) {
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
          render: (data, type, row, meta) => {
            let _btn = '';
            /* ____________ show button manage on get receiptNo ____________ */
            if (row.sapControlVo.reverseBtn) {
              _btn = `
              <button type="button" class="btn btn-success btn-sm" id="sendToSAP"><i class="fa fa-share-square-o"></i> ส่งข้อมูลเข้าระบบ SAP</button>
              <button type="button" class="btn btn-warning btn-sm" id="edit"><i class="fa fa-pencil-square-o"></i> แก้ไข</button>
              `;
            } else {
              _btn = `
              <button type="button" class="btn btn-success btn-sm" disabled><i class="fa fa-share-square-o"></i> ส่งข้อมูลเข้าระบบ SAP</button>
              <button type="button" class="btn btn-warning btn-sm" disabled><i class="fa fa-pencil-square-o"></i> แก้ไข</button>
              `;
            }
            _btn += `<button type="button" class="btn btn-info btn-sm" id="remark"><i class="fa fa-search"> หมายเหตุ</i></button>`;
            return _btn;
          },
          className: "text-center"
        }
      ],
    });

  }

  // event Click button in dataTable
  clickBtn() {
    this.dataTable.on('click', 'tbody tr button#remark', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.dataTable.row(closestRow).data();
      this.onClickRemark(data.remark);
    });

    this.dataTable.on('click', 'tbody tr button#edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.dataTable.row(closestRow).data();
      this.onEdit(data.wasteHeaderId);
    });


    this.dataTable.on('click', 'tbody tr button#sapErr', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.dataTable.row(closestRow).data();
      this.modalError.openModal(data.sapErrorDesc);
    });

    this.dataTable.on('click', 'tbody tr button#sendToSAP', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.dataTable.row(closestRow).data();
      let dataSent = {
        wasteHeaderId: data.wasteHeaderId,
        wasteDetailId: data.wasteDetailId,
        customerCode: data.customerCode,
        customerName: data.customerName
      }
      this.sentSap(dataSent);
    });
  }

}
