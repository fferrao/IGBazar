import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavParams, ViewController } from "ionic-angular";

import { OffersService } from "../../providers/offers.provider";
import { UsersService } from "../../providers/users.provider";

import { Game } from "../../domain/Game";
import { Offer } from "../../domain/Offer";

@Component({
  selector: "modal-create-offer",
  templateUrl: "modal-create-offer.html",
})
export class ModalCreateOfferComponent {

  private selectedGame: Game;

  private form: FormGroup;

  /**
   * Constructor of modal.
   * @param {ViewController} viewCtrl
   * @param {NavParams} navParams
   * @param {FormBuilder} formBuilder
   * @param {OffersService} offersService
   * @param {UsersService} usersService
   */
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private formBuilder: FormBuilder,
              private offersService: OffersService, private usersService: UsersService) {
    this.selectedGame = this.navParams.get("game");

    this.form = this.formBuilder.group({
      desc: [""],
      name: ["", Validators.required],
      price: ["", Validators.required],
      quantity: ["", Validators.required],
      server: this.selectedGame.servers.length ? ["", Validators.required] : [""],
    });
  }

  /**
   * Create a new offer.
   */
  public createOffer() {
    // If form valid
    if (this.form.valid) {
      const offer = new Offer();

      offer.name = this.form.value.name;
      offer.desc = this.form.value.desc;
      offer.price = parseInt(this.form.value.price, 10);
      offer.quantity = this.form.value.quantity;

      offer.server = this.form.value.server;

      offer.username = this.usersService.getName();
      offer.user = this.usersService.getUid();

      offer.game = this.selectedGame.id;
      offer.currency = this.selectedGame.currency;

      this.offersService.addOffer(this.selectedGame.id, offer);
      this.dismiss();
    }
  }

  /**
   * Leave the modal.
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
