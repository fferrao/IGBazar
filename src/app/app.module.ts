import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

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
import {ModalCreateOfferComponent} from "../components/modal-create-offer/modal-create-offer";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    // Components
    ModalCreateOfferComponent,
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
        deps: [HttpClient]
      }
    }),
    ScrollToModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

    // Components
    ModalCreateOfferComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GamesService,
    UsersService,
    OffersService,
  ]
})
export class AppModule {}
