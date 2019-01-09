import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import {ModalController} from '@ionic/angular'
import {Storage} from '@ionic/storage'




@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  myVar: any;
  time = 0
  running = 0
  currentImage: any;
  totalTime = {
    "hours": 0,
    "mins": 0,
    "secs": 0
  };
  constructor(private router: Router,
              private modalCtrl: ModalController,
              private storage: Storage) {}

  ngOnInit() {}

  stopwatchfunc() {
    if (this.running == 0) {
      this.running = 1
      this.myVar = setInterval(() => {
        this.time++;
        this.totalTime.mins = Math.floor(this.time / 10 / 60);
        this.totalTime.secs = Math.floor(this.time / 10 % 60);
        this.totalTime.hours = Math.floor(this.time / 10 / 60 / 60);
        // if (mins < 10) {
        //   mins = 0 + mins;
        // }
        // if (secs < 10) {
        //   secs = 0 + secs;
        // }
        let stopwatch = < HTMLInputElement > document.getElementById("output")
        stopwatch.innerHTML = ( this.totalTime.hours + ":" + this.totalTime.mins + ":" + this.totalTime.secs)
      }, 100)
    };
  }

  go(){
    this.saveTime()
    clearInterval(this.myVar)
    this.modalCtrl.dismiss(); 
    this.router.navigate(['/gallery']); 
    
  }

  saveTime(){
    this.storage.set('taskTime', this.totalTime).then((success)=>{
      console.log('successfully stored');
    }, (err) =>{
      console.log(err);
    })
  }

  }
