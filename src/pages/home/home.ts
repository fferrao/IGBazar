import { Component, OnInit, ViewChild } from "@angular/core";
import { AlertController, ModalController, NavController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { TranslateService } from "@ngx-translate/core";
import { GamesService } from "../../providers/games.provider";
import { OffersService } from "../../providers/offers.provider";
import { UsersService } from "../../providers/users.provider";

import { ModalConnectionComponent } from "../../components/modal-connection/modal-connection";
import { ModalCreateOfferComponent } from "../../components/modal-create-offer/modal-create-offer";
import { ModalDisplayOfferComponent } from "../../components/modal-display-offer/modal-display-offer";
import { ModalProfileComponent } from "../../components/modal-profile/modal-profile";

import { Game } from "../../domain/Game";
import { Offer } from "../../domain/Offer";
import { IUser } from "../../domain/User";

import { Utils } from "../../utils/Utils";

import "rxjs/add/operator/take";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage implements OnInit {

  @ViewChild("globalList") public globalList;
  @ViewChild("nameInput") public nameInput;

  // Global usefull vars
  private windowHeight: number;

  // Quick search input
  private quickSearch: string;

  private isLoading: boolean;

  // Fields data
  private language: string;
  private selectedGame: Game;
  private selectedName: string;
  private selectedPrice: string;
  private selectedServers: string;
  private selectedStatus: string;

  // Result list of offers
  private offersList: any[];
  private offersListFiltered: any[];

  // Result of global list
  private offersGlobalSubs: Subscription[];
  private offersGlobalMap: Map<string, any[]>;
  private offersGlobalList: any[];
  private offersGlobalFilteredList: any[];

  // Observable and Subscriptions
  private gamesObs: Observable<Game[]>;
  private gamesList: Game[];
  private subscriptions: Subscription[];

  /**********************************
   *    CONSTRUCTOR & ON-EVENTS     *
   **********************************/

  /**
   * Constructor of app.
   * @param {NavController} navCtrl
   * @param {TranslateService} translateService
   * @param {ModalController} modalController
   * @param {AlertController} alertController
   * @param {GamesService} gamesService
   * @param {OffersService} offersService
   * @param {UsersService} usersService
   * @param {Utils} utils
   */
  constructor(private navCtrl: NavController, private translateService: TranslateService,
              private modalController: ModalController, private alertController: AlertController,
              private gamesService: GamesService, private offersService: OffersService,
              private usersService: UsersService, private utils: Utils) {
    this.windowHeight = window.innerHeight;

    this.language = "en";
    this.isLoading = false;
    this.translateService.setDefaultLang(this.language);

    this.selectedGame = null;
    this.selectedName = "";
    this.selectedPrice = "0";
    this.selectedServers = "";
    this.selectedStatus = "";

    this.offersList = [];
    this.offersListFiltered = [];

    this.offersGlobalSubs = [];
    this.offersGlobalMap = new Map<string, any[]>();
    this.offersGlobalList = [];
    this.offersGlobalFilteredList = [];
  }

  /**
   * On Init method, subscriptions to data.
   */
  public ngOnInit() {
    this.subscriptions = [];

    // Get games
    this.gamesObs = this.gamesService.getGames();
    this.subscriptions.push(this.gamesObs.subscribe((games) => {
      this.gamesList = games;
    }));
  }

  /**
   * On Destroy method, unsubscription.
   */
  public ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /**********************************
   *    LOGIN, LOGOUT & PROFILE     *
   **********************************/

  /**
   * Open login/signup modal.
   */
  public login() {
    this.modalController.create(ModalConnectionComponent).present();
  }

  /**
   * Get logged out.
   */
  public logout() {
    this.usersService.logout();
  }

  /**
   * Open profile modal.
   */
  public profile() {
    this.modalController.create(ModalProfileComponent, {games: this.gamesList}).present();
  }

  /**********************************
   *        SEARCH & FILTERS        *
   **********************************/

  /**
   * Main search method
   */
  public search() {
    // Timeout needed by ionic before focus
    setTimeout(() => {
      if (this.nameInput) {
        this.selectedName = this.quickSearch;
        this.nameInput.setFocus();
        this.globalList.nativeElement.scrollIntoView();
        this.updateGlobalResult();
      }
    }, 150);
  }

  /**
   * Select a game.
   * @param {Game} game: selected game.
   */
  public goToMarketGame(game: Game) {
    this.selectedGame = game;
    this.updateResult();
  }

  /**
   * Update result on change value of filters of quick search.
   */
  public updateGlobalResult() {
    const promises = [];

    if (!this.selectedName) {
      this.offersGlobalFilteredList = [];
    } else {
      this.offersGlobalList = [];
      this.offersGlobalFilteredList = [];
      this.isLoading = true;

      // Separate offers inside a map and merge it at the end
      this.gamesList.forEach((game) => {

        // For each games we query the database
        this.offersService.getOffersByGameAndFilterCloud(
            game.id,
            this.selectedName,
            parseInt(this.selectedPrice, 10),
            this.selectedServers,
        ).take(1).subscribe((res) => {
          const offers = res.data;

          // Set link between game and offers
          this.offersGlobalMap.set(game.id, offers);

          // Set game id in each offers
          offers.forEach((offer: any) => {
            offer.gameId = game.id;
            offer.copyToClipboard = false;

            promises.push(this.setOfferStatus(offer));
            this.offersGlobalList.push(offer);
          });

          this.offersGlobalList.sort((a, b) => {
            return a.price - b.price;
          });

          Promise.all(promises).then(() => {
            this.filterByStatus(this.offersGlobalList, true);
            this.isLoading = false;
          });

          this.filterByStatus(this.offersGlobalList, true);
        });
      });
    }
  }

  /**
   * Update result on change value of filters.
   */
  public updateResult() {
    if (!this.selectedName) {
      this.offersListFiltered = [];
    }

    if (this.selectedGame && this.selectedName) {
      this.offersListFiltered = [];
      this.isLoading = true;

      // Query the database
      this.offersService.getOffersByGameAndFilterCloud(
          this.selectedGame.id,
          this.selectedName,
          parseInt(this.selectedPrice, 10),
          this.selectedServers,
      ).take(1).subscribe((res) => {
        this.offersList = res.data;
        const promises = [];

        // Set the status in first to run promises asynchronous
        this.offersList.forEach((offer) => {
          promises.push(this.setOfferStatus(offer));
        });

        this.offersList.forEach((offer) => offer.copyToClipboard = false);

        // We filter only when all status are set
        Promise.all(promises).then(() => {
          this.filterByStatus(this.offersList, false);
          this.isLoading = false;
        });
      });
    }
  }

  /**
   * Filter by name and status locally to avoid request
   * @param {Array<{}>} offersList
   * @param {boolean} globalList
   */
  public filterByStatus(offersList: any[], globalList: boolean) {
    const result = [];

    offersList.forEach((offer) => {
      // If not status in filter, we don't filter
      if (!this.selectedStatus || !offer.status) {
        result.push(offer);
      } else if (offer.status === this.selectedStatus) {
        result.push(offer);
      }
    });

    // Set the list as filtered
    if (globalList) {
      this.offersGlobalFilteredList = result;
    } else {
      this.offersListFiltered = result;
    }
  }

  /**********************************
   *             OFFERS             *
   **********************************/

  /**
   * Set async status user of offer.
   * @param offer
   * @returns {Promise<void>}
   */
  public setOfferStatus(offer: any) {
    return this.usersService.getUser(offer.user).then((user) => {
      offer.status = (user.data() as IUser).status;
    });
  }

  /**
   * Enable / Disable copy whisper mode.
   * @param offer
   * @param {boolean} copyOn
   */
  public setOfferCopyMode(offer: any, copyOn: boolean) {
    let game;

    // Choose between selected game or getting game from id for global list
    if (!this.selectedGame) {
      game = this.gamesList.find((g) => g.id === offer.gameId);
    } else {
      game = this.selectedGame;
    }

    // If not set, queried for getting whisp
    if (copyOn && !offer.copyWhisp) {
      this.usersService.getUser(offer.user).then((user) => {
        // Always in english, for communication between players
        offer.copyWhisp = `/w ${(user.data() as IUser).usernames[game.id]} `
                        + `Hello ! I'm interested about ${offer.name} for ${offer.price} ${game.currency}.`;
      });
    }

    offer.copyToClipboard = copyOn;
  }

  /**
   * Display an offer in a modal.
   * @param {string} off: the offer.
   */
  public displayOffer(off: any) {
    this.modalController.create(ModalDisplayOfferComponent, {
      game: this.selectedGame ? this.selectedGame : this.gamesList.find((g) => {
        return g.id === off.gameId;
      }),
      offer: off,
    }).present();
  }

  /**
   * Add a new offer.
   * Need to be logged in.
   */
  public addOffer() {
    this.modalController.create(ModalCreateOfferComponent, {game: this.selectedGame}).present();
  }

  /**
   * Delete an offer.
   * @param {string} offerId
   */
  public deleteOffer(offerId: string) {
    this.alertController.create({
      buttons: [
        {
          role: "cancel",
          text: "Cancel",
        }, {
          handler: () => {
            this.offersService.deleteOffer(this.selectedGame.id, offerId);
          },
          text: "Delete",
        },
      ],
      message: "Are you sure to delete your offer ?",
      title: "Delete offer",
    }).present();
  }

  /**********************************
   *          MISCELANEOUS          *
   **********************************/

  /**
   * Change the language.
   */
  public changeLanguage() {
    this.translateService.setDefaultLang(this.language);
  }

  /**
   * Reset the chose game to go back home.
   */
  public resetGames() {
    this.utils.delay(500).then(() => {
      this.selectedGame = null;

      this.quickSearch = "";
      this.selectedName = "";
      this.selectedPrice = "0";
      this.selectedServers = "";
      this.selectedStatus = "";

      this.offersList = [];
      this.offersListFiltered = [];

      this.offersGlobalSubs = [];
      this.offersGlobalMap = new Map<string, any[]>();
      this.offersGlobalList = [];
      this.offersGlobalFilteredList = [];
    });
  }

  /**********************************
   *           TEST  DATA           *
   **********************************/

  public resetData() {
    this.gamesList.forEach((game) => {
      let randomString;

      if (game.name === "Dofus") {
        randomString = ["Dofus Emeraude", "Dofus Turquoise",
          "Dofus Pourpre", "Dofus Ivoire",
          "Dofus Ebene", "Dofus Ocre"];
      }

      if (game.name === "Wakfu") {
        randomString = ["Rubilax", "Coiffe du tofu",
          "Boufcape Royale", "Rod Gerse",
          "L'Erréotype", "Le Hoshin"];
      }

      if (game.name === "Warframe") {
        randomString = ["Valkyr Prime Set", "Trinity Prime Set",
          "Nova Prime Set", "Nyx Prime Set",
          "Nekros Prime Neuroptics", "Riven Mod (Shotgun)"];
      }

      if (game.name === "World of Warcraft") {
        randomString = ["Aubastre Rapide", "Mécabécane",
          "Proto-Drake perdu dans le temps", "Sac en soie Shal'Dorei",
          "Illidan's twins", "Tome scellé"];
      }

      if (game.name === "Black Desert Online") {
        randomString = ["Kzarka Longsword", "Yuria Longsword of Temptation",
          "Kydict Amulet", "Ahon Kirus's Armor",
          "Velian Casual Clothes", "Jarette’s Armor"];
      }

      for (let i = 0; i < 200; i++) {
        const offer = new Offer();

        offer.name = randomString[i % randomString.length];
        offer.desc = i % 2
            ? `Description of ${offer.name}.`
            : `Description of ${offer.name}. This is a longer description`
              + `, to visualize what can happen if someone write this kind of description.`;

        offer.server = game.servers.length ? game.servers[i % game.servers.length] : "";

        offer.username = "Test Data";
        offer.user = "xoBJ9ZD9tCdBxsktDXIJ9jYJ4kJ3";

        offer.quantity = 1;
        offer.price = game.name === "Dofus" || game.name === "Wakfu"
            ? (i % 100) * 1000
            : i % 100;

        this.offersService.addOffer(game.id, offer);
      }
    });
  }
}
