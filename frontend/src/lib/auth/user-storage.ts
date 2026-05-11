import { AuthUser } from '@/features/auth/types/auth.types';

let currentUser: AuthUser | null = null;

export const userStorage = {
  getUser(): AuthUser | null {
    return currentUser;
  },

  setUser(user: AuthUser) {
    currentUser = user;
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
    currentUser = null;
  },
};
