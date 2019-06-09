import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { AngularFirestore } from '@angular/fire/firestore';
import { selectAllOtherUsers } from '../shared/selectors/user.selectors';
import { AllUsersRequested } from '../shared/actions/user.actions';
import { currentUser } from '../auth/auth.selector';
import { map } from 'rxjs/operators';
import { UserService } from '../shared/services/user.service';
import { ChannelService } from '../shared/services/channel.service';
import { DirectMessagesRequested, DirectMessagesRequestedFromOther } from '../shared/actions/message.actions';

@Component({
    selector   : 'direct-messages',
    templateUrl: './direct-messages.component.html',
    styleUrls  : ['./direct-messages.component.scss']
})
export class DirectMessagesComponent implements OnInit {
    allUsers$: Observable<User[]>;
    selectedUserId: string;
    currentLoggedInUserId: string;

    constructor(private store: Store<AppState>,
                private db: AngularFirestore,
                private userService: UserService,
                private channelService: ChannelService) {
    }

    ngOnInit() {
        this.store
            .pipe(
                select(currentUser),
                map((cUser: User) => {
                    if (!!cUser) {
                        this.currentLoggedInUserId = cUser.id;
                        this.store.dispatch(new AllUsersRequested());
                        this.allUsers$ = this.store.pipe(select(selectAllOtherUsers(this.currentLoggedInUserId)));
                    }
                })
            ).subscribe();

        this.channelService.getSelectedChannel()
            .subscribe(
                (c) => {
                    if (c.selectedChannel !== null) {
                        this.unSelectUser();
                    }
                });

    }

    getBackgroundColor(item: User) {
        if (item.id === this.selectedUserId) {
            return 'grey';
        } else {
            return '';
        }
    }

    userSelected(item) {
        this.selectedUserId = item.id;
        this.userService.userSelected(this.selectedUserId);
        this.store.dispatch(new DirectMessagesRequested({
            fromUserId: this.currentLoggedInUserId,
            toUserId  : this.selectedUserId,
            criteria  : 0,
            pageSize  : 5
        }));

        this.store.dispatch(new DirectMessagesRequestedFromOther({
            fromUserId: this.selectedUserId,
            toUserId  : this.currentLoggedInUserId,
            criteria  : 0,
            pageSize  : 5
        }));
    }

    unSelectUser() {
        this.selectedUserId = null;
    }
}
