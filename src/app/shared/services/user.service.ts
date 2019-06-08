import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../../model/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, withLatestFrom } from 'rxjs/operators';
import { convertSnaps, convertValueChanges } from '../../services/db-utils';
import { Presence } from '../../model/presence';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    }

    createUser(userId: string, changes: Partial<User>): Observable<any> {
        return from(this.db.firestore.runTransaction(async (transaction) => {
            await this.db.doc(`users/${userId}`).set(changes, {merge: true});
            await this.db.doc(`presence/${userId}`).set({loggedIn: true}, {merge: true});
        }));
    }

    logoutUser(userId: string): Observable<any> {
        return from(this.db.firestore.runTransaction(async (transaction) => {
            return Promise.all([
                await this.afAuth.auth.signOut(),
                await this.db.doc(`presence/${userId}`).set({loggedIn: false}, {merge: true})
            ]);
        }));
    }

    findAllUsers(): Observable<User[]> {
        return this
            .findAllPresences()
            .pipe(
                withLatestFrom(this.getRegisteredUsers()),
                map(([presences, users]) => {
                    return users.map((user) => {
                        // tslint:disable-next-line:no-shadowed-variable
                        const isOnPresence: Presence = presences.find(presence => presence.id === user.id);
                        const presence = isOnPresence ? isOnPresence.loggedIn : false;
                        return {...user, presence: presence};
                    });
                })
            );
    }

    private getRegisteredUsers(): Observable<User[]> {
        return this.db.collection('users')
            .valueChanges()
            .pipe(
                map((values) => {
                    return convertValueChanges<User>(values);
                })
            );
    }

    private findAllPresences(): Observable<Presence[]> {
        return this.db.collection('presence')
            .snapshotChanges()
            .pipe(
                map((snaps) => {
                    return convertSnaps<Presence>(snaps);
                })
            );
    }
}


