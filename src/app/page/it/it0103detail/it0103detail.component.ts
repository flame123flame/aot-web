import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it0103detail',
  templateUrl: './it0103detail.component.html',
  styleUrls: ['./it0103detail.component.css']
})
export class It0103detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "กำหนดอัตราค่าภาระ การใช้บริการ Staff Page และ Public Page",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
