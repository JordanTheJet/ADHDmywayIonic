import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router'
import {CognitoService} from '../cognito.service'
import {Storage} from '@ionic/storage'
import { AlertController, ToastController, Slides, Slide} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { RestapiService } from '../restapi.service'
import { AddTaskPage } from '../add-task/add-task.page';
import { ModalPage} from '../modal/modal.page';
import { PhotoService } from '../photo.service';


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
dob: any;
feet: number;
inches: number;
weight: number;
medication: string;
dosage: number;
frequency: number;

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
              private toastCtrl: ToastController,
              public photoService: PhotoService) { }

  ngOnInit() {
    this.photoService.loadSaved();
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
    this.switchToProfile()
    }
    else if(this.restapi.userData.FullTasks[currentTaskName].status == "doing"){
      this.restapi.userData.FullTasks[currentTaskName].status = "done"
      //show hide next planet
      let planet1 = document.getElementById("planet1")
      let planet2 = document.getElementById("planet2")
      let planet3 = document.getElementById("planet3")
      let planet4 = document.getElementById("planet4")
      if(planet1.style.display=="block"){
        planet1.style.display="none"
        planet2.style.display="block"
        console.log("show planet 2")
      }else if(planet2.style.display=="block"){
        planet2.style.display="none"
        planet3.style.display="block"
        console.log("show planet 3")
      }else if(planet3.style.display=="block"){
        planet3.style.display="none"
        planet4.style.display="block"
        console.log("show planet 4")
      }else if(planet4.style.display=="block"){
        planet4.style.display="none"
        planet1.style.display="block"
        console.log("show planet 1")
      }else{
        console.log("something wrong with show hide")
      }
      this.pointToast()
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
          // value: 'homework',
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
    let chip = document.getElementById("avatarChip")
      let ann = document.getElementById("avatarAnn")
      let andy = document.getElementById("avatarAndy")
      let orange = document.getElementById("avatarOrange")
    if(this.currentIndex==0){
      ann.style.display="none"
      andy.style.display="none"
      orange.style.display="none"
      chip.style.display="block"
      console.log("show chip")
    }else if(this.currentIndex==1){
      chip.style.display="none"
      andy.style.display="none"
      orange.style.display="none"
      ann.style.display="block"
      console.log("show ann")
    }else if(this.currentIndex==2){
      ann.style.display="none"
      chip.style.display="none"
      orange.style.display="none"
      andy.style.display="block"
      console.log("show andy")
    }else if(this.currentIndex==3){
      ann.style.display="none"
      andy.style.display="none"
      chip.style.display="none"
      orange.style.display="block"
      console.log("show orange")
    }else{
      console.log("something wrong with show hide profile")
    }
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
       message: "You did it! +200", 
       duration: 2000,
       position: "middle", 
       color: "danger"
       
     }); 
     ptToast.onDidDismiss().then(()=> {
       this.addpoints200(); 
       this.savePoints();
       this.getPoints();
     })
 
     ptToast.present();   
   }
 
   addpoints200(){
    this.restapi.userData.myPoints += 200;
   
   }
   addpoints20(){
    this.restapi.userData.myPoints += 20
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
  // this.router.navigate(['/gallery'])
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
gotoGallery(){
  this.router.navigate(['/gallery'])
}
}
