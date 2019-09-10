import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-water010',
  templateUrl: './water010.component.html',
  styleUrls: ['./water010.component.css']
})
export class Water010Component implements OnInit {
  showMainContent: Boolean = true;
  tabIdx: number = 1;
  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดน้ำประปา",
      link: "/",
    },
    {
      label: "ปรับปรุงอัตราค่าภาระรายเดือน",
      link: "#",
    },
   
  ];
  ngOnInit() {
   
  }
  public clickTap(idx){
    console.log(idx);
    this.tabIdx = idx;
  }

}
