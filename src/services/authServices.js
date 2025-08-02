// src/services/authServices.js

const TOKEN_KEY = 'auth_token';

export default {
  login(username, password) {
    // Here you would typically call your backend API to authenticate
    // For demo, we'll fake a successful login with hardcoded user
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          const fakeToken = 'fake-jwt-token';
          localStorage.setItem(TOKEN_KEY, fakeToken);
          resolve({ token: fakeToken });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 1000);
    });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};
