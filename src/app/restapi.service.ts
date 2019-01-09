import {
  Injectable
} from '@angular/core';
import {
  CognitoService
} from '../app/cognito.service';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import{ Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  data: any
  HttpParams = new HttpParams();
  constructor(private cognitoService: CognitoService,
              private http: HttpClient
              ) {}

  postData(postData) {
    let myUser = this.cognitoService.getAuthenticatedUser();
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

      //test Task Calendar
      // let DayList = {
       
      //   "Task1": {
      //     "Name": "Homework",
      //     "Status": "Not Done"
      //   },
      //   "Task2": {
      //     "Name": "Brush Teeth",
      //     "Status": "Not Done"
      //   }

      // }
      // {  "Day1" : { "M" : {      "Date" : { "S" : "1/3/2019" },      "Task1" : { "S" : "Homework" },      "Task2" : { "S" : "Brush Teeth" }    }  },  "Day2" : { "M" : {      "Date" : { "S" : "1/4/2019" }    }  }}

      // let postData = {

      //   "FirstName": "Jordan",
      //   "LastName": "Tian",
      //   "ZipCode": 53202,
      //   "UserName": "JordanTheJet",
      //   "myPoints": 1000000,
      //   "MedicalQ": {
      //     "Q1": "yes",
      //     "Q2": "no"
      //   },
      //   'Name': 'Jordan Tian',
      //   'Email': myUser.getUsername(),
      //   'Age': 25,
      //   'FullTasks': DayList
      // }
      console.log("myuser: ", myUser.getUsername())
      console.log("postdata: ", postData);

      this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/emailapi',
          JSON.stringify(postData), {
            headers: myHeaders
          }) //headers
        .subscribe(response => {
          console.log("post success: ", response);
        }, err => {
          console.log("post error: ", err);
        });
    });
  }

  getData(): Observable<any> {
    let myUser = this.cognitoService.getAuthenticatedUser();
    if (myUser === null) { // if there’s no data, leave function
      console.log("user is null");
      return;
    }
    return myUser.getSession((err, session) => {
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
      // .subscribe(response => {
      //     console.log("get success: ", response);
      //     this.data = response
      //     console.log("getdata: ", this.data);
      //     console.log("firstitem: ", this.data.Item.ZipCode.N)
      //     // gets task list
      //   }, err => {
      //     console.log("get error: ", err);
      //   });
    });
    
  }

  getUserData() {
    return this.data
  }
}