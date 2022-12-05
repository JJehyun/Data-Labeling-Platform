import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  DatePicker,
  Image,
  Cascader,
} from 'antd';
import compony from '../../Images/companylogo.png';
import axios from 'axios';
import moment from 'moment';
import {
  DateRules,
  EmailRules,
  certifyRules,
  passwordRules,
  nameRules,
  phoneRules,
  tailFormItemLayout,
  formItemLayout,
  AccountRules,
  accountHolderRules,
  BankName,
  bankNameRules,
} from './vaildRules';
const { Option } = Select;

function Join({ history }) {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(''); //user email 입력 input box
  const [duplicate, setDuplicate] = useState(false); //true 되면 이메일 인증 완료
  const [verifyCode, setverifyCode] = useState('Not Code'); // 서버에서 보낸 이메일 인증 번호 저장
  const [vaildCodeBox, setvaildCodeBox] = useState(''); // 인증 번호 인증 하는 input box

  //회원가입 정보를 담아서 서버로 전송 함수
  const onFinish = (value) => {
    if (!duplicate) {
      alert('이메일 인증 확인을 해주세요');
    } else {
      const birthday = moment(value.date._d).format('YYYY-MM-DD');
      const values = { ...value, birthday: birthday };
      console.log(values);
      axios.post('/api/Join', { params: values }).then((date) => {
        console.log(date);
      });
      history.push('/');
      alert('회원가입이 완료 되었습니다!');
    }
  };

  //아이디 중복확인 및 인증번호 전송 함수
  const handleDuplicateID = () => {
    if (userId == '') {
      alert('아이디를 입력해주세요!');
    } else {
      axios.post('/api/DuplicateID', { params: userId }).then((date) => {
        const duplicate = date.data.Duplicate;
        const code = date.data.Authent;
        console.log(duplicate);
        if (!duplicate) {
          alert('중복된 이메일(아이디)가 존재 합니다.');
          setDuplicate(false);
        } else {
          alert('인증번호가 전송 되었습니다.');
          setverifyCode(code);
        }
      });
    }
  };

  //이메일 인증번호 확인 함수
  const CheckVaildCode = () => {
    if (vaildCodeBox == verifyCode) {
      alert('이메일 인증이 완료 되었습니다.');
      setDuplicate(true);
    } else {
      alert('인증 번호를 다시 한번 확인해주세요!');
      setDuplicate(false);
    }
  };

  const handleVaildCode = (a) => {
    setvaildCodeBox(a.target.value);
  };

  const handleChangeId = (a) => {
    setUserId(a.target.value);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
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
    <>
      <div style={{ marginTop: '5%' }}></div>
      <center>
        <Image src={compony} width="300px" height="120px" />
      </center>
      <div style={{ marginTop: '20px' }}>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: '010',
          }}
          scrollToFirstError
        >
          <Form.Item name="email" label="E-mail" {...EmailRules}>
            <Input
              placeholder="ex) OOO @ GOOGLE.COM"
              style={{ height: '35px', width: '360px' }}
              onChange={handleChangeId}
              value={userId}
            />
          </Form.Item>
          <center>
            <Button
              type="primary"
              style={{ height: '33px', marginBottom: '25px' }}
              onClick={handleDuplicateID}
            >
              인증 번호 전송
            </Button>
          </center>
          <Form.Item name="vaild" label="인증번호" {...certifyRules}>
            <Input
              placeholder="이름을 입력해주세요!"
              onChange={handleVaildCode}
              style={{ height: '35px', width: '35%' }}
            />
          </Form.Item>
          <center>
            <Button
              type="primary"
              onClick={CheckVaildCode}
              style={{ height: '33px', marginBottom: '25px' }}
            >
              인증 번호 확인
            </Button>
          </center>
          <Form.Item name="password" label="비밀번호" {...passwordRules}>
            <Input.Password
              placeholder="비밀번호를 8자 이상으로 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="비밀 번호 확인"
            dependencies={['password']}
            tooltip="비밀번호을 다시 입력해주세요!"
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

          <Form.Item name="name" label="이름" {...nameRules}>
            <Input
              placeholder="이름을 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item name="number" label="전화 번호" {...phoneRules}>
            <Input
              placeholder="-제외해서 전화번호를 입력해주세요"
              addonBefore={prefixSelector}
              style={{ width: '35%' }}
            />
          </Form.Item>

          <Form.Item name="date" label="생년 월일" {...DateRules}>
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="생년 월일"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item name="bankName" label="은행이름" {...bankNameRules}>
            <Cascader
              options={BankName}
              placeholder=" 은행을 선택해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item name="account" label="계좌번호" {...AccountRules}>
            <Input
              placeholder="계좌번호를 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item
            name="accountHolder"
            label="예금주"
            {...accountHolderRules}
          >
            <Input
              placeholder="예금주을 입력해주세요!"
              style={{ width: '35%', height: '35px' }}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('개인 정보 수집에 동의 해주세요!')
                      ),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              개인 정보 수집에 동의 하시면 체크를 해주세요{' '}
              <a href="">정보 수집</a>
            </Checkbox>
          </Form.Item>
          <center>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '120px', height: '50px' }}
            >
              회원 가입
            </Button>
          </center>
        </Form>
      </div>
    </>
  );
}

export default Join;
