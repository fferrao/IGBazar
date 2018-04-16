import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Unsubscribe } from "firebase/app";
import { User } from "../domain/User";

@Injectable()
export class UsersService {

  public user: BehaviorSubject<User>;
  public isLogged: boolean;
  private onAuthUnsubscribe: Unsubscribe;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user = new BehaviorSubject(null);
    this.isLogged = false;

    this.onAuthUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log(user);

      if (user) {
        this.isLogged = true;
        this.user.next(user);
      } else {
        this.isLogged = false;
        this.user.next(null);
      }
      console.log(this.user.getValue());
    });
  }

  public loginWithGoogle(): Promise<any> {
    return this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  public logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public getName(): string {
    return this.user.getValue().displayName;
  }

  public getUid(): string {
    return this.user.getValue().uid;
  }
}