export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarImg: string;
  permissions: string[] = [];
  accessToken: string;
  refreshToken: string;

  // UI Only
  nameAvatar: string;

  public constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}

export class AccessTokenResponse {
  accessToken: string;
  refreshToken: string;

  public constructor(init?: Partial<AccessTokenResponse>) {
    Object.assign(this, init);
  }
}
