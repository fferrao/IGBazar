/**
 * Represents an Offer.
 * Attributes public for easier manipulations.
 */
export class Offer {
  public id: string;

  public name: string;
  public desc: string;
  public infos: string[];
  public img: string;

  public price: number;
  public quantity: number;

  public country: string;
  public server: string;

  public user: string;
  public username: string;

  public status: string;

  public copyToClipboard: boolean;
  public copyWhisp: string;
}
