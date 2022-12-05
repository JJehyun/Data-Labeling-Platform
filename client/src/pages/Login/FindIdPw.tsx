import React, { useState } from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import IdForm from '../../components/FindIdPwComponents/findIdForm';
import PwForm from '../../components/FindIdPwComponents/findpwForm';
function FindidPw({ history }) {
  const { TabPane } = Tabs;

  return (
    <>
      <div style={{ marginTop: '5%' }}></div>
      <Row>
        <Col
          span={18}
          offset={3}
          style={{ padding: '30px 30px 30px 30px', backgroundColor: '#ececec' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span
              style={{ padding: '30px', fontSize: '30px', fontWeight: 800 }}
            >
              아이디 찾기
            </span>
            <span
              style={{ padding: '30px', fontSize: '30px', fontWeight: 800 }}
            >
              비밀번호 찾기
            </span>
          </div>
          <div
            className="site-card-border-less-wrapper"
            style={{ display: 'flex', justifyContent: 'space-around' }}
          >
            <Card title="user id 찾기" bordered={false} style={{ width: 700 }}>
              <p>
                가입 시 본인인증을 하셨다면 [본인인증 찾기]로 아이디(이메일)
                전체를 확인 할 수 있습니다.
              </p>
              <p>
                [회원정보로 찾기는 일부 가려진 상태의 아이디(이메일을 확인 할 수
                있습니다.)]
              </p>
              <p>
                본인인증이 불가한 상태에서 아이디(이메일) 전체를 확인하셔야
                한다면 고객센터로 문의주세요.
              </p>
            </Card>
            <Card
              title="password  찾기"
              bordered={false}
              style={{ width: 700 }}
            >
              <p>
                가입 시 본인인증을 하셨다면 [본인인증으로 찾기]로 비밀번호를
                재설정 하실 수 있습니다.
              </p>
              <p>
                [회원정보로 찾기]를 진행하시면 입력하신 아이디(이메일)로 임시
                비밀번호가 발송됩니다.
              </p>
              <p>
                본인인증이 불가한 상태에서 비밀번호 찾기가 계속 실패한다면
                고객센터로 문의주세요.
              </p>
            </Card>
          </div>
        </Col>
        <Col span={18} offset={3} style={{ padding: '30px 30px 30px 30px' }}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <UserOutlined /> 아이디 찾기
                </span>
              }
              key="1"
            >
              <IdForm />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <LockOutlined /> 비밀번호 찾기
                </span>
              }
              key="2"
            >
              <PwForm />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}

export default FindidPw;
