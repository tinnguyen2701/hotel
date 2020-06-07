import {AddressModel} from '@app/modules/core/models/address.model';

export class RegisterBaseModel {
  fistName: string;
  lastName: string;
  mobileNumber: string;
  emailAddress: string;
  password: string;
  address: AddressModel = new AddressModel();

  emergencyContactName: string;
  emergencyContactNumber: string;

  constructor(init?: Partial<RegisterBaseModel>) {
    Object.assign(this, init);
  }
}
