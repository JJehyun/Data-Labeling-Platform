export const questiondayCol = {
  title: '문의 요일',
  dataIndex: 'day',
  width: 150,
};
export const questionNameCol = {
  title: '이름',
  dataIndex: 'name',
  filterMode: 'tree',
  filterSearch: true,
  width: 150,
};
export const questionTitleCol = {
  title: '제목',
  dataIndex: 'titles',
  filterMode: 'tree',
  filterSearch: true,
  width: 500,
};
export const questionStateCol = {
  title: '상태',
  dataIndex: 'State',
  width: 150,
  filters: [
    {
      text: '답변 완료',
      value: '답변 완료',
    },
    {
      text: '답변 전',
      value: '답변 전',
    },
  ],
  filterSearch: true,
};
export const questionStandardCol = {
  title: '문의 기준',
  dataIndex: 'Standard',
  filters: [
    {
      text: '사이트 이용',
      value: '사이트 이용 문의',
    },
    {
      text: '포인트 관련',
      value: '포인트 관련 문의',
    },
    {
      text: '프로젝트 문의',
      value: '프로젝트 문의',
    },
    {
      text: '기타 문의',
      value: '기타 문의',
    },
  ],
  filterSearch: true,
  width: 150,
};
export const provisionWorkdayCol = {
  title: '작업 요일',
  dataIndex: 'day',
  width: 150,
};
export const provisionIDCol = {
  title: '아이디',
  dataIndex: 'id',
  width: 200,
};
export const provisionTitleCol = {
  title: '최근 참여 작업',
  dataIndex: 'titles',
  filterMode: 'tree',
  filterSearch: true,
  width: 400,
};
export const provisionFinishCol = {
  title: '총 수익금',
  dataIndex: 'index',
  width: 150,
};
export const blockcount = {
  title: '경고 받은 횟수',
  dataIndex: 'index',
  width: 150,
};
export const blockButton = {
  title: '경고 내역 확인',
  dataIndex: 'button',
  width: 150,
};
export const RequestDayCol = {
  title: '수익금 신청일',
  dataIndex: 'day',
  width: 150,
};
export const PaymentStateCol = {
  title: '상태',
  dataIndex: 'State',
  filters: [
    {
      text: '지급 완료',
      value: '지급 완료',
    },
    {
      text: '지급 전',
      value: '지급 전',
    },
  ],
  width: 150,
};
export const PaymentMoneyCol = {
  title: '수익금',
  dataIndex: 'money',
  width: 150,
};
export const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
