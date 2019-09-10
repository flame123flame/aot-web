import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it0101detail',
  templateUrl: './it0101detail.component.html',
  styleUrls: ['./it0101detail.component.css']
})
export class It0101detailComponent implements OnInit {

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
