import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

import { OffersService } from "../../providers/offers.provider";
import { UsersService } from "../../providers/users.provider";
import { Utils } from "../../utils/Utils";

import { Game } from "../../domain/Game";

@Component({
  selector: "modal-profile",
  templateUrl: "modal-profile.html",
})
export class ModalProfileComponent {

  private selectedTab: string;

  private username: string;
  private newUsername: string;

  private newPassword: string;
  private repeatPassword: string;
  private email: string;

  private gamesList: Game[];
  private names: {};

  private offersUserSelling: any[];

  /**
   * Constructor of modal.
   * @param {ViewController} viewCtrl
   * @param {NavParams} navParams
   * @param {OffersService} offersService
   * @param {UsersService} usersService
   * @param {Utils} utils
   */
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private offersService: OffersService, private usersService: UsersService,
              private utils: Utils) {
    this.gamesList = this.navParams.get("games");

    this.selectedTab = "infos";

    this.username = this.usersService.getName();
    this.newUsername = this.usersService.getName();

    this.newPassword = "";
    this.repeatPassword = "";
    this.email = this.usersService.getEmail();

    this.names = this.usersService.getNames();

    this.offersUserSelling = [];

    this.usersService.waitUntilLoginIn().then((uid) => {
      const promises = [];

      this.gamesList.forEach((game) => {
        promises.push(this.offersService.getOffersByUser(game.id, uid).toPromise().then((res) => {
          const offers = res.data;
          this.offersUserSelling.push(...offers);
        }));
      });
    });
  }

  /**
   * Select infos tab
   */
  public selectInfos() {
    this.selectedTab = "infos";
  }

  /**
   * Select histo tab.
   */
  public selectHisto() {
    this.selectedTab = "histo";
  }

  /**
   * Change username.
   */
  public changePseudo() {
    if (this.username === this.newUsername) {
      this.utils.info("Username identique au précédent");
      return;
    }

    if (this.newUsername.length < 5) {
      this.utils.info("Username trop court : < 5");
      return;
    }

    this.usersService.updateUsername(this.usersService.getUid(), this.newUsername).then(() => {
      this.utils.info("Username updated");
    });
  }

  /**
   * Change password.
   */
  public changePassword() {
    if (this.newPassword !== this.repeatPassword) {
      this.utils.info("Les passwords sont différents");
      return;
    }

    if (this.newPassword.length < 6) {
      this.utils.info("Password trop court : < 6");
      return;
    }

    this.usersService.updatePassword(this.usersService.getUid(), this.newPassword).then(() => {
      this.utils.info("Password updated");
    });
  }

  public changeUsernames() {
    this.usersService.updateUsernames(this.usersService.getUid(), this.names).then(() => {
      this.utils.info("Names updated");
    });
  }

  /**
   * Leave the modal.
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
