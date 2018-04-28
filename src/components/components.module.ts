import { NgModule } from '@angular/core';
import { ModalCreateOfferComponent } from './modal-create-offer/modal-create-offer';
import { ModalConnectionComponent } from './modal-connection/modal-connection';
import { ModalProfileComponent } from './modal-profile/modal-profile';
import { ModalDisplayOfferComponent } from './modal-display-offer/modal-display-offer';
@NgModule({
	declarations: [ModalCreateOfferComponent,
    ModalConnectionComponent,
    ModalProfileComponent,
    ModalDisplayOfferComponent],
	imports: [],
	exports: [ModalCreateOfferComponent,
    ModalConnectionComponent,
    ModalProfileComponent,
    ModalDisplayOfferComponent]
})
export class ComponentsModule {}
