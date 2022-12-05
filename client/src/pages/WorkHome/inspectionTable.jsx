import React from 'react';
import { Button, Table } from 'antd';
import { useHistory } from 'react-router-dom';

const InspectionTable = () => {
  const history = useHistory();

  const goButtonHandler = () => {
    history.push('/inspection');
  };

  const columns = [
    {
      title: '작업자',
      dataIndex: 'userName',
      key: 'userName',
      render: (name) => <a>{name}</a>,
    },
    {
      title: '작업 개수',
      dataIndex: 'workCount',
      key: 'workCount',
    },
    {
      title: '검수상태',
      dataIndex: 'inspectionState',
      key: 'inspectionState',
    },
    {
      title: '이동',
      key: 'goButton',
      dataIndex: 'goButton',
      render: () => <Button onClick={goButtonHandler}>이동</Button>,
    },
  ];

  const data = [
    {
      userName: '권혁진',
      workCount: '30,000',
      inspectionState: '검수 진행 중',
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        style={{ padding: '3.5rem' }}
      />
    </div>
  );
};

export default InspectionTable;
