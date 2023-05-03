//frontend\src\utils\auth.js kodlarım
import EventEmitter from 'events';

class Auth extends EventEmitter {
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return token !== null && token !== undefined;
  }

  login(access_token, refresh_token) {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    this.emit('login');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.emit('logout');
  }
}
const authInstance = new Auth();
export default authInstance;