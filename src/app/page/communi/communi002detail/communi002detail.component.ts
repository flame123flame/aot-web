import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidateService } from 'src/app/_service/validate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Communi002detailService } from './communi002detail.service';
import { MessageService } from 'src/app/_service/message.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';

@Component({
  selector: 'app-communi002detail',
  templateUrl: './communi002detail.component.html',
  styleUrls: ['./communi002detail.component.css'],
  providers: [Communi002detailService]
})
export class Communi002detailComponent implements OnInit {
  breadcrumb: any = [
    {
      label: "หมวดสื่อสาร",
      link: "/home/communi",
    },
    {
      label: "ขอยกเลิกการใช้วิทยุมือถือ",
      link: "#"
    },
  ];
  @ViewChild('saveModal') saveModal: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;

  /* form */
  formGroup = new FormGroup({});
  mobileSerialNoList: FormArray = new FormArray([]);

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private selfService: Communi002detailService,
    private modalService: BsModalService,
    private validate: ValidateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.initialVariable();
  }

  ngOnInit() {
    let id = this.route.snapshot.queryParams["param1"] || null;
    if (id) {
      this.selfService.findById(id).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.patchData(response.data);
        } else {
          this.modalError.openModal(response.message);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // $('select').selectpicker();
  }

  update() {
    this.selfService.update(this.setFormSave()).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.modalSuccess.openModal();
        // this.routeTo('communi/communi002');
      } else {
        this.modalError.openModal(response.message);
      }
    });
  }

  setFormSave(): FormGroup {
    return this.fb.group({
      id: [this.control('id').value],
      mobileSerialNo: [this.control('mobileSerialNo').value || null],
      cancelDateStr: [this.control('cancelDateStr').value || null],
      description: [this.control('description').value || null],
      remark: [this.control('remark').value || null],
    });
  }

  setDate(e) {
    this.formGroup.get('cancelDateStr').patchValue(e);
  }

  confirm(CASE: string) {
    switch (CASE) {
      case 'UPDATE':
        this.saveModal.openModal(); break;
      default:
        break;
    }
  }

  routeTo(path: string, param?) {
    this.router.navigate([path]);
  }

  patchData(data: any) {
    this.control('id').patchValue(data.id);
    this.control('entreprenuerCode').patchValue(data.entreprenuerCode);
    this.control('entreprenuerName').patchValue(data.entreprenuerName);
    this.control('phoneAmount').patchValue(data.phoneAmount);
    this.control('contractNo').patchValue(data.contractNo);
    this.control('mobileSerialNo').patchValue(data.mobileSerialNo);
    this.control('chargeRates').patchValue(data.chargeRates);
    this.control('insuranceRates').patchValue(data.insuranceRates);
    this.control('totalChargeRates').patchValue(data.totalChargeRates);
    this.control('remark').patchValue(data.remark);
    this.control('totalChargeAll').patchValue(data.totalChargeAll);
    this.control('airport').patchValue(data.airport);
    this.control('customerBranch').patchValue(data.customerBranch);
    this.mobileSerialNoList = this.control('mobileSerialNoList') as FormArray;
    data.details.forEach(element => {
      this.mobileSerialNoList.push(
        this.fb.group({
          mobileSerialNo: [element.mobileSerialNo]
        })
      );
    });
    // this.control('requestDateStr').patchValue(data.requestDateStr);
    // this.control('cancelDateStr').patchValue(data.cancelDateStr);
  }

  control(control: string) {
    return this.formGroup.get(control);
  }

  initialVariable() {
    this.formGroup = this.fb.group({
      id: [''],
      entreprenuerCode: [''],
      entreprenuerName: [''],
      phoneAmount: [''],
      contractNo: [''],
      mobileSerialNoList: this.fb.array([]),
      mobileSerialNo: [0],
      chargeRates: [''],
      insuranceRates: [''],
      totalChargeRates: [''],
      remark: [''],
      totalChargeAll: [''],
      airport: [''],
      customerBranch: [''],
      // requestDate: [''],
      cancelDateStr: [''],
      description: [''],
    });
  }
}
