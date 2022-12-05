import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import { Table, Empty } from 'antd';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_top_tab,
  tab_list__active,
  myPageContainer_bottom,
} from './style';

const ActiveWorks = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [works, setWorks] = useState([]); // 참여 작업 list

  useEffect(() => {
    axios
      .post('/api/MyProjectApi', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Find) {
          setWorks(res.data.MyProject);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const columns = [
    {
      title: '프로젝트 명',
      dataIndex: 'projectName',
      width: '50%',
    },
    {
      title: '작업수',
      dataIndex: 'workload',
      width: '30%',
      render: (workloads) =>
        workloads.map((workload) => {
          if (workload.includes('잔여')) {
            // 잔여작업
            return (
              <b>
                {workload}
                <br />
              </b>
            );
          } else {
            // 내작업수
            return <b style={{ color: 'rgb(46, 125, 255)' }}>{workload}</b>;
          }
        }),
    },
    {
      title: '작업상태',
      dataIndex: 'workState',
      width: '20%',
      render: (workStates) =>
        workStates.map((workState) => {
          if (workState.includes('반려')) {
            // 반려
            return (
              <b style={{ color: 'rgb(54, 179, 126)' }}>
                {workState}
                <br />
              </b>
            );
          } else if (workState.includes('검수완료')) {
            // 검수완료
            return <b style={{ color: 'red' }}>{workState}</b>;
          } else {
            return (
              <>
                {workState}
                <br />
              </>
            );
          }
        }),
    },
  ];

  const worksData = () => {
    const worksData = []; // 참여 작업 data

    works.map((work, key) => {
      worksData.push({
        key: key,
        projectName: work.taskTitle,
        workload: [`잔여작업: ${work.taskDone}`, `내작업수: ${work.myTask}`],
        workState: [
          `검수대기: ${work.waiting}`,
          `반려: ${work.reject}`,
          `검수완료: ${work.success}`,
        ],
      });
    });

    return worksData;
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="activeWorks">
            <div className="top">
              <h1 style={myPageContainer_top__h1}>나의 작업내역</h1>
              <ul className="tab" style={myPageContainer_top_tab}>
                <li className="active" style={tab_list__active}>
                  작업
                </li>
              </ul>
            </div>
            <div className="bottom" style={myPageContainer_bottom}>
              <Table
                columns={columns}
                dataSource={worksData()}
                size="middle"
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={'참여한 작업이 없습니다'}
                    />
                  ),
                }}
              />
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ActiveWorks;
