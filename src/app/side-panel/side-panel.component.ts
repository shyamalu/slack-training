import { Component, OnInit } from '@angular/core';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector   : 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls  : ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  constructor(private store: Store<AppState>,
              private afAuth: AngularFireAuth) {
  }

  ngOnInit() {

  }

}
