import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it004',
  templateUrl: './it004.component.html',
  styleUrls: ['./it004.component.css']
})
export class It004Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "ขอใช้บริการ IT อื่นๆ",
      link: "#",
    }
  ];
}
