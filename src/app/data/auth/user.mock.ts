import * as faker from 'faker';

import {UserModel} from '@app/modules/core/models';

export function randomLoggedUser(): UserModel {
  const user = new UserModel({
    id: faker.random.number(),
    fullName: faker.name.findName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    avatarImg: faker.image.avatar(),
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEiLCJuYmYiOjE2NDA5NzAwMDAsImV4' +
      'cCI6MTY0MDk3MDAwMCwiaWF0IjoxNjQwOTcwMDAwfQ.R0xydJfSjaAfbglZWZqlH9aCZ39MqozD52MPVJ0AZDM',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEiLCJuYmYiOjE2NDA5NzAwMDAsI' +
      'mV4cCI6MTY0MDk3MDAwMCwiaWF0IjoxNjQwOTcwMDAwfQ.R0xydJfSjaAfbglZWZqlH9aCZ39MqozD52MPVJ0AZDM'
  });
  return user;
}
