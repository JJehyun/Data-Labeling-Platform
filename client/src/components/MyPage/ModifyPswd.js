import React from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { Form, Input, Button } from 'antd';
import {
  myPageContainer_bottom_fixedBottom,
  fixedBottom_div,
  fixedBottom_button__last,
  fixedBottom_button_button,
} from '../../pages/UserMyPage/style';

const ModifyPswd = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);

  const handleSubmitPswd = (form) => {
    axios
      .post('/api/UserChangePw', {
        params: {
          id: userInfo.id,
          oldpw: form.lastPswd,
          newpw: form.newPswd,
        },
      })
      .then((data) => {
        if(data.data.Change) {
          alert('비밀번호 변경이 완료되었습니다.');
        } else {
          alert('기존(임시) 비밀번호가 일치하지 않습니다.');
        }
      });
  };

  return (
    <div
      className="pswdBottom"
      style={{
        maxWidth: '400px',
        padding: '0px 0px 0px',
        boxSizing: 'border-box',
      }}
    >
      <Form
        name="modifyPswd"
        size="large"
        layout="vertical"
        onFinish={handleSubmitPswd}
      >
        <Form.Item
          name="lastPswd"
          label="기존(임시) 비밀번호"
          rules={[
            {
              required: true,
              message: '기존(임시) 비밀번호를 입력하세요.',
            },
          ]}
        >
          <Input.Password placeholder="기존(임시) 비밀번호를 입력하세요." />
        </Form.Item>
        <Form.Item
          name="newPswd"
          label="새 비밀번호"
          hasFeedback
          rules={[
            { required: true, message: '새 비밀번호를 입력하세요.' },
            {
              validator(_, value) {
                var rule =
                  /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;
                if (!value || rule.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    '숫자, 특수문자 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력해주세요.'
                  )
                );
              },
            },
          ]}
        >
          <Input.Password placeholder="영문 2자 및 숫자, 특수문자를 조합한 8자 이상" />
        </Form.Item>
        <Form.Item
          name="confirmPswd"
          label="새 비밀번호 확인"
          dependencies={['newPswd']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '새 비밀번호 확인을 입력해주세요.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPswd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('새 비밀번호 확인이 일치하지 않습니다.')
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="설정하신 비밀번호를 다시 입력하세요." />
        </Form.Item>
        <div className="fixedBottom" style={myPageContainer_bottom_fixedBottom}>
          <div style={fixedBottom_div}>
            <div className="button" style={fixedBottom_button__last}>
              <Form.Item style={{ marginBottom: '0px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={fixedBottom_button_button}
                >
                  변경
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModifyPswd;
