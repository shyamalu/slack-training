import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../../model/message';
import { from, Observable } from 'rxjs';
import { ChannelMessage } from '../../model/channel-message';
import { map } from 'rxjs/operators';
import { convertSnaps } from '../../services/db-utils';

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
}


