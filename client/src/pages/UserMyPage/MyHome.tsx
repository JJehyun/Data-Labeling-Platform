import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import { Card, Row, Col, Table, Empty } from 'antd';
import { myPageContainer } from './style';

const cardSection_card_activeWorks__span = {
  fontSize: '13px',
  lineHeight: '20px',
  color: 'rgb(117, 127, 136)',
  marginBottom: '4px',
};

const cardSection_card_activeWorks__p = {
  fontSize: '30px',
  lineHeight: '38px',
  color: 'rgb(32, 45, 57)',
  fontWeight: '700',
};

const cardSection_card = {
  background: 'rgb(255, 255, 255)',
  borderRadius: '4px',
  boxSizing: 'border-box',
  boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 10px, rgb(0 0 0 / 6%) 0px 3px 15px',
};

const cardSection_card_head = {
  fontSize: '17px',
  lineHeight: '24px',
  fontWeight: '700',
  color: 'rgb(32, 45, 57)',
};

const cardSection_card_body = {
  padding: ' 0px',
};

const MyHome = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [myPoint, setMyPoint] = useState('');
  const [myProgress, setMyProgress] = useState({
    taskWait: '',
    taskDone: '',
    taskReject: '',
  });
  const [QnAs, setQnAs] = useState([]); // 문의내역 list

  useEffect(() => {
    // 내 포인트
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

    // 내 작업 현황
    axios
      .post('/api/MyProjectApi', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Find) {
          const myWorks = res.data.MyProject;
          var wait = 0;
          var done = 0;
          var reject = 0;
          myWorks.map((myWork) => {
            wait += myWork.waiting;
            done += myWork.success;
            reject += myWork.reject;
          });

          setMyProgress({
            taskWait: wait,
            taskDone: done,
            taskReject: reject,
          });
        } else {
          console.log(res, 'fail');
        }
      });

    // 최근 문의내역
    axios
      .post('/api/ReadMyQuestions', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Find) {
          setQnAs(res.data.MyQuestion);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const historyProfitsColumns = [
    {
      title: '신청일',
      dataIndex: 'applyDate',
    },
    {
      title: '신청금액',
      dataIndex: 'profitAmount',
    },
    {
      title: '상태',
      dataIndex: 'state',
      render: (text) => <b style={{ color: 'rgb(46, 125, 255)' }}>{text}</b>,
    },
  ];

  const historyProfitsData = [
    {
      key: 1,
      applyDate: '2021-10-19',
      profitAmount: '6,770',
      state: '지급 완료',
    },
    {
      key: 2,
      applyDate: '2021-10-19',
      profitAmount: '6,770',
      state: '지급 완료',
    },
  ];

  const QnAsColumns = [
    {
      title: '제목',
      dataIndex: 'title',
      width: '60%',
      ellipsis: { showTitle: false },
    },
    {
      title: '진행상태',
      dataIndex: 'state',
      align: 'center',
      width: '20%',
      render: (text) => <b style={{ color: 'rgb(46, 125, 255)' }}>{text}</b>,
    },
    {
      title: '등록일',
      dataIndex: 'registrationDate',
      align: 'center',
      width: '20%',
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a.registrationDate) - new Date(b.registrationDate),
      render: (text) => text.substring(0, 10),
    },
  ];

  const QnAsData = () => {
    const QnAsData = []; // 문의내역 data

    QnAs.map((qna, key) => {
      QnAsData.push({
        qIdx: qna.idx, // 문의 고유번호
        key: key + 1,
        title: qna.QuestionTitle,
        state: qna.QuestionState === 0 ? '접수완료' : '답변완료',
        registrationDate: qna.QuestionDate,
      });
    });

    return QnAsData;
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <div className="cardSection" style={{ width: '100%' }}>
          <Row gutter={[32, 32]}>
            <Col span={8}>
              <Card
                title="내 포인트"
                extra={<Link to="/historyPoint">전체보기 &gt;</Link>}
                style={cardSection_card}
                headStyle={cardSection_card_head}
              >
                <p
                  className="myPoint"
                  style={{
                    fontSize: '30px',
                    lineHeight: '38px',
                    color: 'rgb(32, 45, 57)',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: '24px 24px 28px 24px',
                  }}
                >
                  {myPoint}P
                </p>
              </Card>
            </Col>
            <Col span={16}>
              <Card
                title="내 작업 현황"
                extra={<Link to="/activeWorks">전체보기 &gt;</Link>}
                style={cardSection_card}
                headStyle={cardSection_card_head}
              >
                <ul
                  style={{
                    display: 'flex',
                    padding: '0px 24px',
                    marginTop: '16px',
                  }}
                >
                  <li
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      flex: '1 1 0%',
                      borderRight: '1px solid rgb(235, 236, 238)',
                      padding: '0px 8px 0px 0px',
                      cursor: 'pointer',
                      WebkitBoxPack: 'justify',
                      justifyContent: 'space-between',
                      wordBreak: 'break-word',
                    }}
                  >
                    <span style={cardSection_card_activeWorks__span}>
                      검수대기
                    </span>
                    <p style={cardSection_card_activeWorks__p}>
                      {myProgress.taskWait}
                    </p>
                  </li>
                  <li
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      flex: '1 1 0%',
                      borderRight: '1px solid rgb(235, 236, 238)',
                      padding: '0px 8px',
                      cursor: 'pointer',
                      WebkitBoxPack: 'justify',
                      justifyContent: 'space-between',
                      wordBreak: 'break-word',
                    }}
                  >
                    <span style={cardSection_card_activeWorks__span}>
                      검수완료
                    </span>
                    <p style={cardSection_card_activeWorks__p}>
                      {myProgress.taskDone}
                    </p>
                  </li>
                  <li
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      flex: '1 1 0%',
                      padding: '0px 0px 0px 8px',
                      cursor: 'pointer',
                      WebkitBoxPack: 'justify',
                      justifyContent: 'space-between',
                      wordBreak: 'break-word',
                    }}
                  >
                    <span style={cardSection_card_activeWorks__span}>반려</span>
                    <p style={cardSection_card_activeWorks__p}>
                      {myProgress.taskReject}
                    </p>
                  </li>
                </ul>
              </Card>
            </Col>

            <Col span={8}>
              <Card
                title="수익금 신청내역"
                extra={<Link to="/historyProfits">전체보기 &gt;</Link>}
                style={cardSection_card}
                headStyle={cardSection_card_head}
                bodyStyle={cardSection_card_body}
              >
                <Table
                  columns={historyProfitsColumns}
                  dataSource={historyProfitsData}
                  size="small"
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'수익금 신청내역이 없습니다'}
                      />
                    ),
                  }}
                />
              </Card>
            </Col>
            <Col span={16}>
              <Card
                title="최근 문의내역"
                extra={<Link to="/historyQnA">전체보기 &gt;</Link>}
                style={cardSection_card}
                headStyle={cardSection_card_head}
                bodyStyle={cardSection_card_body}
              >
                <Table
                  columns={QnAsColumns}
                  dataSource={QnAsData()}
                  size="small"
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'문의내역이 없습니다'}
                      />
                    ),
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default MyHome;
