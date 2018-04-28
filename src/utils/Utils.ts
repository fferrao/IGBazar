import { ToastController } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class Utils {
  constructor(private toastCtrl: ToastController) {
  }

  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public info(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X',
    }).present();
  }
}