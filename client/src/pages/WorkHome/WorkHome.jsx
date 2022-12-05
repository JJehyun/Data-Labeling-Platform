import React, { useCallback, useState, useEffect } from 'react';
import { Layout, Tabs, Card, Tag, Space, Empty, Button, Divider } from 'antd';
import WorkSidebar from '../../components/WorkSidebar';
import { useRecoilValue } from 'recoil';
import { Redirect } from 'react-router-dom';
import { getUserInfoSelector } from '../../states';
import WorkCreate from './workCreate';
import axios from 'axios';
import TopNav from '../../components/Header/Header';
import InspectionTable from './inspectionTable';

const WorkHome = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [workList, setWorkList] = useState([]);
  const [participateWork, setParticipateWork] = useState([]);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(1);
  const [sortState, setSortState] = useState(0);
  const [isInspectionTableRender, setIsInspectionTableRender] = useState(false);
  const [workCount, setWorkCount] = useState(0);
  const [allWorkList, setAllWorkList] = useState([]);
  const [isWorkCreateRender, setIsWorkCreateRender] = useState(false);
  const [selectedWorkInfo, setSelectedWorkInfo] = useState({});

  useEffect(() => {
    // 참여중인 작업, 반려 작업
    axios
      .post('/api/WorkStateList', { userIndex: userInfo.idx })
      .then((res) => {
        setWorkList(res.data.MyProJectList3);
      });

    // 참여가능 작업
    axios
      .post('/api/WorkPossibilityList', { userIndex: userInfo.idx })
      .then((res) => {
        setParticipateWork(res.data.AllProJectList);
      });

    if (userInfo.userLevel <= 2) {
      // TaskGroup
      axios
        .post('/api/AdminProjectList', { CompanyIdx: userInfo.companyIdx })
        .then((res) => {
          setAllWorkList(res.data.AdminProjectList);
        });
    }
  }, [selectedWorkSpace]);

  const { Header, Content } = Layout;
  const { TabPane } = Tabs;

  const tabsChangeHandler = useCallback((e) => {
    setIsInspectionTableRender(false);
    setIsWorkCreateRender(false);
    setSelectedWorkInfo();
    setSelectedWorkSpace(parseInt(e));
  }, []);

  const sortChangeHandler = (e, sortKey) => {
    if (sortKey === 1) {
    } else {
      if (userInfo.userLevel <= 2) {
        setAllWorkList(
          allWorkList.sort((f, s) => {
            return s.taskPointA - f.taskPointA;
          })
        );
      } else {
        setWorkList(
          workList.sort((f, s) => {
            return s.taskPointA - f.taskPointA;
          })
        );
      }
    }

    setSortState(sortKey);
  };

  const workCardClickHandler = (e, workInfo) => {
    if (userInfo.userLevel <= 2 && selectedWorkSpace === 1) {
      setIsInspectionTableRender(true);
    } else if (userInfo.userLevel <= 2 && selectedWorkSpace === 2) {
      setSelectedWorkInfo(workInfo);
      setIsWorkCreateRender(true);
    }
  };

  const WorkCard = (props) => {
    const { workInfo } = props;

    return (
      <Card
        title={
          <div
            style={
              selectedWorkSpace === 3 ? { color: 'red' } : { color: 'black' }
            }
          >
            {workInfo.taskTitle}
          </div>
        }
        onClick={(e) => workCardClickHandler(e, workInfo)}
        bordered={true}
        hoverable
        style={{ width: '20rem', margin: '0 0.938rem 0.938rem 0' }}
      >
        <p
          style={
            selectedWorkSpace === 3 ? { color: 'red' } : { color: '#b4b4b4' }
          }
        >
          {workInfo.taskCategory}
        </p>
        {workInfo.BoundingBox === 1 && <Tag color="red">Bounding Box</Tag>}
        {workInfo.Polygon === 1 && <Tag color="red">Polygon</Tag>}
        <p
          style={
            selectedWorkSpace === 3 ? { color: 'red' } : { color: 'black' }
          }
        >
          작업 당 : {workInfo.taskPointA} points
        </p>
      </Card>
    );
  };

  const SortSplit = (props) => {
    return (
      <Space
        size={0}
        style={{ position: 'absolute', right: 0 }}
        split={<Divider style={{ color: 'black' }} type="vertical" />}
      >
        <p
          style={
            props.sortKey === 1
              ? { cursor: 'pointer', color: 'red' }
              : { cursor: 'pointer' }
          }
          onClick={(e) => sortChangeHandler(e, 1)}
        >
          최신순
        </p>
        <p
          style={
            props.sortKey === 2
              ? { cursor: 'pointer', color: 'red' }
              : { cursor: 'pointer' }
          }
          onClick={(e) => sortChangeHandler(e, 2)}
        >
          포인트높은순
        </p>
      </Space>
    );
  };

  const EmptyWork = (props) => {
    const { workKey } = props;

    return (
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: '6.25rem',
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '43%',
          margin: 'auto',
        }}
        description={
          <div>
            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold' }}>
              {workKey !== 3
                ? '현재 참여중인 작업이 없습니다.'
                : '현재 반려된 작업이 없습니다.'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#b4b4b4' }}>
              {workKey !== 3 && '원하시는 작업에 참여해보세요.'}
            </p>
          </div>
        }
      >
        {workKey !== 3 && <Button type="primary">작업하러 가기</Button>}
      </Empty>
    );
  };

  const NowWork = (props) => {
    let workName;

    switch (props.workKey) {
      case 1:
        userInfo.userLevel !== 3
          ? (workName = '작업 목록')
          : (workName = '참여중인 작업');
        break;

      case 2:
        userInfo.userLevel !== 3
          ? (workName = '작업 편집')
          : (workName = '참여가능 작업');
        break;

      case 3:
        userInfo.userLevel !== 3
          ? (workName = '작업 생성')
          : (workName = '반려작업');
        break;

      default:
        break;
    }

    return (
      <div
        style={{
          fontSize: '1.125rem',
          fontWeight: 900,
          marginBottom: 10,
        }}
      >
        {workName}
        <span
          style={{
            position: 'relative',
            bottom: 2,
            fontSize: '1.125rem',
            marginLeft: 10,
            color: 'red',
          }}
        >
          {props.workLength}
        </span>
      </div>
    );
  };

  const WorkRender = ({ workKey }) => {
    let renderWorkList;

    if (userInfo.userLevel === 3) {
      const copyWorkList = [...workList];

      switch (workKey) {
        case 1:
          renderWorkList = copyWorkList.filter((work) => {
            return work.state === 0 || work.state === 1 || work.state === 4;
          });
          break;
        case 2:
          renderWorkList = [...participateWork];
          break;
        case 3:
          renderWorkList = copyWorkList.filter((work) => {
            return work.state === 3;
          });
          break;

        default:
          break;
      }
    } else {
      renderWorkList = [...allWorkList];
    }

    setWorkCount(renderWorkList.length);

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {renderWorkList.map((work, index) => {
          return <WorkCard workInfo={work} key={index} />;
        })}
      </div>
    );
  };

  if (userInfo.userLevel === 1) {
    return <Redirect to="/supervisor" />;
  }

  return (
    <>
      <TopNav />
      <Layout style={{ minHeight: '100vh' }}>
        <WorkSidebar pageKey="1" />

        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: 0, backgroundColor: 'white' }}
          >
            <span
              style={{
                fontSize: '1.188rem',
                fontWeight: 900,
                marginLeft: '2.5rem',
              }}
            >
              {userInfo.userLevel !== 3 ? '라벨링 검수' : '라벨링 작업'}
            </span>
          </Header>

          <Content style={{ position: 'relative', margin: '0 1rem' }}>
            <Tabs defaultActiveKey="1" onChange={tabsChangeHandler}>
              <TabPane
                tab={userInfo.userLevel !== 3 ? '작업 목록' : '참여중인 작업'}
                key="1"
              />
              <TabPane
                tab={userInfo.userLevel !== 3 ? '작업 편집' : '참여가능 작업'}
                key="2"
              />
              <TabPane
                tab={userInfo.userLevel !== 3 ? '작업 생성' : '반려작업'}
                key="3"
              />
            </Tabs>

            <div>
              {isInspectionTableRender ? (
                <InspectionTable />
              ) : workList.length > 0 ||
                (userInfo.userLevel !== 3 && selectedWorkSpace === 3) ? (
                <div>
                  {!(userInfo.userLevel !== 3 && selectedWorkSpace === 3) && (
                    <SortSplit sortKey={sortState} />
                  )}

                  <div
                    className="site-layout-background"
                    style={{
                      padding: '1.5rem',
                      minHeight: '100%',
                    }}
                  >
                    {!(
                      (userInfo.userLevel !== 3 && selectedWorkSpace === 3) ||
                      isWorkCreateRender
                    ) && (
                      <NowWork
                        workKey={selectedWorkSpace}
                        workLength={workCount}
                      />
                    )}

                    {(userInfo.userLevel !== 3 && selectedWorkSpace === 3) ||
                    isWorkCreateRender ? (
                      <WorkCreate
                        modifyToWorkInfo={selectedWorkInfo && selectedWorkInfo}
                      />
                    ) : (
                      <WorkRender workKey={selectedWorkSpace} />
                    )}
                  </div>
                </div>
              ) : (
                <EmptyWork workKey={selectedWorkSpace} />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default WorkHome;
