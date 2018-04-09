import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import * as firebase from "@firebase/app";
import "rxjs/add/operator/first";
import { Injectable } from "@angular/core";

@Injectable()
export class UsersService {

    constructor(private firestore: AngularFirestore) {
    }
}