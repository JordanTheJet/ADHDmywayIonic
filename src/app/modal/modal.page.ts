import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import {ModalController} from '@ionic/angular'
import {Storage} from '@ionic/storage'
import { RestapiService } from '../restapi.service';




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
    "secs": 0, 
    "fract": 0, 
  };
  constructor(private router: Router,
              private modalCtrl: ModalController,
              private storage: Storage,
              private restapi: RestapiService) {}
              
              ngOnInit() {
                this.stopwatchfunc()
              }
              
              fract = 0;
  stopwatchfunc() {
    if (this.running == 0) {
      this.running = 1
      this.myVar = setInterval(() => {
        this.time++;
        this.fract++;
        this.totalTime.mins = Math.floor(this.time / 100 / 60);
        this.totalTime.secs = Math.floor(this.time / 100 % 60);
        this.totalTime.hours = Math.floor(this.time / 100 / 60 / 60);
        this.totalTime.fract = Math.floor( this.fract)
        if (this.fract >100){this.fract = 0}
        
        let stopwatch = < HTMLInputElement > document.getElementById("output")
        stopwatch.innerHTML = ( this.totalTime.hours + ":" + this.totalTime.mins + ":" + this.totalTime.secs + ":"+ this.totalTime.fract)
      }, 10)
    };
  }

  go(){
   
    this.saveTime()
    clearInterval(this.myVar)
    this.modalCtrl.dismiss(); 
    this.router.navigate(['/game']); 
    
  }

  saveTime(){
    this.storage.set('taskTime', this.totalTime).then((success)=>{
      console.log('successfully stored');
    }, (err) =>{
      console.log(err);
    })
  }

  }
