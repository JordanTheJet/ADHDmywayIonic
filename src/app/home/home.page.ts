import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {CognitoService} from '../cognito.service'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  email: string;
  password: string;
  currentUser: string;
  constructor(private router: Router, private cognito: CognitoService){
  }
  ngOnInit(){

  }
  goToLogin(){
    this.router.navigate(['/login'])
  }
  goToGame(){
    this.router.navigate(['/game'])
  }
  goToSignup() {
    this.router.navigate(['/signup'])
  }
  // goToLogin() {
  //   this.router.navigate(['/login'])
  // }


  logOut(){
    const currentUser = this.cognito.getAuthenticatedUser()
    if (currentUser != null) { // means that the currentUser constant has data in it
      // then log the user out
      currentUser.signOut();
      console.log('user is now logged out');
      } else { // anything else (likely that the currentUser constant has nothing in it
      // then just log that there is no current user at the moment
      console.log('no current user to logout');
      }
  }


  autoSignIn(){
    
    var loginUser= this.router.navigate(['/game'])
    console.log(autoUser)
    var autoUser= this.cognito.getAuthenticatedUser()
    console.log(autoUser)
    
    if (autoUser != null) {
      autoUser.getSession(function(err, session) {
          if (err) {
              alert(err);
              return;
          }
          console.log('session validity: ' + session.isValid()); //returns session validity is true/null
          let status= session.isValid().toString()
          console.log(status)
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
  login(){
    this.cognito.authenticate(this.email, this.password).then((res) =>{
      console.log("user logged in!")
      console.log(res)
      console.log(res['idToken']['jwtToken'])
      //  res.idToken.jwtToken;
    var currentUser = this.cognito.getAuthenticatedUser()
    console.log(currentUser)
      // localStorage.setItem("currentUser", currentUser)
      this.gotoGame() 
    },(err)=>{
      console.log("user not logged in!")
      console.log(err)
    })
  }
    
  gotoGame(){
    this.router.navigate(['/game'])
  }
}
