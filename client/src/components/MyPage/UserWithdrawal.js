import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { removeCookie } from '../../pages/Login/cookies';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import axios from 'axios';
import { Form, Input, Button, Modal } from 'antd';

const profileBottom_section_title = {
  fontSize: '19px',
  lineHeight: '24px',
  fontWeight: '700',
  color: 'rgb(32, 45, 57)',
  padding: '8px 0px',
  borderBottom: '1px solid rgb(235, 236, 238)',
  marginBottom: '24px',
};

const profileBottom_explanation = {
  color: 'rgb(117, 127, 136)',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0px',
};

const UserWithdrawal = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const history = useHistory();
  const [modalVisible, setModalVisible] = useState(false); // 탈퇴 확인용 modal
  const [passwordInput, setPasswordInput] = useState(''); // 탈퇴 확인용 비밀번호 input

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handlePswdInput = (input) => {
    setPasswordInput(input);
  };

  const handleSubmitWithdrawal = () => {
    axios
      .post('/api/AccountWithdrawal', {
        params: {
          id: userInfo.id,
          pw: passwordInput,
        },
      })
      .then((data) => {
        if (data.data.matchedPassword && data.data.UserWithdrawal) {
          alert('탈퇴 처리가 완료되었습니다.');
          // 탈퇴 처리 후 로그아웃
          removeCookie('labelJWTToken');
          history.push('/login');
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      });
  };

  return (
    <section
      className="withdrawal"
      style={{
        margin: '12px 0px 30px',
        marginBottom: '100px',
      }}
    >
      <h2 style={profileBottom_section_title}>회원 탈퇴</h2>
      <p style={profileBottom_explanation}>
        회원님의 개인정보 보호를 위해 비밀번호를 다시 한번 입력해 주시기
        바랍니다.
      </p>
      <div style={{ maxWidth: '400px', margin: '30px 0px' }}>
        <Form
          name="withdrawForm"
          size="large"
          layout="vertical"
          onValuesChange={handlePswdInput}
        >
          <Form.Item
            name="password"
            label="현재 비밀번호"
            style={{ marginBottom: '10px' }}
            rules={[
              {
                required: true,
                message: '비밀번호를 다시 한번 입력해주세요.',
              },
            ]}
          >
            <Input.Password placeholder="비밀번호를 입력해주세요." />
          </Form.Item>
          <Button type="primary" htmlType="button" onClick={handleModal} block>
            회원 탈퇴 진행하기
          </Button>
          <Modal
            title="회원탈퇴"
            visible={modalVisible}
            closable={false}
            footer={[
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmitWithdrawal}
              >
                탈퇴
              </Button>,
              <Button onClick={handleModal}>취소</Button>,
            ]}
          >
            <p>
              회원탈퇴 처리 후에는 회원님의 개인정보 및 코리아퍼스텍에서
              만들어진 모든 데이터는 삭제됩니다. 그래도 탈퇴를 진행하시겠습니까?
            </p>
          </Modal>
        </Form>
      </div>
    </section>
  );
};

export default UserWithdrawal;
