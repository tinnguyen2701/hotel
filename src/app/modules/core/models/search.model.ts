import {LoadOptions} from 'devextreme/data/load_options';

export class LoadParamModel {
  loadOptions: LoadOptions;
  customFilter: any;

  public constructor(loadOptions: any, customFilter: object = {}) {
    Object.assign(this, {loadOptions, customFilter});
  }
}

export class LoadResultModel<T> {
  data: T;
  totalCount: number;

  public constructor(init?: Partial<LoadResultModel<T>>) {
    Object.assign(this, init);
  }
}
