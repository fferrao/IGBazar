import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import { Observable } from "rxjs/Observable";

import * as firebase from "firebase/app";
import { Unsubscribe } from "firebase/app";

import { IUser } from "../domain/User";

@Injectable()
export class UsersService {

  public user: IUser;
  public isLogged: boolean;
  public onAuthUnsubscribe: Unsubscribe;

  /**
   * Constructor of user service.
   * @param {AngularFireAuth} afAuth
   * @param {AngularFirestore} firestore
   */
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.isLogged = false;
    this.user = null;

    // Relog in case of persisted
    this.onAuthUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getUser(user.uid).then((rep) => {
          this.user = rep.data() as IUser;
          this.isLogged = true;
        });

      } else {
        this.isLogged = false;
      }
    });
  }

  /**
   * Create a new account.
   * @param {string} mail
   * @param {string} password
   * @param {string} pseudo
   * @returns {Promise<void>}
   */
  public signup(mail: string, password: string, pseudo: string): Promise<void> {
    return this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return this.afAuth.auth.createUserWithEmailAndPassword(mail, password).then((user) => {
        return this.addUser(mail, user, pseudo).then(() => {
          this.user = {
            displayName: pseudo,
            email: mail,
            status: "Online",
            uid: user.uid,
            usernames: {},
          };

          this.updateStatus(this.getUid(), "Offline").then(() => {
            this.refresh();
          });

          this.isLogged = true;
        });
      });
    });
  }

  /**
   * Log in into the app.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{}>}
   */
  public login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
        this.getUser(user.uid).then((rep) => {
          this.user = rep.data() as IUser;
          this.updateStatus(this.getUid(), "Online").then(() => {
            this.refresh();
          });

          this.isLogged = true;
        });
      });
    });
  }

  /**
   * Log out from the app.
   * @returns {Promise<{}>}
   */
  public logout(): Promise<any> {
    return this.afAuth.auth.signOut().then(() => {
      this.updateStatus(this.getUid(), "Offline").then(() => {
        this.refresh();
      });

      this.isLogged = false;
      this.user = null;
    });
  }

  /**
   * Create a new User after sign up.
   * @param {string} mail
   * @param {User} user
   * @param {string} pseudo
   * @returns {Promise<void>}
   */
  public addUser(mail: string, user: IUser, pseudo: string): Promise<void> {
    return this.firestore.collection<IUser>("users").doc(user.uid).set({
      displayName: pseudo,
      email: mail,
      uid: user.uid,
      usernames: {},
    });
  }

  /**
   * Get User from firebase.
   * @param {string} uid
   * @returns {Promise<DocumentSnapshot>}
   */
  public getUser(uid: string): Promise<DocumentSnapshot> {
    return this.firestore.collection<IUser>("users").doc(uid).ref.get();
  }

  /**
   * Get User Observable from firebase.
   * @param {string} uid
   * @returns {Promise<DocumentSnapshot>}
   */
  public getUserObservable(uid: string): Observable<{}> {
    return this.firestore.collection<IUser>("users").doc(uid).valueChanges();
  }

  /**
   * Update username.
   * @param {string} uid
   * @param {string} username
   * @returns {Promise<{}>}
   */
  public updateUsername(uid: string, username: string): Promise<any> {
    return this.firestore.collection<IUser>("users").doc(uid).update({displayName: username}).then(() => {
      this.user.displayName = username;
    });
  }

  /**
   * Update usernames.
   * @param {string} uid
   * @param {[]} usernames
   * @returns {Promise<{}>}
   */
  public updateUsernames(uid: string, usernames: {}): Promise<any> {
    return this.firestore.collection<IUser>("users").doc(uid).update({usernames}).then(() => {
      this.user.usernames = usernames;
    });
  }

  /**
   * Update password.
   * @param {string} uid
   * @param {string} password
   * @returns {Promise<{}>}
   */
  public updatePassword(uid: string, password: string): Promise<any> {
    return this.afAuth.auth.currentUser.updatePassword(password);
  }

  /**
   * Update user status.
   * @param {string} uid
   * @param {string} status
   * @returns {Promise<void>}
   */
  public updateStatus(uid: string, status: string): Promise<void> {
    return this.firestore.collection<IUser>("users").doc(uid).update({status});
  }

  /**
   * Refresh the app.
   */
  public refresh() {
    window.location.reload();
  }

  /**
   * Return email of current user.
   * @returns {string}
   */
  public getEmail(): string {
    return this.user ? this.user.email : null;
  }

  /**
   * Return username of current user.
   * @returns {string}
   */
  public getName(): string {
    return this.user ? this.user.displayName : null;
  }

  /**
   * Get all names by games id.
   * @returns {}
   */
  public getNames(): any {
    return this.user ? this.user.usernames : null;
  }

  /**
   * Return uis of current user.
   * @returns {string}
   */
  public getUid(): string {
    return this.user ? this.user.uid : null;
  }
}
