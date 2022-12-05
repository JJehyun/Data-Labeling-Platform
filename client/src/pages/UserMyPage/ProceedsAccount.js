import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { getUserInfoSelector } from '../../states';
import axios from 'axios';
import { Form, Input, Select, Button } from 'antd';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_bottom,
  myPageContainer_bottom_form,
  myPageContainer_bottom_fixedBottom,
  fixedBottom_div,
  fixedBottom_button,
  fixedBottom_button__last,
  fixedBottom_button_button,
} from './style';

const ProceedsAccount = () => {
  const { Option } = Select;
  const [userInfo, setUserInfo] = useRecoilState(getUserInfoSelector);
  const [registerMode, setRegisterMode] = useState(false);

  const handleMode = () => {
    setRegisterMode(!registerMode);
  };

  const handleSubmitAccount = (form) => {
    axios
      .post('/api/AccountChange', {
        params: {
          id: userInfo.id,
          bankName: form.bankName,
          // 원칙적으로 본읜명의만 등록 가능하도록 우선 본인명의로 설정
          accountHolder: userInfo.userName,
          account: form.account,
        },
      })
      .then((data) => {
        if (data.data.AccountChange) {
          const copyUserInfo = { ...userInfo };
          copyUserInfo.bankName = form.bankName;
          // 원칙적으로 본읜명의만 등록 가능하도록 우선 본인명의로 설정
          copyUserInfo.accountHolder = userInfo.userName;
          setUserInfo(copyUserInfo);

          alert('입금계좌 변경이 완료되었습니다.');
          setRegisterMode(false);
        }
      });
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="proceedsAccount">
            <div className="top">
              <h1 style={myPageContainer_top__h1}>입금계좌 관리</h1>
            </div>
            <div className="bottom" style={myPageContainer_bottom}>
              <Form
                name="registerAccount"
                wrapperCol={{ span: 25 }}
                size="large"
                layout="vertical"
                onFinish={handleSubmitAccount}
                requiredMark={false}
              >
                <section
                  className="formSection"
                  style={myPageContainer_bottom_form}
                >
                  {registerMode ? (
                    <>
                      <Form.Item
                        name="bankName"
                        label="은행명"
                        initialValue={userInfo.bankName}
                      >
                        <Select defaultValue={userInfo.bankName}>
                          <Option value="" disabled>
                            은행 선택
                          </Option>
                          <Option value="외환은행">외환은행</Option>
                          <Option value="기업은행">기업은행</Option>
                          <Option value="국민은행">국민은행</Option>
                          <Option value="우리은행">우리은행</Option>
                          <Option value="신한은행">신한은행</Option>
                          <Option value="KEB하나은행">KEB하나은행</Option>
                          <Option value="농협은행">농협은행</Option>
                          <Option value="농협회원조합">농협회원조합</Option>
                          <Option value="지역농축협">지역농축협</Option>
                          <Option value="SC은행">SC은행</Option>
                          <Option value="한국씨티은행">한국씨티은행</Option>
                          <Option value="우체국">우체국</Option>
                          <Option value="경남은행">경남은행</Option>
                          <Option value="광주은행">광주은행</Option>
                          <Option value="대구은행">대구은행</Option>
                          <Option value="도이치은행">도이치은행</Option>
                          <Option value="부산은행">부산은행</Option>
                          <Option value="산림조합">산림조합</Option>
                          <Option value="산업은행">산업은행</Option>
                          <Option value="상호저축은행">상호저축은행</Option>
                          <Option value="새마을금고">새마을금고</Option>
                          <Option value="수협">수협</Option>
                          <Option value="신협중앙회">신협중앙회</Option>
                          <Option value="전북은행">전북은행</Option>
                          <Option value="제주은행">제주은행</Option>
                          <Option value="교보증권">교보증권</Option>
                          <Option value="대신증권">대신증권</Option>
                          <Option value="미래에셋대우">미래에셋대우</Option>
                          <Option value="DB금융투자">DB금융투자</Option>
                          <Option value="메리츠증권">메리츠증권</Option>
                          <Option value="부국증권">부국증권</Option>
                          <Option value="삼성증권">삼성증권</Option>
                          <Option value="솔로몬투자증권">솔로몬투자증권</Option>
                          <Option value="신영증권">신영증권</Option>
                          <Option value="신한금융투자">신한금융투자</Option>
                          <Option value="NH투자증권">NH투자증권</Option>
                          <Option value="유진투자증권">유진투자증권</Option>
                          <Option value="이베스트증권">이베스트증권</Option>
                          <Option value="키움증권">키움증권</Option>
                          <Option value="하나금융투자">하나금융투자</Option>
                          <Option value="하이투자">하이투자</Option>
                          <Option value="한국투자">한국투자</Option>
                          <Option value="한화증권">한화증권</Option>
                          <Option value="KB증권">KB증권</Option>
                          <Option value="SK증권">SK증권</Option>
                          <Option value="카카오뱅크">카카오뱅크</Option>
                          <Option value="케이뱅크">케이뱅크</Option>
                          <Option value="HSBC은행">HSBC은행</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="accountHolder"
                        label="예금주"
                        initialValue={userInfo.accountHolder}
                      >
                        <Input defaultValue={userInfo.accountHolder} disabled />
                      </Form.Item>
                      <Form.Item
                        name="account"
                        label="계좌번호"
                        initialValue={userInfo.account}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: '변경할 계좌번호를 입력해주세요.',
                          },
                          {
                            validator(_, value) {
                              var rule = /^[0-9]+$/;
                              if (rule.test(value)) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error('숫자만 입력해주세요.')
                              );
                            },
                          },
                        ]}
                      >
                        <Input
                          style={{ minWidth: '100%' }}
                          defaultValue={userInfo.account}
                          placeholder="'-'없이 숫자만 입력"
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item label="은행명">
                        <Input defaultValue={userInfo.bankName} disabled />
                      </Form.Item>
                      <Form.Item label="예금주">
                        <Input defaultValue={userInfo.accountHolder} disabled />
                      </Form.Item>
                      <Form.Item label="계좌번호">
                        <Input defaultValue={userInfo.account} disabled />
                      </Form.Item>
                    </>
                  )}
                  <p
                    style={{
                      padding: '0px 4px 24px',
                      color: 'rgb(117, 127, 136)',
                      fontSize: '13px',
                      lineHeight: '20px',
                      margin: '0px',
                    }}
                  >
                    입금계좌는 본인 명의의 계좌만 등록 가능합니다.
                    <br />
                    예금주 명과 회원정보의 성명이 다른 경우 수익금 지급에 문제가
                    발생할 수 있습니다.
                  </p>
                </section>
                <div
                  className="fixedBottom"
                  style={myPageContainer_bottom_fixedBottom}
                >
                  {registerMode ? (
                    <div style={fixedBottom_div}>
                      <div className="button" style={fixedBottom_button}>
                        <button
                          type="button"
                          style={fixedBottom_button_button}
                          onClick={handleMode}
                        >
                          취소
                        </button>
                      </div>
                      <div className="button" style={fixedBottom_button__last}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={fixedBottom_button_button}
                          >
                            확인
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="button" style={fixedBottom_button__last}>
                        <button
                          type="button"
                          style={fixedBottom_button_button}
                          onClick={handleMode}
                        >
                          입금계좌 수정
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ProceedsAccount;
