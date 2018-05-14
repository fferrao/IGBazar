import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Offer } from "../domain/Offer";

@Injectable()
export class OffersService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) {
  }

  public addOffer(gameId: string, offer: Offer): Promise<any> {
    return this.firestore.collection<Offer>(this.getPath(gameId)).add({...offer});
  }

  public getOffersByGameAndFilterCloud(gameId: string, name: string, price: number, server: string): Observable<any> {
    const url = "https://us-central1-igbazar-84e8e.cloudfunctions.net/getFilteredOffers";

    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append("gameId", gameId);
    params = params.append("name", name);
    params = params.append("price", String(price));
    params = params.append("server", server);

    return this.http.get(url, {params});
  }

  public getOffersByUser(gameId: string, uid: string): Observable<any> {
    const url = "https://us-central1-igbazar-84e8e.cloudfunctions.net/getUserOffers";

    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append("gameId", gameId);
    params = params.append("uid", uid);

    return this.http.get(url, {params});
  }

  public deleteOffer(gameId: string, offerId: string) {
    return this.firestore.collection<Offer>(this.getPath(gameId)).doc(offerId).delete();
  }

  private getPath(gameId: string) {
    return `/games/${gameId}/offers`;
  }
}
