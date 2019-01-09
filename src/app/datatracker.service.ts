
import { Injectable } from '@angular/core';
import {
  Observable
} from 'rxjs';
import {RestapiService} from './restapi.service'
@Injectable({
  providedIn: 'root'
})
export class DatatrackerService {
  
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
  theData$: Observable < any >
  constructor(
    private storage: Storage,
    private restapi: RestapiService,) { }
  getData(){
    
  }
  loadData(){
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
    this.finishTask()
  }

  finishTask(){
    let currentTaskName= `task${this.userData.currentTaskNum}`
    this.userData.FullTasks[currentTaskName].status = "done"
  }
}
