import React, { useState, useRef } from 'react';
import { Table, Input, Space, Button, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { PaymentListValues } from './TestValue';
import {
  RequestDayCol,
  provisionIDCol,
  PaymentStateCol,
  questionNameCol,
  PaymentMoneyCol,
} from './tableColumns';

function PaymentListTable({ history }) {
  const [selectionType, setSelectionType] = useState('checkbox');
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
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
  //컬럼들
  const columns = [
    {
      ...RequestDayCol,
      sorter: (a, b) => moment(a.day).unix() - moment(b.day).unix(),
      ...getColumnSearchProps('day'),
    },
    {
      ...questionNameCol,
      ...getColumnSearchProps('name'),
    },
    {
      ...provisionIDCol,
      ...getColumnSearchProps('id'),
    },
    {
      ...PaymentStateCol,
      onFilter: (value, record) => record.State.startsWith(value),
    },
    {
      ...PaymentMoneyCol,
    },
  ];

  return (
    <>
      <Card>
        <span style={{ fontSize: '30px', fontWeight: 900 }}>
          수익금 지급 내역(나중)
        </span>
        <div style={{ marginBottom: '10px' }}></div>
        <Table
          columns={columns}
          dataSource={PaymentListValues}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 500 }}
          rowSelection={{ type: selectionType, ...rowSelection }}
        />
      </Card>
    </>
  );
}
export default PaymentListTable;
