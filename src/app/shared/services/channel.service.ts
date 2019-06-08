import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, Subject } from 'rxjs';
import { Channel, ChannelCreator } from '../../model/channel';
import { convertSnaps } from '../../services/db-utils';
import { first, map } from 'rxjs/operators';
import { User } from '../../model/user';
import { UserChannel } from '../../model/user-channel';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelSelectedSubject = new Subject<any>();

  constructor(private db: AngularFirestore, private store: Store<AppState>) {
  }

  findAllChannels(criteria: string = '', pageSize: number = 3): Observable<Channel[]> {
    return this.db.collection(
      'channels',
      ref => ref.orderBy('name', 'asc')
        .limit(pageSize)
        .startAfter(criteria)
    )
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Channel>(snaps)),
        first());
  }

  findChannelById(channelId: string): Observable<Channel> {
    return this.db.collection('channels',
      ref => ref.where('id', '==', channelId))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const channels = convertSnaps<Channel>(snaps);
          return channels.length === 1 ? channels[0] : undefined;
        })
      );
  }

  createChannel(channelId: string, changes: Partial<Channel>): Observable<any> {
    changes.createdBy = this.channelCreator();
    changes.id = channelId;
    changes.totalUsers = 0;
    return from(this.db.firestore.runTransaction(async (transaction) => {
      await this.db.doc(`channels/${channelId}`).set(changes, {merge: true});
      await this.joinChannel(changes.createdBy.userId, channelId, changes.name, transaction);
    }));
  }

  joinChannelAfterSearch(userId: string, channelId: string, channelName: string): Observable<any> {
    return from(this.db.firestore.runTransaction(async (transaction) => {
      const userChannel: UserChannel = {
        isStarred  : false,
        userId     : userId,
        channelId  : channelId,
        channelName: channelName
      };

      return Promise.all(
        [
          this.updateUserCount(channelId, transaction),
          this.db.doc(`/users/${userId}/channels/${channelId}`)
            .set(
              userChannel,
              {
                merge: true
              }
            )
        ]
      );
    }));
  }

  leaveChannel(userId: string, channelId: string, channelName: string): Observable<any> {
    return from(this.db.firestore.runTransaction(async (transaction) => {
      const userChannel: UserChannel = {
        isStarred  : false,
        userId     : userId,
        channelId  : channelId,
        channelName: channelName
      };

      return await Promise.all(
        [
          this.reduceUserCount(channelId, transaction),
          this.db.doc(`/users/${userId}/channels/${channelId}`).delete()
        ]
      );
    }));
  }

  markAsStarredChannel(userId: string, channelId: string): Observable<any> {
    return from(this.db.firestore.runTransaction(async (transaction) => {
      const userChannel: Partial<UserChannel> = {
        isStarred: true,
        channelId: channelId,
        userId   : userId
      };

      await this.db.doc(`/users/${userId}/channels/${channelId}`)
        .update(
          userChannel
        );
      return userChannel;
    }));
  }

  markAsUnStarredChannel(userId: string, channelId: string): Observable<any> {
    return from(this.db.firestore.runTransaction(async (transaction) => {
      const userChannel: Partial<UserChannel> = {
        isStarred: false,
        channelId: channelId,
        userId   : userId

      };

      await this.db.doc(`/users/${userId}/channels/${channelId}`)
        .update(
          userChannel
        );

      return userChannel;
    }));
  }

  fetchStarredInfo(userId: string, channelId: string): Observable<UserChannel> {
    return this.db.doc(`/users/${userId}/channels/${channelId}`)
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          console.log(snaps.payload.data());
          return <UserChannel>snaps.payload.data();
        })
      );
  }

  channelCreator(): ChannelCreator {
    const user: User = JSON.parse(sessionStorage.getItem('user'));
    return {
      avatar: user.avatar,
      name  : user.displayName,
      userId: user.id
    };
  }

  private async updateUserCount(channelId: string, transaction: any) {
    const channelRef = this.db.doc(`/channels/${channelId}`).ref;
    const snap = await transaction.get(channelRef);
    const channel = <Channel>snap.data();
    const existingUsers = _.isNumber(channel.totalUsers) ? channel.totalUsers : 0;
    const totalUsers = existingUsers + 1;
    await transaction.update(channelRef, {totalUsers});
  }

  private async reduceUserCount(channelId: string, transaction: any) {
    const channelRef = this.db.doc(`/channels/${channelId}`).ref;
    const snap = await transaction.get(channelRef);
    const channel = <Channel>snap.data();
    const existingUsers = _.isNumber(channel.totalUsers) ? channel.totalUsers : 0;
    const totalUsers = existingUsers > 0 ? existingUsers - 1 : 0;
    await transaction.update(channelRef, {totalUsers});
  }

  private async joinChannel(userId: string, channelId: string, channelName: string, transaction): Promise<any> {
    const userChannel: UserChannel = {
      isStarred  : false,
      userId     : userId,
      channelId  : channelId,
      channelName: channelName
    };

    return Promise.all(
      [
        this.updateUserCount(channelId, transaction),
        this.db.doc(`/users/${userId}/channels/${channelId}`)
          .set(
            userChannel,
            {
              merge: true
            }
          )
      ]
    );
  }

  findAllUserChannels(userId: string): Observable<UserChannel[]> {
    return this.db.collection(`users/${userId}/channels`)
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return convertSnaps<UserChannel>(snaps);
        }),
        first()
      );
  }

  channelSelected(channelId: string) {
    this.channelSelectedSubject.next({selectedChannel: channelId});
  }

  clear() {
    this.channelSelectedSubject.next();
  }

  getSelectedChannel(): Observable<any> {
    return this.channelSelectedSubject.asObservable();
  }
}
