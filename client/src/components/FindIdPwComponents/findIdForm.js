import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import axios from 'axios';
import { nameRules, phoneRules } from '../../pages/Login/vaildRules';
function IdForm({ history }) {
  const [findId, setFindId] = useState(false); // 사용자가 찾는 아이디가 DB에 있으면 TRUE
  const [userId, setuserId] = useState(''); // 사용자가 찾는 아이디 저장 : userId

  //아이디를 찾아주는 함수
  const handleFindId = (values) => {
    axios.post('/api/FindId', { params: values }).then((date) => {
      console.log(date.data.id);
      if (!date.data.id) {
        //일치하는 아이디 없을 때 alert 창 표시
        alert('일치하는 아이디가 없습니다.');
        setFindId(false);
      } else {
        //일치하는 아이디 있을 때
        setuserId(date.data.id);
        setFindId(true);
      }
    });
  };

  return (
    <>
      {!findId ? (
        <div style={{ padding: '5%  0% 15%  35%' }}>
          <Form
            onFinish={handleFindId}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <Form.Item name="name" label="이름" {...nameRules}>
              <Input
                size="large"
                placeholder="이름을 입력해주세요."
                style={{ width: '38.5%' }}
              />
            </Form.Item>
            <Form.Item name="phone" label="전화 번호" {...phoneRules}>
              <Input
                placeholder="-제외해서 전화번호를 입력해주세요"
                style={{ width: '36.5%', height: '35px' }}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="remember"
                valuePropName="checked"
                noStyle
              ></Form.Item>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ borderRadius: '25px', width: '45%', height: '45px' }}
              >
                아이디 찾기
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <>
          <center>
            <Card style={{ width: '50%', marginTop: '10%' }}>
              아이디 : {userId}
            </Card>
          </center>
        </>
      )}
    </>
  );
}
export default IdForm;
