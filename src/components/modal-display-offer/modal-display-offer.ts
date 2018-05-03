import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

import { Game } from "../../domain/Game";
import { IUser } from "../../domain/User";

import { UsersService } from "../../providers/users.provider";

@Component({
  selector: "modal-display-offer",
  templateUrl: "modal-display-offer.html",
})
export class ModalDisplayOfferComponent {

  private game: Game;
  private offer: any;

  private whisp: string;
  private placeholder: string;

  /**
   * Constructor of modal.
   * @param {ViewController} viewCtrl
   * @param {NavParams} navParams
   * @param {UsersService} usersService
   */
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private usersService: UsersService) {
    this.game = this.navParams.get("game");
    this.offer = this.navParams.get("offer");

    this.placeholder = "https://icons8.com/icon/set/placeholder";

    this.usersService.getUser(this.offer.user).then((user) => {
      this.whisp = `/w ${(user.data() as IUser).usernames[this.game.id]} `
                    + `Hello ! I'm interested about ${this.offer.name} for ${this.offer.price} ${this.game.currency}.`;
    });
  }

  /**
   * Leave the modal.
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
