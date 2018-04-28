import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import { AngularFirestore } from "angularfire2/firestore";
import { Unsubscribe } from "firebase/app";
import { User } from "../domain/User";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UsersService {

  public user: User;
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
          this.user = rep.data() as User;
          this.isLogged = true;
        });

      } else {
        this.isLogged = false;
      }
    });
  }

  /**
   * Create a new account.
   * @param {string} email
   * @param {string} password
   * @param {string} pseudo
   * @returns {Promise<void>}
   */
  public signup(email: string, password: string, pseudo: string): Promise<void> {
    return this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
        return this.addUser(email, user, pseudo).then(() => {
          this.user = {
            uid: user.uid,
            status: "Online",
            displayName: pseudo,
            email: email,
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
      return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((rep) => {
        this.getUser(rep.uid).then((rep) => {
          this.user = rep.data() as User;
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
   * @returns {Promise<>}
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
   * @param {string} email
   * @param {User} user
   * @param {string} pseudo
   * @returns {Promise<any>}
   */
  public addUser(email: string, user: User, pseudo: string): Promise<void> {
    return this.firestore.collection<User>("users").doc(user.uid).set({
      uid: user.uid,
      displayName: pseudo,
      email: email,
      usernames: {},
    });
  }

  /**
   * Get User from firebase.
   * @param {string} uid
   * @returns {Promise<DocumentSnapshot>}
   */
  public getUser(uid: string): Promise<DocumentSnapshot> {
    return this.firestore.collection<User>("users").doc(uid).ref.get();
  }

  /**
   * Get User Observable from firebase.
   * @param {string} uid
   * @returns {Promise<DocumentSnapshot>}
   */
  public getUserObservable(uid: string): Observable<{}> {
    return this.firestore.collection<User>("users").doc(uid).valueChanges();
  }

  /**
   * Update username.
   * @param {string} uid
   * @param {string} username
   * @returns {Promise<{}>}
   */
  public updateUsername(uid: string, username: string): Promise<any> {
    return this.firestore.collection<User>("users").doc(uid).update({displayName: username}).then(() => {
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
    return this.firestore.collection<User>("users").doc(uid).update({usernames: usernames}).then(() => {
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
    return this.firestore.collection<User>("users").doc(uid).update({status: status});
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