import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import ChangePw from './changePw';
import {
  EmailRules,
  certifyRules,
  nameRules,
} from '../../pages/Login/vaildRules';

function PwForm({ history }) {
  const [findPw, setFindPw] = useState(false); // pw 찾을 인증 처리가 끝나면 TRUE
  const [emailBox, setEmailBox] = useState(''); // 패쓰워드 변경 이메일 input 상자
  const [authent, setAuthent] = useState('Not find authent'); // 이메일에 발급된 인증 번호
  const [passwordAuthent, setPasswordAuthent] = useState(false); // 이메일 인증이 안된 상태 : false
  const [authentBox, setAuthentBox] = useState(''); //인증 번호 Input Box

  const Authenticationkey = () => {
    axios.post('/api/EmailKey', { params: emailBox }).then((date) => {
      console.log(date.data.Duplicate);
      if (date.data.Duplicate) {
        setAuthent(date.data.Authent);
        alert('인증 번호가 발송되었습니다.');
      } else {
        alert('일치하는 아이디가 없습니다.');
      }
    });
  };

  //인증 번호가 맞는 지 확인해주는 함수
  const confirmKey = () => {
    if (authentBox == authent) {
      alert('이메일 인증이 완료 되었습니다.');
      setPasswordAuthent(true);
    } else {
      alert('이메일 인증 번호를 확인해주세요.');
    }
  };

  const handleFindPw = (values) => {
    if (!passwordAuthent) {
      alert('이메일 인증을 해주세요');
    } else {
      console.log(values);
      setFindPw(true);
    }
  };

  const handleChangeBox = (values) => {
    setEmailBox(values.target.value);
  };

  const handleAuthentBox = (values) => {
    setAuthentBox(values.target.value);
  };

  return (
    <>
      {!findPw ? (
        <div style={{ padding: '5%  0% 15%  35%' }}>
          <Form
            onFinish={handleFindPw}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <div style={{ display: 'flex' }}>
              <Form.Item name="email" label="E-mail" {...EmailRules}>
                <Input
                  value={emailBox}
                  onChange={handleChangeBox}
                  placeholder="ex) OOO @ GOOGLE.COM"
                  style={{ width: '300px', height: '45px' }}
                />
              </Form.Item>
              <Button
                onClick={Authenticationkey}
                type="primary"
                block
                style={{
                  borderRadius: '25px',
                  width: '15%',
                  height: '45px',
                  marginLeft: '10px',
                }}
              >
                인증하기
              </Button>
            </div>
            <div style={{ display: 'flex' }}>
              <Form.Item label="인증 번호" name="AuthentBox" {...certifyRules}>
                <Input
                  value={authentBox}
                  onChange={handleAuthentBox}
                  size="large"
                  placeholder="인증번호를 입력해주세요."
                  style={{ width: '280px' }}
                />
              </Form.Item>
              <Button
                onClick={confirmKey}
                type="primary"
                block
                style={{
                  borderRadius: '25px',
                  width: '15%',
                  height: '45px',
                  marginLeft: '10px',
                }}
              >
                확인 하기
              </Button>
            </div>

            <Form.Item label="이름" name="name" {...nameRules}>
              <Input
                size="large"
                placeholder="이름을 입력해주세요."
                style={{ width: '34%' }}
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
                비밀번호 찾기
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <ChangePw emailBox={emailBox} history={history} />
      )}
    </>
  );
}
export default PwForm;
