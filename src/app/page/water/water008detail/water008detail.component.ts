import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AjaxService } from 'src/app/_service/ajax.service';
import { CommonService } from 'src/app/_service/ common.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalCustomComponent } from 'src/app/components/modal/modal-custom/modalCustom.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'src/app/_service/message.service';
import { ValidateService } from 'src/app/_service/validate.service';
import { Utils } from 'src/app/common/helper';
import { InputCalendarComponent } from 'src/app/components/input/input-calendar/input-calendar.component';

declare var $: any;

const URL = {
  SAVE: "water008/save",
  FIND_ID: "water008/find_id",
  GET_METER: "water008/get_all_meter",
  FIND_METER: "water008/find_meter",
}
@Component({
  selector: 'app-water008detail',
  templateUrl: './water008detail.component.html',
  styleUrls: ['./water008detail.component.css']
})
export class Water008detailComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('calendar') calendar: InputCalendarComponent;

  breadcrumb: any = [
    {
      label: "หมวดน้ำประปา",
      link: "/",
    },
    {
      label: "ขอเปลี่ยนมิเตอร์การใช้น้ำประปา",
      link: "/water/water008",
    },
    {
      label: "เพิ่มรายการขอเปลี่ยนมิเตอร์การใช้น้ำประปา",
      link: "#",
    },

  ];

  formGroup: FormGroup;
  waterChangeId: any;
  //data table
  dataTable: any;
  datas: any[] = [];
  meterList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private validate: ValidateService
  ) {
    this.setFormGroup();
  }
  // ============== Initial setting ============== 
  ngOnInit() {
    this.formGroup.get('reqId').patchValue(this.route.snapshot.queryParams['id']);
    this.waterChangeId = this.route.snapshot.queryParams['waterChangeId'];
    if (this.formGroup.get('reqId').value != null && this.formGroup.get('reqId').value != "") {
      this.findById(this.formGroup.get('reqId').value);
    } else if (Utils.isNotNull(this.waterChangeId)) {
      this.formGroup.get('waterChangeId').patchValue(this.waterChangeId);
      this.findById(this.formGroup.get('reqId').value);
    } else {
      this.router.navigate(['/water/water003']);
    }
    this.getAllMeter();
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      waterChangeId: [""],
      customerCode: ["", Validators.required],
      customerName: [""],
      customerBranch: [""],
      contractNo: [""],
      voltageType: [""],
      invoiceNo: [""],
      newSerialNo: ["", Validators.required],
      newMeterName: [""],
      newMeterType: [""],
      newMeterLocation: [""],
      newRentalAreaCode: [""],
      newChargeRates: [""],
      newVat: [""],
      newTotalchargeRates: [""],
      oldSerialNo: [""],
      oldMeterName: [""],
      oldMeterType: [""],
      oldMeterLocation: [""],
      oldRentalAreaCode: [""],
      oldChargeRates: [""],
      oldVat: [""],
      oldTotalchargeRates: [""],
      dateChange: ["", Validators.required],
      remark: [""],
      airport: [""],
      rateInvoiceNo: [""],
      rateReceiptNo: [""],
      lgInvoiceNo: [""],
      lgReceiptNo: [""],
      reqId: [""],
    })
  }

  // ============== Action ==================
  dateChange(event) {
    this.formGroup.get('dateChange').patchValue(event);
  }

  onBack() {
    let pathBack = '';
    if (Utils.isNotNull(this.waterChangeId)) {
      pathBack = '/water/water008';
    } else {
      pathBack = '/water/water003';
    }
    this.router.navigate([pathBack]);
  }

  onOpenModalSave() {
    let validateData = [
      { format: "", header: "SerialNo", value: this.formGroup.get("newSerialNo").value },
      { format: "", header: "dateChange", value: this.formGroup.get("dateChange").value }
    ];
    if (this.validate.checking(validateData)) {
      if (this.formGroup.invalid) {
        this.modalError.openModal("กรุณากรอกข้อมูลให้ครบ");
      } else {
        this.modalSave.openModal();
      }
    }
  }

  onClickSave() {
    if (this.formGroup.invalid) {
      this.modalError.openModal("กรุณากรอกข้อมูลให้ครบ");
    } else {
      this.callSave();
    }
  }

  openModalCustom(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.datas = this.meterList.filter(v => {
      return v.serialNo != this.formGroup.get('oldSerialNo').value;
    });
    this.initDataTable();
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  // ================ call back-end ==============
  callSave() {
    this.commonService.loading();
    // console.log("formGroup => ", this.formGroup.value);
    this.ajax.doPost(URL.SAVE, this.formGroup.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.modalSuccess.openModal();
        this.router.navigate(['/water/water008']);
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }

  findById(id) {
    this.commonService.loading();
    let data = {
      id: id,
      waterChangeId: ''
    }
    if (Utils.isNotNull(this.waterChangeId)) {
      data['waterChangeId'] = this.waterChangeId
    }
    this.ajax.doPost(URL.FIND_ID, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formGroup.get('customerCode').patchValue(res.data.customerCode);
        this.formGroup.get('customerName').patchValue(res.data.customerName);
        this.formGroup.get('customerBranch').patchValue(res.data.customerBranch);
        this.formGroup.get('contractNo').patchValue(res.data.contractNo);
        this.formGroup.get('oldSerialNo').patchValue(res.data.oldSerialNo);
        this.formGroup.get('oldMeterName').patchValue(res.data.oldMeterName);
        this.formGroup.get('oldMeterType').patchValue(res.data.oldMeterType);
        this.formGroup.get('oldMeterLocation').patchValue(res.data.oldMeterLocation);
        this.formGroup.get('oldRentalAreaCode').patchValue(res.data.oldRentalAreaCode);
        this.formGroup.get('oldChargeRates').patchValue(res.data.oldChargeRates.toFixed(2));
        this.formGroup.get('oldVat').patchValue(res.data.oldVat.toFixed(2));
        this.formGroup.get('oldTotalchargeRates').patchValue(res.data.oldTotalchargeRates.toFixed(2));
        this.formGroup.get('newRentalAreaCode').patchValue(res.data.oldRentalAreaCode);
        this.formGroup.get('invoiceNo').patchValue(res.data.invoiceNo);
        this.formGroup.get('airport').patchValue(res.data.airport);
        this.formGroup.get('rateInvoiceNo').patchValue(res.data.rateInvoiceNo);
        this.formGroup.get('rateReceiptNo').patchValue(res.data.rateReceiptNo);
        this.formGroup.get('lgInvoiceNo').patchValue(res.data.lgInvoiceNo);
        this.formGroup.get('lgReceiptNo').patchValue(res.data.lgReceiptNo);
        if (Utils.isNotNull(this.waterChangeId)) {
          this.formGroup.get('newSerialNo').patchValue(res.data.newSerialNo);
          this.formGroup.get('newMeterName').patchValue(res.data.newMeterName);
          this.formGroup.get('newMeterType').patchValue(res.data.newMeterType);
          this.formGroup.get('newMeterLocation').patchValue(res.data.newMeterLocation);
          this.formGroup.get('dateChange').patchValue(res.data.dateChange);
          this.calendar.setDate(this.formGroup.get('dateChange').value);
          this.formGroup.get('remark').patchValue(res.data.remark);
        }
      } else {
        this.modalError.openModal(res.message);
        this.router.navigate(['/water/water003']);
      }
      this.commonService.unLoading();
    })
  }

  findMeter(serialNo: string) {
    this.commonService.loading();
    let data = {
      newSerialNo: serialNo
    }
    this.ajax.doPost(URL.FIND_METER, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formGroup.get('newSerialNo').patchValue(res.data.newSerialNo);
        this.formGroup.get('newMeterName').patchValue(res.data.newMeterName);
        this.formGroup.get('newMeterType').patchValue(res.data.newMeterType);
        this.formGroup.get('newMeterLocation').patchValue(res.data.newMeterLocation);
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
      this.onCloseModal();
    })
  }

  getAllMeter() {
    // this.commonService.loading();
    this.meterList = [];
    this.ajax.doGet(URL.GET_METER).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.meterList = res.data;
      } else {
        this.modalError.openModal(res.message);
      }
      // this.commonService.unLoading();
    })
  }

  // ========== data table ===============

  initDataTable = () => {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    this.dataTable = $('#datatable').DataTable({
      processing: true,
      serverSide: false,
      searching: false,
      ordering: false,
      paging: true,
      scrollX: true,
      data: this.datas,
      columns: [
        {
          data: 'serialNo', className: 'text-left'
        }, {
          data: 'meterName', className: 'text-left'
        }, {
          data: 'meterType', className: 'text-left'
        }, {
          data: 'meterLocation', className: 'text-left'
        }, {
          data: 'rentalAreaCode', className: 'text-left'
        }, {
          className: 'text-center',
          render(data, type, row, meta) {
            return `<button class="btn btn-primary btn-sm" type="button">เลือก</button>`;
          }
        },
      ],
    });

    this.dataTable.on('click', 'td > button.btn-primary', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.findMeter(data.serialNo);
    });
  }

}
