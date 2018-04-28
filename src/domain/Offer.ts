export class Offer {
  id: string;

  name: string;
  desc: string;
  infos: Array<string>;
  img: string;

  price: number;
  quantity: number;

  country: string;
  server: string;

  user: string;
  username: string;

  status: string;

  copyToClipboard: boolean;
  copyWhisp: string;
}