import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-it005detail',
  templateUrl: './it005detail.component.html',
  styleUrls: ['./it005detail.component.css']
})
export class It005detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: " ขอใช้บริการห้องฝึกอบรม CUTE",
      link: "#",
    }
  ];
  ngOnInit() {
  }

  ShowModal(){
    $('#myModal').modal('show')
  }
  HideModal(){
    $('#myModal').modal('hide')
  }


}
