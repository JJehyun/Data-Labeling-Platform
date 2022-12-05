import React from 'react';
import { Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
export const blockValues = [
  {
    key: '1',
    name: '김제현',
    titles: '날짜별 정렬 기능 완료',
    id: '12334@gmail.com',
    index: 12,
    button: (
      <Button shape="circle">
        <MailOutlined />
      </Button>
    ),
  },
  {
    key: '2',
    name: '이제현',
    titles: '호랑나비 정렬 기능 완료',
    id: '6579@gmail.com',
    index: 7,
    button: (
      <Button shape="circle">
        <MailOutlined />
      </Button>
    ),
  },
  {
    key: '3',
    name: '삼제현',
    titles: '띠용 기능 완료',
    id: '23780@gmail.com',
    index: 5,
    button: (
      <Button shape="circle">
        <MailOutlined />
      </Button>
    ),
  },
  {
    key: '4',
    name: '사제현',
    titles: '디용 정렬 기능 완료',
    id: '12367@gmail.com',
    index: 23,
    button: (
      <Button shape="circle">
        <MailOutlined />
      </Button>
    ),
  },
];
export const PaymentListValues = [
  {
    key: '1',
    day: '2020-12-04',
    name: '김제현',
    id: 'povt99@gmail.com',
    State: '지급 완료',
    money: '8000원',
  },
  {
    key: '2',
    day: '2020-12-14',
    name: '이제현',
    id: '123@gmail.com',
    State: '지급 전',
    money: '7000원',
  },
  {
    key: '3',
    day: '2020-12-24',
    name: '삼제현',
    id: 'povt99@gmail.com',
    State: '지급 완료',
    money: '5000원',
  },
];
