import { Component } from '@angular/core';
import { UsersService } from "../../providers/users.provider";
import { ViewController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Generated class for the ModalConnectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-connection',
  templateUrl: 'modal-connection.html'
})
export class ModalConnectionComponent {

  private signin: FormGroup;
  private signup: FormGroup;

  private isSignIn: boolean;

   /**
   * Constructor of modal.
   * @param {ViewController} viewCtrl
   * @param {FormBuilder} formBuilder
   * @param {UsersService} usersService
   */
  constructor(private viewCtrl: ViewController, private formBuilder: FormBuilder,
              private usersService: UsersService) {
    this.signin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      pseudo: ['', Validators.required],
    });

    this.isSignIn = true;
  }

  /**
   * Get signed in.
   */
  public signUp() {
    if(this.signup.valid) {
      this.usersService.signup(this.signup.value.email, this.signup.value.password, this.signup.value.pseudo).then(() => {
        this.dismiss();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  /**
   * Create new account.
   */
  public signIn() {
    if(this.signin.valid) {
      this.usersService.login(this.signin.value.email, this.signin.value.password).then(() => {
        this.dismiss();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  /**
   * Switch sign in / sign up.
   * @param {boolean} signin
   */
  public goToSignIn(signin: boolean) {
    this.isSignIn = signin;
  }

  /**
   * Leave the modal.
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
