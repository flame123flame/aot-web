import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { Water003detailService } from './water003detail.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_service/ common.service';
import { AjaxService } from 'src/app/_service/ajax.service';
import { ValidateService } from 'src/app/_service/validate.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageService } from 'src/app/_service/message.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalSuccessComponent } from 'src/app/components/modal/modal-success/modalSuccess.component';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modalConfirm.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
import { Utils } from 'src/app/common/helper';

declare var $: any;

const URLS = {
  GET_ALLMETER: 'water003/get_meter'
}
@Component({
  selector: 'app-water003detail',
  templateUrl: './water003detail.component.html',
  styleUrls: ['./water003detail.component.css'],
  providers: [Water003detailService]
})
export class Water003detailComponent implements OnInit, AfterViewInit {
  @ViewChild('errorModal') modalError: ModalErrorComponent;
  @ViewChild('saveModal') modalSave: ModalConfirmComponent;
  @ViewChild('successModal') successModal: ModalSuccessComponent;
  @ViewChild('alertModal') alertModal: ModalAlertComponent;
  userTypeDetail = ['C', 'E'];
  formSave: FormGroup = new FormGroup({});
  formServiceCharge: FormGroup = new FormGroup({});
  serviceCharge: FormArray = new FormArray([]);
  typeUser = 0;
  cusList: any[] = [];
  contractNoList: any[] = [];
  modalRef: BsModalRef;

  dataTable: any;
  datas: any[] = [];
  meterList: any[] = [];
  configList: any[] = [];
  sum: number;
  vat = 7;

  waterSizeList: any[] = [];
  otherList: any[] = [];
  selectOther: any[];
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


  breadcrumb: any = [
    {
      label: 'หมวดน้ำประปา',
      link: '/',
    }, {
      label: 'ขอใช้น้ำประปาและบริการอื่นๆ',
      link: '/water/water003',
    }, {
      label: 'เพิ่มขอใช้น้ำประปาและบริการอื่นๆ',
      link: '#',
    },
  ];


  constructor(
    private selfService: Water003detailService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private ajax: AjaxService,
    private validate: ValidateService,
    private modalService: BsModalService,
  ) {
    // set form save
    this.formSave = this.formBuilder.group(this.selfService.getFormSave());
    this.getDropDown();
    this.getAllMeter();
    this.formServiceCharge = this.formBuilder.group({
      waterPhase: [],
      chargeType: [],
      waterAmpere: [],
      chargeRate: [],
      chargeVat: [],
      totalChargeRate: [],
    });
    this.getWaterSize();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    $('#date1').Zebra_DatePicker();
    $('#date2').Zebra_DatePicker();
  }

  getWaterSize() {
    this.selfService.getWaterSize().subscribe((res: ResponseData<any>) => {
      this.waterSizeList = res.data;
    });
  }

  // getDropDown FUNCTION
  async getDropDown() {
    // get ELECTRIC_RATE_TYPE List
    this.electricRateTypeList = await this.selfService.getParams('ELECTRIC_RATE_TYPE');
    // get PAYMENT_TYPE List
    this.paymentTypeList = await this.selfService.getParams('PAYMENT_TYPE');
    // get REQUEST_TYPE List
    this.requestTypeList = await this.selfService.getParams('REQUEST_TYPE_WATER');
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
  }

  setDate(control, e) {
    this.formSave.get(control).patchValue(e);
  }

  openModalCustom2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    this.getCus();
  }

  async getCus() {
    if (this.typeUser === 0) {
      this.cusList = await this.selfService.getSapCus('B101');
    } else if (this.typeUser === 1) {
      this.cusList = await this.selfService.getSapCus('B3');
    }

    this.datatableCus();
  }

  async getContractNoList(partner: any) {
    this.contractNoList = await this.selfService.getSapContractNo(partner);
  }

  datatableCus() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    if (this.typeUser === 0) {
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
            data: 'adrKind', className: 'text-center'
          }, {
            data: 'address', className: 'text-left'
          }, {
            className: 'text-center',
            render(data, type, row, meta) {
              return `<button class="btn btn-primary btn-sm" type="button">เลือก</button>`;
            }
          },
        ],
      });


    } else if (this.typeUser === 1) {
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

  setCustumerData(data) {

    if (this.typeUser === 0) {
      this.formSave.patchValue({
        userCode: data.customerCode,
        userName: data.customerName,
        branch: data.adrKind + " : " + data.address
      });

    } else if (this.typeUser === 1) {
      this.formSave.patchValue({
        userCode: data.customerCode,
        userName: data.customerName,
      });
    }
    this.onCloseModal();
  }

  async openModalCustom(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.datas = this.meterList.filter(v => {
      // return v.serialNo != this.formGroup.get('oldSerialNo').value;
      return v.serialNo;
    });
    await this.getAllMeter();
  }

  getAllMeter() {
    this.commonService.loading();
    this.meterList = [];
    this.ajax.doGet(URLS.GET_ALLMETER).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.meterList = res.data;
        this.initDataTable();
      } else {
        this.modalError.openModal(res.message);
      }
      this.commonService.unLoading();
    });
  }

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
      this.selectMeter(data);
    });
  }

  selectOtherFunc(select: string) {
    console.log(select);
    const selectData = this.otherList.filter((data: any) => {
      return data.waterType === select;
    });
    this.formServiceCharge.patchValue({
      chargeType: selectData[0].waterType,
      chargeRate: Number(selectData[0].chargeRates).toFixed(2),
      chargeVat: (Number(selectData[0].chargeRates) * this.vat / 100).toFixed(2),
      totalChargeRate: (Number(selectData[0].chargeRates) * (this.vat + 100) / 100).toFixed(2),
    });
  }

  selectMeter(res) {
    if (this.typeUser === 0) {
      this.formSave.patchValue({
        meterSerialNo: res.serialNo,
        meterType: res.meterType,
        meterName: res.meterName,
        installPosition: res.meterLocation,
      });
    } else if (this.typeUser === 1) {
      this.formSave.patchValue({
        meterSerialNo: res.serialNo,
        meterType: res.meterType,
        meterName: res.meterName,
        installPosition: res.meterLocation,
      });
    }
    this.onCloseModal();
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  showModal() {
    this.formServiceCharge.reset();
    this.commonService.loading();
    this.selfService.getOtherList().subscribe((res: any) => {
      this.otherList = res.data;
      $('#myModal').modal('show');
      this.commonService.unLoading();
    });
  }

  hideModal() {
    $('#myModal').modal('hide');
  }

  async searchConfig() {
    this.commonService.loading();
    if (this.formServiceCharge.value.waterAmpere && this.formServiceCharge.value.waterPhase) {
      this.configList = await this.selfService.getConfig(
        this.formServiceCharge.value.waterAmpere, this.formServiceCharge.value.waterPhase
      );
    } this.commonService.unLoading();
  }

  addServiceCharge() {
    this.hideModal();
    const check = this.formSave.value.serviceCharge.filter((item) => {
      return item.chargeType === this.formServiceCharge.value.chargeType;
    });
    console.log(check);
    if (check.length !== 0 || !this.formServiceCharge.value.chargeType) {
      return;
    }
    this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    this.serviceCharge.push(this.createCharge(this.formServiceCharge.value));
    let sum = 0;
    this.formSave.value.serviceCharge.forEach((item) => {
      sum += Number(item.totalChargeRate);
    });
    this.sum = sum;
  }

  searchRate() {
    const data = this.waterSizeList.filter((dataFil) => {
      return dataFil.waterMaintenanceConfigId === this.formSave.value.meterType;
    });
    console.log(data[0].waterMeterSize);
    this.ajax.doPost('water003/getRateConfig', data[0].waterMeterSize).subscribe((res: ResponseData<any>) => {
      this.formSave.patchValue({
        insuranceRates: (Number(res.data.insuranceRates)).toFixed(2),
        vatInsurance: (Number(res.data.insuranceRates) * this.vat / 100).toFixed(2),
        totalInsuranceChargeRates: (Number(res.data.insuranceRates) * (100 + this.vat) / 100).toFixed(2),
        installRates: (Number(res.data.installRates)).toFixed(2),
        vatInstall: (Number(res.data.installRates) * this.vat / 100).toFixed(2),
        totalInstallChargeRates: (Number(res.data.installRates) * (100 + this.vat) / 100).toFixed(2),
      });
      this.formSave.get('totalChargeRates').patchValue(
        (Number(this.formSave.value.totalInsuranceChargeRates) + Number(this.formSave.value.totalInstallChargeRates)).toFixed(2)
      );
    });
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
    this.serviceCharge = this.formSave.get('serviceCharge') as FormArray;
    this.serviceCharge.removeAt(index);
  }

  onCkeckValidator() {
    this.formSave.patchValue({ typeUser: this.userTypeDetail[this.typeUser] });
    let validateData;
    if (this.typeUser === 0) {
      validateData = [
        { format: '', header: 'รหัสผู้ประกอบการ', value: this.formSave.value.userCode },
        { format: '', header: 'ชื่อผู้ประกอบการ', value: this.formSave.value.userName },
        { format: '', header: 'สาขา', value: this.formSave.value.branch },
        { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
        { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
        { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },
      ];
      if (!this.validate.checking(validateData)) {
        return;
      }
      if (this.formSave.value.requestType === 'ขอใช้เหมาจ่าย') {
        validateData = [
          { format: '', header: 'ประเภทเหมาจ่าย', value: this.formSave.value.adhocType },
          { format: '', header: 'จำนวนหน่วย', value: this.formSave.value.adhocUnit },
          { format: '', header: 'อัตราค่าภาระ', value: this.formSave.value.sumChargeRate },
          { format: '', header: 'สถานที่ใช้น้ำ', value: this.formSave.value.installPosition },
        ];
        if (!this.validate.checking(validateData)) {
          return;
        }
        if (this.formSave.value.adhocType === '0') {
          validateData = [
            { format: '', header: 'จำนวนคน', value: this.formSave.value.personUnit },
          ];
          if (!this.validate.checking(validateData)) {
            return;
          }
        }
      } else if (this.formSave.value.requestType === 'อื่น ๆ') {
      } else {
        validateData = [
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterSerialNo },
          { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterName },
        ];
        if (!this.validate.checking(validateData)) {
          return;
        }
      }
    } else if (this.typeUser === 1) {
      validateData = [
        { format: '', header: 'รหัสพนักงาน', value: this.formSave.value.userCode },
        { format: '', header: 'ชื่อผู้พนักงาน', value: this.formSave.value.userName },
        { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterSerialNo },
        { format: '', header: 'Serial No. มิเตอร์', value: this.formSave.value.meterName },
        { format: '', header: 'วันที่ขอใช้บริการ', value: this.formSave.value.requestStartDate },
        { format: '', header: 'วันที่สิ้นสุดการใช้บริการ', value: this.formSave.value.requestEndDate },

        // { format: '', header: 'ประเภทที่ขอใช้', value: this.formSave.value.requestType },
        // { format: '', header: 'การนำมาใช้มิเตอร์', value: this.formSave.value.applyType },
        // { format: '', header: 'ประเภทอัตราไฟฟ้า', value: this.formSave.value.electricRateType },
        // { format: '', header: 'ประเภทค่าไฟฟ้า', value: this.formSave.value.electricVoltageType },
        // { format: '', header: 'ประเภทเหมาจ่าย', value: this.formSave.value.adhocType },
        // { format: '', header: 'จำนวนหน่วย', value: this.formSave.value.adhocUnit },
        // { format: '', header: 'จำนวนหน่วย', value: this.formSave.value.adhocChargeRate },
        // { format: '', header: 'หมายเหตุ', value: this.formSave.value.remark },
      ];
      if (!this.validate.checking(validateData)) {
        return;
      }
    }
    this.modalSave.openModal();
  }

  onSave() {
    if (this.typeUser === 0) {
      this.formSave.patchValue({ userType: this.userTypeDetail[this.typeUser] });
    } else if (this.typeUser === 1) {
      this.formSave.patchValue({ userType: this.userTypeDetail[this.typeUser] });
    }

    this.selfService.saveService(this.formSave.value)
      .subscribe((data: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === data.status) {
          this.successModal.openModal();
          this.goLocation(data.data.reqId);
        } else {
          this.alertModal.openModal();

        }
      });
  }

  goLocation(reqId: any) {
    // this.isUploadFile = true;
    // this.getFileList();
    this.router.navigate(['/water/water003'], {
      queryParams: {
        id: reqId
      }
    });
  }
}
