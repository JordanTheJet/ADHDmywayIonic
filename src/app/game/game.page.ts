import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {CognitoService} from '../cognito.service'
import {Storage} from '@ionic/storage'
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
inputStuff: string;
showData: string;
  constructor(private router: Router,
              private cognito: CognitoService,
              private storage: Storage,
              public alertController: AlertController) { }

  ngOnInit() {
    
  }
  saveVariable(){
    //myVariable is the key that will let you store and grab your data
    this.storage.set('myVariable', this.inputStuff).then((success) => {
      console.log('successfully stored');
      }, (err) => {
      console.log(err);
      });
  }
  getVariable() { 
    // ‘myVariable’ is the key that will let you store and grab your data
  this.storage.get('myVariable').then((data) => {
  console.log('myData: ', data);
  // place the stored data into the showData property
  this.showData = data;
  }, (err) => {
  console.log(err);
  });
  }

  async addTask(){
    const alert = await this.alertController.create({
      header: 'Add Task Name and Date',
      inputs: [
        
        {
          name: 'name2',
          type: 'text',
          id: 'taskName',
          value: 'homework',
          placeholder: 'What are you going to do?'
        },
        // input date with min & max
        {
          name: 'dateInput',
          type: 'date',
          id: 'taskDate',
          min: '2017-03-01',
          max: '2019-01-12',
          placeholder: 'When are you going to do it? YYYY-MM-DD'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
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
