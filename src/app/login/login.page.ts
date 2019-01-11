import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../cognito.service'
import {ToastController} from '@ionic/angular'
import { Router } from '@angular/router';
import { RestapiService } from '../restapi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
email: string;
password: string;
currentUser: string;
  constructor(public cognito: CognitoService,
              public router: Router,
              public toast: ToastController,
              public api: RestapiService) { }

  ngOnInit() {
    var autoUser= this.cognito.getAuthenticatedUser()
    console.log(autoUser)
    if (autoUser != null) {
      this.api.getData()
      setTimeout(() => {
        this.router.navigate(['/game'])
      }, 1000);
      
      autoUser.getSession(function(err, session) {
          if (err) {
              alert(err);
              return;
          }
          console.log(session)
          console.log('session validity: ' + session.isValid());
          let status= session.isValid().toString()
          console.log(status)
      });
    } else {
      console.log("there was no one signed in")
    }
    console.log("autosignin clicked")
  }
  
 
  login(){
    this.cognito.authenticate(this.email, this.password).then((res) =>{
      console.log("user logged in!")
      console.log(res)
      console.log(res['idToken']['jwtToken'])
      //  res.idToken.jwtToken;
    var currentUser = this.cognito.getAuthenticatedUser()
    console.log(currentUser)
      // localStorage.setItem("currentUser", currentUser)
      this.api.getData()
    console.log(this.api.userData)
    setTimeout(() => {
      this.router.navigate(['/game'])
    }, 1000);
    },(err)=>{
      this.loginErrToast()
      console.log("user not logged in!")
      console.log(err)
    })
  }

  
 goToSignup(){
   this.router.navigate(['/signup'])
 }
  async loginErrToast(){
    const loginToast = await this.toast.create({
      message: "Whoops! Your username or password is incorrect. Please try again.", 
      duration: 2000,
      position: "middle", 
      color: "secondary",

    }); 
    loginToast.present(); 
  }
  autoSignIn(){
    var autoUser= this.cognito.getAuthenticatedUser()
    console.log(autoUser)
    if (autoUser != null) {
      this.api.getData()
           console.log(this.api.userData)
           setTimeout(() => {
            this.router.navigate(['/game'])
          }, 1000);
      autoUser.getSession(function(err, session) {
          if (err) {
              alert(err);
              return;
          }
          console.log(session)
          console.log('session validity: ' + session.isValid());
          let status= session.isValid().toString()
          console.log(status)
          
          this.api.getData()
           console.log(this.api.userData)
          this.gotoGame();
            
          
      });
    } else {
      console.log("there was no one signed in")
    }
    console.log("autosignin clicked")
  }
}
