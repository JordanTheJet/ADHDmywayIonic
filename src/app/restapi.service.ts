import { Injectable } from '@angular/core';
import { CognitoService } from '../app/cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
data: any
// autoUser = this.cognitoService.getAuthenticatedUser().getUsername()
taskID: string;
userData = {
  "Email": "",
  "FirstName": "",
  "LastName": "",
  "ZipCode": 0,
  "UserName": "",
  "myPoints": 0,
  "FullTasks": {},
  "MedicalQ": {},
  "currentTaskNum": 0
}
  constructor( private cognitoService: CognitoService,
               private http: HttpClient,
               private storage: Storage) { }

  postData(userData) {
    let myUser = this.cognitoService.getAuthenticatedUser();
if (myUser === null) { // if there’s no data, leave function
console.log("user is null");
return;
}
myUser.getSession((err, session) => {
  if(err) {
  
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

  //test Task Calendar
let DayList = {
  // "Day1": {
  //   "Date": "1/3/2019",
  //   "Task1": "Homework",
  //   "Task2": "Brush Teeth"
  // },
  // "Day2": {
  //   "Date": "1/4/2019"
  // }
    "Task1": {
      "Name": "Homework",
      "Status": "Not Done"
    },
    "Task2": {
      "Name": "Brush Teeth",
      "Status": "Not Done"
    }
  
}
// {  "Day1" : { "M" : {      "Date" : { "S" : "1/3/2019" },      "Task1" : { "S" : "Homework" },      "Task2" : { "S" : "Brush Teeth" }    }  },  "Day2" : { "M" : {      "Date" : { "S" : "1/4/2019" }    }  }}

  // let postData = {
   
  //   'Name': 'Jordan Tian',
  //   'Email': myUser.getUsername(),
  //   'Age': 25,
  //   'FullTasks': DayList
  //   }
    console.log("myuser: ", myUser.getUsername())
    console.log("postdata: ", userData);
    
    this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/emailapi',
     JSON.stringify(userData),
     {headers: myHeaders}) //headers
.subscribe( response => {
console.log("post success: ", response);
}, err => {
console.log("post error: ", err);
});
});
  }

  getData(){
    let myUser = this.cognitoService.getAuthenticatedUser();
if (myUser === null) { // if there’s no data, leave function
console.log("user is null");
return;
}
myUser.getSession((err, session) => {
  if(err) {
  
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

    this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/ADHDGetFromDynamoDB', 
    JSON.stringify(postUserName))
.subscribe( response => {
console.log("get success: ", response);
this.data = response
    console.log("getdata: ",this.data);
    this.userData.Email = this.data.Item.Email.S
    this.userData.FirstName = this.data.Item.FirstName.S
      console.log(this.userData)
      console.log(this.userData.FirstName)

      this.userData.LastName = this.data.Item.LastName.S
      console.log(this.data.Item.LastName.S)

      console.log(this.data.Item.ZipCode.S)
      console.log(this.data.Item.ZipCode)
      this.userData.ZipCode = this.data.Item.ZipCode.S
      console.log("posted", this.userData.ZipCode)

      this.userData.UserName = this.data.Item.UserName.S
      console.log(this.userData.UserName)

      this.userData.myPoints = parseInt(this.data.Item.myPoints.N)
      console.log(this.userData.myPoints)

      this.userData.currentTaskNum = this.data.Item.currentTaskNum.N
      console.log(this.userData.currentTaskNum)

      let numObjects=Object.keys(this.data.Item.FullTasks.M).length
      console.log(numObjects)
      let numOfTasks = 0
      
      
      while(numOfTasks<numObjects){
        let taskID= `task${numOfTasks}`
        console.log(numObjects)
        
        let taskObject = {
          taskName: this.data.Item.FullTasks.M[taskID].M.taskName.S,
          status: this.data.Item.FullTasks.M[taskID].M.status.S
        }
        this.userData.FullTasks[taskID]=taskObject
        console.log(this.userData.FullTasks)
        numOfTasks++
      }
      console.log(this.userData)
      this.updateTask()
      // this.saveData()
}, err => {

console.log("get error: ", err);
});
});
  }

updateTask(){
  let holder = `task${this.userData.currentTaskNum}`
      console.log(holder)
      this.taskID=this.userData.FullTasks[holder].taskName
      console.log(this.taskID)
}
  saveData(){
    //myVariable is the key that will let you store and grab your data
    this.storage.set('userData', this.userData).then((success) => {
      console.log('successfully stored');
      }, (err) => {
      console.log(err);
      });
  }
getUserData(){
  return this.data
}
}


  