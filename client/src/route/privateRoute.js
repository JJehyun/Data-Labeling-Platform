import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getUserInfoSelector } from '../states';
import { useRecoilValue } from 'recoil';
import jwt_decode from 'jwt-decode';
import { getCookie, removeCookie } from '../pages/Login/cookies';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userInfo = useRecoilValue(getUserInfoSelector);

  const checkToken = () => {
    if (getCookie('labelJWTToken')) {
      const token = getCookie('labelJWTToken');
      const decodeToken = jwt_decode(token);
      const expConvertDate = new Date(decodeToken.exp * 1000);
      const currentTime = new Date();
      const calc =
        (expConvertDate.getTime() - currentTime.getTime()) / 1000 / 60;

      if (calc < 0) {
        // 토큰 만료시
        removeCookie('labelJWTToken');
        return false;
      } else {
        return true;
      }
    }

    return false;
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        checkToken() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
