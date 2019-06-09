import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { AllChannelsRequested, ChannelRequested } from '../shared/actions/channel.actions';
import { AppState } from '../reducers';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChannelService } from '../shared/services/channel.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChannelSearchDialogComponent } from '../channel-search-dialog/channel-search-dialog.component';
import { countUserChannels, selectAllUserChannels } from '../shared/selectors/user-channel.selectors';
import { UserChannel } from '../model/user-channel';
import { UserChannelSelected } from '../shared/actions/user-channel.actions';
import { ChannelMessagesRequested } from '../shared/actions/message.actions';
import { UserService } from '../shared/services/user.service';

@Component({
    selector   : 'channels',
    templateUrl: './channels.component.html',
    styleUrls  : ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

    allChannels$: Observable<UserChannel[]>;
    channelTotal$: Observable<number>;
    selectedChannelId: string;

    constructor(private dialog: MatDialog,
                private store: Store<AppState>,
                private db: AngularFirestore,
                private channelService: ChannelService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.store.dispatch(new AllChannelsRequested());
        this.allChannels$ = this.store.pipe(select(selectAllUserChannels));
        this.channelTotal$ = this.store.pipe(select(countUserChannels));

        this.userService.getSelectedUser()
            .subscribe(
                (c) => {
                    if (c.selectedUser !== null) {
                        this.unSelectChannel();
                    }
                });
    }

    addChannel() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        const dialogRef = this.dialog.open(ChannelDialogComponent,
            dialogConfig);
    }

    searchChannels() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        const dialogRef = this.dialog.open(ChannelSearchDialogComponent,
            dialogConfig);

    }

    channelSelected(item) {
        this.userService.clear();
        this.selectedChannelId = item.channelId;
        if (!!this.selectedChannelId) {
            this.store.dispatch(new UserChannelSelected({userId: item.userId, channelId: item.channelId}));
            this.store.dispatch(new ChannelRequested({channelId: item.channelId}));
            this.store.dispatch(new ChannelMessagesRequested({
                channelId: item.channelId,
                criteria : 0,
                pageSize : 3
            }));
            this.channelService.clear();
            this.channelService.channelSelected(item.channelId);
        }
    }

    getBackgroundColor(item) {
        if (item.channelId === this.selectedChannelId) {
            return 'grey';
        } else {
            return '';
        }
    }

    unSelectChannel() {
        this.channelService.clear();
        this.selectedChannelId = null;
    }
}
