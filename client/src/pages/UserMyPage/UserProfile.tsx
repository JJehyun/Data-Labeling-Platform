import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import ModifyProfile from '../../components/MyPage/ModifyProfile';
import ModifyPswd from '../../components/MyPage/ModifyPswd';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_top_tab,
  tab_list__hover,
  tab_list__active,
  tab_list,
  tab_list__last,
} from './style';

const UserProfile = (props) => {
  const [profileMode, setProfileMode] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const handleMode = (e) => {
    setProfileMode(!profileMode);
  };

  const handleHover = (e) => {
    setIsHover(!isHover);
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="userProfile">
            <div className="top">
              <h1 style={myPageContainer_top__h1}>회원정보</h1>
              <ul className="tab" style={myPageContainer_top_tab}>
                <li
                  className={profileMode}
                  onClick={handleMode}
                  onMouseOver={handleHover}
                  onMouseOut={handleHover}
                  style={
                    profileMode
                      ? tab_list__active
                      : isHover
                      ? tab_list__hover
                      : tab_list
                  }
                >
                  회원정보 수정
                </li>
                <li
                  className={!profileMode}
                  onClick={handleMode}
                  onMouseOver={handleHover}
                  onMouseOut={handleHover}
                  style={
                    !profileMode
                      ? tab_list__active
                      : isHover
                      ? tab_list__hover
                      : tab_list__last
                  }
                >
                  비밀번호 변경
                </li>
              </ul>
            </div>
            {profileMode ? <ModifyProfile /> : <ModifyPswd />}
          </div>
        </article>
      </section>
    </>
  );
};

export default UserProfile;
