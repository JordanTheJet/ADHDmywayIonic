import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  CognitoService
} from '../cognito.service';
import {Storage} from '@ionic/storage';
import {
  AlertController
} from '@ionic/angular';
import {
  ModalController
} from '@ionic/angular';
import {
  RestapiService
} from '../restapi.service'
import {
  ModalPage
} from '../modal/modal.page';
import {
  Observable
} from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { DatatrackerService } from '../datatracker.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  autoUser = this.cognito.getAuthenticatedUser().getUsername()
  userData = {
    "Email": this.autoUser,
    "FirstName": "",
    "LastName": "",
    "ZipCode": 0,
    "UserName": "",
    "myPoints": 0,
    "FullTasks": {},
    "MedicalQ": {},
    "currentTaskNum": 0
  }
  
  inputStuff: string;
  showData: string;
  // downloadData: any;
  value = 0;
  FullTasks = {}
  totalTime: any
  data: any;
  HttpParams = new HttpParams();
  theData$: Observable < any > ;
  constructor(private router: Router,
    private cognito: CognitoService,
    private storage: Storage,
    public alertController: AlertController,
    private restapi: RestapiService,
    private modal: ModalController,
    private http: HttpClient,
    private dataTracker: DatatrackerService
  ) {}

  ngOnInit() {
    // theData$ | async as anyName
    console.log("here")
    this.theData$ = this.restapi.getData();
    console.log("there")
    this.theData$.subscribe((data) => {
      console.log(data);
      console.log(this.theData$)
      this.userData.FirstName = data.Item.FirstName.S
      console.log(this.userData)
      console.log(this.userData.FirstName)

      this.userData.LastName = data.Item.LastName.S
      console.log(data.Item.LastName.S)

      console.log(data.Item.ZipCode.S)
      console.log(data.Item.ZipCode)
      this.userData.ZipCode = data.Item.ZipCode.S
      console.log("posted", this.userData.ZipCode)

      this.userData.UserName = data.Item.UserName.S
      console.log(this.userData.UserName)

      this.userData.myPoints = parseInt(data.Item.myPoints.N)
      console.log(this.userData.myPoints)
      // gets task list
      
      console.log(this.userData)
    }, (err) => {
      console.log(err)
    })

  }


  getData(): Observable < Object > {
    let myUser = this.cognito.getAuthenticatedUser();
    if (myUser === null) { // if there’s no data, leave function
      console.log("user is null");
      return;
    }
    myUser.getSession((err, session) => {
      if (err) {

        console.log("post error: ", err);
        return;
      }
      console.log('post session: ', session);
      // get the token id
      const token = session['idToken']['jwtToken']; //
      session.getIdToken().getJwtToken();
      console.info('post token: ', token);


      let myHeaders = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": token
      });
      console.log('post headers', myHeaders);
      let postUserName = {
        "Email": myUser.getUsername()
      }

      this.HttpParams.append('body', JSON.stringify(postUserName));

      return this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/ADHDGetFromDynamoDB', JSON.stringify(postUserName))
        .subscribe(response => {
          console.log("get success: ", response);
          this.data = response
          console.log("getdata: ", this.data);
          console.log("firstitem: ", this.data.Item.ZipCode.N)
          console.log(typeof this.data)

          this.userData.FirstName = this.data.Item.FirstName.S
          console.log(this.userData)
          console.log(this.userData.FirstName)

          this.userData.LastName = this.data.Item.LastName.S
          console.log(this.data.Item.LastName.S)

          console.log(this.data.Item.ZipCode.N)
          console.log(this.data.Item.ZipCode)
          this.userData.ZipCode = this.data.Item.ZipCode.N
          console.log("posted", this.userData.ZipCode)

          this.userData.UserName = this.data.Item.UserName.S
          console.log(this.userData.UserName)

          this.userData.myPoints = this.data.Item.myPoints.N
          console.log(this.userData.myPoints)
          // gets task list

          console.log(this.userData)

          // DRAW THE TASK LIST HERE


          //DRAW THE TASK LIST HERE
        }, err => {
          console.log("get error: ", err);
        });
    });

  }
  getStuff() {
    console.log(this.userData)
  }

  async showModal() {
    console.log("function ran")
    const modal = await this.modal.create({
      component: ModalPage
    });
    console.log("before modal present")
    await modal.present();
    console.log("after modal present")
  }
  getTime() {
    this.storage.get('taskTime').then((data) => {
      console.log('taskTime ', data);
      this.totalTime = data;
    }, (err) => {
      console.log(err)
    })
  }
  taskBuilder() {

  }

  saveVariable() {
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

  startTask(){
    let currentTaskName= `task${this.userData.currentTaskNum}`
    console.log(currentTaskName)
    console.log(this.userData)
    this.userData.FullTasks[currentTaskName].status = "doing"
    console.log(this.userData.FullTasks)
    this.restapi.postData(this.userData)
    this.showModal()
  }
  async addTask() {
    const alert = await this.alertController.create({
      header: 'Add Task Name and Date',
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
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          console.log(data)
          data.status="not done"
          let taskName=`task${Object.keys(this.userData.FullTasks).length}`
          console.log(taskName)
          this.userData.FullTasks[taskName]=data
          console.log(this.userData)
          console.log('Confirm Ok');
          this.restapi.postData(this.userData)
          // console.log(this.tracker.userData)
          
          // console.log(this.tracker.userData)
        }
      }]
    });
    await alert.present();

    
  }
  gotoHome() {
    this.router.navigate(['/home'])
  }

  get() {}

  hideCalendar() {
    let calendar = document.getElementById("calendar")
    calendar.style.display = "none"
  }
  hideProfile() {
    let profile = document.getElementById("profile")
    profile.style.display = "none"
  }
  hideAvatar() {
    let avatar = document.getElementById("avatar")
    avatar.style.display = "none"
  }
  hideReport() {
    let report = document.getElementById("report")
    report.style.display = "none"
  }
  switchToCalendar() {
    this.hideProfile()
    this.hideReport()
    this.hideAvatar()
    let calendar = document.getElementById("calendar")
    calendar.style.display = "block"
  }
  switchToProfile() {
    this.hideAvatar()
    this.hideCalendar()
    this.hideReport()
    let profile = document.getElementById("profile")
    profile.style.display = "block"
  }
  switchToAvatar() {
    this.hideProfile()
    this.hideCalendar()
    this.hideReport()
    let avatar = document.getElementById("avatar")
    avatar.style.display = "block"
  }
  switchToReport() {
    this.hideProfile()
    this.hideCalendar()
    this.hideAvatar()
    let report = document.getElementById("report")
    report.style.display = "block"
  }


  segmentChanged(tab) {
    let medQ = document.getElementById('QuestionList')
    let Achievements = document.getElementById('AchievementList')
    let contentValue = tab.detail.value
    console.log(contentValue)
    if (contentValue == "Achievements") {
      console.log("achievement tag is chosen")
      medQ.style.display = 'none'
      Achievements.style.display = 'block'
    } else if (contentValue == "MedQ") {
      console.log("medQ is chosen")
      Achievements.style.display = 'none'
      medQ.style.display = 'block'
    } else {
      console.log("something went wrong")
    }

  }
  testFunction(){
  console.log(this.userData)
  }
}