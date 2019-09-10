import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AjaxService } from 'src/app/_service/ajax.service';
import { ResponseData } from 'src/app/common/models/response-data.model';
import { CommonService } from 'src/app/_service/ common.service';
import { User } from 'src/app/_model/user';
import { UserService } from 'src/app/_service/user.service.';
import { catchError } from 'rxjs/operators';
import { ModalErrorComponent } from 'src/app/components/modal/modal-error/modalError.component';
import { ModalAlertComponent } from 'src/app/components/modal/modal-alert/modalAlert.component';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public imagePath: string;
  public username: string = '';
  public password: string = '';
  public modalRef: BsModalRef;
  public user: User = new User;
  public bodyModal:string = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
  constructor(private router: Router
    , private modalService: BsModalService
    , private ajax: AjaxService
    , private commonService: CommonService
    , private userSV: UserService) {

  }
  @ViewChild('errorModal') modalError: ModalAlertComponent;
  ngOnInit() {
    this.userSV.logout();
    this.imagePath = location.origin + location.pathname + '/assets/img/Logo_AOT.png';
  }

  login(template) {
    console.log("login");
    this.commonService.loading();
    let param = { username: this.username, password: this.password };
    this.ajax.doPostLogin("token/generate-token", param).subscribe((response: User) => {
      console.log("response", response);
      this.commonService.unLoading();
      console.log("response.authorities" , response.authorities);
      if (response) {
        if(!response.authorities){
          this.bodyModal = "ไม่มีสิทธิ์การเข้าใช้งาน";
          this.userSV.logout();
          this.modalError.openModal();
        }else{
          this.user.fullName = response.fullName;
          this.user.token = response.token;
          this.user.organizeCode = response.organizeCode;
          this.user.organizeDesc = response.organizeDesc;
          this.user.authorities = response.authorities;
          this.user.username = response.username;
          this.userSV.logIn(this.user);

          this.router.navigate(['/home']);
        }
        
      } else {
        this.userSV.logout();
      }// else

    }, // response
    error => 
    {
    //   console.log("error");
    //   console.error("err", error);
      this.userSV.logout();
      this.modalError.openModal();
    }
    
    ) ;// subscribe
  }
  

}
