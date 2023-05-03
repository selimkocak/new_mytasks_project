// frontend\src\components\Navbar\Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from '../../components/Views/Tasks/NavbarElements';
import '../../assets/css/Navbar.css';
import AuthContext from '../../AuthContext';

const Navbar = () => {
  const Auth = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(Auth.isAuthenticated());

  useEffect(() => {
    const onLogin = () => {
      setIsAuthenticated(true);
    };

    const onLogout = () => {
      setIsAuthenticated(false);
    };

    Auth.on('login', onLogin);
    Auth.on('logout', onLogout);
    return () => {
      Auth.off('login', onLogin);
      Auth.off('logout', onLogout);
    };
  }, [Auth]);

  const logout = () => {
    Auth.logout();
  };

  return (
    <>
      <Nav>
        <Bars />

        <NavMenu>
          {isAuthenticated ? (
            <>
              <NavLink to="/tasks" active="active-link">
                MyTasks
              </NavLink>
              <NavLink to="/tasks" active="active-link">
                Görevler
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" active="active-link">
                Giriş
              </NavLink>
              <NavLink to="/register" active="active-link">
                Kayıt Ol
              </NavLink>
            </>
          )}
        </NavMenu>
        {isAuthenticated && (
          <NavBtn>
            <NavBtnLink to="/logout" onClick={logout}>
              Çıkış
            </NavBtnLink>
          </NavBtn>
        )}
      </Nav>
    </>
  );
};
export default Navbar;
