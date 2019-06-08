import { Component, OnInit } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector   : 'about',
  templateUrl: './about.component.html',
  styleUrls  : ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private db: AngularFirestore) {

  }

  ngOnInit() {

  }
}
















