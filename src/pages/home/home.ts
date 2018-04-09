import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamesService } from "../../providers/games.provider";
import { Game } from "../../domain/Game";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { OffersService } from "../../providers/offers.provider";
import { Offer } from "../../domain/Offer";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  // Global usefull vars
  private windowHeight: number;

  // Fields data
  private language: string;
  private selectedGame: Game;
  private selectedName: string;
  private selectedPrice: number;
  private selectedServers: string;
  private selectedStatus: string;

  // Result list of offers
  private offersList: Array<Offer>;

  // Observable and Subscriptions
  private gamesObs: Observable<Game[]>;
  private subscriptions: Subscription[];

  /**
   * Constructor of app.
   * @param {NavController} navCtrl
   * @param {GamesService} gamesService
   * @param {OffersService} offersService
   */
  constructor(private navCtrl: NavController, private gamesService: GamesService, private offersService: OffersService) {
    this.windowHeight = window.innerHeight;

    this.language = "fr";
    this.selectedGame = null;
    this.selectedName = "";
    this.selectedPrice = null;
    this.selectedServers = "";
    this.selectedStatus = "";

    this.offersList = [];
  }

  /**
   * On Init method, subscriptions to data.
   */
  public ngOnInit() {
    this.subscriptions = [];

    // Get games
    this.gamesObs = this.gamesService.getGames();
    this.subscriptions.push(this.gamesObs.subscribe((games) => {
        games.forEach((game) => console.log(game.name + " module loaded."))
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

  /**
   * Main search method
   */
  public search() {

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
   * Update result on change value of filters.
   */
  public updateResult() {
    this.offersService.getOffersByGame(this.selectedGame.id).subscribe((offers) => {
      this.offersList = offers;

      // Filter by name
      this.offersList = this.selectedName ? this.offersList.filter((offer) => {
          return offer.name.trim().toLowerCase().indexOf(this.selectedName.trim().toLocaleLowerCase()) !== -1;
      }) : this.offersList;

      // Filter by price
      this.offersList = this.selectedPrice ? this.offersList.filter((offer) => {
          return offer.price <= this.selectedPrice;
      }) : this.offersList;

      // Filter by server
      this.offersList = this.selectedServers ? this.offersList.filter((offer) => {
          return offer.server === this.selectedServers;
      }) : this.offersList;

      // Filter by status
      this.offersList = this.selectedStatus ? this.offersList.filter((offer) => {
          return true;
      }) : this.offersList;
    });
  }

  /**
   * Display an offer in a modal.
   * @param {string} gameId: game id.
   * @param {string} offerId: offer id.
   */
  public displayOffer(gameId: string, offerId: string) {
      console.log("Open offer ID " + offerId);
  }

  /**
   * Add a new offer.
   * Need to be logged in.
   */
  public addOffer() {

  }
}
