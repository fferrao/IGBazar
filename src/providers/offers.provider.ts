import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import { Injectable } from "@angular/core";
import { Offer } from "../domain/Offer";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class OffersService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
  }

  public addOffer(gameId: string, offer: Offer): Promise<any> {
    return this.firestore.collection<Offer>(this.getPath(gameId)).add({...offer});
  }

  public getOffersByGameAndFilter(gameId: string, price: number, server: string): Observable<Offer[]> {
    return this.firestore.collection<Offer>(this.getPath(gameId), (ref) => {
      // Filters server side for better performances

      // Order price,
      let query = ref.orderBy('price', 'asc');

      // Filter on server
      if(server) {
        query = query.where('server', '==', server);
      }
      // Filter on max price
      if(price) {
        query = query.where('price', '<=', price);
      }

      return query;
    }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Offer;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
    });
  }

  public getOffersByGameAndFilterCloud(gameId: string, name: string, price: number, server: string): Observable<any> {
    const url = "https://us-central1-igbazar-84e8e.cloudfunctions.net/getFilteredOffers";

    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('gameId', gameId);
    Params = Params.append('name', name);
    Params = Params.append('price', String(price));

    return this.http.get(url, { params: Params });
  }

  public deleteOffer(gameId: string, offerId: string) {
    return this.firestore.collection<Offer>(this.getPath(gameId)).doc(offerId).delete();
  }

  private getPath(gameId: string) {
    return `/games/${gameId}/offers`;
  }
}