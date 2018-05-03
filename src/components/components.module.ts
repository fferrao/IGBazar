import { NgModule } from "@angular/core";

import { ModalConnectionComponent } from "./modal-connection/modal-connection";
import { ModalCreateOfferComponent } from "./modal-create-offer/modal-create-offer";
import { ModalDisplayOfferComponent } from "./modal-display-offer/modal-display-offer";
import { ModalProfileComponent } from "./modal-profile/modal-profile";

@NgModule({
  declarations: [
    ModalConnectionComponent,
    ModalCreateOfferComponent,
    ModalDisplayOfferComponent,
    ModalProfileComponent,
  ],
  exports: [
    ModalConnectionComponent,
    ModalCreateOfferComponent,
    ModalDisplayOfferComponent,
    ModalProfileComponent,
  ],
  imports: [],
})
export class ComponentsModule {}
