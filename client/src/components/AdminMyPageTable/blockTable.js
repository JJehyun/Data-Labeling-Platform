import React, { useState, useRef } from 'react';
import { Table, Card, Input, Space, Button, Modal, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  WarningOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import {
  questionNameCol,
  provisionIDCol,
  provisionTitleCol,
  blockcount,
  blockButton,
} from './tableColumns';
import axios from 'axios';

function BlockTable({ Lists }) {
  const [WarnigList, setWarnigList] = useState([]);
  const { Text } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //테이블 클릭 시 행 정보를 리턴해주는 함수
  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        let id = record.id;
        WarnigTitleList(id);
        setIsModalVisible(true);
      },
    };
  };

  const WarnigTitleList = async (value) => {
    let result = await axios
      .post('/api/WarnigTitleList', { userIndex: value })
      .then((data) => {
        console.log(data.data.List);
        setWarnigList(data.data.List);
        return data.data.List;
      });
  };
  let BlackList = [];
  for (let i = 0; i < Lists.length; i++) {
    let keys = i;
    let names = Lists[i].userName;
    let titless = Lists[i].taskTitle;
    let warningNums = Lists[i].count;
    let ids = Lists[i].id;
    let RequestLists = {
      key: keys,
      name: names,
      id: ids,
      titles: titless,
      index: warningNums,
      button: (
        <Button shape="circle">
          <ImportOutlined />
        </Button>
      ),
    };
    BlackList.push(RequestLists);
  }

  const [selectionType, setSelectionType] = useState('checkbox');
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  //검색 기능을 추가 하기 위한 함수 시작 =>
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [state, setState] = useState({ searchText: '', searchedColumn: '' });
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(
          () =>
            searchInput && searchInput.current && searchInput.current.select()
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  function handleReset(clearFilters) {
    clearFilters();
    setState({ searchText: '' });
  }

  //**검색 기능을 추가 하기 위한 함수 끝**
  //table 컬럼들
  const columns = [
    {
      ...questionNameCol,
      onFilter: (value, record) => record.name.includes(value),
      ...getColumnSearchProps('name'),
    },
    {
      ...provisionIDCol,
      onFilter: (value, record) => record.id.includes(value),
      ...getColumnSearchProps('id'),
    },
    {
      ...provisionTitleCol,
      onFilter: (value, record) => record.titles.includes(value),
      ...getColumnSearchProps('titles'),
    },
    {
      ...blockcount,
      sorter: (a, b) => a.index - b.index,
    },
    {
      ...blockButton,
    },
  ];
  return (
    <>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '30px', fontWeight: 900 }}>
            경고 휫수 목록
          </span>
          <Button style={{ height: '50px' }}>
            <WarningOutlined />
            기능 정지 시키기
          </Button>
        </div>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          테이블 클릭 시 세부 경고 목록을 확인 할 수 있습니다.
        </Text>
        <Table
          columns={columns}
          dataSource={BlackList}
          pagination={{ pageSize: 8 }}
          scroll={{ y: 500 }}
          style={{ width: '100%', paddingLeft: '0%' }}
          rowSelection={{ type: selectionType, ...rowSelection }}
          onRow={onRow}
          onSelect={(value) => {
            console.log(value);
          }}
        />
      </Card>
      <Modal
        title="Project List"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {WarnigList &&
          WarnigList.map((array, i) => (
            <>
              <p>
                {i + 1} 번째 경고 : {array.companyName} 의 {array.taskTitle}
              </p>
            </>
          ))}
      </Modal>
    </>
  );
}
export default BlockTable;
