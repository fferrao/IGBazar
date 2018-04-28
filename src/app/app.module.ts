import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ClipboardModule } from 'ngx-clipboard';
import { ScrollToModule } from "ng2-scroll-to";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireModule } from "angularfire2";

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ENV } from '../environnement/env';

import { GamesService } from "../providers/games.provider";
import { UsersService } from "../providers/users.provider";
import { OffersService } from "../providers/offers.provider";

import { ModalCreateOfferComponent } from "../components/modal-create-offer/modal-create-offer";
import { ModalConnectionComponent } from "../components/modal-connection/modal-connection";
import { ModalProfileComponent } from "../components/modal-profile/modal-profile";
import { ModalDisplayOfferComponent } from "../components/modal-display-offer/modal-display-offer";

import { Utils } from "../utils/Utils";
import { DOCUMENT } from "@angular/common";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    // Components
    ModalCreateOfferComponent,
    ModalConnectionComponent,
    ModalProfileComponent,
    ModalDisplayOfferComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md' // 'md' | 'ios' | 'wp'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, DOCUMENT]
      }
    }),
    ScrollToModule.forRoot(),
    ClipboardModule,
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

    // Components
    ModalCreateOfferComponent,
    ModalConnectionComponent,
    ModalProfileComponent,
    ModalDisplayOfferComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GamesService,
    UsersService,
    OffersService,
    Utils,
  ]
})
export class AppModule {}
