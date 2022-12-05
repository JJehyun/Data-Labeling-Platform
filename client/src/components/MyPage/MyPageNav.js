import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const MyPageNav = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);

  const navMenu_list = {
    listStyle: 'none',
  };

  const navMenu_list__dl = {
    marginBottom: '32px',
  };

  const navMenu_list__dt = {
    fontSize: '17px',
    lineHeight: '24px',
    fontWeight: '700',
    marginBottom: '12px',
  };

  const navMenu_list__dd = {
    fontSize: '15px',
    lineHeight: '22px',
    padding: '8px 0px',
    color: 'rgb(78, 90, 102)',
    fontWeight: '400',
  };

  return (
    <>
      {userInfo.userLevel === 3 ? (
        <aside
          style={{
            width: '180px',
            minHeight: '100%',
            marginRight: '32px',
          }}
        >
          <div
            className="myPageNav"
            style={{ position: 'sticky', top: '110px' }}
          >
            <div className="navProfile" style={{ marginBottom: '40px' }}>
              <dl
                style={{
                  display: 'flex',
                  marginBottom: '16px',
                  WebkitBoxAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <dt
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    marginRight: '16px',
                    flex: '0 0 64px',
                  }}
                >
                  <Avatar
                    size={64}
                    style={{ backgroundColor: '#87d068' }}
                    icon={<UserOutlined />}
                  />
                </dt>
                <dd>
                  <p
                    style={{
                      fontSize: '19px',
                      lineHeight: '24px',
                      fontWeight: '700',
                      color: 'rgb(32, 45, 57)',
                      marginBottom: '4px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {userInfo.userName}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      lineHeight: '20px',
                      fontWeight: '500',
                      color: 'rgb(117, 127, 136)',
                    }}
                  >
                    USER
                  </p>
                </dd>
              </dl>
            </div>
            <div className="navMenu">
              <li className="myHome" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/userMyPage">MY 홈</Link>
                  </dt>
                </dl>
              </li>
              <li className="myHistory" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/activeWorks">나의 활동내역</Link>
                  </dt>
                  <dd style={navMenu_list__dd}>
                    <Link to="/activeWorks">나의 작업내역</Link>
                  </dd>
                  <dd style={navMenu_list__dd}>
                    <Link to="/historyQnA">나의 문의내역</Link>
                  </dd>
                </dl>
              </li>
              <li className="myProfit" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/historyPoint">나의 수익금</Link>
                  </dt>
                  <dd style={navMenu_list__dd}>
                    <Link to="/historyPoint">포인트 내역</Link>
                  </dd>
                  <dd style={navMenu_list__dd}>
                    <Link to="/historyProfits">수익금 신청내역</Link>
                  </dd>
                </dl>
              </li>
              <li className="mySetting" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/UserProfile">나의 계정설정</Link>
                  </dt>
                  <dd style={navMenu_list__dd}>
                    <Link to="/UserProfile">회원정보</Link>
                  </dd>
                  <dd style={navMenu_list__dd}>
                    <Link to="/ProceedsAccount">입금계좌 관리</Link>
                  </dd>
                </dl>
              </li>
            </div>
          </div>
        </aside>
      ) : (
        <aside>
          <div
            className="myPageNav"
            style={{ position: 'sticky', top: '110px' }}
          >
            <div
              className="navProfile"
              style={{ marginBottom: '40px', minWidth: '180px' }}
            >
              <dl
                style={{
                  display: 'flex',
                  marginBottom: '16px',
                  WebkitBoxAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <dt
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    marginRight: '16px',
                    flex: '0 0 64px',
                  }}
                >
                  <Avatar
                    size={64}
                    style={
                      userInfo.userLevel === 0
                        ? { backgroundColor: '#EF5350' } // master
                        : userInfo.userLevel === 1
                        ? { backgroundColor: '#F4D03F' } // supervisor
                        : { backgroundColor: '#5DADE2' } // admin
                    }
                    icon={<UserOutlined />}
                  />
                </dt>
                <dd>
                  <p
                    style={{
                      fontSize: '19px',
                      lineHeight: '24px',
                      fontWeight: '700',
                      color: 'rgb(32, 45, 57)',
                      marginBottom: '4px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {userInfo.userName}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      lineHeight: '20px',
                      fontWeight: '500',
                      color: 'rgb(117, 127, 136)',
                    }}
                  >
                    {userInfo.userLevel === 0
                      ? 'MASTER'
                      : userInfo.userLevel === 1
                      ? 'SUPERVISOR'
                      : 'ADMIN'}
                  </p>
                </dd>
              </dl>
            </div>
            <div className="navMenu">
              <li className="myHome" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/adminMyPage">MY 홈</Link>
                  </dt>
                </dl>
              </li>
              <li className="myProfit" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/WorksAskList">문의 목록</Link>
                  </dt>
                </dl>
              </li>
              <li className="mySetting" style={navMenu_list}>
                <dl style={navMenu_list__dl}>
                  <dt style={navMenu_list__dt}>
                    <Link to="/UserManager">유저 관리</Link>
                  </dt>
                </dl>
              </li>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
export default MyPageNav;
