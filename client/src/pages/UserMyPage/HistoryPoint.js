import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import { Empty, Table } from 'antd';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_top__h2,
  myPageContainer_top__h2_emphasis,
  myPageContainer_top_tab,
  tab_list__active,
  myPageContainer_emphasis,
} from './style';

const historyPoint_top_guide__li = {
  display: 'flex',
  margin: '6px 0px',
  fontSize: '13px',
  color: 'rgb(117, 127, 136)',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
};

const HistoryPoint = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [myPoint, setMyPoint] = useState(''); // 총 보유 포인트
  const [myPointHistory, setMyPointHistory] = useState([]); // 포인트 내역 list

  useEffect(() => {
    axios
      .post('/api/MyPointApi', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Read) {
          setMyPoint(res.data.MyAllPoint);
          setMyPointHistory(res.data.MyPointList);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const columns = [
    {
      title: '프로젝트 명',
      dataIndex: 'projectName',
      width: '55%',
      render: (text) => <b>{text}</b>,
    },
    {
      title: '단가',
      dataIndex: 'point',
      align: 'center',
      width: '15%',
      render: (number) => (
        <div style={{ color: 'rgb(117, 127, 136)' }}>{number}P</div>
      ),
    },
    {
      title: '적립 건',
      dataIndex: 'tasks',
      align: 'center',
      width: '15%',
      render: (number) => (
        <div style={{ color: 'rgb(117, 127, 136)' }}>{number}</div>
      ),
    },
    {
      title: '적립 포인트',
      dataIndex: 'earnPoints',
      align: 'center',
      width: '15%',
      render: (number) => (
        <b style={{ color: 'rgb(46, 125, 255)' }}>{number}P</b>
      ),
    },
  ];

  let totalProjects = 0; // 전체 프로젝트 건수
  let totalTasks = 0; // 포인트 적립 건수
  const pointsData = () => {
    const pointsData = []; // 포인트 내역 data
    console.log(myPointHistory, 'myPointHistory');

    myPointHistory.map((history, key) => {
      pointsData.push({
        key: key,
        projectName: history.taskTitle,
        point: history.taskPointA,
        tasks: history.PointCount,
        earnPoints: history.Point,
      });
      totalProjects += 1;
      totalTasks += history.PointCount;
    });
    console.log(pointsData, "pointsData")

    return pointsData;
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="historyPoint">
            <div className="top">
              <h1 style={myPageContainer_top__h1}>포인트 내역</h1>
              <h2 style={myPageContainer_top__h2}>
                총 보유 포인트
                <span style={myPageContainer_top__h2_emphasis}>{myPoint}P</span>
              </h2>
              <ul
                className="guide"
                style={{
                  margin: '24px 0px 32px',
                  padding: '0px',
                  listStyleType: 'disc', // 안먹힘,
                }}
              >
                <li style={historyPoint_top_guide__li}>
                  - 검수 과정이 없는 작업은 작업 후 바로 포인트가 지급됩니다.
                </li>
                <li style={historyPoint_top_guide__li}>
                  - 검수 과정이 있는 작업은 최종 검수 승인 후 포인트가
                  지급됩니다.
                </li>
                <li style={historyPoint_top_guide__li}>
                  - 보유 포인트는 수익금 신청을 하지 않은 포인트 기준입니다.
                </li>
              </ul>
              <ul className="tab" style={myPageContainer_top_tab}>
                <li className="active" style={tab_list__active}>
                  작업
                </li>
              </ul>
            </div>
            <div
              className="bottom"
              style={{ position: 'relative', padding: '0px' }}
            >
              <div
                className="boardDefault"
                style={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                }}
              >
                <Table
                  columns={columns}
                  dataSource={pointsData()}
                  size="middle"
                  title={() => (
                    <p
                      style={{
                        padding: '0px',
                        marginBottom: '0px',
                        textAlign: 'right',
                        top: '16px',
                        right: '0px',
                        fontSize: '13px',
                        lineHeight: '20px',
                        textAlign: 'right',
                      }}
                    >
                      전체 프로젝트{' '}
                      <em style={myPageContainer_emphasis}>
                        {totalProjects}건
                      </em>{' '}
                      / 포인트 적립{' '}
                      <em style={myPageContainer_emphasis}>{totalTasks}건</em>
                    </p>
                  )}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'포인트 적립 내역이 없습니다'}
                      />
                    ),
                  }}
                ></Table>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default HistoryPoint;
