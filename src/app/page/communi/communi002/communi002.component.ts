import { Component, OnInit } from '@angular/core';
import { Communi002Service } from './communi002.service';
import { CommonService } from 'src/app/_service/ common.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Communi002detailService } from '../communi002detail/communi002detail.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidateService } from 'src/app/_service/validate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { MessageService } from 'src/app/_service/message.service';
import { Utils } from 'src/app/common/helper';
declare var $: any;
@Component({
  selector: 'app-communi002',
  templateUrl: './communi002.component.html',
  styleUrls: ['./communi002.component.css'],
  providers: [Communi002Service]
})
export class Communi002Component implements OnInit {
  breadcrumb: any = [
    { label: "หมวดสื่อสาร", link: "/home/communi" },
    { label: "ขอยกเลิกการใช้วิทยุมือถือ", link: "#" },
  ];
  /* datatable */
  table: any;
  dataTable: any;

  /* form */
  formSearch = new FormGroup({});
  mobileSerialNoList: FormArray = new FormArray([]);

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private selfService: Communi002Service,
    private modalService: BsModalService,
    private validate: ValidateService,
    private router: Router,
    private route: ActivatedRoute,
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
          }
        },
        {
          data: 'contractNo',
          className: 'text-center',
          render: renderString
        },
        {
          render: function (data, type, row, meta) {
            return renderNumber(row.phoneAmount);
          },
          className: 'text-right',
        },
        {
          data: 'cancelDateStr',
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
        // {
        //   className: "text-center",
        //   render: (data, type, full, meta) => {
        //     // <i class="fa fa-ban" aria-hidden="true"></i>
        //     return `
        //     <button type="button" class="btn btn-danger btn-sm" id="cancle">
        //     <i class="fa fa-times" aria-hidden="true"></i> ยกเลิกการใช้วิทยุมือถือ
        //     </button>`;
        //   }
        // }
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
      mobileSerialNo: [0],
      chargeRates: [''],
      insuranceRates: [''],
      totalChargeRates: [''],
      remark: [''],
      totalChargeAll: [''],
      airport: [''],
      customerBranch: [''],
      cancelDateStr: [''],
    });
  }
}
