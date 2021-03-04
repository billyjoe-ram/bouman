import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  constructor(private storage: AngularFireStorage) { }
    
  ngOnInit(): void {
  }
  uploadFile(event:any) {
    const file = event.target.files[0];
    console.log(file)
    /*const filePath = 'name-your-file-path-here';
    const task = this.storage.upload(filePath, file);*/
  }
}
