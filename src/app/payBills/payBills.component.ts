import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../userService.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { BillServiceService } from './billService.service';
import { environment } from 'src/environments/environment';
import { patientPageImages } from 'src/environments/environment.development';

@Component({
  selector: 'app-payBills',
  templateUrl: './payBills.component.html',
  styleUrls: ['./payBills.component.css']
})
export class PayBillsComponent implements OnInit {

  payBillImg=patientPageImages
  loggedInUser:any=""
  refereshData:any=""
  historyPayment:any=""
  baseUrl:any=environment.getUrl;
  showStatus:any="true"
  history:any=""
  constructor(private userServeice:UserServiceService, private route:Router,private fb:FormBuilder,
    private http:HttpClient, private service:BillServiceService) { }

  ngOnInit() {
    const sessionUser = sessionStorage.getItem('loggedInUser');
    if (sessionUser) {
      this.loggedInUser = JSON.parse(sessionUser);
    }
    else if (this.userServeice.loggedInUser !== null) {
      this.loggedInUser = this.userServeice.loggedInUser;
    } else {
      alert('You are Loggedout. Login to continue');
      this.route.navigate(['/login']);
    }

    this.http.get<any>(environment.getPatientRegistrationDetails).subscribe(data=>{
        const value=data.find((item1:any)=>{
          return item1.email===this.loggedInUser.email
        })
        if(value){
          this.refereshData=value
        }
    });
    this.http.get<any>(environment.getPaymentHistoryDetails).subscribe(val=>{
        const history=val.find((item2:any)=>{
          return item2.email===this.loggedInUser.email
        })
        if(history){
          this.historyPayment=history
        }
    });
    this.service.searchPayment(this.loggedInUser.phone).subscribe((value)=>{
      this.history=value;
    })

  }

  paying=this.fb.group({
    totalPay:[,]
  })
  debitCardForm=this.fb.group({
    cardNumber:[,[Validators.required]],
    expireDate:[,[Validators.required]],
    ccvNumber:[,[Validators.required]]
  })
  pay(user:any){
    var body={
      patientName:user.patientName,
      email:user.email,
      phone:user.phone,
      appointmentDate:user.appointmentDate,
      doctorField:user.doctorField,
      doctorName:user.doctorName,
      consultingFee:user.consultingFee,
      otherFee:user.otherFee,
      Total:user.Total,
      paymentStatus:"Success"
    }
    this.http.post<any>(environment.getPaymentHistoryDetails, body).subscribe(data=>{
      alert("Posted to payHistory DB");
      // this.showStatus="true";
    });
    this.unPaid()
  }

  // Send the message to ADMIN
  unPaid(){
    this.http.get<any>(environment.getPatientRegistrationDetails).subscribe((get)=>{
      const getting=get.find((item:any)=>{
        return this.loggedInUser.phone==item.phone
      })
      if(getting){
        this.compare(getting)
      }
    })
  }
  compare(value:any){
    this.http.get<any>(environment.getBillDetails).subscribe((val)=>{
      const findId=val.find((item:any)=>{
        this.ngOnInit
        return (item.mobileNo===value.phone && item.appointmentDate===value.appointmentDate && item.Total===value.Total)
      });
      if(findId){
        this.paid(findId);
      }
    });
  }
  paid(findId:any){
    var body={
      paymentStatus:"Paid"
    }
    this.http.patch<any>(environment.getBillDetails+findId.id,body).subscribe(()=>{
      alert("Paided to admin");
      this.sample();

    })
  }
  sample(){
    var value={
      appointmentDate:"",
      doctorField:"",
      doctorName:"",
      consultingFee:"",
      otherFee:"",
      Total:"",
      attemptStatus:"false",
      appointmentTime:"",
      appStatus:"",
      remarkMessage:""
    }

        this.http.patch<any>(`${environment.getPatientRegistrationDetails}${this.loggedInUser.id}`,value).subscribe(()=>{
          alert("Updated to Patient DB");
          this.ngOnInit();
        })

  }
}
