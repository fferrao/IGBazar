import { Injectable } from "@angular/core";

import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

import { Game } from "../domain/Game";

@Injectable()
export class GamesService {

  constructor(private firestore: AngularFirestore) {
  }

  public getGames(): Observable<Game[]> {
    return this.firestore.collection<Game>("/games").snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Game;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    });
  }
}
