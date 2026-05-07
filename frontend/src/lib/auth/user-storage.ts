import { AuthUser } from '@/features/auth/types/auth.types';

const USER_STORAGE_KEY = 'lifedrop_user';

export const userStorage = {
  getUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  setUser(user: AuthUser) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  updateUser(updates: Partial<AuthUser>) {
    const currentUser = this.getUser();

    if (!currentUser) {
      return null;
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
    };

    this.setUser(updatedUser);
    return updatedUser;
  },

  clearUser() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(USER_STORAGE_KEY);
  },
};
