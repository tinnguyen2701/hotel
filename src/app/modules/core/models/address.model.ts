export class AddressModel {
  street: string;
  suburb: string;
  state: string;
  postCode: string;

  constructor(init?: Partial<AddressModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
