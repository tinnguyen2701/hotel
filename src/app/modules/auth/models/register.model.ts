import {AddressModel} from '@app/modules/core/models';
import {RegisterBaseModel} from '@app/modules/core/models/register-base.model';

export class CompanyRegisterModel extends RegisterBaseModel {
  company: CompanyModel = new CompanyModel();

  constructor(init?: Partial<CompanyRegisterModel>) {
    super(init);
    Object.assign(this, init);
  }
}


export class EmployeeRegisterModel extends RegisterBaseModel {
  companyName: string;

  constructor(init?: Partial<EmployeeRegisterModel>) {
    super(init);
    Object.assign(this, init);
  }
}

export class CompanyModel {
  // Read only fields. Select form ABN search service
  entityName: string;
  entityType: string;
  entityId: number;
  abnNumber: string;
  abnStatus: string;
  gts: boolean = false;
  mainBusinessLocation: string;
  // Enter fields
  address: AddressModel = new AddressModel();
  commonName: string;

  constructor(init?: Partial<CompanyModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
