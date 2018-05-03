import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { ScrollToModule } from "ng2-scroll-to";
import { ClipboardModule } from "ngx-clipboard";

import { HomePage } from "../pages/home/home";
import { MyApp } from "./app.component";

import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { ENV } from "../environnement/env";

import { GamesService } from "../providers/games.provider";
import { OffersService } from "../providers/offers.provider";
import { UsersService } from "../providers/users.provider";

import { ModalConnectionComponent } from "../components/modal-connection/modal-connection";
import { ModalCreateOfferComponent } from "../components/modal-create-offer/modal-create-offer";
import { ModalDisplayOfferComponent } from "../components/modal-display-offer/modal-display-offer";
import { ModalProfileComponent } from "../components/modal-profile/modal-profile";

import { DOCUMENT } from "@angular/common";
import { Utils } from "../utils/Utils";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  bootstrap: [IonicApp],
  declarations: [
    MyApp,
    HomePage,

    // Components
    ModalCreateOfferComponent,
    ModalConnectionComponent,
    ModalProfileComponent,
    ModalDisplayOfferComponent,
  ],
  entryComponents: [
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
      mode: "md", // "md" | "ios" | "wp"
    }),
    TranslateModule.forRoot({
      loader: {
        deps: [HttpClient, DOCUMENT],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      },
    }),
    ScrollToModule.forRoot(),
    ClipboardModule,
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GamesService,
    UsersService,
    OffersService,
    Utils,
  ],
})
export class AppModule {}
