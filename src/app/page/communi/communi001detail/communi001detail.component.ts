import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Phone002detailService } from '../../phone/phone002detail/phone002detail.service';
import { ValidateService } from 'src/app/_service/validate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Communi001DetailSrevice } from './communi001detail.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { MessageService } from 'src/app/_service/message.service';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
declare var $: any;
@Component({
  selector: 'app-communi001detail',
  templateUrl: './communi001detail.component.html',
  styleUrls: ['./communi001detail.component.css'],
  providers: [Communi001DetailSrevice]
})
export class Communi001detailComponent implements OnInit {
  @ViewChild('saveModal') saveModal: ModalConfirmComponent;
  @ViewChild('successModal') modalSuccess: ModalSuccessComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  breadcrumb: any = [
    { label: "หมวดสื่อสาร", link: "/home/communi" },
    { label: "ขอใช้วิทยุมือถือ", link: "#", },
  ];
  modalRef: BsModalRef;
  cusList: any[] = [];
  contractNoList: any[] = [];
  dataTable: any;

  /* form */
  formSave = new FormGroup({});
  mobileSerialNoList: FormArray = new FormArray([]);

  constructor(
    private commonService: CommonService,
    private ajax: AjaxService,
    private fb: FormBuilder,
    private selfService: Communi001DetailSrevice,
    private modalService: BsModalService,
    private validate: ValidateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.initialVariable();
  }

  openModalCustom(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    this.getCustomerList();
  }

  getCustomerList() {
    this.selfService.getSapCustomerList('B101').subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.cusList = response.data;
        this.datatable();
        this.clickTdBtn();
      }
    });
  }

  getSapContractNo(partner: string) {
    this.selfService.getSapContractNo(partner).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.contractNoList = response.data;
      }
    });
  }

  save() {
    this.selfService.save(this.formSave).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.modalSuccess.openModal();
        this.routeTo('communi/communi001');
      } else {
        this.modalError.openModal(response.message);
      }
    });
  }

  routeTo(path: string, param?) {
    this.router.navigate([path]);
  }

  setDate(e) {
    this.formSave.get('requestDateStr').patchValue(e);
  }

  confirm(CASE: string) {
    switch (CASE) {
      case 'SAVE':
        this.saveModal.openModal();
        break;
      default:
        break;
    }
  }

  datatable() {
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
      data: this.cusList,
      columns: [
        {
          data: 'customerCode', className: 'text-left'
        }, {
          data: 'customerName', className: 'text-left'
        }, {
          data: 'adrKind', className: 'text-left'
        }, {
          data: 'customerName', className: 'text-left'
        }, {
          className: 'text-center',
          render(data, type, row, meta) {
            return `<button class="btn btn-primary btn-sm" type="button">เลือก</button>`;
          }
        },
      ],
    });
  }

  clickTdBtn = () => {
    this.dataTable.on('click', 'td > button.btn-primary', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.formSave.patchValue({
        entreprenuerCode: data.customerCode,
        entreprenuerName: data.customerName,
        customerBranch: `${data.adrKind} : ${data.address}`
      });
      this.getSapContractNo(data.partner)
      this.onCloseModal();
    });
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  addMobileSerialNo(loop: boolean = false) {
    if (!loop) {
      this.formSave.get('phoneAmount').patchValue(Number(this.formSave.get('phoneAmount').value) + 1);
    }
    this.mobileSerialNoList = this.formSave.get('mobileSerialNoList') as FormArray;
    // const index = this.mobileSerialNoList.controls.length;
    this.mobileSerialNoList.push(this.fb.group({
      mobileSerialNo: ['']
    }));
  }

  removeMobileSerialNo(loop: boolean = false, index?: number) {
    if (!loop) {
      this.formSave.get('phoneAmount').patchValue(Number(this.formSave.get('phoneAmount').value) - 1);
    }
    this.mobileSerialNoList = this.formSave.get('mobileSerialNoList') as FormArray;
    this.mobileSerialNoList.removeAt(index);
  }

  onBlur(e) {
    this.control('phoneAmount').patchValue(e.target.value);
    let sum: number = this.control('phoneAmount').value - this.control('mobileSerialNoList').value.length;
    for (let i = 0; i < Math.abs(sum); i++) {
      if (sum >= 0) {
        this.addMobileSerialNo(true);
      } else {
        this.removeMobileSerialNo(true);
      }
    }
  }

  control(control: string) {
    return this.formSave.get(control);
  }

  initialVariable() {
    this.formSave = this.fb.group({
      id: [''],
      entreprenuerCode: [''],
      entreprenuerName: [''],
      phoneAmount: [0],
      contractNo: [''],
      mobileSerialNoList: this.fb.array([]),
      mobileSerialNo: [''],
      chargeRates: [''],
      insuranceRates: [''],
      totalChargeRates: [''],
      remark: [''],
      totalChargeAll: [''],
      airport: [''],
      customerBranch: [''],
      requestDateStr: [''],
    });
  }

}
