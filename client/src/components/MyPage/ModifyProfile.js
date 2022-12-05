import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { getUserInfoSelector } from '../../states';
import axios from 'axios';
import UserWithdrawal from '../../components/MyPage/UserWithdrawal';
import ModifyUserInfoModal from '../../components/MyPage/ModifyUserInfoModal';
import { Descriptions, Form, Input, Button, Switch, Row, Col } from 'antd';
import {
  myPageContainer_emphasis,
  myPageContainer_bottom_fixedBottom,
  fixedBottom_div,
  fixedBottom_button__last,
  fixedBottom_button_button,
} from '../../pages/UserMyPage/style';

const profileBottom_section_title = {
  fontSize: '19px',
  lineHeight: '24px',
  fontWeight: '700',
  color: 'rgb(32, 45, 57)',
  padding: '8px 0px',
  borderBottom: '1px solid rgb(235, 236, 238)',
  marginBottom: '24px',
};

const profileBottom_section_list = {
  display: 'flex',
  WebkitBoxPack: 'justify',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const profileBottom_section_list_title = {
  fontSize: '13px',
  lineHeight: '20px',
  fontWeight: '700',
  color: 'rgb(78, 90, 102)',
};

const profileBottom_withdraw = {
  fontSize: '13px',
  lineHeight: '20px',
  color: 'rgb(78, 90, 102)',
  fontWeight: '700',
  textDecoration: 'underline',
  background: 'transparent',
  border: '0px',
  marginBottom: '50px',
  cursor: 'pointer',
};

const profileBottom_explanation = {
  color: 'rgb(117, 127, 136)',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0px',
};

const ModifyProfile = () => {
  const [userInfo, setUserInfo] = useRecoilState(getUserInfoSelector);

  const [emailModifyMode, setEmailModifyMode] = useState(false); // 이메일 변경 모드
  const [isVerify, setIsVerify] = useState(true); // true: 이메일 인증 완료, false: 이메일 인증 전
  const [newEmail, setNewEmail] = useState(''); // 새로운 이메일(아이디)
  const [verifyCode, setVerifyCode] = useState('Not Code'); // 서버에서 보낸 이메일 인증 번호

  const [modalVisible, setModalVisible] = useState(false); // 본인인증으로 정보 수정 modal

  const [withdrawalMode, setWithdrawalMode] = useState(false); // 회원탈퇴 모드

  const handleEmailInput = (input) => {
    setNewEmail(input.target.value);
  };

  const handleEmailModifyMode = () => {
    setEmailModifyMode(!emailModifyMode);
    setIsVerify(true);
  };

  const handleWithdrawalMode = () => {
    setWithdrawalMode(!withdrawalMode);
  };

  const handleUserInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  //아이디 중복확인 및 인증번호 전송 함수
  const checkDuplicateID = () => {
    axios.post('/api/DuplicateID', { params: newEmail }).then((data) => {
      const duplicate = data.data.Duplicate; // true: 중복 없음
      const code = data.data.Authent;

      if (!duplicate) {
        alert('중복된 이메일(아이디)가 존재 합니다.');
        setIsVerify(true);
      } else {
        console.log(code, '인증번호');
        alert('인증번호가 전송 되었습니다.');
        setVerifyCode(code);
        setIsVerify(false);
      }
    });
  };

  const sendVerifyMail = () => {
    checkDuplicateID();
  };

  const handleSubmitEmail = () => {
    axios
      .post('/api/UserChange', {
        params: {
          id: userInfo.id,
          email: userInfo.emailReceive,
          mesg: userInfo.mesgReceive,
          changeId: newEmail, // 변경할 이메일
        },
      })
      .then((data) => {
        if (data.data.Receive) {
          const copyUserInfo = { ...userInfo };
          copyUserInfo.id = newEmail;
          setUserInfo(copyUserInfo);

          alert('이메일(아이디) 변경이 완료되었습니다.');
          setNewEmail('');
          setEmailModifyMode(false);
        }
      });
  };

  const handleSubmitReceive = (form) => {
    const emailReceive = form.emailReceive ? 1 : 0; // 이메일 수신동의
    const mesgReceive = form.mesgReceive ? 1 : 0; // 메시지 수신동의

    axios
      .post('/api/UserChange', {
        params: {
          id: userInfo.id,
          email: emailReceive,
          mesg: mesgReceive,
          changeId: userInfo.id,
        },
      })
      .then((res) => {
        if (res.data.Receive) {
          const copyUserInfo = { ...userInfo };
          copyUserInfo.emailReceive = emailReceive;
          copyUserInfo.mesgReceive = mesgReceive;
          setUserInfo(copyUserInfo);

          alert('회원정보가 변경되었습니다.');
        }
      });
  };

  return (
    <div
      className="profileBottom"
      style={{
        padding: '0px 0px 0px',
        boxSizing: 'border-box',
      }}
    >
      <p style={profileBottom_explanation}>
        회원정보 수정 후 하단의{' '}
        <em style={myPageContainer_emphasis}>[저장하기]</em> 버튼을 클릭해야
        반영이 완료됩니다.
      </p>
      <section
        className="email"
        style={{ margin: '12px 0px 30px', maxWidth: '400px' }}
      >
        <Form
          name="modifyEmail"
          wrapperCol={{ span: 25 }}
          size="large"
          layout="vertical"
          onFinish={handleSubmitEmail}
        >
          {!emailModifyMode ? (
            <Row gutter={6}>
              <Col span={19}>
                <Form.Item label="이메일(아이디)">
                  <Input defaultValue={userInfo.id} disabled="true" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item>
                  <Button
                    htmlType="button"
                    onClick={handleEmailModifyMode}
                    style={{ marginTop: '48px' }}
                  >
                    변경하기
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <>
              <Row>
                <Form.Item
                  name="newEmail"
                  label="이메일(아이디)"
                  style={{ marginBottom: '10px' }}
                  hasFeedback
                  requiredMark={false}
                  rules={[
                    {
                      required: true,
                      message: '새 이메일(아이디)를 입력해주세요.',
                    },
                    {
                      validator(_, value) {
                        var rule =
                          /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
                        if (!value || rule.test(value)) {
                          if (userInfo.id !== value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('기존 이메일(아이디)와 동일합니다.')
                          );
                        }
                        return Promise.reject(
                          new Error('이메일 형식을 확인해주세요.')
                        );
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="변경하고자 하는 이메일(아이디)을 입력하세요."
                    style={{ width: '400px' }}
                    onChange={handleEmailInput}
                    disabled={isVerify ? false : true}
                  />
                </Form.Item>
              </Row>
              {!isVerify && (
                <Row gutter={[6, 8]}>
                  <Col span={19}>
                    <Form.Item
                      name="verification"
                      style={{ marginBottom: '10px' }}
                      hasFeedback
                      rules={[
                        { required: true, message: '인증번호를 입력해주세요.' },
                        {
                          validator(_, value) {
                            if (verifyCode == value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('인증번호가 일치하지 않습니다.')
                            );
                          },
                        },
                      ]}
                    >
                      <Input placeholder="인증번호를 입력해주세요." />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Button htmlType="button" onClick={sendVerifyMail} block>
                      재전송
                    </Button>
                  </Col>
                </Row>
              )}
              <Row gutter={8}>
                <Col span={12}>
                  <Button
                    htmlType="button"
                    onClick={handleEmailModifyMode}
                    block
                  >
                    변경취소
                  </Button>
                </Col>
                <Col span={12}>
                  {isVerify ? (
                    <Form.Item name="sendEmail">
                      <Button
                        htmlType="button"
                        onClick={sendVerifyMail}
                        block
                        disabled={newEmail !== '' ? false : true}
                      >
                        인증메일 발송
                      </Button>
                    </Form.Item>
                  ) : (
                    <Form.Item name="submit">
                      <Button type="primary" htmlType="submit" block>
                        인증 완료
                      </Button>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Form>
      </section>
      <section className="userInfo" style={{ margin: '12px 0px 30px' }}>
        <h2 style={profileBottom_section_title}>회원정보</h2>
        <Descriptions>
          <Descriptions.Item name="userName" label="이름">
            {userInfo.userName}
          </Descriptions.Item>
          <Descriptions.Item name="telephone" label="휴대폰번호">
            {userInfo.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item name="birth" label="생년월일">
            {userInfo.birthday}
          </Descriptions.Item>
        </Descriptions>
        <Button onClick={handleUserInfoModal}>
          본인인증으로 정보 수정하기
        </Button>
        {modalVisible && (
          <ModifyUserInfoModal
            setModalVisible={setModalVisible}
            setUserInfo={setUserInfo}
          />
        )}
      </section>
      <Form
        name="receiveAgreement"
        wrapperCol={{ span: 25 }}
        size="large"
        layout="vertical"
        onFinish={handleSubmitReceive}
      >
        <section
          className="receiveAgreement"
          style={{
            margin: '12px 0px 10px',
          }}
        >
          <h2 style={profileBottom_section_title}>메시지 수신동의</h2>
          <p style={profileBottom_explanation}>
            작업 반려 메시지 등과 서비스의 주요정책/공지사항 관련 내용은 메시지
            수신동의 여부와 관계없이 발송됩니다.
          </p>
          <div style={{ maxWidth: '400px', marginTop: '30px' }}>
            <dl style={profileBottom_section_list}>
              <dt style={profileBottom_section_list_title}>이메일 수신여부</dt>
              <dd>
                <Form.Item
                  name="emailReceive"
                  initialValue={userInfo.emailReceive ? true : false}
                  style={{ marginBottom: '0px' }}
                >
                  <Switch
                    defaultChecked={userInfo.emailReceive ? true : false}
                  />
                </Form.Item>
              </dd>
            </dl>
            <dl style={profileBottom_section_list}>
              <dt style={profileBottom_section_list_title}>SMS 수신여부</dt>
              <dd>
                <Form.Item
                  name="mesgReceive"
                  initialValue={userInfo.mesgReceive ? true : false}
                  style={{ marginBottom: '0px' }}
                >
                  <Switch
                    defaultChecked={userInfo.mesgReceive ? true : false}
                  />
                </Form.Item>
              </dd>
            </dl>
          </div>
        </section>
        {withdrawalMode ? (
          <UserWithdrawal />
        ) : (
          <p
            className="withdraw"
            style={
              withdrawalMode
                ? { paddingTop: '30px' }
                : {
                    paddingTop: '30px',
                    borderTop: '1px solid rgb(235, 236, 238',
                  }
            }
          >
            <button
              type="button"
              style={profileBottom_withdraw}
              onClick={handleWithdrawalMode}
            >
              회원 탈퇴하기
            </button>
          </p>
        )}
        <div className="fixedBottom" style={myPageContainer_bottom_fixedBottom}>
          <div style={fixedBottom_div}>
            <div className="button" style={fixedBottom_button__last}>
              <Form.Item style={{ marginBottom: '0px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={fixedBottom_button_button}
                >
                  저장하기
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModifyProfile;
