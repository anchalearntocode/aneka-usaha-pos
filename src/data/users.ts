import { User } from '../types';

export const POS_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Kasir (Karyawan)',
    role: 'cashier',
    pin: '1234',
    avatarColor: 'bg-sky-500',
  },
  {
    id: 'user-2',
    name: 'Owner',
    role: 'owner',
    pin: '9999',
    avatarColor: 'bg-emerald-600',
  },
];

export const STORAGE_KEY_AUTH = 'aneka_pos_auth_user_v2';
