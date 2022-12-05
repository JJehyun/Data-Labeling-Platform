import React from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { Form, Input, Button, Modal, DatePicker, Select } from 'antd';

const profileBottom_explanation = {
  color: 'rgb(117, 127, 136)',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '10px',
};

const ModifyUserInfoModal = ({ setModalVisible, setUserInfo }) => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const { Option } = Select;

  const handleModal = () => {
    setModalVisible(false);
  };

  const handleSubmitUserInfo = (form) => {
    const phoneNumber = form.prefix + form.phoneNumber;
    const birth = form.birth._d.toISOString().substring(0, 10);

    axios
      .post('/api/UserInfoChange', {
        params: {
          id: userInfo.id,
          pw: form.password,
          userName: form.userName,
          phoneNumber: phoneNumber,
          birthday: birth,
        },
      })
      .then((data) => {
        if (data.data.matchedPassword && data.data.UserInfoChange) {
          alert('회원정보 변경이 완료되었습니다.');

          const copyUserInfo = { ...userInfo };
          copyUserInfo.userName = form.userName;
          copyUserInfo.phoneNumber = phoneNumber;
          copyUserInfo.birthday = birth;

          setUserInfo(copyUserInfo); // userInfo 업데이트
          setModalVisible(false); // modal 닫기
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        defaultValue="000"
        style={{
          width: 80,
        }}
      >
        <Option value="010">010</Option>
        <Option value="070">070</Option>
        <Option value="082">082</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Modal
      title="회원정보 수정"
      centered
      closable={false}
      visible={true}
      width={600}
      footer={null}
      bodyStyle={{ display: 'flex', justifyContent: 'center' }}
    >
      <Form
        name="modifyUserInfo"
        size="large"
        style={{ width: '400px' }}
        onFinish={handleSubmitUserInfo}
      >
        <Form.Item
          name="userName"
          label="이름"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input placeholder="변경할 이름을 입력해주세요."></Input>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="전화번호"
          rules={[
            { required: true, message: '전화번호를 작성해주세요' },
            {
              required: true,
              pattern: /^[0-9]+$/,
              message: "'-'를 제외한 전화번호를 작성해주세요",
            },
          ]}
        >
          <Input
            placeholder="'-'을 제외한 전화번호를 입력해주세요."
            addonBefore={prefixSelector}
          ></Input>
        </Form.Item>
        <Form.Item
          name="birth"
          label="생년월일"
          rules={[{ required: true, message: '생년월일을 입력해주세요.' }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <p style={profileBottom_explanation}>
          회원님의 개인정보 보호를 위해 비밀번호를 입력해주세요.
        </p>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력하세요.',
            },
          ]}
        >
          <Input.Password placeholder="비밀번호를 입력하세요." />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Form.Item style={{ margin: '0px 10px 0px 0px' }}>
            <Button type="primary" htmlType="submit">
              수정
            </Button>
          </Form.Item>
          <Button onClick={handleModal}>취소</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModifyUserInfoModal;
