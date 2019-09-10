import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-it010',
  templateUrl: './it010.component.html',
  styleUrls: ['./it010.component.css']
})
export class It010Component implements OnInit {
  showMainContent: Boolean = true;
  tabIdx: number = 1;
  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "ปรับปรุงอัตราค่าภาระการใช้บริการ IT",
      link: "#",
    }
  ];
  ngOnInit() {
   
  }
  public clickTap(idx){
    console.log(idx);
    this.tabIdx = idx;
  }
}
