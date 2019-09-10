import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it008',
  templateUrl: './it008.component.html',
  styleUrls: ['./it008.component.css']
})
export class It008Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "ขอใช้บริการ Dedicated CUTE",
      link: "#",
    }
  ];

  ngOnInit() {
  }

}
