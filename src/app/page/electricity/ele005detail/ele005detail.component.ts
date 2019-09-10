import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { MessageService } from 'src/app/_service/message.service';
import { ValidateService } from 'src/app/_service/validate.service';
import { Utils } from 'src/app/common/helper/utils';
import { InputCalendarComponent } from 'src/app/components/input/input-calendar/input-calendar.component';

const URL = {
  SAVE: "electric005/save",
  FIND_ID: "electric005/find_id"
}

@Component({
  selector: 'app-ele005detail',
  templateUrl: './ele005detail.component.html',
  styleUrls: ['./ele005detail.component.css']
})
export class Ele005detailComponent implements OnInit {

  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('calendar') calendar: InputCalendarComponent;

  breadcrumb: any = [
    {
      label: "หมวดไฟฟ้า",
      link: "/home/elec",
    },
    {
      label: "ขอยกเลิกการใช้ไฟฟ้า",
      link: "/electricity/ele005",
    },
    {
      label: "เพิ่มรายการขอยกเลิกการใช้ไฟฟ้า",
      link: "/",
    }
  ]

  formGroup: FormGroup;
  reqCancelId: any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private validate: ValidateService
  ) {
    this.setFormGroup();
  }

  // =============== Initial setting ======================
  ngOnInit() {
    this.formGroup.get('reqId').patchValue(this.route.snapshot.queryParams['id']);
    this.reqCancelId = this.route.snapshot.queryParams['reqCancelId'];
    if (this.formGroup.get('reqId').value != null && this.formGroup.get('reqId').value != "") {
      this.formGroup.get('reqId').patchValue(this.formGroup.get('reqId').value);
      this.findById(this.formGroup.get('reqId').value);
    } else if (Utils.isNotNull(this.reqCancelId)) {
      this.formGroup.get('reqCancelId').patchValue(this.reqCancelId);
      this.findById(this.formGroup.get('reqId').value);
    } else {
      this.router.navigate(['/electricity/ele003']);
    }
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      reqCancelId: [""],
      customerCode: ["", Validators.required],
      customerName: [""],
      customerBranch: [""],
      contractNo: [""],
      voltageType: [""],
      serialNo: [""],
      meterName: [""],
      meterType: [""],
      meterLocation: [""],
      functionalLocation: [""],
      chargeRates: [""],
      vat: [""],
      totalchargeRates: [""],
      dateCancel: ["", Validators.required],
      invoiceNo: [""],
      remark: [""],
      airport: [""],
      rateInvoiceNo: [""],
      rateReceiptNo: [""],
      lgInvoiceNo: [""],
      lgReceiptNo: [""],
      reqId: [""],
    });
  }


  // ================= Action =============================
  dateChange(event) {
    this.formGroup.get('dateCancel').patchValue(event);
  }

  onBack() {
    let pathBack = '';
    if (Utils.isNotNull(this.reqCancelId)) {
      pathBack = '/electricity/ele005';
    } else {
      pathBack = '/electricity/ele003';
    }
    this.router.navigate([pathBack]);
  }

  onOpenModalSave() {
    let validateData = [
      { format: "", header: "DateCancel", value: this.formGroup.get("dateCancel").value }
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

  // ===================== call back-end ===============
  callSave() {
    this.commonService.loading();
    console.log("formGroup => ", this.formGroup.value);
    this.ajax.doPost(URL.SAVE, this.formGroup.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.modalSuccess.openModal();
        this.router.navigate(['/electricity/ele005']);
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
      reqCancelId: ''
    }
    if (Utils.isNotNull(this.reqCancelId)) {
      data['reqCancelId'] = this.reqCancelId
    }
    this.ajax.doPost(URL.FIND_ID, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formGroup.get('customerCode').patchValue(res.data.customerCode);
        this.formGroup.get('customerName').patchValue(res.data.customerName);
        this.formGroup.get('customerBranch').patchValue(res.data.customerBranch);
        this.formGroup.get('contractNo').patchValue(res.data.contractNo);
        this.formGroup.get('voltageType').patchValue(res.data.voltageType);
        this.formGroup.get('serialNo').patchValue(res.data.serialNo);
        this.formGroup.get('meterName').patchValue(res.data.meterName);
        this.formGroup.get('meterType').patchValue(res.data.meterType);
        this.formGroup.get('meterLocation').patchValue(res.data.meterLocation);
        this.formGroup.get('functionalLocation').patchValue(res.data.functionalLocation);
        this.formGroup.get('chargeRates').patchValue(res.data.chargeRates.toFixed(2));
        this.formGroup.get('vat').patchValue(res.data.vat.toFixed(2));
        this.formGroup.get('totalchargeRates').patchValue(res.data.totalchargeRates.toFixed(2));
        this.formGroup.get('invoiceNo').patchValue(res.data.invoiceNo);
        this.formGroup.get('airport').patchValue(res.data.airport);
        this.formGroup.get('rateInvoiceNo').patchValue(res.data.rateInvoiceNo);
        this.formGroup.get('rateReceiptNo').patchValue(res.data.rateReceiptNo);
        this.formGroup.get('lgInvoiceNo').patchValue(res.data.lgInvoiceNo);
        this.formGroup.get('lgReceiptNo').patchValue(res.data.lgReceiptNo);
        if (Utils.isNotNull(this.reqCancelId)) {
          this.formGroup.get('dateCancel').patchValue(res.data.dateCancel);
          this.calendar.setDate(this.formGroup.get('dateCancel').value);
          this.formGroup.get('remark').patchValue(res.data.remark);
        }
      } else {
        this.modalError.openModal(res.message);
        this.router.navigate(['/electricity/ele003']);
      }
      this.commonService.unLoading();
    })
  }
}
