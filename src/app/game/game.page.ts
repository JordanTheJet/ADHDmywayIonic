import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {CognitoService} from '../cognito.service'
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(private router: Router, private cognito: CognitoService) { }

  ngOnInit() {
  }

  gotoHome(){
    this.router.navigate(['/home'])
  }
  
  get(){}

hideCalendar(){
  let calendar = document.getElementById("calendar")
  calendar.style.display="none"
}
hideProfile(){
  let profile = document.getElementById("profile")
  profile.style.display="none"
}
hideAvatar(){
  let avatar = document.getElementById("avatar")
  avatar.style.display="none"
}
hideReport(){
  let report = document.getElementById("report")
  report.style.display="none"
}
switchToCalendar(){
this.hideProfile()
this.hideReport()
this.hideAvatar()
let calendar = document.getElementById("calendar")
calendar.style.display= "block"
}
switchToProfile(){
this.hideAvatar()
this.hideCalendar()
this.hideReport()
let profile = document.getElementById("profile")
profile.style.display="block"
}
switchToAvatar(){
this.hideProfile()
this.hideCalendar()
this.hideReport()
let avatar = document.getElementById("avatar")
avatar.style.display="block"
}
switchToReport(){
this.hideProfile()
this.hideCalendar()
this.hideAvatar()
let report = document.getElementById("report")
report.style.display="block"
}


segmentChanged(tab){
  let medQ = document.getElementById('QuestionList')
  let Achievements = document.getElementById('AchievementList')
  let contentValue=tab.detail.value
console.log(contentValue)
  if(contentValue=="Achievements"){
    console.log("achievement tag is chosen")
    medQ.style.display ='none'
    Achievements.style.display ='block'
  }else if(contentValue=="MedQ"){
    console.log("medQ is chosen")
    Achievements.style.display ='none'
    medQ.style.display ='block'
  }else{
    console.log("something went wrong")
  }
  
}
}
