import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it005',
  templateUrl: './it005.component.html',
  styleUrls: ['./it005.component.css']
})
export class It005Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }
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
}
