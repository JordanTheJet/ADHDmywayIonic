import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router'
import {CognitoService} from '../cognito.service'
import {Storage} from '@ionic/storage'
import { AlertController, ToastController, Slides, Slide} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { RestapiService } from '../restapi.service'
import { AddTaskPage } from '../add-task/add-task.page';
import { ModalPage} from '../modal/modal.page';


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  slideOpts = {
    slidesPerView: 1.0,
    spaceBetween: 10,
    centeredSlides: true,
    pagination: true
  };
currentIndex: number;
inputStuff: string;
showData = 'string';
value = 0;
FullTasks= {}
totalTime: any
  constructor(private router: Router,
              private cognito: CognitoService,
              private storage: Storage,
              public alertController: AlertController,
              private restapi: RestapiService,
              private modal: ModalController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    
    // this.getVariable()
    // let taskNum = `task${this.restapi.userData.currentTaskNum}`
    // this.showData=this.restapi.userData.FullTasks[taskNum].taskName
    // console.log(this.showData)
    // console.log(typeof this.showData)

    // let taskLabel = document.getElementById("taskLabel")
    // let label = document.createElement("ion-label")
    // label.innerHTML = `${this.showData}`
    // taskLabel.appendChild(label)
  }

  getVariable() { 
    // ‘myVariable’ is the key that will let you store and grab your data
  this.storage.get('userData').then((data) => {
  console.log('myData: ', data);
  // place the stored data into the showData property
  this.showData = data;
  console.log(this.showData)
  }, (err) => {
  console.log(err);
  });
  }
  async showModal(){ 
    console.log("function ran")
    const modal = await this.modal.create({
      component: ModalPage
    });
    console.log("before modal present")
    await modal.present(); 
    console.log("after modal present")
  }
  getTime(){
this.storage.get('taskTime').then((data)=>{
  console.log('taskTime ', data);
  this.totalTime=data;
}, (err)=>{
  console.log(err)
})
}
  taskBuilder(){

  }

  saveVariable(){
    //myVariable is the key that will let you store and grab your data
    this.storage.set('myVariable', this.inputStuff).then((success) => {
      console.log('successfully stored');
      }, (err) => {
      console.log(err);
      });
  }
 

  async startTask(){

    let currentTaskName= `task${this.restapi.userData.currentTaskNum}`
    console.log(currentTaskName)
    console.log(this.restapi.userData)
    console.log("object that we are working on", this.restapi.userData.currentTaskNum)
    console.log("how many objects total", Object.keys(this.restapi.userData.FullTasks).length)
    if(this.restapi.userData.currentTaskNum==Object.keys(this.restapi.userData.FullTasks).length){
      let alert = await this.alertController.create({
        header: "Congratulations!",
       
        subHeader: "You are done with all of your tasks!",
        buttons: ['Dismiss']
      });
      await alert.present();
      return
    } else{
    if(this.restapi.userData.FullTasks[currentTaskName].status == "not done"){
    this.restapi.userData.FullTasks[currentTaskName].status = "doing"
    console.log(this.restapi.userData.FullTasks)
    this.restapi.postData(this.restapi.userData)
    this.showModal()
    }
    else if(this.restapi.userData.FullTasks[currentTaskName].status == "doing"){
      this.restapi.userData.FullTasks[currentTaskName].status = "done"
      this.restapi.userData.myPoints+= 200;
      this.restapi.userData.currentTaskNum++;
      this.restapi.updateTask()
      console.log(this.restapi.userData.currentTaskNum)

      //show the next task
    }else{
      let alert = await this.alertController.create({
        header: "Uhoh",
       
        subHeader: "Something went wrong",
        buttons: ['Dismiss']
      });
      await alert.present();
    }
  }
  }
  async addTask() {
    const alert = await this.alertController.create({
      header: 'Add Task Name',
      inputs: [
        //input name of the task
        {
          name: 'taskName',
          type: 'text',
          id: 'taskName',
          value: 'homework',
          placeholder: 'What are you going to do?'
        },
        // input date with min & max
        // {
        //   name: 'taskDate',
        //   type: 'date',
        //   id: 'taskDate',
        //   min: '2019-01-01',
        //   max: '2020-01-01',
        //   value: "myDate",
        //   placeholder: 'When are you going to do it? YYYY-MM-DD'
        // }
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
          handler: (data) => {
            data.status="not done"
          let taskName=`task${Object.keys(this.restapi.userData.FullTasks).length}`
          console.log(taskName)
          this.restapi.userData.FullTasks[taskName]=data
          console.log(this.restapi.userData)
          console.log('Confirm Ok');
          this.restapi.postData(this.restapi.userData)
            console.log(data);
            console.log('Confirm Ok');
            
          }
        }
      ]
    });
    await alert.present();
  }

  slideChanged(){
    this.slides.getActiveIndex().then(data => {
      console.log(data)
      this.currentIndex=data;
      console.log('Current index is', this.currentIndex);
    console.log(typeof this.currentIndex)
      });;
  }
  avatarSelect(){
    let avatarNum= this.slides.getActiveIndex()
    console.log(avatarNum)
  }
  purBtn(){
    console.log(typeof this.slides)
    console.log(this.slides)
    if(this.currentIndex<3){
    this.restapi.userData.myPoints= this.restapi.userData.myPoints-1000
    }else{
      this.restapi.userData.myPoints= this.restapi.userData.myPoints-500
    }
    // this.slides.lockSwipeToNext(true) 
    // makes it so that you cant swipe right
    // this.slides.slideNext()
    this.restapi.postData(this.restapi.userData)
  }
  gotoHome(){
    this.router.navigate(['/home'])
  }
  
  savePoints(){
    this.storage.set('points', this.restapi.userData.myPoints).then((success)=>{
      console.log('sucessfully stored'); 
    }, (err)=>{
      console.log(err); 
    });
  } 
 
  getPoints(){
    this.storage.get('points').then((data)=>{
      console.log('myData:', data)
      this.restapi.userData.myPoints = data; 
    }, (err)=> {
      console.log(err); 
    }); 
  }
 
   async pointToast(){
     const ptToast = await this.toastCtrl.create({
       message: "You did it! +300", 
       duration: 2000,
       position: "middle", 
       color: "danger"
       
 
     }); 
     ptToast.onDidDismiss().then(()=> {
       this.addpoints(); 
       this.savePoints();
       this.getPoints();
     })
 
     ptToast.present();   
   }
 
   addpoints(){
    this.restapi.userData.myPoints += 300;
   
   }

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
  this.router.navigate(['/gallery'])
// this.hideAvatar()
// this.hideCalendar()
// this.hideReport()
// let profile = document.getElementById("profile")
// profile.style.display="block"
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
