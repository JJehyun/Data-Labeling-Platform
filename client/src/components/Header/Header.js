import React from 'react';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { removeCookie } from '../../pages/Login/cookies';
import { Layout, Space, Divider, Image, Avatar } from 'antd';
import logo from '../../Images/companylogo.png';
import { UserOutlined } from '@ant-design/icons';

const Header = () => {
  const { Header } = Layout;
  const userInfo = useRecoilValue(getUserInfoSelector);
  const history = useHistory();
  const location = useLocation();

  const header_userProfile = {
    fontSize: '15px',
    lineHeight: '42px',
    letterSpacing: '-0.14px',
    color: '#a5a5a5',
  };

  const header_userProfile__em = {
    fontStyle: 'normal',
    fontWeight: '700',
    color: 'rgb(46, 125, 255)',
  };

  const header_userProfile__link = {
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    color: '#b4b4b4',
    marginRight: 20,
  };

  const getUserLevel = () => {
    switch (userInfo.userLevel) {
      case 0:
        return 'MASTER';
        break;
      case 1:
        return 'SUPERVISOR';
        break;
      case 2:
        return 'ADMIN';
        break;
      case 3:
        return 'USER';
        break;
      default:
        return 'ERROR';
        break;
    }
  };

  const logOutHandler = () => {
    removeCookie('labelJWTToken');
    history.push('/login');
  };

  const myPageRoutePathList = [
    '/userMyPage',
    '/activeWorks',
    '/historyQnA',
    '/historyPoint',
    '/historyProfits',
    '/UserProfile',
    '/ProceedsAccount',
    '/adminMyPage',
    '/WorksAskList',
    '/UserManager',
  ];

  return (
    <Header
      className="logout"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottom: '1px solid rgb(235, 236, 238)',
      }}
    >
      <div className="logo">
        <Image src={logo} width="100px" height="65px" />
      </div>

      {userInfo.userLevel !== 1 && (
        <div style={{ position: 'absolute', left: 170 }}>
          <Link
            style={
              location.pathname === '/'
                ? { ...header_userProfile__link, color: 'red' }
                : header_userProfile__link
            }
            to="/"
          >
            작업하기
          </Link>

          <Link
            style={
              myPageRoutePathList.includes(location.pathname)
                ? { ...header_userProfile__link, color: 'red' }
                : header_userProfile__link
            }
            to={userInfo.userLevel !== 3 ? '/adminMyPage' : '/userMyPage'}
          >
            마이페이지
          </Link>
        </div>
      )}

      <Space>
        <div className="avator" style={header_userProfile}>
          <Avatar
            size={42}
            style={
              userInfo.userLevel === 0
                ? { backgroundColor: '#EF5350' } // master
                : userInfo.userLevel === 1
                ? { backgroundColor: '#F4D03F' } // supervisor
                : userInfo.userLevel === 2
                ? { backgroundColor: '#5DADE2' } // admin
                : { backgroundColor: '#87d068' } // user
            }
            icon={<UserOutlined />}
          />
        </div>
        <div style={header_userProfile}>
          <em style={header_userProfile__em}>{userInfo.userName}</em> 님
        </div>
        <Divider type="vertical" />
        <div style={header_userProfile}>
          등급 <em style={header_userProfile__em}>{getUserLevel()}</em>
        </div>
        <Divider type="vertical" />
        <div style={header_userProfile}>
          <a onClick={logOutHandler}>로그아웃</a>
        </div>
      </Space>
    </Header>
  );
};

export default Header;
