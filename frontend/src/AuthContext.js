// AuthContext.js
import { createContext } from 'react';
import Auth from './utils/auth';

const AuthContext = createContext(Auth);

export default AuthContext;
