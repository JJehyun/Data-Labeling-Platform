import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import UserMyPageNav from '../../components/MyPage/MyPageNav';
import PaymentListTable from '../../components/AdminMyPageTable/paymentListTable';
import InspectTable from '../../components/AdminMyPageTable/inspectTable';
import { useRecoilState } from 'recoil';
import { getUserInfoSelector } from '../../states';
import axios from 'axios';
import Header from '../../components/Header/Header';

function AdminMyHome({ history }) {
  const [userInfo, setUserInfo] = useRecoilState(getUserInfoSelector);
  const [myProjectList, setMyProjectList] = useState();

  useEffect(() => {
    MyProjectList();
  }, []);

  async function MyProjectList() {
    await axios
      .post('/api/MyProJectList', { userIndex: userInfo.companyIdx })
      .then((data) => {
        setMyProjectList(data.data.MyProJectList);
        return data.data.MyProJectList;
      });
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          padding: '40px 80px',
          maxWidth: 1380,
          margin: 'auto',
        }}
      >
        <UserMyPageNav />
        {/* 관리자 nav Bar*/}
        <div>
          <InspectTable myProjectList={myProjectList} />{' '}
          {/* 참여중인 프로젝트, 참여중인 프로젝트 검수 횟수 보는 테이블*/}
          <PaymentListTable /> {/* 수익금 신청 내역 테이블*/}
        </div>
      </div>
    </>
  );
}
export default AdminMyHome;
