import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it008detail',
  templateUrl: './it008detail.component.html',
  styleUrls: ['./it008detail.component.css']
})
export class It008detailComponent implements OnInit {

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
