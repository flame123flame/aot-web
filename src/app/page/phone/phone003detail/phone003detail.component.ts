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
  SAVE: "phone003/save",
  FIND_ID: "phone003/find_id"
}
@Component({
  selector: 'app-phone003detail',
  templateUrl: './phone003detail.component.html',
  styleUrls: ['./phone003detail.component.css']
})
export class Phone003detailComponent implements OnInit {

  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('calendar') calendar: InputCalendarComponent;

  breadcrumb: any = [
    {
      label: "หมวดโทรศัพท์",
      link: "/",
    },
    {
      label: "เพิ่มขอยกเลิกการใช้โทรศัพท์",
      link: "#",
    }
  ];

  formGroup: FormGroup;
  phoneCancelId: any;

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
    this.phoneCancelId = this.route.snapshot.queryParams['phoneCancelId'];
    if (this.formGroup.get('reqId').value != null && this.formGroup.get('reqId').value != "") {
      this.formGroup.get('reqId').patchValue(this.formGroup.get('reqId').value);
      this.findById(this.formGroup.get('reqId').value);
    } else if (Utils.isNotNull(this.phoneCancelId)) {
      this.formGroup.get('phoneCancelId').patchValue(this.phoneCancelId);
      this.findById(this.formGroup.get('reqId').value);
    } else {
      this.router.navigate(['/phone/phone002']);
    }
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      phoneCancelId: [""],
      customerCode: [""],
      customerName: [""],
      customerBranch: [""],
      contractNo: [""],
      phoneNo: [""],
      rentalAreaCode: [""],
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
    // console.log("formGroup => ", this.formGroup.value);
    this.ajax.doPost(URL.SAVE, this.formGroup.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.modalSuccess.openModal();
        this.router.navigate(['/phone/phone003']);
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }

  onBack() {
    let pathBack = '';
    if (Utils.isNotNull(this.phoneCancelId)) {
      pathBack = '/phone/phone003';
    } else {
      pathBack = '/phone/phone002';
    }
    this.router.navigate([pathBack]);
  }

  findById(id) {
    this.commonService.loading();
    let data = {
      id: id,
      phoneCancelId: Utils.isNotNull(this.phoneCancelId) ? this.phoneCancelId : ''
    }
    this.ajax.doPost(URL.FIND_ID, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formGroup.get('customerCode').patchValue(res.data.customerCode);
        this.formGroup.get('customerName').patchValue(res.data.customerName);
        this.formGroup.get('customerBranch').patchValue(res.data.customerBranch);
        this.formGroup.get('contractNo').patchValue(res.data.contractNo);
        this.formGroup.get('phoneNo').patchValue(res.data.phoneNo);
        this.formGroup.get('rentalAreaCode').patchValue(res.data.rentalAreaCode);
        this.formGroup.get('chargeRates').patchValue(res.data.chargeRates.toFixed(2));
        this.formGroup.get('vat').patchValue(res.data.vat.toFixed(2));
        this.formGroup.get('totalchargeRates').patchValue(res.data.totalchargeRates.toFixed(2));
        this.formGroup.get('invoiceNo').patchValue(res.data.invoiceNo);
        this.formGroup.get('airport').patchValue(res.data.airport);
        this.formGroup.get('rateInvoiceNo').patchValue(res.data.rateInvoiceNo);
        this.formGroup.get('rateReceiptNo').patchValue(res.data.rateReceiptNo);
        this.formGroup.get('lgInvoiceNo').patchValue(res.data.lgInvoiceNo);
        this.formGroup.get('lgReceiptNo').patchValue(res.data.lgReceiptNo);
        if (Utils.isNotNull(this.phoneCancelId)) {
          this.formGroup.get('dateCancel').patchValue(res.data.dateCancel);
          this.calendar.setDate(this.formGroup.get('dateCancel').value);
          this.formGroup.get('remark').patchValue(res.data.remark);
        }
      } else {
        this.modalError.openModal(res.message);
        this.router.navigate(['/phone/phone002']);
      }
      this.commonService.unLoading();
    })
  }

}
