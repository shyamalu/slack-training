import { Component, OnInit } from '@angular/core';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { MessageService } from '../shared/services/message.service';
import { combineLatest } from 'rxjs';
import { Message } from '../model/message';
import { loggedInUserId } from '../auth/auth.selector';
import { tap } from 'rxjs/operators';
import { ChannelService } from '../shared/services/channel.service';
import { selectAllMessagesForChannel } from '../shared/selectors/message.selectors';
import * as _ from 'lodash';
import { ChannelMessagesRequested } from '../shared/actions/message.actions';

@Component({
    selector   : 'messages',
    templateUrl: './messages.component.html',
    styleUrls  : ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    selectedChannelId: string;
    messages: Message[] = [];
    loading = false;

    constructor(private store: Store<AppState>,
                private messageService: MessageService,
                private channelService: ChannelService) {
    }

    ngOnInit() {
        combineLatest(
            this.store.select(loggedInUserId),
            this.channelService.getSelectedChannel()
        ).pipe(
            tap(data => {
                    if (data != null && data.length === 2) {
                        this.selectedChannelId = !!data[1] ? data[1].selectedChannel : undefined;

                        if (!!this.selectedChannelId) {
                            this.messages = [];
                            this.store.select(selectAllMessagesForChannel(this.selectedChannelId))
                                .subscribe(
                                    mess => {
                                        this.messages = (_.uniqBy(this.messages.concat(mess),
                                            'messageId'));
                                    });
                        }
                    }
                }
            )
        ).subscribe();
    }

    loadMore() {
        this.loading = true;
        const nextCriteria: number = _.last(_.orderBy(this.messages, ['timestamp'],['desc'])).timestamp;

        this.store.dispatch(new ChannelMessagesRequested({
            channelId: this.selectedChannelId,
            criteria : nextCriteria,
            pageSize : 3
        }));
    }
}
