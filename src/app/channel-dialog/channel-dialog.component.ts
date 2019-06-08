import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Channel } from '../model/channel';
import { ChannelService } from '../shared/services/channel.service';
import uuidv1 from 'uuid/v1';
import { User } from '../model/user';
import { AllUserChannelsRequested } from '../shared/actions/user-channel.actions';
import { AllChannelsRequested } from '../shared/actions/channel.actions';

@Component({
  selector   : 'channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls  : ['./channel-dialog.component.scss']
})
export class ChannelDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private channelService: ChannelService,
    private dialogRef: MatDialogRef<ChannelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) channel: Channel) {
    this.form = fb.group({
      details: [channel ? channel.details : '', Validators.required],
      name   : [channel ? channel.name : '', Validators.required]
    });

  }

  ngOnInit() {

  }

  save() {
    const changes = this.form.value;
    const channelId: string = uuidv1();
    this.channelService
      .createChannel(channelId, changes)
      .subscribe(
        () => {
          const user: User = JSON.parse(sessionStorage.getItem('user'));
          this.store.dispatch(new AllChannelsRequested());
          this.store.dispatch(new AllUserChannelsRequested({userId: user.id}));
          this.dialogRef.close();
        }
      );
  }

  close() {
    this.dialogRef.close();
  }
}
