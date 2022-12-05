import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { Table, Button, Input, Form, Empty, Modal } from 'antd';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_bottom,
  myPageContainer_list,
  myPageContainer_emphasis,
} from './style';

const historyProfits_middle_profitPointDescription__li = {
  listStyle: 'disc',
  paddingBottom: '6px',
  marginLeft: '16px',
  fontSize: '13px',
  color: 'rgb(117, 127, 136)',
};

const HistoryProfits = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [myPoint, setMyPoint] = useState(''); // 총 보유 포인트
  const [applyPoint, setApplyPoint] = useState(''); // 신청금액
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios
      .post('/api/MyPointApi', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Read) {
          setMyPoint(res.data.MyAllPoint);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const columns = [
    {
      title: '번호',
      dataIndex: 'id',
      align: 'center',
      width: '5%',
    },
    {
      title: '지금금액(신청금액 - 세금)',
      dataIndex: 'profitAmount',
      width: '22%',
      render: (text) => <b>{text}</b>,
    },
    {
      title: '출금정보',
      dataIndex: 'withdrawalInfo',
      align: 'center',
      width: '18%',
    },
    {
      title: '상태',
      dataIndex: 'state',
      align: 'center',
      width: '10%',
      filters: [
        {
          text: '지급 요청',
          value: '지급 요청',
        },
        {
          text: '지급 완료',
          value: '지급 완료',
        },
        {
          text: '지급 취소',
          value: '지급 취소',
        },
      ],
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      render: (text) => <b style={{ color: 'rgb(46, 125, 255)' }}>{text}</b>,
    },
    {
      title: '신청/예상/처리일',
      align: 'center',
      width: '30%',

      children: [
        {
          title: '신청일',
          dataIndex: 'applyDate',
          align: 'center',
          width: '10%',
          defaultSortOrder: 'descend',
          showSorterTooltip: false,
          sorter: (a, b) => new Date(a.applyDate) - new Date(b.applyDate),
          render: (text) => text.substring(0, 10),
        },
        {
          title: '예상일',
          dataIndex: 'expactedDate',
          align: 'center',
          width: '10%',
        },
        {
          title: '처리일',
          dataIndex: 'processedDate',
          align: 'center',
          width: '10%',
        },
      ],
    },
    {
      title: '취소사유',
      dataIndex: 'cancelReason',
      align: 'center',
      width: '15%',
    },
  ];

  const data = [
    {
      key: '1',
      id: 1,
      profitAmount: '6,770(7,000-230)',
      withdrawalInfo: '10199999977777',
      state: '지급 완료',
      applyDate: '2021-10-19',
      expactedDate: '2021-10-22',
      processedDate: '2021-10-22',
      cancelReason: '-',
    },
    {
      key: '2',
      id: 2,
      profitAmount: '6,770(7,000-230)',
      withdrawalInfo: '계좌번호',
      state: '지급 완료',
      applyDate: '2021-10-19',
      expactedDate: '2021-10-22',
      processedDate: '2021-10-22',
      cancelReason: '-',
    },
    {
      key: '3',
      id: 3,
      profitAmount: '6,770(7,000-230)',
      withdrawalInfo: '계좌번호',
      state: '지급 요청',
      applyDate: '2021-10-19',
      expactedDate: '2021-10-22',
      processedDate: '2021-10-22',
      cancelReason: '-',
    },
    {
      key: '4',
      id: 4,
      profitAmount: '6,770(7,000-230)',
      withdrawalInfo: '계좌번호',
      state: '지급 취소',
      applyDate: '2021-10-19',
      expactedDate: '2021-10-22',
      processedDate: '2021-10-22',
      cancelReason: '계좌번호 오류',
    },
  ];

  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  };

  const getAvailableMaxProfit = () => {
    if (myPoint < 5000) {
      return 0;
    } else {
      return parseInt(myPoint - (myPoint % 1000));
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const SubmitApplyPoint = () => {
    // 지급 신청 api
    console.log(applyPoint, 'submitapplypoint');
    setIsModalVisible(false);
    alert('수익금 지급신청이 완료되었습니다.');
  };

  const confirmSubmit = () => {
    if (applyPoint % 1000 === 0) {
      setIsModalVisible(true);
    } else {
      alert('포인트는 1,000원 단위로 지급 신청 가능합니다.');
    }
  };

  const applyPointChangeHandler = (e) => {
    setApplyPoint(parseInt(e.target.value));
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="historyProfits">
            <div className="top">
              <h1 style={myPageContainer_top__h1}>수익금 지급신청</h1>
            </div>
            <div className="middle">
              <div
                className="usedPoint"
                style={{
                  display: 'flex',
                  WebKitBoxPack: 'justify',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  margin: '30px 0px 10px',
                }}
              >
                <div style={{ width: '20%', margin: '0px 8px 0px 0px' }}>
                  <ul style={myPageContainer_list}>
                    <li
                      style={{
                        fontSize: '13px',
                        lineHeight: '20px',
                        fontWeight: '700',
                        color: 'rgb(78, 90, 102)',
                      }}
                    >
                      보유 포인트
                    </li>
                    <li
                      style={{
                        fontSize: '25px',
                        lineHeight: '56px',
                        fontWeight: '700',
                        color: 'rgb(32, 45, 57)',
                      }}
                    >
                      {comma(myPoint)}P
                    </li>
                  </ul>
                </div>
                <div style={{ width: '100%' }}>
                  <ul style={myPageContainer_list}>
                    <li
                      style={{
                        fontSize: '13px',
                        lineHeight: '20px',
                        fontWeight: '700',
                        color: 'rgb(78, 90, 102)',
                      }}
                    >
                      신청금액
                    </li>
                    <li style={{ margin: '10px 0px' }}>
                      <Form
                        name="applyProfit"
                        layout="inline"
                        size="large"
                        onFinish={confirmSubmit}
                      >
                        <Form.Item
                          name="point"
                          style={{ width: '87%', margin: '0px 9px 0px 0px' }}
                          requiredMark={false}
                          rules={[
                            {
                              required: true,
                              pattern: /^[0-9]+$/,
                              message: '신청할 포인트를 입력해주세요.',
                            },
                            {
                              validator(_, value) {
                                var intValue = parseInt(value);
                                if (
                                  intValue >= 5000 &&
                                  intValue <= getAvailableMaxProfit()
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    '신청 가능한 금액의 범위를 벗어나셨습니다.'
                                  )
                                );
                              },
                            },
                          ]}
                        >
                          <Input
                            onChange={applyPointChangeHandler}
                            size="large"
                            placeholder="숫자입력"
                            suffix={'원'}
                          />
                        </Form.Item>
                        <Form.Item style={{ margin: '0px' }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                          >
                            지급신청
                          </Button>
                        </Form.Item>
                      </Form>
                    </li>
                    <li
                      style={{
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: 'rgb(117, 127, 136)',
                      }}
                    >
                      신청 가능 최대금액은{' '}
                      <span
                        style={{
                          fontWeight: '700',
                          color: 'rgb(46, 125, 255)',
                        }}
                      >
                        {comma(getAvailableMaxProfit())}원
                      </span>{' '}
                      입니다.
                    </li>
                    <li
                      style={{
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: 'rgb(117, 127, 136)',
                      }}
                    >
                      지급신청은 5,000포인트 이상부터 가능하며, 1,000원 단위로
                      신청할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="profitPointDescription"
                style={{
                  padding: '24px',
                  border: '1px solid rgb(235, 236, 238)',
                  backgroundColor: ' rgb(250, 251, 252)',
                }}
              >
                <h4
                  style={{
                    marginTop: '14px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: 'rgb(78, 90, 102)',
                  }}
                >
                  수익금 정산 안내
                </h4>
                <h4
                  style={{
                    marginTop: '0px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: 'rgb(78, 90, 102)',
                  }}
                >
                  수익금 지급 절차 : 수익금 지급신청 &gt; (지급대기) &gt;
                  지금승인 &gt; 지급완료
                </h4>
                <ul style={{ padding: '0px 10px' }}>
                  <li style={historyProfits_middle_profitPointDescription__li}>
                    일주일에 1회만 지급신청 할 수 있으며, 수익금 신청내역에서
                    상태를 확인하실 수 있습니다.
                  </li>
                  <li style={historyProfits_middle_profitPointDescription__li}>
                    3.3%의 사업소득세가 차감된 금액이 지급되며, 월간 누적 세금이
                    1,000원 미만일 경우 익월 10일경에 환급됩니다.
                  </li>
                  <li style={historyProfits_middle_profitPointDescription__li}>
                    수익금은 매주 목요일 14시까지 신청 가능하며, 해당 건에
                    대하여 금요일 14시에 입금됩니다. (목요일 14시 이후 신청한
                    경우, 다음 주 금요일 지급 대상자가 됩니다.)
                  </li>
                  <li style={historyProfits_middle_profitPointDescription__li}>
                    수익금 신청 불가 시간 (시스템 점검) : 매주 목요일 14시 01분
                    ~ 15시 00분
                  </li>
                </ul>
              </div>
            </div>
            <div className="bottom" style={myPageContainer_bottom}>
              <div
                style={{
                  display: 'flex',
                  WebkitBoxPack: 'justify',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  WebkitBoxAlign: 'center',
                  alignItems: 'center',
                  paddingBottom: '17px',
                }}
              >
                <h2
                  style={{
                    fontSize: '19px',
                    lineHeight: '24px',
                    fontWeight: '500',
                    color: 'rgb(32, 45, 57)',
                  }}
                >
                  수익금 신청내역
                </h2>
              </div>
              <div className="boardDefault">
                <Table
                  columns={columns}
                  dataSource={data}
                  size="middle"
                  locale={{
                    filterConfirm: '적용',
                    filterReset: '초기화',
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'수익금 신청내역이 없습니다'}
                      />
                    ),
                  }}
                />
              </div>
            </div>
            <Modal
              title="수익금 지급신청"
              visible={isModalVisible}
              onOk={SubmitApplyPoint}
              okText="신청"
              onCancel={closeModal}
              cancelText="취소"
            >
              <p>
                <em style={myPageContainer_emphasis}>{applyPoint}</em> 원을 아래
                계좌 정보로 지급 신청하시겠습니까?
                <br />
                (지급 신청 후에는 철회가 불가능합니다.)
              </p>
              <p style={{ fontWeight: 'bold' }}>은행명 : {userInfo.bankName}</p>
              <p style={{ fontWeight: 'bold' }}>
                예금주 : {userInfo.accountHolder}
              </p>
              <p style={{ fontWeight: 'bold' }}>
                계좌번호 : {userInfo.account}
              </p>
            </Modal>
          </div>
        </article>
      </section>
    </>
  );
};

export default HistoryProfits;
