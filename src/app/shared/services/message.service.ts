import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../../model/message';
import { from, Observable } from 'rxjs';
import { ChannelMessage } from '../../model/channel-message';
import { map } from 'rxjs/operators';
import { convertSnaps } from '../../services/db-utils';
import { DirectMessage } from '../../model/direct-message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private db: AngularFirestore) {
    }

    addMessageToChannel(channelId: string, message: Message): Observable<ChannelMessage> {
        return from(this.db.firestore.runTransaction(async (transaction) => {
            await this.db.doc(`/channelMessages/${channelId}/messages/${message.messageId}`)
                .set(
                    message,
                    {
                        merge: true
                    }
                );

            const cMessage = {};
            cMessage[channelId] = [message];
            return cMessage;
        }));
    }

    addMessageToDirectUser(fromUserId: string, toUserId: string, message: Message): Observable<DirectMessage> {
        return from(this.db.firestore.runTransaction(async (transaction) => {
            await this.db.doc(`privateMessages/${fromUserId}/users/${toUserId}/messages/${message.messageId}`)
                .set(
                    message,
                    {
                        merge: true
                    }
                );

            const cMessage = {};
            const key = `${fromUserId}-${toUserId}`;
            cMessage[`${key}`] = [message];
            return cMessage;
        }));
    }

    findMessagesForChannel(channelId: string, criteria: number = 0, pageSize: number = 3): Observable<ChannelMessage> {
        criteria = criteria === 0 ? new Date().getTime() : criteria;
        return this.db.collection(
            `channelMessages/${channelId}/messages`,
            ref => ref.orderBy('timestamp', 'desc')
                .limit(pageSize)
                .startAfter(criteria)
        )
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    const messages = convertSnaps<Message>(snaps);
                    const cMessage: ChannelMessage = {};
                    cMessage[channelId] = messages;
                    return cMessage;
                })
            );
    }

    // tslint:disable-next-line:max-line-length
    findMessagesFromUserToUser(fromUserId: string, toUserId: string, criteria: number = 0, pageSize: number = 3): Observable<DirectMessage> {
        criteria = criteria === 0 ? new Date().getTime() : criteria;
        return this.db.collection(
            `privateMessages/${fromUserId}/users/${toUserId}/messages`,
            ref => ref.orderBy('timestamp', 'desc')
                // .limit(pageSize)
                // .startAfter(criteria)
        )
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    const messages = convertSnaps<Message>(snaps);
                    const cMessage: DirectMessage = {};
                    cMessage[`${fromUserId}-${toUserId}`] = messages;
                    return cMessage;
                })
            );
    }
}


