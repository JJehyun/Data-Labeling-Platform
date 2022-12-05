import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { passwordRules, formItemLayout } from '../../pages/Login/vaildRules';
function ChangePw({ history, emailBox }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const params = { ...values, emailBox };
    axios.post('/api/ChangePw', { params: params }).then((date) => {
      if (date.data.changePw) {
        alert('비밀번호 변경이 완료 되었습니다.');
        history.push('/');
      }
    });
  };

  return (
    <>
      <div style={{ marginTop: '5%' }}></div>
      <div style={{ marginTop: '20px' }}>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '010',
          }}
          scrollToFirstError
        >
          <Form.Item name="password" label="새 비밀번호" {...passwordRules}>
            <Input.Password
              placeholder="비밀번호를 8자 이상으로 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="새 비밀 번호 확인"
            tooltip="비밀번호을 다시 입력해주세요!"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '비밀번호을 다시 한번 입력해주세요!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error('비밀번호가 일치 하지 않습니다')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="비밀번호를 다시 한번 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>
          <center>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '120px', height: '50px' }}
            >
              비밀번호변경
            </Button>
          </center>
        </Form>
      </div>
    </>
  );
}

export default ChangePw;
