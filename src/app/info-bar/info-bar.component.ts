import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../shared/services/channel.service';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { Channel } from '../model/channel';
import { tap } from 'rxjs/operators';
import { UserChannelStarred, UserChannelUnStarred } from '../shared/actions/user-channel.actions';
import { loggedInUserId } from '../auth/auth.selector';
import { selectStarredUserChannelById, selectUserChannelById } from '../shared/selectors/user-channel.selectors';
import { UserChannel } from '../model/user-channel';

@Component({
    selector   : 'info-bar',
    templateUrl: './info-bar.component.html',
    styleUrls  : ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit, OnDestroy {
    selectedChannelId: string;
    channel$: Observable<Channel>;
    userChannel$: Observable<UserChannel>;
    isStarred: boolean;
    userId: string;
    destroy$ = new Subject();

    constructor(private channelService: ChannelService, private store: Store<AppState>) {
    }

    ngOnInit() {
        combineLatest(
            this.store.select(loggedInUserId),
            this.channelService.getSelectedChannel()
        ).pipe(
            tap(data => {
                if (data != null && data.length === 2) {
                    this.userId = !!data[0] ? data[0] : undefined;
                    this.selectedChannelId = !!data[1] ? data[1].selectedChannel : undefined;

                    if (!!this.selectedChannelId && !!this.userId) {

                        // ANTI PATTERNS CALLING SERVICE LAYER DIRECT
                        this.channel$ = this.channelService.findChannelById(this.selectedChannelId);
                        this.userChannel$ = this.store.select(selectUserChannelById(this.userId, this.selectedChannelId));
                        this.store.select(selectStarredUserChannelById(this.userId, this.selectedChannelId))
                            .subscribe(
                                x => this.isStarred = x
                            );
                    } else {
                        this.selectedChannelId = null;
                    }
                }
            })
        ).subscribe();
    }

    toggleStar() {
        if (this.userId && this.selectedChannelId) {
            this.isStarred = !this.isStarred;
            if (this.isStarred) {
                this.store.dispatch(new UserChannelUnStarred({
                    userId: this.userId, channelId: this.selectedChannelId
                }));
            } else {
                this.store.dispatch(new UserChannelStarred({
                    userId: this.userId, channelId: this.selectedChannelId
                }));
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}
