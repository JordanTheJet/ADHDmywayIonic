import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../cognito.service'
import { AlertController, ToastController } from '@ionic/angular'; 
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
  postData: any;
  userData = {
    "Email": "",
    "FirstName": "",
    "LastName": "",
    "ZipCode": 0,
    "UserName": "",
    "myPoints": 1000,
    "FullTasks": {},
    "MedicalQ": {},
    "currentTaskNum": 0
  }
  constructor(public cognitoService: CognitoService, 
              public alertCtrl: AlertController, 
              public router: Router,
              public api: RestapiService,
              public toastCtrl: ToastController) { }

  ngOnInit() {
  }
  register1() { 
    this.cognitoService.signUp(this.email, this.password).then( 
      res => { 
      this.promptVerificationCode(); 
      let info1 = document.getElementById("info1")
      info1.style.display="none"    
      let info2 = document.getElementById("info2")
      info2.style.display="block"
      }, err => { 
        if(err.code=="UsernameExistsException"){
          this.promptVerificationCode();
        }else if(err.code=="InvalidPasswordException"){
          this.signupErrToast()
        }

      // user already exists! (if has same email, etc.) 
      // create warning here 
      //put toast here
      
      console.log(err); 
      } 
      );
     
  }
  async signupErrToast(){
    const signUpToast = await this.toastCtrl.create({
      message: "Password needs at least 8 letters and a symbol.", 
      duration: 2000,
      position: "middle", 
      color: "secondary",
     
    }); 
    signUpToast.present(); 

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
    this.api.postData(this.userData)
    this.router.navigate(['/login'])
  }

  taskBuilder(){
    let currentTaskName= "task0"
    
    let dummyTask = {
      "taskName": "Present our app",
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
      let info1 = document.getElementById("info1")
      info1.style.display="block"    
      let info2 = document.getElementById("info2")
      info2.style.display="none"
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
    this.cognitoService.confirmUser(verificationCode, this.email).then( 
      res => { 
      console.log(res); // prints SUCCESS 
      // on success present a new alert that says they are 
      // successfully registered 
      // then redirect to "home" page on dismiss of this alert 
      this.successAlert(); 
      }, err => { 
        let info1 = document.getElementById("info1")
      info1.style.display="block"    
      let info2 = document.getElementById("info2")
      info2.style.display="none"
      alert(err.message); 
      } 
      ); 
      
  }
  async successAlert() { 
    const alert = await this.alertCtrl.create({ 
      header: "Success", 
      message: "You are now registered to ADHDmyway!", 
      buttons: ["Get Started!"] 
      }); 
      alert.onDidDismiss().then( () => { 
      // navigate to home page 
      // this.router.navigate(['/home']); 
      }); 
      await alert.present();       
  }
}
