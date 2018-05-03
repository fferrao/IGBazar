import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class Utils {
  constructor(private toastCtrl: ToastController) {
  }

  /**
   * Return promise resolved after a delay.
   * @param {number} ms
   * @returns {Promise<{}>}
   */
  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public info(msg: string) {
    this.toastCtrl.create({
      closeButtonText: "X",
      duration: 2000,
      message: msg,
      position: "bottom",
      showCloseButton: true,
    }).present();
  }

  public error(msg: string) {
    this.toastCtrl.create({
      closeButtonText: "X",
      duration: 2000,
      message: msg,
      position: "top",
      showCloseButton: true,
    }).present();
  }
}
