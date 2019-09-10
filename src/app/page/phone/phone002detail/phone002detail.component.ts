import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Phone002detailService } from './phone002detail.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ValidateService } from 'src/app/_service/validate.service';
import { MessageService } from 'src/app/_service/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from 'src/app/common/helper/utils';
import { ResponseData } from 'src/app/common/models/response-data.model';

const URLS = {
  GET_BY_ID: 'phone002/get-by-id',
  GET_RENTAL_AREA: "common/getUtilityArea/"
};

declare var $: any;
@Component({
  selector: 'app-phone002detail',
  templateUrl: './phone002detail.component.html',
  styleUrls: ['./phone002detail.component.css'],
  providers: [Phone002detailService]
})
export class Phone002detailComponent implements OnInit {
  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('successModal') successModal: ModalSuccessComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;

  // form save
  formSave = new FormGroup({});
  rateCharge = new FormGroup({});
  serviceCharge: FormArray = new FormArray([]);

  // List DropDown
  paymentTypeList: any[] = [];
  phoneTypeList: any[] = [];
  serviceTypeList: any[] = [];
  // Const fixed value
  paymentType = ['เงินสด', 'Bank guarantee'];
  vat = 7;
  sumChargeRate = 0;
  // modal
  modalRef: BsModalRef;
  cusList: any[] = [];
  contractNoList: any[] = [];
  rentalAreaList: any[] = [];

  dataTable: any;

  id: any;
  flagDisble: Boolean = false;

  breadcrumb: any = [
    {
      label: 'หมวดโทรศัพท์',
      link: '/phone',
    },
    {
      label: 'ขอใช้งานเลขหมายโทรศัพท์',
      link: '/phone/phone002',
    }, {
      label: 'เพิ่มขอใช้งานเลขหมายโทรศัพท์',
      link: '#',
    },
  ];
  constructor(
    private commonService: CommonService,
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private selfService: Phone002detailService,
    private modalService: BsModalService,
    private validate: ValidateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // set control form save
    this.formSave = this.formBuilder.group({
      entrepreneurCode: [], // รหัสผู้ประกอบการ
      entrepreneurName: [], // ชื่อผู้ประกอบการ
      branchCustomer: [], // สาขา
      contractNo: [], // เลขที่สัญญา
      phoneNo: [], // เลขหมาย
      description: [], // คำอธิบาย
      paymentType: [''], // วิธีการชำระเงิน
      requestStartDate: [], // วันที่ขอใช้บริการ
      requestEndDate: [], // วันที่สิ้นสุดการใช้บริการ
      remark: [], // หมายเหตุ
      serviceCharge: this.formBuilder.array([]), // list ของ rate charge
      // วิธีชำระเงินประกัน สำหรับ Bank guarantee
      bankName: [],
      bankBranch: [],
      bankExplanation: [],
      bankGuaranteeNo: [],
      bankExpNo: [],
      // พื้นที่เช่า
      rentalAreaCode: [],
      rentalAreaName: [''],
    });

    // เพิ่มค่าภาระ
    this.rateCharge = this.formBuilder.group({
      typeName: [],
      serviceTypeName: [],
      chargeRates: [],
      vat: [],
      totalChargeRates: [],
    });
    this.getDropDrownList();
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'] || '';
    if (Utils.isNotNull(this.id)) {
      this.flagDisble = true;
      this.getById(this.id);
    }
  }

  getById(id: String) {
    this.commonService.loading();
    this.ajax.doGet(`${URLS.GET_BY_ID}/${id}`).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log(res);
        this.formSave.get('entrepreneurCode').patchValue(res.data.entrepreneurCode);
        this.formSave.get('entrepreneurName').patchValue(res.data.entrepreneurName);
        this.formSave.get('branchCustomer').patchValue(res.data.branchCustomer);
        this.formSave.get('contractNo').patchValue(res.data.contractNo);
        this.formSave.get('phoneNo').patchValue(res.data.phoneNo);
        this.formSave.get('description').patchValue(res.data.description);
        this.formSave.get('paymentType').patchValue(res.data.paymentType);
        this.formSave.get('requestStartDate').patchValue(res.data.requestStartDate);
        this.formSave.get('requestEndDate').patchValue(res.data.requestEndDate);
        this.formSave.get('remark').patchValue(res.data.remark);
        this.formSave.get('bankName').patchValue(res.data.bankName);
        this.formSave.get('bankBranch').patchValue(res.data.bankBranch);
        this.formSave.get('bankExplanation').patchValue(res.data.bankExplanation);
        this.formSave.get('bankGuaranteeNo').patchValue(res.data.bankGuaranteeNo);
        this.formSave.get('bankExpNo').patchValue(res.data.bankExpNo);
        this.formSave.get('rentalAreaCode').patchValue(res.data.rentalAreaCode);
        this.formSave.get('rentalAreaName').patchValue(res.data.rentalAreaName);
        if (res.data.phone002DtlRes.length > 0) {
          let sum = 0;
          res.data.phone002DtlRes.forEach(res => {
            const dataSave = {
              typeName: res.typeName.trim(),
              serviceTypeName: res.serviceTypeName.trim(),
              chargeRates: (Number(res.chargeRates)).toFixed(2),
              vat: (Number(res.vat)).toFixed(2),
              totalChargeRates: (Number(res.totalChargeRates)).toFixed(2),
            };
            this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
            this.serviceCharge.push(this.createCharge(dataSave));

            sum += Number(dataSave.totalChargeRates);
          });
          this.sumChargeRate = sum;
        } else {
          this.serviceCharge.controls.splice(0, this.serviceCharge.controls.length);
          this.serviceCharge.patchValue([]);
        }
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }


  async getDropDrownList() {
    this.paymentTypeList = await this.selfService.getParams('PAYMENT_TYPE');
    this.phoneTypeList = await this.selfService.getParams('PHONE_CAL_TYPE');
  }

  openModalCustom(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    this.getCustomerList();
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  async getCustomerList() {
    this.cusList = await this.selfService.getSapCustomerList('B101');
    this.datatableCus();
  }

  datatableCus() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    this.dataTable = $('#datatableCus').DataTable({
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

    this.dataTable.on('click', 'td > button.btn-primary', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.setCustumerData(data);
      this.getContractNoList(data.partner);
    });
  }

  setCustumerData(data) {
    this.formSave.patchValue({
      entrepreneurCode: data.customerCode,
      entrepreneurName: data.customerName,
      branchCustomer: `${data.adrKind} : ${data.address}`
    });

    this.onCloseModal();
  }

  async getContractNoList(partner: any) {
    this.contractNoList = await this.selfService.getSapContractNo(partner);
    console.log("isttttt : ", this.contractNoList);

  }

  async getRentalAreaList(event) {
    let contractNo = '0';
    if (Utils.isNotNull(event.target.value)) {
      contractNo = event.target.value;
    }
    this.rentalAreaList = await this.selfService.getRentalArea(contractNo);
  }

  setRentalAreaCode(even) {
    console.log(even.target.value);
    this.rentalAreaList = this.rentalAreaList.filter((data) => {
      return data.id == even.target.value
    })
    this.formSave.patchValue({
      rentalAreaCode: this.rentalAreaList[0].roNumber,
      rentalAreaName: this.rentalAreaList[0].roName
    })
  }

  setDate(control, e) {
    this.formSave.get(control).patchValue(e);
    console.log(e);
  }

  async getServiceType() {
    console.log(this.rateCharge.value);
    this.serviceTypeList = await this.selfService.getServiceType(this.rateCharge.value.typeName);
    let serviceTypeName = await setTimeout(() => {
      $('.serviceTypeName').val("");
      this.rateCharge.patchValue({
        serviceTypeName: '',
        chargeRates: '',
        vat: '',
        totalChargeRates: ''
      });
    }, 100);
  }

  getCharge() {
    console.log(this.rateCharge.value);
    this.ajax.doGet(`phone002/get-rate-charge/${this.rateCharge.value.typeName}/${this.rateCharge.value.serviceTypeName}`)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.message) {
          const chargeRate = Number(res.data.chargeRate);
          this.rateCharge.patchValue({
            chargeRates: chargeRate.toFixed(2),
            vat: (chargeRate * this.vat / 100).toFixed(2),
            totalChargeRates: (chargeRate * (this.vat + 100) / 100).toFixed(2),
          });
        } else {
          this.modalError.openModal(res.message);
        }

      }, (err) => {
        this.modalError.openModal(MessageService.MSG.FAILED_CALLBACK + err);
      });
  }

  addServiceCharge() {
    let duplicateData = false;
    this.formSave.value.serviceCharge.forEach(item => {
      if (item.typeName === this.rateCharge.value.typeName && item.serviceTypeName === this.rateCharge.value.serviceTypeName) {
        duplicateData = true;
        return;
      }
    });
    if (duplicateData) {
      return;
    }
    this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    this.serviceCharge.push(this.createCharge((this.rateCharge.value)));
    let sum = 0;
    this.formSave.value.serviceCharge.forEach(item => {
      sum += Number(item.totalChargeRates);
    });
    this.sumChargeRate = sum;
    this.hideModal();
  }

  calChargeRate() {
    let chargeRates = Number(this.rateCharge.get('chargeRates').value);
    let vat = chargeRates * 0.07;
    let totalChargeRates = chargeRates + vat;
    this.rateCharge.get('vat').patchValue(vat.toFixed(2));
    this.rateCharge.get('totalChargeRates').patchValue(totalChargeRates.toFixed(2));
  }

  createCharge(obj?): FormGroup {
    const data = obj || {
      // id: [],
      // electricPhase: [],
      // chargeType: [],
      // electricAmpere: [],
      // chargeRate: [],
      // chargeVat: [],
      // totalChargeRate: []
    };
    return this.formBuilder.group(data);
  }

  // Remove Form from FormArray
  delDetail(index: number): void {
    this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    this.serviceCharge.removeAt(index);
    // re callculate sum totalChargeRate
    let sum = 0;
    this.formSave.value.serviceCharge.forEach(item => {
      sum += Number(item.totalChargeRates);
    });
    this.sumChargeRate = sum;
  }

  showModal() {
    this.rateCharge.reset();
    $('#myModal').modal('show');
  }

  hideModal() {
    $('#myModal').modal('hide');
  }

  validatorFormSave() {
    let serviceCharge = '';
    if (this.formSave.value.serviceCharge.length !== 0) {
      serviceCharge = 'have';
    }
    let validateData = [
      { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.entrepreneurCode },
      { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.entrepreneurName },
      { format: '', header: 'สาขา', value: this.formSave.value.branchCustomer },
      { format: '', header: 'เลขที่สัญญา', value: this.formSave.value.contractNo },
      { format: '', header: 'เลขหมาย', value: this.formSave.value.phoneNo },
      { format: '', header: 'พื้นที่เช่า', value: this.rentalAreaList.length > 0 ? this.formSave.value.rentalAreaName : 'success' },
      // { format: '', header: 'คำอธิบาย', value: this.formSave.value.description },
      { format: '', header: 'วิธีการชำระเงิน', value: this.formSave.value.paymentType },
      { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
      { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },
      { format: '', header: 'ค่าภาระ', value: serviceCharge },
    ];
    // ถ้าเลือก วิธีชำระเงินประกัน เป็น Bank guarantee
    if (this.formSave.value.paymentType === 'Bank guarantee') {
      validateData = [
        ...validateData,
        { format: '', header: 'ชื่อธนาคาร', value: this.formSave.value.bankName },
        { format: '', header: 'ชื่อสาขา', value: this.formSave.value.bankBranch },
        { format: '', header: 'ชื่อสาขา', value: this.formSave.value.bankBranch },
        { format: '', header: 'คำอธิบาย', value: this.formSave.value.bankExplanation },
        { format: '', header: 'หมายเลข Bank guarantee', value: this.formSave.value.bankGuaranteeNo },
        { format: '', header: 'วันหมดอายุ', value: this.formSave.value.bankExpNo },
      ];
    } else if (this.formSave.value.paymentType === 'เงินสด') {
      validateData = [
        ...validateData,
        { format: '', header: 'หมายเหตุ', value: this.formSave.value.remark },
      ];
    }
    let arrays: any[] = this.formSave.value.serviceCharge;
    if (this.validateServiceTypeDtl(arrays)) {
      validateData = [
        ...validateData,
        { format: '', header: 'เงินประกัน', value: "" },
      ];
    }
    if (!this.validate.checking(validateData)) {
      return;
    }
    this.modalSave.openModal();
  }

  validateServiceTypeDtl(dataList: any[]): boolean {
    let bool: boolean = true;
    dataList.forEach(element => {
      if ("เงินประกัน" === element.typeName) {
        return bool = false;
      }
    });
    return bool;
  }

  onSave() {

    this.selfService.saveService(this.formSave.value).subscribe(
      (res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.successModal.openModal();
          this.goLocation();
        } else {
          this.modalError.openModal(res.message);
        }
      }, (err) => {
        this.modalError.openModal(MessageService.MSG.FAILED_CALLBACK + err);
      });
  }

  goLocation() {
    this.router.navigate(['/phone/phone002'], {
      // queryParams: {
      //   id: reqId
      // }
    });
  }

}
