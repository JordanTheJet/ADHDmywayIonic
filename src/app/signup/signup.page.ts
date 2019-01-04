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
  email: string; 
  password: string;
  postData: any;
  constructor(public cognitoService: CognitoService, 
              public alertCtrl: AlertController, 
              public router: Router,
              public api: RestapiService) { }

  ngOnInit() {
  }
  register1() { 
    // this.cognitoService.signUp(this.email, this.password).then( 
    //   res => { 
    //   this.promptVerificationCode(); 
    //   }, err => { 
    //   // user already exists! (if has same email, etc.) 
    //   // create warning here 
    //   console.log(err); 
    //   } 
    //   );
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
    this.router.navigate(['/login'])
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
    this.cognitoService.confirmUser(verificationCode, this.email).then( 
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
      // navigate to home page 
      this.router.navigate(['/home']); 
      }); 
      await alert.present();       
  }
}
