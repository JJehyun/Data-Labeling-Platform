import React, { useState, useRef, setState } from 'react';
import { Table, Card, Input, Space, Button, Modal, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DollarOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  provisionWorkdayCol,
  provisionIDCol,
  questionNameCol,
  provisionTitleCol,
  provisionFinishCol,
} from './tableColumns';
import axios from 'axios';
function ProvisionTable({ List }) {
  const { Text } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pointList, setpointList] = useState([]);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        let id = record.id;
        setIsModalVisible(true);
        RequestLists(id);
      },
    };
  };

  const RequestLists = async (value) => {
    let result = await axios
      .post('/api/PointList', { userIndex: value })
      .then((data) => {
        setpointList(data.data.List);
        return data.data.List;
      });
  };

  let RequestList = [];
  for (let i = 0; i < List.length; i++) {
    let keys = i;
    let names = List[i].userName;
    let days = moment(List[i].DAY).format('YYYY-MM-DD');
    let titless = List[i].taskTitle + '<' + List[i].companyName + '>';
    let indexs = List[i].point;
    let ids = List[i].id;
    let RequestLists = {
      key: keys,
      name: names,
      id: ids,
      day: days,
      titles: titless,
      index: indexs,
    };
    RequestList.push(RequestLists);
  }
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
      ...provisionWorkdayCol,
      sorter: (a, b) => moment(a.day).unix() - moment(b.day).unix(),
      ...getColumnSearchProps('day'),
    },
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
      ...provisionFinishCol,
      sorter: (a, b) => a.index - b.index,
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
            작업 통과자 목록 (끝)
          </span>
          <Button style={{ height: '50px' }}>
            <DollarOutlined />
            지급 하기
          </Button>
        </div>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          테이블 클릭 시 세부 수익금 목록을 확인 할 수 있습니다.
        </Text>
        <Table
          columns={columns}
          dataSource={RequestList}
          pagination={{ pageSize: 8 }}
          scroll={{ y: 500 }}
          style={{ width: '100%', paddingLeft: '0%' }}
          onRow={onRow}
          rowSelection={{ type: selectionType, ...rowSelection }}
        />{' '}
        <Modal
          title="정산 세부 내역"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {pointList &&
            pointList.map((array, i) => (
              <>
                <p>
                  {array.companyName}의 {array.taskTitle} [정산 금액] :{' '}
                  {array.Point}원
                </p>
              </>
            ))}
        </Modal>
      </Card>
    </>
  );
}
export default ProvisionTable;
