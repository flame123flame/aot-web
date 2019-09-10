import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heavyeqp001',
  templateUrl: './heavyeqp001.component.html',
  styleUrls: ['./heavyeqp001.component.css']
})
export class Heavyeqp001Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดเครื่องทุ่นแรง",
      link: "/home/heavyeqp",
    },
    {
      label: "รายได้ค่าบริการเครื่องทุ่นแรง",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
