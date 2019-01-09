import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../photo.service'
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  currentImage: any; 

  constructor(public photoService: PhotoService,
              private router: Router) { }

  ngOnInit() {
    this.photoService.loadSaved();
  }

  goGame(){ 
    this.router.navigate(['/game'])
  }
}