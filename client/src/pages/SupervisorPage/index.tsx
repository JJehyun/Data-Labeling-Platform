import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { Table, Select, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const SuperVisorPage = () => {
  const [userList, setUserList] = useState([{}]);

  useEffect(() => {
    axios
      .get('/api/UserListReturn')
      .then((res) => {
        const responseUserList = res.data.UserList;

        responseUserList.map((data, index) => {
          data.key = index;
          data.phoneNumber = String(data.phoneNumber).replace(
            /^(\d{2,3})(\d{3,4})(\d{4})$/,
            `$1-$2-$3`
          );
        });

        setUserList(responseUserList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (value, index) => {
    const copyUserList = [...userList];

    copyUserList.map((data) => {
      if (data.key === index) {
        data.userLevel = value;
      }
    });

    setUserList(copyUserList);
  };

  const handleSaveClick = () => {
    Modal.confirm({
      title: '변경사항을 저장하시겠습니까?',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        return new Promise((resolve, reject) => {
          axios
            .post('/api/UserListReturn', { params: userList })
            .then((res) => {
              if (res.data.Update) {
                resolve();
                Modal.info({ title: '저장을 성공하였습니다.' });
              }
            })
            .catch((err) => {
              reject(err);
            });
        }).catch((err) => {
          Modal.error({
            title: '저장을 실패했습니다.',
          });
        });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: '이름',
      dataIndex: 'userName',
      key: 'userName',
      render: (name) => <a>{name}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '휴대폰',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '등급',
      key: 'userLevel',
      dataIndex: 'userLevel',
      render: (rank, record, index) => {
        return (
          <Select
            key={index}
            onSelect={(e) => handleChange(e, index)}
            style={{ width: 120 }}
            value={rank}
          >
            <Select.Option value={3}>사용자</Select.Option>
            <Select.Option value={2}>관리자</Select.Option>
          </Select>
        );
      },
    },
  ];

  return (
    <div>
      <Header />

      <Table
        columns={columns}
        dataSource={userList}
        style={{ padding: '3.5rem' }}
        pagination={{ pageSize: 10 }}
      />

      <Button
        onClick={handleSaveClick}
        style={{
          position: 'absolute',
          right: '3.5rem',
          width: 150,
          height: 45,
          borderRadius: 25,
        }}
      >
        저장
      </Button>
    </div>
  );
};

export default SuperVisorPage;
