import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userInfo = atom({
  key: 'userInfo',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const getUserInfoSelector = selector({
  key: 'userInfo/set',
  get: ({ get }) => {
    return get(userInfo);
  },

  set: ({ set }, newUserInfo) => {
    set(userInfo, newUserInfo);
  },
});
