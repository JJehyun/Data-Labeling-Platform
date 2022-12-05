import React, { useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Input,
  Checkbox,
  Button,
  Form,
  Image,
  message,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import compony from '../../Images/companylogo.png';
import { Link } from 'react-router-dom';
import { EmailRules, passwordRules } from './vaildRules';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { getUserInfoSelector } from '../../states';
import { getCookie, setCookie } from './cookies';

function Login({ history }) {
  const { Footer } = Layout;
  const [userInfo, setUserInfo] = useRecoilState(getUserInfoSelector);

  useEffect(() => {
    if (
      getCookie('labelJWTToken') &&
      userInfo.token === getCookie('labelJWTToken')
    ) {
      history.push('/');
    }
  }, [userInfo]);

  const errorMessage = (mes) => {
    message.error(mes);
  };

  const handleSubmit = (values) => {
    axios.post('/api/Login', { params: values }).then((data) => {
      const loginData = data.data;

      if (loginData.LoginID === false) {
        return errorMessage('일치하는 이메일 주소가 없습니다!');
      }
      if (loginData.LoginPW === false) {
        return errorMessage('비밀번호가 일치하지 않습니다!');
      }

      setUserInfo(loginData.UserInfo);
      setCookie('labelJWTToken', loginData.UserInfo.token);
    });
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white' }}>
      <div style={{ marginTop: '150px' }}>
        <center>
          <Image src={compony} width="300px" height="120px" />
        </center>
        <br />
        <Row style={{ backgroundColor: 'white' }}>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}></Col>
          <Col xs={20} sm={16} md={12} lg={8} xl={4}>
            <Form
              onFinish={handleSubmit}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
            >
              <Form.Item name="username" {...EmailRules}>
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="이메일을 입력해주세요."
                />
              </Form.Item>
              <Form.Item name="password" {...passwordRules}>
                <Input
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>아이디 저장</Checkbox>
                  <span style={{ margin: '0px 0.625rem' }}>
                    아직 아이디가 없나요?
                  </span>
                  <Link to="/join">
                    <a className="login-form-forgot" href="">
                      회원가입
                    </a>
                  </Link>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ borderRadius: '25px' }}
                >
                  로그인
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Link to="/findIdPw">
                  <a className="login-form-forgot" href="">
                    아이디
                  </a>
                </Link>
                &nbsp; ∙ &nbsp;
                <Link to="/findIdPw">
                  <a className="login-form-forgot" href="">
                    비밀번호 찾기
                  </a>
                </Link>
              </div>
            </Form>
          </Col>
          <Col xs={2} sm={4} md={6} lg={8} xl={10}></Col>
        </Row>
      </div>
      <Footer
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'gray',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#f0f2f5',
        }}
      >
        (주) 코리아퍼스텍 (대표:장영규) | 사업자등록번호 : 223-81-18325 | 서울시
        강서구 화곡로 222
        <br />
        고객 센터 : koreafirct@koreafirct.kr | 02) 838-0300
      </Footer>
    </Layout>
  );
}

export default Login;
