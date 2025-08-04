const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export default {
  // Get stored token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save token
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token & user
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get current user
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Save user
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};
