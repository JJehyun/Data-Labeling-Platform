import React, { useEffect, useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { DollarCircleOutlined, WarningOutlined } from '@ant-design/icons';
import UserMyPageNav from '../../components/MyPage/MyPageNav';
import BlockTable from '../../components/AdminMyPageTable/blockTable';
import ProvisionTable from '../../components/AdminMyPageTable/provisionTable';
import { getUserInfoSelector } from '../../states';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import Header from '../../components/Header/Header';

function ManageUser({ history }) {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [requestList, setRequestList] = useState({}); //작업통과자 목록
  const [warningList, setWarningList] = useState({}); //사용자별 경고 횟수
  useEffect(() => {
    PointRequestList();
    WarningLists();
  }, []);

  async function PointRequestList() {
    let result = await axios
      .post('/api/PointRequestList', { company: userInfo.companyIdx })
      .then((data) => {
        return data.data.List;
      });
    await setRequestList(result);
  }
  async function WarningLists() {
    let result = await axios
      .post('/api/warning', { companyIndex: userInfo.companyIdx })
      .then((data) => {
        console.log(data);
        return data.data.list;
      });
    await setWarningList(result);
  }

  const { TabPane } = Tabs;
  const { Title } = Typography;
  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          height: '100vh',
          maxWidth: 1380,
          padding: '40px 80px',
          margin: 'auto',
        }}
      >
        <UserMyPageNav />
        {/* 관리자 nav Bar*/}
        <div>
          <Card>
            <Title>유저 관리</Title>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <DollarCircleOutlined />
                    작업 통과자 목록
                  </span>
                }
                key="1"
              >
                <ProvisionTable List={requestList} />
                {/* 작업 통과자 목록 보여주는 table 컴포넌트*/}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <WarningOutlined />
                    경고 횟수 목록
                  </span>
                }
                key="2"
              >
                <BlockTable Lists={warningList} />
                {/*작업자 경고 횟수를 보여주거나 , 작업자를 차단할 수 있는 table컴포넌트*/}
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}
export default ManageUser;
