import React from 'react';
import { useRecoilValue } from 'recoil';
import { Redirect, Route } from 'react-router-dom';
import { getUserInfoSelector } from '../states';
import jwt_decode from 'jwt-decode';
import { getCookie, removeCookie } from '../pages/Login/cookies';

const SuperVisorRoute = ({ component: Component, ...rest }) => {
  const userInfo = useRecoilValue(getUserInfoSelector);

  const checkRole = () => {
    if (userInfo.userLevel === 1) {
      return true;
    } else {
      return false;
    }
  };

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
        checkToken() && checkRole() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default SuperVisorRoute;
