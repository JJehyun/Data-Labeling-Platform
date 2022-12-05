import React from 'react';

import { Layout, Table } from 'antd';
import WorkSidebar from '../../components/WorkSidebar';
const { Header } = Layout;

const DelectePage = () => {
  const columns = [
    {
      title: '프로젝트 명',
      dataIndex: '프로젝트 명',
      key: 'title',
    },
    {
      title: '삭제 검수',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '삭제일',
      dataIndex: '삭제일',
      key: 'date',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <WorkSidebar pageKey="2" />

        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: 0, backgroundColor: 'white' }}
          >
            <span style={{ fontSize: '19px', fontWeight: 900, marginLeft: 40 }}>
              작업 삭제 조회
            </span>
          </Header>

          <Table columns={columns} dataSource={data} />
        </Layout>
      </Layout>
    </div>
  );
};

export default DelectePage;
