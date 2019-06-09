import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { ChannelService } from '../shared/services/channel.service';
import { UserService } from '../shared/services/user.service';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Message } from '../model/message';
import { User } from '../model/user';
import uuidv1 from 'uuid/v1';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { PostMessageToChannel, PostMessageToDirectUser } from '../shared/actions/message.actions';

@Component({
    selector   : 'message-form',
    templateUrl: './message-form.component.html',
    styleUrls  : ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
    messageForm: FormGroup;
    showMessageForm$: Observable<boolean>;
    selectedUserId: string;
    selectedChannelId: string;

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private channelService: ChannelService,
        private userService: UserService) {
        this.messageForm = fb.group({
            message: ''
        });

    }

    ngOnInit() {
        combineLatest(
            this.userService.getSelectedUser(),
            this.channelService.getSelectedChannel()
        ).pipe(
            tap(
                data => {
                    if (data != null && data.length === 2) {
                        this.selectedUserId = !!data[0] ? data[0].selectedUser : undefined;
                        this.selectedChannelId = !!data[1] ? data[1].selectedChannel : undefined;
                        if (this.selectedChannelId === null && this.selectedUserId === null) {
                            this.showMessageForm$ = of(false);
                        } else {
                            this.showMessageForm$ = of(true);
                        }
                    }
                }
            )
        ).subscribe();

    }

    send() {
        const user: User = JSON.parse(sessionStorage.getItem('user'));
        const changes = this.messageForm.value;
        const sendMessage: Message = this.prepareMessage(changes);
        if (!!this.selectedUserId) {
            console.log(`send message for user id ${this.selectedUserId}`);
            this.store.dispatch(new PostMessageToDirectUser({fromUserId: user.id, toUserId: this.selectedUserId, message: sendMessage}));
        } else if (!!this.selectedChannelId) {
            this.store.dispatch(new PostMessageToChannel({channelId: this.selectedChannelId, message: sendMessage}));
        }
        this.messageForm.reset();
    }

    private prepareMessage({message}) {
        const user: User = JSON.parse(sessionStorage.getItem('user'));
        const messageToSend: Message = {
            messageId: uuidv1(),
            content  : message,
            timestamp: new Date().getTime(),
            sentBy   : user
        };

        return messageToSend;
    }
}
