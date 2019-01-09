import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../photo.service'
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
import { TrackerService } from '../tracker.service'
import { DatatrackerService } from '../datatracker.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  currentImage: any; 

  constructor(public photoService: PhotoService,
              private router: Router,
              private datatracker: DatatrackerService
              ) { }

  ngOnInit() {
    this.photoService.loadSaved();
  }

  goGame(){ 
    this.datatracker.loadData
    this.router.navigate(['/game'])
  }
}