import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { Game } from "../../domain/Game";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OffersService } from "../../providers/offers.provider";
import { Offer } from "../../domain/Offer";
import { UsersService } from "../../providers/users.provider";

@Component({
  selector: 'modal-create-offer',
  templateUrl: 'modal-create-offer.html'
})
export class ModalCreateOfferComponent {

  private selectedGame: Game;

  private form : FormGroup;

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
    this.selectedGame = navParams.get("game");

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      desc: [''],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      server: this.selectedGame.servers.length ? ['', Validators.required] : [''],
    });
  }

  /**
   * Create a new offer.
   */
  public createOffer() {
    // If form valid
    if(this.form.valid) {
      const offer = new Offer();

      offer.name = this.form.value.name;
      offer.desc = this.form.value.desc;
      offer.price = parseInt(this.form.value.price);
      offer.quantity = this.form.value.quantity;

      offer.server = this.form.value.server;

      offer.username = this.usersService.getName();
      offer.user = this.usersService.getUid();

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
