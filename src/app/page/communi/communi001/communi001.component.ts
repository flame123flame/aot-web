import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/common/helper/utils';
import { AjaxService } from 'src/app/_service/ajax.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/_service/ common.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateService } from 'src/app/_service/validate.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Communi001Srevice } from './communi001.service';
import { MessageService } from 'src/app/_service/message.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-communi001',
  templateUrl: './communi001.component.html',
  styleUrls: ['./communi001.component.css'],
  providers: [Communi001Srevice]
})
export class Communi001Component implements OnInit {
  breadcrumb: any = [
    { label: "หมวดสื่อสาร", link: "/home/communi" },
    { label: "ขอใช้วิทยุมือถือ", link: "#" }
  ];

  /* datatable */
  table: any;
  dataTable: any;

  /* form */
  formSearch = new FormGroup({});
  mobileSerialNoList: FormArray = new FormArray([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonService,
    private selfService: Communi001Srevice,
    private toastr: ToastrService,
    private validate: ValidateService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.initialVariable();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.clickTdButton()
  }

  search() {
    this.selfService.search(this.formSearch).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.table = response.data;
        this.initDataTable();
      } else {

      }
    });
  }

  initDataTable(): void {
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
      data: this.table,
      columns: [
        {
          render: function (data, type, row, meta) {
            return `${row.entreprenuerCode} - ${row.entreprenuerName}`
          },
          // className: 'text-center'
        },
        {
          data: 'contractNo',
          className: 'text-center',
          render: renderString
        },
        {
          className: 'text-right',
          render: function (data, type, row, meta) {
            return renderNumber(row.phoneAmount);
          }
        },
        {
          className: 'text-right',
          render: function (data, type, row, meta) {
            return renderNumber(row.totalChargeRates, 2);
          }
        },
        {
          data: 'requestDateStr',
          className: 'text-center',
          render: renderString
        },
        {
          data: '',
          render: renderString
        },
        {
          data: '',
          render: renderString
        },
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            // <i class="fa fa-ban" aria-hidden="true"></i>
            return `
            <button type="button" class="btn btn-danger btn-sm" id="cancle">
            <i class="fa fa-times" aria-hidden="true"></i> ยกเลิกการใช้วิทยุมือถือ
            </button>`;
          }
        }
      ]
    });
  }

  clickTdButton() {
    this.dataTable.on("click", "td > button", e => {
      let dataRow = this.dataTable.row($(e.currentTarget).closest("tr")).data();
      const { id } = e.currentTarget;

      if (dataRow) {
        if (id.split("-")[0] === 'cancle') {
          this.routeTo('communi/communi002detail', dataRow.id);
          console.log(dataRow);
        }
      }
    });
  }

  routeTo(path: string, param?) {
    this.router.navigate([path], {
      queryParams: {
        param1: param
      }
    });
  }

  control(control: string) {
    return this.formSearch.get(control);
  }

  initialVariable() {
    this.formSearch = this.fb.group({
      id: [''],
      entreprenuerCode: [''],
      entreprenuerName: [''],
      phoneAmount: [''],
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
