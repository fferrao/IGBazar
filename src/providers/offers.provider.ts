import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import * as firebase from "@firebase/app";
import "rxjs/add/operator/first";
import { Injectable } from "@angular/core";
import { Game } from "../domain/Game";
import {Offer} from "../domain/Offer";

@Injectable()
export class OffersService {

  constructor(private firestore: AngularFirestore) {

  }

  public addOffer(gameId: string, offer: Offer) {
    return this.firestore.collection<Offer>(this.getPath(gameId)).add({...offer});
  }

  public getOffersByGameAndFilter(gameId: string): Observable<Offer[]> {
    return this.firestore.collection<Offer>(this.getPath(gameId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Offer;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  public deleteOffer(gameId: string, offerId: string) {
    return this.firestore.collection<Offer>(this.getPath(gameId)).doc(offerId).delete();
  }

  private getPath(gameId: string) {
    return `/games/${gameId}/offers`;
  }
}