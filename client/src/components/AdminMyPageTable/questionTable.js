import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Input, Space, Button } from 'antd';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, RestOutlined } from '@ant-design/icons';
import QuestionAnswer from '../../components/AdminMyPageComponent/QuestionAnswer';
import {
  questiondayCol,
  questionNameCol,
  questionTitleCol,
  questionStateCol,
  questionStandardCol,
} from './tableColumns';
import axios from 'axios';

const QuestionTable = (props) => {
  const [selectionType, setSelectionType] = useState();
  const [deletelist, setdeletelist] = useState();
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let array = [];
      for (let i = 0; i < selectedRows.length; i++) {
        array.push(selectedRows[i].key);
      }
      setdeletelist(array);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const deleteButton = (value) => {
    axios.post('/api/deleteQustion', { key: value }).then((data) => {
      if (value == undefined) return;
      if (data.data.delete == true) alert('삭제가 완료 되었습니다.');
      window.location.replace('/WorksAskList');
    });
  };
  //**Works들이 질문한 내용들 db에서 가져와 table로 뿌려주는 함수**
  let QuestionArray = [];
  for (let i = 0; i < props.List.length; i++) {
    let keys = props.List[i].idx;
    let Standards = props.List[i].QuestionType; // 기타문의 or 작업문의
    if (Standards == 1) {
      Standards = '사이트 이용 문의';
    } else if (Standards == 2) {
      Standards = '포인트 관련 문의';
    } else if (Standards == 3) {
      Standards = '프로젝트 문의';
    } else if (Standards == 4) {
      Standards = '기타 문의';
    }
    let titless = props.List[i].QuestionTitle; // 질문 제목
    let constents = props.List[i].QuestionContents; //질문 내용
    let days = moment(props.List[i].QuestionDate).format('YYYY-MM-DD'); //질문한 요일
    let States = props.List[i].QuestionState; //답변전 = 1 답변 완료 = 2
    let names = props.List[i].userName; //질문한 유저 이름
    if (States == 0) {
      States = '답변 전';
    } else {
      States = '답변 완료';
    }
    let descriptions = (
      <QuestionAnswer
        name={names}
        day={days}
        title={titless}
        Standard={props.List[i].QuestionType}
        content={constents}
        Answer={props.List[i].Answer}
        Key={props.List[i].idx}
        project={props.List[i].taskTitle}
      />
    );
    let QuestionToTal = {
      key: keys,
      Standard: Standards,
      titles: titless,
      constent: constents,
      day: days,
      State: States,
      name: names,
      description: descriptions,
    };
    QuestionArray.push(QuestionToTal);
  }
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
      ...questiondayCol,
      sorter: (a, b) => moment(a.day).unix() - moment(b.day).unix(),
      ...getColumnSearchProps('day'),
    },
    {
      ...questionNameCol,
      onFilter: (value, record) => record.name.includes(value),
      ...getColumnSearchProps('name'),
    },
    {
      ...questionTitleCol,
      onFilter: (value, record) => record.titles.includes(value),
      ...getColumnSearchProps('titles'),
    },
    {
      ...questionStateCol,
      onFilter: (value, record) => record.State.includes(value),
    },
    {
      ...questionStandardCol,
      onFilter: (value, record) => record.Standard.startsWith(value),
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
            문의 목록(끝)
          </span>
          <Button
            style={{ height: '50px' }}
            onClick={() => {
              deleteButton(deletelist);
            }}
          >
            <RestOutlined />
            선택 삭제 하기
          </Button>
        </div>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== 'Not Expandable',
          }}
          dataSource={QuestionArray}
          pagination={{ pageSize: 8 }}
          scroll={{ y: 1000 }}
          style={{ width: '100%', paddingLeft: '0%', height: '100%' }}
          rowSelection={{ type: selectionType, ...rowSelection }}
        />
      </Card>
    </>
  );
};
export default QuestionTable;
