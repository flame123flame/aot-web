import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'modal-custom',
  templateUrl: './modalCustom.component.html',
  styleUrls: ['./modalCustom.component.css']
})
export class ModalCustomComponent implements OnInit {
  @ViewChild('modalCustom') mymodal: ElementRef;
  public modalRef: BsModalRef;
  
  @Input() header: string = '';
  @Input() body: string = 'กรุณายืนยันการทำรายการ';

  @Output() onConfirm: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: BsModalService) { }


  ngOnInit() {
    console.log("header : ", this.header);
  }

  openModal(){
    this.modalRef = this.modalService.show(this.mymodal);
  }
  onClick(key){
    this.modalRef.hide();
    switch (key) {
      case 'confirm':
        this.onConfirm.emit();
        break;
      case 'close':
          this.onClose.emit();
          break;
      default:
        break;
    }    
  }
}
