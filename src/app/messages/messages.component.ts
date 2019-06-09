import { Component, OnInit } from '@angular/core';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { MessageService } from '../shared/services/message.service';
import { Message } from '../model/message';
import { tap } from 'rxjs/operators';
import { ChannelService } from '../shared/services/channel.service';
import * as _ from 'lodash';
import { ChannelMessagesRequested } from '../shared/actions/message.actions';
import { selectAllMessagesBetweenUsers, selectAllMessagesForChannel } from '../shared/selectors/message.selectors';
import { UserService } from '../shared/services/user.service';
import { loggedInUserId } from '../auth/auth.selector';
import { combineLatest } from 'rxjs';

@Component({
    selector   : 'messages',
    templateUrl: './messages.component.html',
    styleUrls  : ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    selectedUserId: string;
    currentLoggedInUserId: string;
    selectedChannelId: string;
    messages: Message[] = [];
    loading = false;

    constructor(private store: Store<AppState>,
                private userService: UserService,
                private messageService: MessageService,
                private channelService: ChannelService) {
    }

    ngOnInit() {
        this.channelService.getSelectedChannel()
            .pipe(
                tap(({selectedChannel}) => {
                        this.selectedChannelId = selectedChannel;
                        if (!!this.selectedChannelId) {
                            this.messages = [];
                            this.store.select(selectAllMessagesForChannel(this.selectedChannelId))
                                .subscribe(
                                    mess => {
                                        this.messages = (_.uniqBy(this.messages.concat(mess),
                                            'messageId'));
                                    });
                        } else {
                            this.messages = [];
                        }
                    }
                )
            ).subscribe();

        combineLatest(
            this.store.select(loggedInUserId),
            this.userService.getSelectedUser()
        ).pipe(
            tap(data => {
                if (data != null && data.length === 2) {
                    this.currentLoggedInUserId = !!data[0] ? data[0] : undefined;
                    this.selectedUserId = !!data[1] ? data[1].selectedUser : undefined;

                    if (!!this.selectedUserId) {
                        this.messages = [];
                        this.store.select(selectAllMessagesBetweenUsers(this.currentLoggedInUserId, this.selectedUserId))
                            .subscribe(
                                mess => {
                                    this.messages = _.uniqBy(this.messages.concat(mess), 'messageId');
                                }
                            );
                    } else {
                        this.messages = [];
                    }
                }
            })
        ).subscribe();
    }

    loadMore() {
        this.loading = true;
        const nextCriteria: number = _.last(_.orderBy(this.messages, ['timestamp'], ['desc'])).timestamp;

        this.store.dispatch(new ChannelMessagesRequested({
            channelId: this.selectedChannelId,
            criteria : nextCriteria,
            pageSize : 3
        }));
    }
}
