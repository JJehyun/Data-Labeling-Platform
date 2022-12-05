import React, { useState } from 'react';
// import logo from '../../logo.jpg';
import { DeleteOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Layout, Menu, Image } from 'antd';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
const { Sider } = Layout;

const WorkSidebar = (props) => {
  const userInfo = useRecoilValue(getUserInfoSelector);

  if (userInfo.userLevel !== 3) {
    return (
      <Sider collapsed>
        <div className="logo" />
        {/* <Image src={logo} /> */}
        <Menu theme="dark" defaultSelectedKeys={props.pageKey} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">작업 홈</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  } else {
    return (
      <Sider collapsed>
        <div className="logo" />
        {/* <Image src={logo} /> */}
        <Menu theme="dark" defaultSelectedKeys={props.pageKey} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">작업 홈</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
};

export default WorkSidebar;
