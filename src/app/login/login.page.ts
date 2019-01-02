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
  constructor(public cognito: CognitoService,
              public router: Router,
              public toast: ToastController,
              public api: RestapiService) { }

  ngOnInit() {
  }
  post(){
    this.api.postData()
  }
  get(){
    this.api.getData()
  }
  login(){
    this.cognito.authenticate(this.email, this.password).then((res) =>{
      console.log("user logged in!")
      console.log(res)
      console.log(res['idToken']['jwtToken'])
      //  res.idToken.jwtToken;
      // localStorage.setItem("currentUser", this.cognito.getAuthenticatedUser())
      this.gotoGame() 
    },(err)=>{
      console.log("user not logged in!")
      console.log(err)
    })
  }

  
  gotoGame(){
    this.router.navigate(['/game'])
  }


  autoSignIn(){
    var autoUser= this.cognito.getAuthenticatedUser()
    var loginUser= this.router.navigate(['/game'])
    // console.log(autoUser)
    if (autoUser != null) {
      autoUser.getSession(function(err, session) {
          if (err) {
              alert(err);
              return;
          }
          console.log(session)
          console.log('session validity: ' + session.isValid());
          let status= session.isValid().toString()
          console.log(status)
          console.log("true")
          if(status=="true"){
            loginUser
            console.log("they match")
          }
      });
    } else {
      console.log("there was no one signed in")
    }
    console.log("autosignin clicked")
  }
}
