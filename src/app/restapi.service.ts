import { Injectable } from '@angular/core';
import { CognitoService } from '../app/cognito.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
data: any
  constructor( private cognitoService: CognitoService,
               private http: HttpClient ) { }

  postData() {
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

  let postData = {
   
    'Name': 'Jordan Tian',
    'Email': myUser.getUsername(),
    'Age': 25
    }
    console.log("myuser: ", myUser.getUsername())
    console.log("postdata: ", postData);
    
    this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/emailapi', JSON.stringify(postData))
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
// let myHeaders = new HttpHeaders({
//   "Content-Type": "application/json",
//   "Authorization": token
//   });
//   console.log('post headers', myHeaders);
let postUserName = {
  "Email": myUser.getUsername()
}

    this.http.post('https://nphtfo2p2j.execute-api.us-east-1.amazonaws.com/12-20Stage/ADHDGetFromDynamoDB', JSON.stringify(postUserName))
.subscribe( response => {
console.log("get success: ", response);
this.data = response
    console.log("getdata: ",this.data);
    console.log("firstitem: ", this.data[0])
}, err => {

console.log("get error: ", err);
});
});
  }
}


  