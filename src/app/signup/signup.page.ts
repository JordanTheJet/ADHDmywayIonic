import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../cognito.service'
import { AlertController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import { RestapiService } from '../restapi.service'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  userName: string;
  zipCode: number;
  firstName: string;
  lastName: string;
  email: string; 
  password: string;
  userData = {
    "Email": "",
    "FirstName": "",
    "LastName": "",
    "ZipCode": 0,
    "UserName": "",
    "myPoints": 0,
    "FullTasks": {},
    "MedicalQ": {},
    "currentTaskNum": 0
  }
  constructor(public cognito: CognitoService, 
              public alertCtrl: AlertController, 
              public router: Router,
              public api: RestapiService) { }

  ngOnInit() {
  }
  register1() { 
      let info1 = document.getElementById("info1")
      info1.style.display="none"    
      let info2 = document.getElementById("info2")
      info2.style.display="block"
  }
  register2(){
    let info2 = document.getElementById("info2")
      info2.style.display="none"
      let info3 = document.getElementById("info3")
      info3.style.display="block"
  }
  register3(){
    this.userData.Email=this.email;
    this.userData.UserName=this.userName;
    this.userData.ZipCode=this.zipCode;
    this.userData.FirstName=this.firstName;
    this.userData.LastName=this.lastName;
    this.taskBuilder()
    console.log(this.userData)
      this.cognito.signUp(this.email, this.password).then( 
      res => { 
      this.promptVerificationCode(); 
      }, err => { 
      // user already exists! (if has same email, etc.) 
      // create warning here 
      console.log(err); 
      } 
      );
    
  }

  taskBuilder(){
    let currentTaskName= "task0"
    
    let dummyTask = {
      "taskName": "finish the app",
      "status": "not done"
    }
    this.userData.FullTasks[currentTaskName]=dummyTask
  }
  
  async promptVerificationCode() { 
    let alert = await this.alertCtrl.create({ 
      message: "Enter Verfication Code", 
      inputs: [ // the input is for the user to enter their code 
      { 
      name: "VerificationCode", 
      placeholder: "Verification Code" 
      } 
      ], buttons: [ // buttons are used as two objects 
      { 
      text: "Cancel", 
      role: "cancel", 
      handler: data => { // when the user presses Cancel 
      console.log("Cancel clicked"); 
      } 
      }, { 
      text: "Verify", 
      handler: data => { // when the user presses Verify 
      this.verifyUser(data.VerificationCode); 
      } 
      } 
      ] 
      }); 
      await alert.present();
      
  }
  verifyUser(verificationCode) { 
    this.cognito.confirmUser(verificationCode, this.email).then( 
      res => { 
      console.log(res); // prints SUCCESS 
      // on success present a new alert that says they are 
      // successfully registered 
      // then redirect to "home" page on dismiss of this alert 
      this.successAlert(); 
      }, err => { 
      alert(err.message); 
      } 
      ); 
      
  }
  async successAlert() { 
    const alert = await this.alertCtrl.create({ 
      header: "Success", 
      message: "You are now registered!", 
      buttons: ["Sweet!"] 
      }); 
      alert.onDidDismiss().then( () => { 
        this.cognito.authenticate(this.email, this.password).then((res) =>{
          console.log("user logged in!")
          console.log(res)
          console.log(res['idToken']['jwtToken'])
          //  res.idToken.jwtToken;
        var currentUser = this.cognito.getAuthenticatedUser()
        console.log(currentUser)
          // localStorage.setItem("currentUser", currentUser)
        },(err)=>{
          console.log("user not logged in! Somethings really wrong")
          console.log(err)
        })

      this.api.postData(this.userData)
      // navigate to home
      this.router.navigate(['/home'])
      
      }); 
      await alert.present();       
  }
  
}
