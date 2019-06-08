import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Channel } from '../model/channel';
import { ChannelService } from '../shared/services/channel.service';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { User } from '../model/user';
import { AllUserChannelsRequested } from '../shared/actions/user-channel.actions';

@Component({
  selector   : 'channel-search-dialog',
  templateUrl: './channel-search-dialog.component.html',
  styleUrls  : ['./channel-search-dialog.component.scss']
})
export class ChannelSearchDialogComponent implements OnInit {
  displayedColumns = ['name'];
  channels: Channel[];
  loading = false;
  channelsFound = false;
  lastPageLoaded = 0;
  lastChannelName = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private channelService: ChannelService,
    private dialogRef: MatDialogRef<ChannelSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) channel: Channel) {
  }

  ngOnInit() {
    this.loading = true;
    this.channelService.findAllChannels()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        channels => {
          this.channelsFound = true;
          this.channels = channels;
        }
      );
  }

  channelSelected(row: any) {
    this.loading = true;
    const channelId: string = row.id;
    const channelName: string = row.name;
    const user: User = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.id;
    this.channelService.joinChannelAfterSearch(userId, channelId, channelName)
      .subscribe(
        () => {
          this.store.dispatch(new AllUserChannelsRequested({userId: userId}));
          this.loading = false;
          this.close();
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  loadMore() {

    this.lastPageLoaded++;

    this.loading = true;
    this.lastChannelName = _.last(this.channels).name;

    this.channelService.findAllChannels(this.lastChannelName)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(channels => {
        this.channelsFound = true;
        this.channels = this.channels.concat(channels);

      });
  }

}
