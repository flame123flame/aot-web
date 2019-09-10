import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Ele003detailService } from './ele003detail.service';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { MessageService } from 'src/app/_service/message.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { AjaxService } from 'src/app/_service/ajax.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/_service/ common.service';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ValidateService } from 'src/app/_service/validate.service';
import { Utils } from 'src/app/common/helper';

declare var $: any;
const customerTypeDetail = ['C', 'E'];
const chargeTypeLg = 'ค่าประกัน';
const URLS = {
  FIND_METER: 'electric003/find_meter',
  GET_ALLMETER: 'electric003/get_meter',
  UPLOAD: 'electric003/upload',
  GET_FILE_LIST: 'electric003/get-file-list',
  GET_DETAIL: 'electric003/get-detail/',
  DELETE_FILE: 'electric003/delete-file',
  CAL_MONEY_FROM_UNIT: 'electric003/cal-money-from-unit',
  DOWNLOAD: 'electric003/downloadRicFile/',
  GET_PAYMENT: 'constant/get-constant'
};

@Component({
  selector: 'app-ele003detail',
  templateUrl: './ele003detail.component.html',
  styleUrls: ['./ele003detail.component.css'],
  providers: [Ele003detailService]
})

export class Ele003detailComponent implements OnInit, AfterViewInit {
  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('deleteFileModal') deleteFileModal: ModalConfirmComponent;
  @ViewChild('successModal') successModal: ModalSuccessComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  @ViewChild('errorModal') modalError: ModalErrorComponent;

  // Const
  paymentType = ['เงินสด', 'Bank guarantee'];
  requestType = ['ขอใช้เหมาจ่าย'];
  applyType = ['ผู้ประกอบการนำมาเอง'];
  // adhocType ประเภทเหมาจ่าย adhocType1=เหมาจ่ายจำนวนหน่วย adhocType2=เหมาจ่ายจำนวนเงิน
  adhocType = ['adhocType1', 'adhocType2'];

  formSave: FormGroup = new FormGroup({});
  formSave2: FormGroup = new FormGroup({});
  formServiceCharge: FormGroup = new FormGroup({});
  formSearchMeter: FormGroup = new FormGroup({});
  serviceCharge: FormArray = new FormArray([]);
  contractNoList: any[] = [];
  rentalAreaList: any[] = [];

  sumChargeRateNoLg1 = 0;
  chargeVatNoLg1 = 0;
  totalChargeRateNoLg1 = 0;

  sumChargeRateNoLg2 = 0;
  chargeVatNoLg2 = 0;
  totalChargeRateNoLg2 = 0;

  sumChargeRate1 = 0;
  chargeVat1 = 0;
  totalChargeRate1 = 0;

  sumChargeRate2 = 0;
  chargeVat2 = 0;
  totalChargeRate2 = 0;

  dataTable: any;
  submitted: Boolean = false;
  typeCustomer = 0;
  textAlert = '';
  testLogData: any;
  meterList: any[] = [];
  vat = 7;


  // for manage file
  id: any;
  isUploadFile = false;
  tableFile: any;
  reqFileId: any;
  // List DropDown
  electricRateTypeList: any[] = [];
  paymentTypeList: any[] = [];
  requestTypeList: any[] = [];
  meterTypeList: any[] = [];
  applyTypeList: any[] = [];
  electricVoltageTypeList: any[] = [];
  electricAmpereRangeList: any[] = [];
  electricPhaseList: any[] = [];
  electricCalTypeList: any[] = [];
  adhocTypeList: any[] = [];


  cusList: any[] = [];
  configList: any[] = [];
  modalRef: BsModalRef;
  datas: any[] = [];
  breadcrumb: any = [
    {
      label: 'หมวดไฟฟ้า',
      link: '/home/elec',
    }, {
      label: 'ขอใช้ไฟฟ้า',
      link: '/electricity/ele003',
    }, {
      label: 'เพิ่มรายการขอใช้ไฟฟ้า',
      link: '#',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private selfService: Ele003detailService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private ajax: AjaxService,
    private validate: ValidateService,
  ) {
    // set form
    this.formSave = this.formBuilder.group(this.selfService.getFormSave(0));
    this.formSave2 = this.formBuilder.group(this.selfService.getFormSave(1));
    this.formServiceCharge = this.formBuilder.group({
      electricPhase: [''],
      chargeType: [],
      electricAmpere: [''],
      chargeRate: [],
      chargeVat: [],
      totalChargeRate: [],
    });

    //formSearchMeter
    this.formSearchMeter = this.formBuilder.group({
      criteria: ['']
    });

    // get data DropDown
    this.getDropDown();
  }

  bookId = new FormControl();
  bookForm: FormGroup = this.formBuilder.group({
    bookId: this.bookId
  });

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'] || '';
    if (Utils.isNotNull(this.id)) {
      this.isUploadFile = true;
      this.getDetail();
      this.getFileList();
    }

    // this.searchBook();

  }




  ngAfterViewInit(): void {
    // this.changeUnitChange();
    // this.adhocChargeRateChange();
  }


  // getDropDown FUNCTION
  async getDropDown() {
    // get ELECTRIC_RATE_TYPE List
    this.electricRateTypeList = await this.selfService.getParams('ELECTRIC_RATE_TYPE');
    // get PAYMENT_TYPE List
    this.paymentTypeList = await this.selfService.getParams('PAYMENT_TYPE');
    // get REQUEST_TYPE List
    this.requestTypeList = await this.selfService.getParams('REQUEST_TYPE');
    // get METER_TYPE List
    this.meterTypeList = await this.selfService.getParams('METER_TYPE');
    // get APPLY_TYPE List
    this.applyTypeList = await this.selfService.getParams('APPLY_TYPE');
    // get ELECTRIC_VOLTAGE_TYPE List
    this.electricVoltageTypeList = await this.selfService.getParams('ELECTRIC_VOLTAGE_TYPE');
    // get ELECTRIC_AMPERE_RANGE List
    this.electricAmpereRangeList = await this.selfService.getParams('ELECTRIC_AMPERE_RANGE');
    // get ELECTRIC_PHASE List
    this.electricPhaseList = await this.selfService.getParams('ELECTRIC_PHASE');
    // get ELECTRIC_CAL_TYPE List
    this.electricCalTypeList = await this.selfService.getParams('ELECTRIC_CAL_TYPE');
    // get Adhoc Type
    this.adhocTypeList = await this.selfService.getParams('ADHOC_TYPE');
  }

  showModal() {
    // this.formServiceCharge.reset();
    $('#myModal').modal('show');
  }

  hideModal() {
    $('#myModal').modal('hide');
  }

  getAllMeter() {
    this.commonService.loading();
    this.meterList = [];
    this.ajax.doPost(URLS.GET_ALLMETER, this.formSearchMeter.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.meterList = res.data;
        this.datas = res.data;
        this.initDataTable();
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }

  openModalCustom(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.datas = this.meterList.filter(v => {
      // return v.serialNo != this.formGroup.get('oldSerialNo').value;
      return v.serialNo;
    });
    this.formSearchMeter.reset();
    this.getAllMeter();

  }

  openModalCustom2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    this.getCus();

  }

  addServiceCharge() {
    this.hideModal();
    if (this.typeCustomer === 0) {
      this.formSave.value.serviceCharge.forEach(() => {
        this.delDetail(0);
      });
      this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    } else if (this.typeCustomer === 1) {
      this.formSave2.value.serviceCharge.forEach(() => {
        this.delDetail(0);
      });
      this.serviceCharge = this.formSave2.get('serviceCharge') as FormArray;
    }
    let sumNoLg1 = 0;
    let sumNoLg2 = 0;
    let sumNoLg3 = 0;

    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    this.configList.forEach(config => {
      const dataSave = {
        electricPhase: this.formServiceCharge.value.electricPhase.trim(),
        electricAmpere: this.formServiceCharge.value.electricAmpere.trim(),
        chargeType: config.serviceType,
        chargeRate: config.chargeRates,
        chargeVat: (config.chargeRates * this.vat / 100).toFixed(2),
        totalChargeRate: (config.chargeRates * (this.vat + 100) / 100).toFixed(2),
      };
      this.serviceCharge.push(this.createCharge(dataSave));
      if (dataSave.chargeType !== chargeTypeLg) {
        sumNoLg1 += Number(dataSave.chargeRate);
        sumNoLg2 += Number(dataSave.chargeVat);
        sumNoLg3 += Number(dataSave.totalChargeRate);
      }

      sum1 += Number(dataSave.chargeRate);
      sum2 += Number(dataSave.chargeVat);
      sum3 += Number(dataSave.totalChargeRate);
    });
    if (this.typeCustomer === 0) {
      this.sumChargeRateNoLg1 = sumNoLg1;
      this.chargeVatNoLg1 = sumNoLg2;
      this.totalChargeRateNoLg1 = sumNoLg3;

      this.sumChargeRate1 = sum1;
      this.chargeVat1 = sum2;
      this.totalChargeRate1 = sum3;

      this.formSave.patchValue({
        sumChargeRates: this.sumChargeRateNoLg1,
        sumVatChargeRates: this.chargeVatNoLg1,
        totalChargeRate: this.totalChargeRateNoLg1
      });

    } else if (this.typeCustomer === 1) {
      this.sumChargeRateNoLg2 = sumNoLg1;
      this.chargeVatNoLg2 = sumNoLg2;
      this.totalChargeRateNoLg2 = sumNoLg3;

      this.sumChargeRate2 = sum1;
      this.chargeVat2 = sum2;
      this.totalChargeRate2 = sum3;

      this.formSave2.patchValue({
        sumChargeRates: this.sumChargeRateNoLg2,
        sumVatChargeRates: this.chargeVatNoLg2,
        totalChargeRate: this.totalChargeRateNoLg2
      });
    }
    console.log(this.formSave.value);
    console.log(this.formSave.get('serviceCharge'));
  }

  createCharge(obj?): FormGroup {
    const data = obj || {
      id: [],
      electricPhase: [],
      chargeType: [],
      electricAmpere: [],
      chargeRate: [],
      chargeVat: [],
      totalChargeRate: []
    };
    return this.formBuilder.group(data);
  }

  // Remove Form from FormArray
  delDetail(index: number): void {
    if (this.typeCustomer === 0) {
      this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    } else if (this.typeCustomer === 1) {
      this.serviceCharge = this.formSave2.get('serviceCharge') as FormArray;
    }
    // if (this.id !== '' && this.serviceCharge.at(index).get('id').value !== '') {
    //   this.delete.push(Number(this.serviceCharge.at(index).get('id').value));
    // }
    this.serviceCharge.removeAt(index);

    // re callculate sum totalChargeRate
    let sum = 0;
    if (this.typeCustomer === 0) {
      this.formSave.get('serviceCharge').value.forEach(item => {
        sum += Number(item.totalChargeRate);
      });
      this.sumChargeRate1 = sum;
    } else if (this.typeCustomer === 1) {
      this.formSave2.get('serviceCharge').value.forEach(item => {
        sum += Number(item.totalChargeRate);
      });
      this.sumChargeRate2 = sum;
    }
  }

  validateCheck() {
    this.submitted = true;
    this.textAlert = 'กรุณากรอกข้อมูลให้ครบ';
    if (this.typeCustomer === 0) {
      let validateData = [
        { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.customerCode },
        { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.customerName },
        { format: '', header: 'เลขที่สัญญา', value: this.formSave.value.contractNo },
        { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
        { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },
        { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
        { format: '', header: 'เจ้าของมิเตอร์', value: this.formSave.value.applyType },
        { format: '', header: 'ประเภทค่าไฟฟ้า', value: this.formSave.value.voltageType },
        { format: '', header: 'ประเภทอัตราไฟฟ้า', value: this.formSave.value.electricRateType },
        { format: '', header: 'แรงดันไฟฟ้า', value: this.formSave.value.electricVoltageType },
        { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterSerialNo },
        { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterName },
        { format: '', header: 'เลขที่มิเตอร์เริ่มต้น', value: this.formSave.value.defaultMeterNo === 0 || Utils.isNotNull(this.formSave.value.defaultMeterNo) ? 'success' : '' },
        { format: '', header: 'พื้นที่เช่า', value: this.rentalAreaList.length > 0 ? this.formSave.value.rentalAreaName : 'success' },
        { format: '', header: 'วิธีชำระเงินประกัน', value: this.formSave.value.paymentType },
      ];
      // ถ้าเลือก ประเภทที่ขอใช้ เป็น เหมาจ่าย
      if (this.formSave.value.requestType === this.requestType[0]) {
        validateData = [
          { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.customerCode },
          { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.customerName },
          { format: '', header: 'เลขที่สัญญา', value: this.formSave.value.contractNo },
          { format: '', header: 'ที่อยู่จัดส่งเอกสาร', value: this.formSave.value.addressDocument },
          { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
          { format: '', header: 'ประเภทเหมาจ่าย', value: this.formSave.value.adhocType },
          { format: '', header: 'จำนวนหน่วย', value: this.formSave.value.adhocUnit },
          { format: '', header: 'จำนวนเงิน', value: this.formSave.value.adhocChargeRate },
          { format: '', header: 'พื้นที่เช่า', value: this.rentalAreaList.length > 0 ? this.formSave.value.rentalAreaName : 'success' },
          { format: '', header: 'วิธีชำระเงินประกัน', value: this.formSave.value.paymentType },
          { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
          { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },

          // , ...validateData
        ];
      }
      // ถ้าเลือก วิธีชำระเงินประกัน เป็น Bank guarantee
      if (this.formSave.value.paymentType === this.paymentType[1]) {
        validateData = [

          // ...validateData,
          { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.customerCode },
          { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.customerName },
          { format: '', header: 'เลขที่สัญญา', value: this.formSave.value.contractNo },
          { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
          { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },
          { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
          { format: '', header: 'เจ้าของมิเตอร์', value: this.formSave.value.applyType },
          { format: '', header: 'ประเภทค่าไฟฟ้า', value: this.formSave.value.voltageType },
          { format: '', header: 'ประเภทอัตราไฟฟ้า', value: this.formSave.value.electricRateType },
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterSerialNo },
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterName },
          { format: '', header: 'เลขที่มิเตอร์เริ่มต้น', value: this.formSave.value.defaultMeterNo === 0 || Utils.isNotNull(this.formSave.value.defaultMeterNo) ? 'success' : '' },
          { format: '', header: 'พื้นที่เช่า', value: this.rentalAreaList.length > 0 ? this.formSave.value.rentalAreaName : 'success' },
          { format: '', header: 'วิธีชำระเงินประกัน', value: this.formSave.value.paymentType },

          { format: '', header: 'ชื่อธนาคาร', value: this.formSave.value.bankName },
          { format: '', header: 'ชื่อสาขา', value: this.formSave.value.bankBranch },
          { format: '', header: 'ชื่อสาขา', value: this.formSave.value.bankBranch },
          { format: '', header: 'คำอธิบาย', value: this.formSave.value.bankExplanation },
          { format: '', header: 'หมายเลข  แบงค์การันตี', value: this.formSave.value.bankGuaranteeNo },
          { format: '', header: 'วันหมดอายุ', value: this.formSave.value.bankExpNo },
        ];
      } else if (this.formSave.value.paymentType === this.paymentType[0]) {
        validateData = [

          // ...validateData,
          { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.customerCode },
          { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.customerName },
          { format: '', header: 'เลขที่สัญญา', value: this.formSave.value.contractNo },
          { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
          { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },
          { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
          { format: '', header: 'เจ้าของมิเตอร์', value: this.formSave.value.applyType },
          { format: '', header: 'ประเภทค่าไฟฟ้า', value: this.formSave.value.voltageType },
          { format: '', header: 'ประเภทอัตราไฟฟ้า', value: this.formSave.value.electricRateType },
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterSerialNo },
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterName },
          { format: '', header: 'เลขที่มิเตอร์เริ่มต้น', value: this.formSave.value.defaultMeterNo === 0 || Utils.isNotNull(this.formSave.value.defaultMeterNo) ? 'success' : '' },
          { format: '', header: 'พื้นที่เช่า', value: this.rentalAreaList.length > 0 ? this.formSave.value.rentalAreaName : 'success' },
          { format: '', header: 'วิธีชำระเงินประกัน', value: this.formSave.value.paymentType },

          { format: '', header: 'หมายเหตุ', value: this.formSave.value.remark },
        ];
      }
      if (!this.validate.checking(validateData)) {
        return;
      }
    } else if (this.typeCustomer === 1) {
      const validateData = [
        { format: '', header: 'รหัสพนักงาน', value: this.formSave2.value.customerCode },
        { format: '', header: 'รหัสพนักงาน', value: this.formSave2.value.customerName },
        { format: '', header: 'หมายเลขประจำตัวประชาชน', value: this.formSave2.value.idCard },
        { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave2.value.requestStartDate },
        { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave2.value.requestEndDate },
        { format: '', header: 'ประเภทอัตราไฟฟ้า', value: this.formSave2.value.electricRateType },
        { format: '', header: 'แรงดันไฟฟ้า', value: this.formSave2.value.electricVoltageType },
        { format: '', header: 'Serial No. มิเตอร์', value: this.formSave2.value.meterSerialNo },
        { format: '', header: 'เลขที่มิเตอร์เริ่มต้น', value: this.formSave2.value.defaultMeterNo === 0 || Utils.isNotNull(this.formSave2.value.defaultMeterNo) ? 'success' : '' },
        { format: '', header: 'ประเภทมิเตอร์', value: this.formSave2.value.meterType },
      ];
      if (!this.validate.checking(validateData)) {
        return;
      }
    }
    this.modalSave.openModal();
  }

  onSubmit() {
    console.log('dataSave', this.formSave.value);
    console.log('dataSave2', this.formSave2.value);
    this.textAlert = 'บันทึกรายการไม่สำเร็จ';
    if (this.typeCustomer === 0) {
      this.saveCustumer();
    } else if (this.typeCustomer === 1) {
      this.saveEmploayee();
    }
  }

  saveCustumer() {
    this.commonService.loading();
    this.formSave.patchValue({ customerType: customerTypeDetail[this.typeCustomer] });
    this.selfService.saveService(this.formSave.value).subscribe((data) => {
      console.log(data);
      if (!data) {
        return;
      }
      if (MessageService.MSG.SUCCESS === data.status) {
        this.successModal.openModal();
        // this.goLocation(data.data.reqId);
        this.goLocation();
      } else {
        this.alertModal.openModal();
      }
      this.submitted = false;
      this.commonService.unLoading();
    });
    //     .then((data: ResponseData<any>) => {

    //     }).catch(() => {
    //       console.error('error');
    //       this.alertModal.openModal();
    //       this.submitted = false;
    //     });
  }

  saveEmploayee() {
    this.formSave2.patchValue({ customerType: customerTypeDetail[this.typeCustomer] });
    this.selfService.saveService(this.formSave2.value).subscribe((data) => {
      if (MessageService.MSG.SUCCESS === data.status) {
        this.successModal.openModal();
        this.goLocation(data.data.reqId);
      } else {
        this.alertModal.openModal();
      }
      this.submitted = false;
    })
    // .then((data: ResponseData<any>) => {

    // }).catch(() => {
    //   console.error('error');
    //   this.submitted = false;
    //   this.alertModal.openModal();
    // });
  }

  goLocation(reqId?: any) {
    this.isUploadFile = true;
    // this.getFileList();
    this.router.navigate(['/electricity/ele003']);
    // this.router.navigate(['/electricity/ele003detail'], {
    //   queryParams: {
    //     id: reqId
    //   }
    // });
  }

  setUnitOrMoney(flag, val) {
    val = Number(val);
    if (flag === 'fromUnit') { // change from adhocUnit
      if (val || val > 0) {
        $('#adhocChargeRate').attr('readonly', '');
        this.calMoneyFromUnit(flag, 'UNIT_PAYMENT');
      } else if (!val || val === 0) {
        $('#adhocChargeRate').attr('readonly', null);
        this.formSave.patchValue({ adhocChargeRate: 0.00 });
      }
    } else if (flag === 'fromMoney') { // change from adhocChargeRate
      if (val || val > 0) {
        $('#adhocUnit').attr('readonly', '');
        this.calMoneyFromUnit(flag, 'AMOUNT_PAYMENT');
      } else if (!val || val === 0) {
        $('#adhocUnit').attr('readonly', null);
        this.formSave.patchValue({ adhocUnit: 0.00 });
      }
    }
  }

  calMoneyFromUnit(flag: any, key: string) {
    this.commonService.loading();
    this.ajax.doGet(`${URLS.GET_PAYMENT}/${key}`).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log('PAYMENT constantValue : ', res.data.constantValue);
        if (flag === 'fromUnit') {
          let cal = res.data.constantValue * this.formSave.get('adhocUnit').value
          this.formSave.patchValue({
            adhocChargeRate: Number(cal).toFixed(2)
          });
        } else {
          let cal = res.data.constantValue * this.formSave.get('adhocChargeRate').value
          this.formSave.patchValue({
            adhocUnit: cal
          });
        }

      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }



  setDate(control, e) {
    if (this.typeCustomer === 0) {
      this.formSave.get(control).patchValue(e);
    } else if (this.typeCustomer === 1) {
      this.formSave2.get(control).patchValue(e);
    }
    console.log(e);
  }

  // ============== manage file ===============
  onUpload = (event: any) => {
    const validateData = [
      { format: '', header: 'File', value: $('#file').val() }
    ];
    if (this.validate.checking(validateData)) {
      if ($('#file').val() == '') {
        return;
      } else {
        event.preventDefault();
        const form = $('#upload-form')[0];
        const formBody = new FormData(form);
        formBody.append('reqId', this.id);
        // call uploadFile
        this.uploadFile(formBody);
      }
    }
  }

  uploadFile(formBody: any) {
    this.commonService.loading();
    this.ajax.upload(URLS.UPLOAD, formBody, res => {
      if (MessageService.MSG.SUCCESS === res.json().status) {
        this.successModal.openModal();
        this.getFileList();
        $('#file').val('');
      } else {
        this.modalError.openModal('ไม่สามารถอัพโหลดไฟล์ได้');
      }
      this.commonService.unLoading();
    });
  }

  getFileList() {
    this.commonService.loading();
    this.ajax.upload(URLS.GET_FILE_LIST, { reqId: this.id }, res => {
      if (MessageService.MSG.SUCCESS === res.json().status) {
        this.datatableFile(res.json().data);
      } else {
        this.modalError.openModal(MessageService.MSG.FAILED_CALLBACK);
      }
      this.commonService.unLoading();
    });
  }

  getDetail() {
    this.commonService.loading();
    this.ajax.doGet(URLS.GET_DETAIL + this.id).subscribe(res => {
      if (MessageService.MSG.SUCCESS === res.status) {
        if (res.data.customerType === customerTypeDetail[0]) {
          console.log('ผู้ประกอบการ');
          this.typeCustomer = 0;
          this.formSave.patchValue(this.selfService.setValeSave1(res.data));
          let sumNoLg1 = 0;
          let sumNoLg2 = 0;
          let sumNoLg3 = 0;

          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          res.data.rateCharge.forEach(config => {
            const dataSave = {
              electricPhase: config.electricPhase.trim(),
              electricAmpere: config.electricAmpere.trim(),
              chargeType: config.chargeType,
              chargeRate: (Number(config.chargeRate)).toFixed(2),
              chargeVat: (Number(config.chargeVat)).toFixed(2),
              totalChargeRate: (Number(config.totalChargeRate)).toFixed(2),
            };
            this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
            this.serviceCharge.push(this.createCharge(dataSave));
            if (dataSave.chargeType !== chargeTypeLg) {
              sumNoLg1 += Number(dataSave.chargeRate);
              sumNoLg2 += Number(dataSave.chargeVat);
              sumNoLg3 += Number(dataSave.totalChargeRate);
            }

            sum1 += Number(dataSave.chargeRate);
            sum2 += Number(dataSave.chargeVat);
            sum3 += Number(dataSave.totalChargeRate);
          });
          this.sumChargeRateNoLg1 = sumNoLg1;
          this.chargeVatNoLg1 = sumNoLg2;
          this.totalChargeRateNoLg1 = sumNoLg3;

          this.sumChargeRate1 = sum1;
          this.chargeVat1 = sum2;
          this.totalChargeRate1 = sum3;
        } else if (res.data.customerType === customerTypeDetail[1]) {
          console.log('พนักงาน');
          this.typeCustomer = 1;
          this.formSave2.patchValue(this.selfService.setValeSave2(res.data));
          let sumNoLg1 = 0;
          let sumNoLg2 = 0;
          let sumNoLg3 = 0;

          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          res.data.rateCharge.forEach(config => {
            const dataSave = {
              electricPhase: config.electricPhase.trim(),
              electricAmpere: config.electricAmpere.trim(),
              chargeType: config.chargeType,
              chargeRate: (Number(config.chargeRate)).toFixed(2),
              chargeVat: (Number(config.chargeVat)).toFixed(2),
              totalChargeRate: (Number(config.totalChargeRate)).toFixed(2),
            };
            this.serviceCharge = this.formSave2.get('serviceCharge') as FormArray;
            this.serviceCharge.push(this.createCharge(dataSave));
            if (dataSave.chargeType !== chargeTypeLg) {
              sumNoLg1 += Number(dataSave.chargeRate);
              sumNoLg2 += Number(dataSave.chargeVat);
              sumNoLg3 += Number(dataSave.totalChargeRate);
            }

            sum1 += Number(dataSave.chargeRate);
            sum2 += Number(dataSave.chargeVat);
            sum3 += Number(dataSave.totalChargeRate);
          });
          this.sumChargeRateNoLg2 = sumNoLg1;
          this.chargeVatNoLg2 = sumNoLg2;
          this.totalChargeRateNoLg2 = sumNoLg3;

          this.sumChargeRate2 = sum1;
          this.chargeVat2 = sum2;
          this.totalChargeRate2 = sum3;
        }
      } else {
        this.modalError.openModal(MessageService.MSG.FAILED_CALLBACK);
      }
      this.commonService.unLoading();
    }, (err) => {
      console.error(err);
      this.modalError.openModal(err);
      this.commonService.unLoading();
    });
  }

  onClickDeleteFile() {
    this.deleteFile();
  }

  // =============== end manage file =============

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
          data: 'functionalLocation', className: 'text-left'
        }, {
          className: 'text-center',
          render() {
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



  datatableFile = (data: any[]) => {
    if (this.tableFile != null) {
      this.tableFile.destroy();
    }
    this.tableFile = $('#datatableFile').DataTable({
      ...this.commonService.configDataTable(),
      data: data, // <====== add data
      columns: [
        {
          data: 'reqFileName', className: 'text-left'
        }, {
          data: 'reqFileExtension', className: 'text-left'
        }, {
          data: 'createdDate', className: 'text-center'
        }, {
          className: 'text-center',
          render() {
            return `<button class="btn btn-info btn-sm" id="downloadfile" type="button">
                      <i class="fa fa-download" aria-hidden="true"></i> ดาวน์โหลดไฟล์
                    </button>
                    <button class="btn btn-outline-danger btn-sm" id="deletefile">
                      <i class="fa fa-trash-o" aria-hidden="true"></i> ลบ
                    </button>`;
          }
        },
      ],
    });
    // download file button
    this.tableFile.on('click', 'td > button#downloadfile', (event) => {
      const data2 = this.tableFile.row($(event.currentTarget).closest('tr')).data();
      console.log('download file : ', data2);
      this.downloadFile(data2.reqFileId);
    });
    // delete file button
    this.tableFile.on('click', 'td > button#deletefile', (event) => {
      const data3 = this.tableFile.row($(event.currentTarget).closest('tr')).data();
      this.reqFileId = data3.reqFileId;
      this.deleteFileModal.openModal();
    });
  }

  datatableCus() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    if (this.typeCustomer === 0) {
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
    } else if (this.typeCustomer === 1) {
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
            className: 'text-center',
            render(data, type, row, meta) {
              return `<button class="btn btn-primary btn-sm" type="button">เลือก</button>`;
            }
          },
        ],
      });
    }


    this.dataTable.on('click', 'td > button.btn-primary', (event) => {
      const data = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.setCustumerData(data);
      this.getContractNoList(data.partner);
    });
  }

  downloadFile(fileId) {
    window.open(AjaxService.CONTEXT_PATH + URLS.DOWNLOAD + fileId, "_blank");
  }

  setCustumerData(data) {
    if (this.typeCustomer === 0) {
      this.formSave.patchValue({
        customerCode: data.customerCode,
        customerName: data.customerName,
        customerBranch: `${data.adrKind} : ${data.address}`
      });
    } else if (this.typeCustomer === 1) {
      this.formSave2.patchValue({
        customerCode: data.customerCode,
        customerName: data.customerName,
      });
    }
    this.onCloseModal();
  }

  async getContractNoList(partner: any) {
    this.contractNoList = await this.selfService.getSapContractNo(partner);
  }

  async getRentalAreaList(event) {
    let contractNo = '0';
    if (Utils.isNotNull(event.target.value)) {
      contractNo = event.target.value;
    }
    this.rentalAreaList = await this.selfService.getRentalArea(contractNo);
  }

  findMeter(serialNo: string) {
    this.commonService.loading();
    const data = {
      newSerialNo: serialNo
    };
    this.ajax.doPost(URLS.FIND_METER, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        if (this.typeCustomer === 0) {
          this.formSave.patchValue({
            meterSerialNo: res.data.newSerialNo,
            meterType: res.data.newMeterType,
            meterName: res.data.newMeterName,
            installPosition: res.data.newMeterLocation,
          });
        } else if (this.typeCustomer === 1) {
          this.formSave2.patchValue({
            meterSerialNo: res.data.newSerialNo,
            meterType: res.data.newMeterType,
            meterName: res.data.newMeterName,
            installPosition: res.data.newMeterLocation,
          });
        }
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
      this.onCloseModal();
    });
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  async searchConfig() {
    this.commonService.loading();
    if (this.formServiceCharge.value.electricAmpere && this.formServiceCharge.value.electricPhase) {
      this.configList = await this.selfService.getConfig(
        this.formServiceCharge.value.electricAmpere, this.formServiceCharge.value.electricPhase
      );

      // this.formServiceCharge.patchValue({

      // });
    } this.commonService.unLoading();
  }

  async getCus() {
    if (this.typeCustomer === 0) {
      this.cusList = await this.selfService.getSapCus('B101');
    } else if (this.typeCustomer === 1) {
      this.cusList = await this.selfService.getSapCus('B3');
    }
    this.datatableCus();
  }

  deleteFile() {
    this.commonService.loading();
    this.ajax.doPost(URLS.DELETE_FILE, { reqFileId: this.reqFileId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.successModal.openModal();
        this.goLocation(this.id);
      } else {
        this.modalError.openModal(MessageService.MSG.FAILED_CALLBACK);
      }
      this.commonService.unLoading();
    });
  }


  addTypeMeter(event) {
    if (event.target.value === this.applyType[0]) {
      this.formSave.patchValue({
        meterSerialNo: '',
        meterType: 'Analog',
        meterName: '',
        installPosition: ''
      });
    } else {
      this.formSave.patchValue({
        meterSerialNo: '',
        meterType: '',
        meterName: '',
        installPosition: ''
      });
    }
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

  setDataBank(even) {
    console.log(even.target.value);
    if (even.target.value === this.paymentType[1]) {
      this.formSave.patchValue({
        remark: ''
      })
    }
  }


  adhocTypeCk(even) {
    console.log(even.target.value);
    this.formSave.patchValue({
      adhocUnit: '',
      adhocChargeRate: ''
    })
  }

  requestTypeCk(even) {
    console.log(even.target.value);
    this.formSave.patchValue({
      adhocType: '',
      adhocUnit: '',
      adhocChargeRate: ''
    })
  }



}
